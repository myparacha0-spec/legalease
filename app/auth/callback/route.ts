import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole, getRoleForUser } from "@/lib/auth/profile";

/**
 * Auth callback — handles the redirect Supabase sends after a user clicks a
 * link in an email (account confirmation or password reset).
 *
 * Supabase dashboard settings required:
 *   Site URL ............... http://localhost:3000
 *   Redirect URLs .......... http://localhost:3000/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const linkType = searchParams.get("type");

  const supabase = await createClient();

  if (!code || !supabase) {
    return NextResponse.redirect(`${origin}/auth/error?error=invalid_link`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?error=invalid_link`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/error?error=invalid_link`);
  }

  // Password reset: land on the "set a new password" screen.
  if (linkType === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  // Account confirmation (or magic link): send the user to their dashboard.
  const role = await getRoleForUser(supabase, user);
  if (!role) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_profile`);
  }

  return NextResponse.redirect(`${origin}${dashboardPathForRole(role)}`);
}