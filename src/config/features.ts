/**
 * Switches for backend features that are planned but not built yet.
 *
 * Every page for these features is already coded against the endpoint described in
 * docs/API-ENDPOINTS.md (section "Planned"). While a switch is false, the page shows a
 * friendly "not available yet" message and never calls the endpoint.
 *
 * When the backend team finishes an endpoint:
 *   1. Check it matches docs/API-ENDPOINTS.md (or update the types in src/lib/api/*).
 *   2. Change its switch below to true.
 *
 * For local testing you can switch them on without editing this file:
 *   NEXT_PUBLIC_FEATURES=all                      (everything on, e.g. with scripts/dev-api.mjs)
 *   NEXT_PUBLIC_FEATURES=orders,payments          (only these)
 */
const defaults = {
  /** Place order, My orders, cancel unpaid order. Implemented by the backend. */
  orders: true,
  /** Razorpay: create payment + verify signature. POST /account/orders/{no}/payment */
  payments: true,
  /** Public "Track your order". POST /orders/track */
  orderTracking: true,
  /** Download invoice PDF. GET /account/orders/{no}/invoice */
  invoices: true,
  /** Return request from My orders. POST /account/orders/{no}/return */
  returns: true,
  /** Coupon box in the cart. POST/DELETE /account/cart/coupon */
  coupons: true,
  /** Delivery PIN code check on the diamond page. GET /delivery/pincode/{pin} */
  pincodeCheck: true,
  /** Contact form and "Book a viewing". POST /enquiries */
  enquiries: true,
  /** Newsletter sign-up in the footer. POST /newsletter */
  newsletter: true,
  /** Admin: dashboard numbers. GET /admin/summary */
  adminDashboard: true,
  /** Admin: add/edit diamonds, photos, CSV import. /admin/products/** */
  adminCatalog: true,
  /** Admin: orders, packing, shipping. /admin/orders/** */
  adminOrders: true,
  /** Admin: customers list and detail. /admin/customers/** */
  adminCustomers: true,
  /** Admin: return requests. /admin/returns/** */
  adminReturns: true,
  /** Admin: coupons. /admin/coupons/** */
  adminCoupons: true,
  /** Admin: contact messages and viewing requests. /admin/enquiries/** */
  adminEnquiries: true,
};

export type Feature = keyof typeof defaults;

function fromEnv(): Partial<Record<Feature, boolean>> {
  const raw = process.env.NEXT_PUBLIC_FEATURES?.trim();
  if (!raw) return {};
  const names = raw.split(",").map((s) => s.trim());
  const overrides: Partial<Record<Feature, boolean>> = {};
  for (const key of Object.keys(defaults) as Feature[]) {
    if (names.includes("all") || names.includes(key)) overrides[key] = true;
  }
  return overrides;
}

export const features: Readonly<Record<Feature, boolean>> = { ...defaults, ...fromEnv() };

export function isEnabled(feature: Feature): boolean {
  return features[feature];
}

/** Thrown by API helpers when their feature is switched off, so callers can show a friendly message. */
export class FeatureOffError extends Error {
  constructor(public readonly feature: Feature) {
    super("This isn’t available online yet. Please contact us and we’ll help you straight away.");
    this.name = "FeatureOffError";
  }
}

/** Use at the top of an API helper for a planned endpoint. */
export function requireFeature(feature: Feature) {
  if (!features[feature]) throw new FeatureOffError(feature);
}
