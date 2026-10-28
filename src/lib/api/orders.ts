import { requireFeature } from "@/config/features";
import { BROWSER_API_BASE } from "@/lib/api/config";
import { apiFetch } from "@/lib/api/client";
import type {
  Order,
  OrderListPage,
  PaymentConfirmation,
  PaymentSession,
  ReturnRequestSummary,
  TrackingResult,
} from "@/lib/types/order";

export function listOrders(page = 0, size = 20): Promise<OrderListPage> {
  requireFeature("orders");
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch<BackendOrderPage>(`/account/orders?${query}`, { cache: "no-store" }).then((result) => ({
    ...result,
    items: result.items.map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      itemCount: order.items.length,
      totalPaise: order.totalPaise,
      firstItemName: order.items[0]?.productName ?? "Diamond order",
      firstItemImageUrl: order.items[0]?.imageUrl ?? null,
    })),
  }));
}

type BackendOrderPage = Omit<OrderListPage, "items"> & { items: Order[] };

export function getOrder(orderNumber: string): Promise<Order | null> {
  requireFeature("orders");
  return apiFetch<Order | null>(`/account/orders/${encodeURIComponent(orderNumber)}`, {
    allow404: true,
    cache: "no-store",
  });
}

export function cancelOrder(orderNumber: string): Promise<Order> {
  requireFeature("orders");
  return apiFetch<Order>(`/account/orders/${encodeURIComponent(orderNumber)}/cancel`, {
    method: "POST",
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
): Promise<unknown> {
  requireFeature("payments");
  return apiFetch<unknown>(`/account/orders/${encodeURIComponent(orderNumber)}/payment/verify`, {
    method: "POST",
    body: payment,
  });
}

export function invoiceUrl(orderNumber: string): string {
  requireFeature("invoices");
  return `${BROWSER_API_BASE}/account/orders/${encodeURIComponent(orderNumber)}/invoice`;
}

export function requestReturn(orderNumber: string, body: { reason: string; details: string }): Promise<ReturnRequestSummary> {
  requireFeature("returns");
  return apiFetch<ReturnRequestSummary>(`/account/orders/${encodeURIComponent(orderNumber)}/return`, {
    method: "POST",
    body,
  });
}

export function trackOrder(body: { orderNumber: string; email: string }): Promise<TrackingResult | null> {
  requireFeature("orderTracking");
  return apiFetch<TrackingResult | null>("/orders/track", {
    method: "POST",
    body,
    allow404: true,
  });
}