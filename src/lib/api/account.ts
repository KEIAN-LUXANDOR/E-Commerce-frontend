// src/lib/api/account.ts
import { apiFetch } from "./client";
import type { User, MessageResponse } from "@/lib/types/auth";

export async function updateProfile(data: { fullName: string; phone?: string }): Promise<User> {
  return apiFetch<User>("/account/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: any): Promise<MessageResponse> {
  return apiFetch<MessageResponse>("/account/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCheckoutEligibility(): Promise<{ canCheckout: boolean }> {
  return apiFetch<{ canCheckout: boolean }>("/account/checkout-eligibility");
}