import { requireFeature } from "@/config/features";
import { apiFetch } from "@/lib/api/client";
import type {
  Order,
  OrderListPage,
  PaymentConfirmation,
  PaymentSession,
  TrackingResult,
} from "@/lib/types/order";

export function listOrders(page = 0, size = 20): Promise<OrderListPage> {
  requireFeature("orders");
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch<OrderListPage>(`/account/orders?${query}`, { cache: "no-store" });
}

export function getOrder(orderNumber: string): Promise<Order | null> {
  requireFeature("orders");
  return apiFetch<Order | null>(`/account/orders/${encodeURIComponent(orderNumber)}`, {
    allow404: true,
    cache: "no-store",
  });
}

export function createOrder(addressId: string): Promise<Order> {
  requireFeature("orders");
  return apiFetch<Order>("/account/orders", {
    method: "POST",
    body: { addressId },
  });
}

export function startPayment(orderNumber: string): Promise<PaymentSession> {
  requireFeature("payments");
  return apiFetch<PaymentSession>(`/account/orders/${encodeURIComponent(orderNumber)}/payment`, {
    method: "POST",
  });
}

export function confirmPayment(
  orderNumber: string,
  payment: PaymentConfirmation,
): Promise<Order> {
  requireFeature("payments");
  return apiFetch<Order>(`/account/orders/${encodeURIComponent(orderNumber)}/payment`, {
    method: "PUT",
    body: payment,
  });
}

export function invoiceUrl(orderNumber: string): string {
  requireFeature("invoices");
  return `/api/account/orders/${encodeURIComponent(orderNumber)}/invoice`;
}

export function requestReturn(orderNumber: string, reason: string): Promise<Order> {
  requireFeature("returns");
  return apiFetch<Order>(`/account/orders/${encodeURIComponent(orderNumber)}/return`, {
    method: "POST",
    body: { reason },
  });
}

export function trackOrder(orderNumber: string): Promise<TrackingResult> {
  requireFeature("orderTracking");
  return apiFetch<TrackingResult>("/orders/track", {
    method: "POST",
    body: { orderNumber },
  });
}