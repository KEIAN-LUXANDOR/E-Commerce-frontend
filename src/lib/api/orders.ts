// src/lib/api/orders.ts
import { apiFetch } from "./client";
import type { Order } from "@/lib/types/order";

export async function createOrder(addressId: string) {
  return apiFetch<Order>("/account/orders", {
    method: "POST",
    body: JSON.stringify({ addressId }),
  });
}

export async function getOrders(page = 0, size = 10) {
  return apiFetch<{ items: Order[]; totalPages: number; totalItems: number; page: number; size: number }>(
    `/account/orders?page=${page}&size=${size}`
  );
}

export async function getOrder(orderNumber: string) {
  return apiFetch<Order>(`/account/orders/${orderNumber}`);
}

export async function cancelOrder(orderNumber: string) {
  return apiFetch<Order>(`/account/orders/${orderNumber}/cancel`, { method: "POST" });
}