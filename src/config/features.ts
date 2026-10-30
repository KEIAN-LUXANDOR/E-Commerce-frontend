/**
 * Feature switches. Turn one on only when its backend endpoint exists (see docs/api.md).
 * Live on the backend (29 Oct 2026): orders + Razorpay payments. Everything else is planned,
 * and its page shows a friendly "coming soon" fallback while switched off.
 * For local testing with the stand-in API: NEXT_PUBLIC_FEATURES=all
 */
const defaults = {
  /** Place order, My orders, cancel unpaid order. POST /account/orders */
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
  /** Admin: dashboard metrics. GET /admin/summary */
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

/** Thrown by API helpers when their feature is switched off. */
export class FeatureOffError extends Error {
  constructor(public readonly feature: Feature) {
    super("This isn’t available online yet. Please contact our atelier and we’ll assist you.");
    this.name = "FeatureOffError";
  }
}

/** Use at the top of an API helper to check feature activation. */
export function requireFeature(feature: Feature) {
  if (!features[feature]) throw new FeatureOffError(feature);
}
