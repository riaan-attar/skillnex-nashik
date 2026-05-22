
-- Lock down search_path on trigger fns and revoke broad EXECUTE
alter function public.handle_new_user() set search_path = public;
alter function public.set_updated_at() set search_path = public;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.has_active_subscription(uuid) from public, anon;
revoke execute on function public.is_enrolled(uuid, uuid) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.has_active_subscription(uuid) to authenticated;
grant execute on function public.is_enrolled(uuid, uuid) to authenticated;
