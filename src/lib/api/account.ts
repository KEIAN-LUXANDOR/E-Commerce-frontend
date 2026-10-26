import { apiFetch } from "@/lib/api/client";

export interface CheckoutEligibility {
  canCheckout: true;
}

export function getCheckoutEligibility() {
  return apiFetch<CheckoutEligibility>("/account/checkout-eligibility", { cache: "no-store" });
}
