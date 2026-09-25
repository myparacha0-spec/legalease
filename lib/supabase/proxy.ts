import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/config/supabase";

/**
 * Creates a Supabase SSR client bound to the proxy request/response cookies.
 * Returns `null` when the project is not configured yet, so the proxy lets
 * requests pass through untouched.
 */
export async function createSsrProxyClient(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) return null;

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, response };
}