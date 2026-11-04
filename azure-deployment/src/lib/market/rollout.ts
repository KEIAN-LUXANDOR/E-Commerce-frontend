import { isMarketCountryCode } from "@/lib/market/countries";

/**
 * International market rollout uses the existing account-address, order and
 * delivery endpoints for every configured market. The delivery checker must
 * return serviceability before the customer can continue to payment.
 */
export function isOnlineCheckoutAvailable(countryCode: string): boolean {
  return isMarketCountryCode(countryCode);
}

export function isInternationalConciergeMarket(countryCode: string): boolean {
  return countryCode.toUpperCase() !== "IN";
}
