
-- Roles
create type public.app_role as enum ('admin', 'student');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer fn
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Courses
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  cover_image_url text,
  category text,
  level text,
  price_cents integer not null default 0,
  stripe_price_id text,
  stripe_product_id text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;

-- Lessons
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null default 0,
  title text not null,
  description text,
  vimeo_video_id text,
  duration_seconds integer,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.lessons enable row level security;
create index lessons_course_id_idx on public.lessons(course_id);

-- Enrollments
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  source text not null default 'purchase',
  stripe_session_id text,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
alter table public.enrollments enable row level security;

-- Lesson progress
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_position_seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;

-- has_active_subscription helper
create or replace function public.has_active_subscription(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and status in ('active', 'trialing')
      and (current_period_end is null or current_period_end > now())
  )
$$;

-- is_enrolled helper
create or replace function public.is_enrolled(_user_id uuid, _course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.enrollments where user_id = _user_id and course_id = _course_id)
$$;

-- Policies: profiles
create policy "profiles_select_own_or_admin" on public.profiles for select
  using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id);
create policy "profiles_insert_self" on public.profiles for insert
  with check (auth.uid() = id);

-- Policies: user_roles
create policy "user_roles_select_self_or_admin" on public.user_roles for select
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_write" on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Policies: courses
create policy "courses_select_published_or_admin" on public.courses for select
  using (published = true or public.has_role(auth.uid(), 'admin'));
create policy "courses_admin_write" on public.courses for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Policies: lessons (metadata visible if parent course published; vimeo gating done in serverFn)
create policy "lessons_select_if_course_published_or_admin" on public.lessons for select
  using (
    exists (select 1 from public.courses c where c.id = course_id and (c.published = true or public.has_role(auth.uid(), 'admin')))
  );
create policy "lessons_admin_write" on public.lessons for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Policies: enrollments
create policy "enrollments_select_own_or_admin" on public.enrollments for select
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "enrollments_admin_write" on public.enrollments for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Policies: lesson_progress
create policy "lesson_progress_select_own" on public.lesson_progress for select
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "lesson_progress_insert_own" on public.lesson_progress for insert
  with check (user_id = auth.uid());
create policy "lesson_progress_update_own" on public.lesson_progress for update
  using (user_id = auth.uid());

-- Policies: subscriptions
create policy "subscriptions_select_own_or_admin" on public.subscriptions for select
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-create profile + assign student role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger courses_updated before update on public.courses for each row execute function public.set_updated_at();
create trigger lesson_progress_updated before update on public.lesson_progress for each row execute function public.set_updated_at();
create trigger subscriptions_updated before update on public.subscriptions for each row execute function public.set_updated_at();
