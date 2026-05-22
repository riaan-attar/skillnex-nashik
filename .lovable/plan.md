## Skillnex — Interactive Course Platform

Build a storytelling course-selling site for Skillnex with auth, Stripe payments (per-course + subscription), Vimeo-embedded video lessons, and a Student/Admin model. Visual direction: **Editorial Narrative** (Instrument Serif + Inter, off-white `#fafafa` / ink `#171717`, chapter-led sections).

### Pages & Routes

Public:
- `/` — Landing with chaptered scroll narrative (Hero "The Spark", theatrical demo player, Programs grid "The Disciplines", How it Works, Pricing "The Investment", Campus/who-we-help, Testimonials, FAQ)
- `/programs` — All courses catalog with category filter
- `/programs/$slug` — Course detail: hero, syllabus (lessons list), instructor, free-preview Vimeo, price/Enroll or Subscribe CTAs
- `/about`, `/faq`, `/contact` — Editorial pages mirroring the existing sitemap
- `/pricing` — Per-course vs All-Access subscription comparison
- `/login`, `/signup`, `/reset-password`

Authenticated student (`/_authenticated`):
- `/dashboard` — Enrolled courses, continue-watching, subscription status
- `/learn/$courseSlug` — Course player: Vimeo iframe, lesson list sidebar, mark complete, progress bar. Locked unless enrolled or subscribed.
- `/account` — Profile, subscription management (Stripe customer portal link)
- `/checkout/success`, `/checkout/cancel`

Admin (`/_authenticated/_admin`):
- `/admin` — Overview (students, revenue, enrollments)
- `/admin/courses` — List/create/edit/publish courses
- `/admin/courses/$id` — Edit course meta + manage lessons (title, Vimeo ID, order, free preview flag)
- `/admin/students` — View enrollments

### Backend (Lovable Cloud)

Enable Lovable Cloud. Tables:
- `profiles` (id → auth.users, full_name, avatar_url, email) — trigger-created on signup
- `app_role` enum: `admin`, `student` → `user_roles` table + `has_role()` security-definer function
- `courses` (id, slug, title, subtitle, description, cover_image_url, category, level, price_cents, stripe_price_id, published, created_at)
- `lessons` (id, course_id, position, title, description, vimeo_video_id, duration_seconds, is_free_preview)
- `enrollments` (id, user_id, course_id, source: 'purchase'|'subscription'|'free', stripe_session_id, created_at) — unique(user_id, course_id)
- `lesson_progress` (id, user_id, lesson_id, completed_at, last_position_seconds)
- `subscriptions` (id, user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, price_id) — managed by webhook

RLS:
- `courses`/`lessons`: published rows readable to anon; admins full write
- `enrollments`/`lesson_progress`/`subscriptions`: user reads own; admins read all; writes server-side only
- Free-preview lessons: vimeo_video_id readable to anon; non-preview lessons readable only when user has matching enrollment OR active subscription (enforced via server fn, not raw RLS, for clarity)

### Auth

- Email/password + Google sign-in via Lovable broker (`supabase--configure_social_auth` for `google`)
- `_authenticated` layout route with `beforeLoad` redirect to `/login`
- `_admin` nested layout checking `has_role('admin')`
- Root `onAuthStateChange` → router.invalidate + queryClient.invalidate
- Trigger creates profile + assigns default `student` role on signup
- First admin is bootstrapped via SQL (client logs in, then we insert their role)

### Stripe (Lovable built-in seamless Stripe payments)

- Run `payments--recommend_payment_provider` → confirm Stripe (digital courses) → `payments--enable_stripe_payments`
- Ask user for tax handling option (full compliance / calculation only / none)
- Create Stripe products via `batch_create_product`:
  - One product per course (one-time price = course.price_cents)
  - One subscription product "Skillnex All-Access" with monthly + yearly prices
- Server functions:
  - `createCheckoutSession({ courseId | subscriptionPriceId })` → returns Stripe checkout URL, success_url=`/checkout/success?session_id=...`
  - `createPortalSession()` for subscription management
