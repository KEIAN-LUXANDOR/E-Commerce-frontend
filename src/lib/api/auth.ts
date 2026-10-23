import { apiFetch, clearCsrfToken } from "@/lib/api/client";
import type { LoginRequest, RegisterRequest, User } from "@/lib/types/auth";

/** Account calls made from the browser. The session lives in the JSESSIONID cookie set by the backend. */

/** 201 with the new user; 400 lists wrong fields; 409 if the email is taken. Does not log in. */
export function register(body: RegisterRequest) {
  return apiFetch<User>("/auth/register", { method: "POST", body });
}

/** 200 with the user; 401 for a wrong email or password; 429 after 5 wrong passwords. */
export async function login(body: LoginRequest) {
  const user = await apiFetch<User>("/auth/login", { method: "POST", body });
  clearCsrfToken();
  return user;
}

/** Ends the session (needs the CSRF token, which apiFetch adds). */
export async function logout() {
  try {
    await apiFetch<void>("/auth/logout", { method: "POST" });
  } finally {
    clearCsrfToken();
  }
}

/** The logged-in user, or null when logged out. */
export function fetchCurrentUser() {
  return apiFetch<User | null>("/auth/me", { allow401: true, cache: "no-store" });
}

/** Verifies an email address using its one-time token. */
export function verifyEmail(token: string) {
  return apiFetch<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: { token },
  });
}

/** Requests another verification email without revealing account verification status. */
export function resendVerification(email: string) {
  return apiFetch<MessageResponse>("/auth/resend-verification", {
    method: "POST",
    body: { email },
  });
}

/** Requests a one-time password-reset email without revealing whether the address is registered. */
export function requestPasswordReset(email: string) {
  return apiFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/** Sets a new password using the one-time token from the reset email. */
export function resetPassword(body: { token: string; newPassword: string }) {
  return apiFetch<MessageResponse>("/auth/reset-password", { method: "POST", body });
}

export interface MessageResponse {
  message: string;
}
