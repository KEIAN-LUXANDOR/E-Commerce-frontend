const DEV_VERIFIED_EMAILS = [
  "lala@gmail.com",
  "yash.bajaj@keianinovex.com",
].map((email) => email.toLowerCase());

export function isDevVerifiedAccount(
  email?: string | null
): boolean {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  if (!email) {
    return false;
  }

  return DEV_VERIFIED_EMAILS.includes(email.trim().toLowerCase());
}