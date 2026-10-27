// src/lib/api/auth.ts
import { apiFetch, clearCsrfToken } from "./client";
import type { User, RegisterInput, LoginInput, MessageResponse } from "@/lib/types/auth";

export async function register(data: RegisterInput): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginInput): Promise<User> {
  const user = await apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  clearCsrfToken(); // Clear token to force a refresh on next POST/PUT
  return user;
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  clearCsrfToken();
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

export async function verifyEmail(token: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}