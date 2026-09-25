/**
 * Central access point for Supabase credentials.
 *
 * Both the browser and server Supabase clients read credentials through this
 * module. `getSupabaseEnv` returns `null` when the project has not been
 * configured yet, allowing the site (and auth pages) to start gracefully and
 * show a clear "Supabase not configured" message instead of crashing.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
 */
export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}