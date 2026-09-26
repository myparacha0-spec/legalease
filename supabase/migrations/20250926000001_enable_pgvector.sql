-- ============================================================================
-- LegalEase — 0002 · Enable pgvector + shared authorization helper
-- ----------------------------------------------------------------------------
-- Adds the pgvector extension used by the RAG knowledge base (legal_chunks)
-- and the `is_admin()` helper used by RLS policies and server-side role checks.
-- The extension is installed into the `extensions` schema (Supabase default).
-- ============================================================================

create extension if not exists vector
  with schema extensions;

-- True when the current request's user has the admin profile role.
-- Security definer so the function can read profiles even though the caller
-- has no direct access. Only rows for auth.uid() are consulted.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- In development you can promote an account with the service role:
--
--   select public.set_profile_role('<user uuid>', 'admin');
--
-- (see migration 20250926000005 for that helper)