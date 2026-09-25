-- ============================================================================
-- LegalEase — 0006 · Admin role support
-- ----------------------------------------------------------------------------
-- Adds 'admin' as a valid profile role. Sign-ups still can only ever create
-- citizen/lawyer accounts (see handle_new_user), so admin must be granted
-- explicitly — by an operator using set_profile_role with the service role.
-- ============================================================================

-- Relax the role constraint to admit admins.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('citizen', 'lawyer', 'admin'));

-- Granting/removing admin with one call. Runs as security definer so it may
-- flip the role despite profiles_prevent_role_change (which exists to stop
-- *users* from editing their own role via the API). It is NOT executable by
-- anon/authenticated — only service_role (or the SQL editor) may use it.
create or replace function public.set_profile_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_role not in ('citizen', 'lawyer', 'admin') then
    raise exception 'Invalid role: %', p_role;
  end if;

  alter table public.profiles disable trigger profiles_prevent_role_change;
  update public.profiles
     set role = p_role, updated_at = now()
   where id = p_user_id;
  alter table public.profiles enable trigger profiles_prevent_role_change;

  if not found then
    raise exception 'No profile found for user %', p_user_id;
  end if;
end;
$$;

-- Only the service role / SQL editor can promote users. Normal users cannot.
revoke execute on function public.set_profile_role(uuid, text) from public, anon, authenticated;
grant execute on function public.set_profile_role(uuid, text) to service_role