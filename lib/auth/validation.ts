/**
 * Client + server safe form validation used by the auth flows. Rules match
 * what the create-account trigger expects (role in citizen|lawyer) and the
 * password policy enforced on Supabase auth.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidFullName(name: string): boolean {
  return name.trim().length >= 2;
}

/** At least 8 chars, must contain a letter and a number. */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{6,20}$/.test(phone.trim());
}

export function isValidCity(city: string): boolean {
  return city.trim().length >= 2;
}