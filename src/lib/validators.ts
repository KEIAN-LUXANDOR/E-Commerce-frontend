/**
 * Form checks that mirror the backend rules (RegisterRequest and LoginRequest),
 * so shoppers see mistakes before sending. The backend still checks everything;
 * its messages are shown when they arrive.
 */

export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normaliseEmail(value: string) {
  return value.trim().toLowerCase();
}

/** Accepts "98765 43210", "+91 98765 43210" or "09876543210" and returns "9876543210". */
export function normalisePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** BCrypt only uses the first 72 bytes; emojis and some symbols use several bytes each. */
function byteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

export function validateRegister(input: { fullName: string; email: string; phone: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.fullName.trim();
  if (!name) errors.fullName = "Enter your full name.";
  else if (name.length > 100) errors.fullName = "Use 100 characters or fewer.";

  const email = normaliseEmail(input.email);
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 255 || !EMAIL.test(email)) errors.email = "Enter an email address like name@example.com.";

  if (input.phone.trim()) {
    const phone = normalisePhone(input.phone);
    if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a 10-digit Indian mobile number, or leave it empty.";
  }

  if (input.password.length < 8) errors.password = "Use at least 8 characters.";
  else if (input.password.length > 72 || byteLength(input.password) > 72) errors.password = "Use 72 characters or fewer (emojis count as several).";

  return errors;
}

export function validateLogin(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!normaliseEmail(input.email)) errors.email = "Enter your email address.";
  if (!input.password) errors.password = "Enter your password.";
  return errors;
}

/**
 * Only allow returning to a page on this site after login, never to another website
 * ("//evil.com" or "https://…" are refused).
 */
export function safeNextPath(next: string | undefined | null, fallback = "/account") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
