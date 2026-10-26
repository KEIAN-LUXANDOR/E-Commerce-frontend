import { apiFetch } from "@/lib/api/client";
import { BROWSER_API_BASE } from "@/lib/api/config";
import { requireFeature } from "@/config/features";
import type {
  Order,
  OrderListPage,
  PaymentConfirmation,
  PaymentSession,
  ReturnRequestSummary,
  TrackingResult,
} from "@/lib/types/order";

/**
 * PLANNED endpoints (docs/API-ENDPOINTS.md, "Planned: orders and payment").
 * Each helper throws FeatureOffError while its switch in src/config/features.ts is off,
 * so pages can show a friendly message without calling a missing endpoint.
 */

/**
 * Creates an order from the cart and reserves the diamonds for 15 minutes.
 * 201 Order (PENDING_PAYMENT). Errors: 403 EMAIL_NOT_VERIFIED, 400 empty cart,
 * 409 ITEM_SOLD, 409 PENDING_ORDER_EXISTS (detail + orderNumber of the unpaid order).
 */
export async function placeOrder(addressId: string) {
  requireFeature("orders");
  return apiFetch<Order>("/account/orders", { method: "POST", body: { addressId } });
}

export async function listOrders(page = 0, size = 10) {
  requireFeature("orders");
  return apiFetch<OrderListPage>(`/account/orders?page=${page}&size=${size}`, { cache: "no-store" });
}

/** The order, or null if it doesn't exist / isn't yours. */
export async function getOrder(orderNumber: string) {
  requireFeature("orders");
  return apiFetch<Order | null>(`/account/orders/${encodeURIComponent(orderNumber)}`, { allow404: true, cache: "no-store" });
}

/** Cancels an unpaid order; the diamonds go back on sale. */
export async function cancelOrder(orderNumber: string) {
  requireFeature("orders");
  return apiFetch<Order>(`/account/orders/${encodeURIComponent(orderNumber)}/cancel`, { method: "POST" });
}

/** Creates (or reuses) the Razorpay order for an unpaid order. */
export async function startPayment(orderNumber: string) {
  requireFeature("payments");
  return apiFetch<PaymentSession>(`/account/orders/${encodeURIComponent(orderNumber)}/payment`, { method: "POST" });
}

/** Sends Razorpay's result to the backend, which checks the signature. Returns the PAID order. */
export async function confirmPayment(orderNumber: string, body: PaymentConfirmation) {
  requireFeature("payments");
  return apiFetch<Order>(`/account/orders/${encodeURIComponent(orderNumber)}/payment/verify`, { method: "POST", body });
}

/** Link to the invoice PDF (opened in a new tab; the session cookie is sent). */
export function invoiceUrl(orderNumber: string) {
  return `${BROWSER_API_BASE}/account/orders/${encodeURIComponent(orderNumber)}/invoice`;
}

/** Asks to return a delivered order (within the return window). */
export async function requestReturn(orderNumber: string, body: { reason: string; details: string }) {
  requireFeature("returns");
  return apiFetch<ReturnRequestSummary>(`/account/orders/${encodeURIComponent(orderNumber)}/return`, { method: "POST", body });
}

/** Public tracking with order number + the email used. 404 when they don't match. */
export async function trackOrder(body: { orderNumber: string; email: string }) {
  requireFeature("orderTracking");
  return apiFetch<TrackingResult | null>("/orders/track", { method: "POST", body, allow404: true });
}
