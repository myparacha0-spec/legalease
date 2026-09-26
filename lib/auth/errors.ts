interface AuthErrorLike {
  code?: string;
  message?: string;
  status?: number;
}

/**
 * Maps raw Supabase auth errors to friendly, human-readable copy. Falls back
 * to a generic message when nothing can be recognized.
 */
export function friendlyAuthError(error: AuthErrorLike | null): string {
  if (!error) return "Something went wrong. Please try again.";

  const code = error.code?.toLowerCase() ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Please verify your email first. We sent a confirmation link to your inbox.";
  }
  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (
    code === "weak_password" ||
    message.includes("password should be at least") ||
    message.startsWith("password should")
  ) {
    return "That password is too weak. Use at least 8 characters, with letters and numbers.";
  }
  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Too many requests. Please wait a few minutes and try again.";
  }
  if (code === "email_exists") {
    return "This email is already in use. Try logging in instead.";
  }
  if (message.includes("failed to fetch") || message.includes("fetch failed")) {
    return "We couldn't reach the authentication service. Check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}