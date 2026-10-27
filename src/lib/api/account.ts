// src/lib/api/account.ts
import { apiFetch } from "./client";
export { changePassword, updateProfile } from "./profile";
export type { ChangePasswordRequest, UpdateProfileRequest } from "./profile";

export interface CheckoutEligibility {
  canCheckout: boolean;
}

export function getCheckoutEligibility(): Promise<CheckoutEligibility> {
  return apiFetch<CheckoutEligibility>("/account/checkout-eligibility");
}