- Webhook route `/api/public/webhooks/stripe`:
  - `checkout.session.completed` → insert `enrollments` row (one-time) OR upsert `subscriptions` row
  - `customer.subscription.updated|deleted` → update subscription status
  - HMAC signature verification with `STRIPE_WEBHOOK_SECRET`

### Vimeo Streaming

- Lessons store `vimeo_video_id` only (admin pastes URL/ID in admin form, we parse the ID)
- Player uses Vimeo's standard iframe embed: `https://player.vimeo.com/video/{id}` with `dnt=1`
- Domain restriction is configured by the client in their Vimeo Pro dashboard (whitelist `*.lovable.app` + custom domain) — surface this as a setup note in the admin UI
- Access gate (server fn `getLessonStream`): returns vimeo_video_id only if lesson.is_free_preview OR user has enrollment/active subscription; otherwise 403

### Demo Courses (seeded)

Insert 3 demo courses matching existing platform streams:
- "Social Media Management" — Creator Program ($299)
- "Performance Marketing" — ($249)
- "Video Editing Mastery" — ($199)
Each with 3–5 lessons (1 free preview), placeholder Vimeo IDs the client will update.

### Design Tokens (verbatim from selected direction)

CSS in `src/styles.css`:
```
--background: #fafafa (page)
--foreground: #171717 (ink)
--muted-foreground: #737373
--accent: #262626
Font: Instrument Serif (display, italic), Inter (sans)
Radius: small `min(1vw, 12px)` aesthetic
```
Dark inversion used in pricing section (neutral-900 bg). Buttons: pill, ink-on-page primary, page-on-ink inverted. Chapter labels: tracked uppercase 0.2em.

### Interactivity / Storytelling

- Framer Motion scroll-reveal for chapter headlines (fade + 20px rise)
- Sticky chapter markers in left margin on landing (01, 02, 03)
- Course cards: image grayscale → color on hover, syllabus subtle slide-up
- Theatrical demo player: large rounded video well with floating play button
- FAQ tabbed accordion (Students / Firms / Colleges) matching existing site
- "How it Works" horizontal steps with connecting line

### SEO

Per-route `head()`: unique title (<60c) + description (<160c) + og:title/description; course detail uses course.cover_image_url as og:image; JSON-LD Course schema on detail pages.

### Technical notes

- TanStack Start file-based routing under `src/routes/`
- Server functions in `src/lib/*.functions.ts` using `requireSupabaseAuth`; admin operations via `supabaseAdmin` in server-only `.server.ts`
- Stripe webhook is a server route at `src/routes/api/public/webhooks/stripe.ts`
- All Supabase reads via `createServerFn` → `queryOptions` → `useSuspenseQuery` pattern
- Wire `attachSupabaseAuth` in `src/start.ts`

### Build order

1. Enable Lovable Cloud + run migrations (tables, RLS, roles, profile trigger)
2. Configure Google OAuth (`supabase--configure_social_auth`)
3. Tokens + fonts + layout shell (nav, footer, root)
4. Landing page with all narrative sections (placeholder images via generate_image for hero/course covers)
5. Programs catalog + course detail
6. Auth pages + `_authenticated` guard + onAuthStateChange wiring
7. Enable Stripe (`payments--enable_stripe_payments`), pick tax option, create products
8. Checkout server fn + webhook + success/cancel pages
9. Student dashboard + `/learn/$slug` player with access gate
10. Admin dashboard + course/lesson manager
11. Seed 3 demo courses
12. About / FAQ / Contact / Pricing pages
13. SEO heads + JSON-LD
14. QA: signup → enroll free → buy course → subscribe → watch lesson → admin add course

### What I'll ask you during the build

- Stripe enable form (you fill email/business name)
- Stripe tax handling preference (full compliance / calculation only / none)
- Eventually: real Vimeo video IDs for demo lessons (placeholders used until then)
