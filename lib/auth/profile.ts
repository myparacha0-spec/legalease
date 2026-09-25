import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import {
  DASHBOARD_PATH,
  type Profile,
  type Role,
  isRole,
} from "@/lib/auth/types";

/** Dashboard path for a given role (citizen/lawyer). */
export function dashboardPathForRole(role: Role | null | undefined): string {
  if (role && DASHBOARD_PATH[role]) return DASHBOARD_PATH[role];
  return "/login";
}

/** Load a user's profile row from `profiles`. */
export async function getProfileForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!data || !isRole(data.role)) return null;

  return data as Profile;
}

/** Resolve a user's role, preferring the DB profile over signup metadata. */
export async function getRoleForUser(
  supabase: SupabaseClient,
  user: User
): Promise<Role | null> {
  const profile = await getProfileForUser(supabase, user.id);
  if (profile) return profile.role;

  const metadataRole = user.user_metadata?.role;
  return isRole(metadataRole) ? metadataRole : null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
}

/**
 * Server-side session + profile lookup for Server Components and Server
 * Actions. Returns `{ user: null, profile: null }` when Supabase is not
 * configured, so callers render gracefully instead of throwing.
 */
export async function getAuthState(): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { user: null, profile: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const profile = await getProfileForUser(supabase, user.id);
  return { user, profile };
}