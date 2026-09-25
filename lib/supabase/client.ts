import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/config/supabase";

/**
 * Browser-side Supabase client.
 *
 * Credentials come from `NEXT_PUBLIC_SUPABASE_URL` and
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Returns `null` when the project is not
 * configured yet (`getSupabaseEnv() === null`) so components can degrade
 * gracefully on unauthenticated pages.
 */
export function createClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}