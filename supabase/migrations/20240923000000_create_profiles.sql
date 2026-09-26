-- ============================================================================
-- LegalEase — 0001 · profiles table, signup trigger, and RLS
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL editor (or via `supabase db push`).
--
-- Also required in the Supabase dashboard (Authentication → Providers → Email
-- or Project Settings → Auth):
--   * Site URL / Site URL  ................ http://localhost:3000
--   * Redirect URLs ....................... http://localhost:3000/auth/callback
--   * Email → Confirm email ............... ON
--   * Email templates → "Confirm signup"   use the Site URL link tag (default)
--   * Email templates → "Reset password"   use the Site URL link tag (default)
-- ============================================================================

-- --- Tables ---------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'citizen' check (role in ('citizen', 'lawyer')),
  full_name text not null,
  email text not null,
  phone text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Application profile for every auth user. Role is assigned at sign-up and can never be changed by the user (see prevent_profile_role_change).';

-- Indexes for role scoping and lookups.
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_city_idx on public.profiles (city);

-- --- updated_at automation ------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- --- Auto-create profile at sign-up ---------------------------------------
-- Fires when a row is inserted into auth.users (i.e. every account sign-up),
-- so a user never exists without an application profile. The role comes from
-- sign-up metadata (options.data.role) and is strictly limited to
-- citizen | lawyer — anything else (e.g. "admin") falls back to citizen.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  requested_role text := lower(trim(coalesce(meta->>'role', 'citizen')));
  full_name text := nullif(trim(coalesce(meta->>'full_name', '')), '');
begin
  if requested_role not in ('citizen', 'lawyer') then
    requested_role := 'citizen';
  end if;

  insert into public.profiles (id, role, full_name, email, phone, city, avatar_url)
  values (
    new.id,
    requested_role,
    coalesce(full_name, split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, ''),
    nullif(trim(coalesce(meta->>'phone', '')), ''),
    nullif(trim(coalesce(meta->>'city', '')), ''),
    nullif(trim(coalesce(meta->>'avatar_url', '')), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- --- Role immutability ----------------------------------------------------
-- Users may update their profile fields, but never their role.
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    raise exception 'Profile role cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
before update on public.profiles
for each row
execute function public.prevent_profile_role_change();

-- --- Row Level Security ---------------------------------------------------

alter table public.profiles enable row level security;

-- Users can read their own profile only.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

-- Users can update their own profile, but never swap roles (checked against
-- both RLS and the trigger above for defence in depth).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
);

-- No insert/delete policies: creation is handled by the trigger (security
-- definer) and in-place deletion is not allowed.

-- Tighten table privileges so the anon key can never read profiles and the
-- authenticated key can only touch their own row via the policies above.
revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select, update on public.profiles to authenticated;