import { apiFetch } from "@/lib/api/client";
import { requireFeature } from "@/config/features";
import type {
  AdminCustomer,
  AdminCustomerSummary,
  AdminEnquiry,
  AdminImage,
  AdminOrder,
  AdminOrderSummary,
  AdminProduct,
  AdminProductRequest,
  AdminReturn,
  AdminSummary,
  Coupon,
  CouponRequest,
  EnquiryStatus,
  ImportResult,
  PackingOrder,
  Paged,
  ProductStatus,
  ShipRequest,
} from "@/lib/types/admin";
import type { OrderStatus, ReturnStatus } from "@/lib/types/order";

/**
 * PLANNED admin endpoints under /api/v1/admin/** (ADMIN role only, CSRF on writes).
 * Contracts: docs/API-ENDPOINTS.md, "Planned: admin". Each group has its own switch.
 */

function qs(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") p.set(k, String(v));
  }
  const text = p.toString();
  if (!text) return "";
  return `?${text}`;
}

// ---------- dashboard ----------

export async function getAdminSummary() {
  requireFeature("adminDashboard");
  return apiFetch<AdminSummary>("/admin/summary", { cache: "no-store" });
}

// ---------- diamonds ----------

export interface AdminProductFilters {
  q?: string;
  status?: ProductStatus;
  origin?: "NATURAL" | "LAB_GROWN";
  page?: number;
  size?: number;
}

export async function listAdminProducts(f: AdminProductFilters = {}) {
  requireFeature("adminCatalog");
  return apiFetch<Paged<AdminProduct>>(`/admin/products${qs({ ...f })}`, { cache: "no-store" });
}

export async function getAdminProduct(id: string) {
  requireFeature("adminCatalog");
  return apiFetch<AdminProduct | null>(`/admin/products/${encodeURIComponent(id)}`, { allow404: true, cache: "no-store" });
}

export async function createAdminProduct(body: AdminProductRequest) {
  requireFeature("adminCatalog");
  return apiFetch<AdminProduct>("/admin/products", { method: "POST", body });
}

export async function updateAdminProduct(id: string, body: AdminProductRequest) {
  requireFeature("adminCatalog");
  return apiFetch<AdminProduct>(`/admin/products/${encodeURIComponent(id)}`, { method: "PUT", body });
}

export async function setAdminProductStatus(id: string, status: ProductStatus) {
  requireFeature("adminCatalog");
  return apiFetch<AdminProduct>(`/admin/products/${encodeURIComponent(id)}/status`, { method: "PUT", body: { status } });
}

/** Only for diamonds that were never ordered; others must be archived. */
export async function deleteAdminProduct(id: string) {
  requireFeature("adminCatalog");
  return apiFetch<void>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Uploads one photo (JPEG/PNG/WebP, max 10 MB). */
export async function uploadAdminImage(productId: string, file: File, altText: string) {
  requireFeature("adminCatalog");
  const form = new FormData();
  form.set("file", file);
  form.set("altText", altText);
  return apiFetch<AdminImage>(`/admin/products/${encodeURIComponent(productId)}/images`, { method: "POST", body: form });
}

export async function deleteAdminImage(productId: string, imageId: string) {
  requireFeature("adminCatalog");
  return apiFetch<void>(`/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`, { method: "DELETE" });
}

/** New photo order: the first id becomes the main photo. */
export async function reorderAdminImages(productId: string, imageIds: string[]) {
  requireFeature("adminCatalog");
  return apiFetch<AdminImage[]>(`/admin/products/${encodeURIComponent(productId)}/images/order`, { method: "PUT", body: { imageIds } });
}

/** CSV import. dryRun = check only, nothing saved. */
export async function importProductsCsv(file: File, dryRun: boolean) {
  requireFeature("adminCatalog");
  const form = new FormData();
  form.set("file", file);
  return apiFetch<ImportResult>(`/admin/products/import?dryRun=${dryRun}`, { method: "POST", body: form });
}

// ---------- orders, packing, shipping ----------

export async function listAdminOrders(f: { status?: OrderStatus; q?: string; page?: number; size?: number } = {}) {
  requireFeature("adminOrders");
  return apiFetch<Paged<AdminOrderSummary>>(`/admin/orders${qs({ ...f })}`, { cache: "no-store" });
}

export async function getAdminOrder(orderNumber: string) {
  requireFeature("adminOrders");
  return apiFetch<AdminOrder | null>(`/admin/orders/${encodeURIComponent(orderNumber)}`, { allow404: true, cache: "no-store" });
}

export async function shipAdminOrder(orderNumber: string, body: ShipRequest) {
  requireFeature("adminOrders");
  return apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(orderNumber)}/ship`, { method: "POST", body });
}

export async function markAdminOrderDelivered(orderNumber: string) {
  requireFeature("adminOrders");
  return apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(orderNumber)}/deliver`, { method: "POST" });
}

/** Cancels a paid order (refund is done in Razorpay, then recorded with the note). */
export async function cancelAdminOrder(orderNumber: string, reason: string) {
  requireFeature("adminOrders");
  return apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(orderNumber)}/cancel`, { method: "POST", body: { reason } });
}

export async function addAdminOrderNote(orderNumber: string, text: string) {
  requireFeature("adminOrders");
  return apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(orderNumber)}/notes`, { method: "POST", body: { text } });
}

export async function getPackingList() {
  requireFeature("adminOrders");
  return apiFetch<PackingOrder[]>("/admin/packing", { cache: "no-store" });
}

// ---------- customers ----------

export async function listAdminCustomers(f: { q?: string; page?: number; size?: number } = {}) {
  requireFeature("adminCustomers");
  return apiFetch<Paged<AdminCustomerSummary>>(`/admin/customers${qs({ ...f })}`, { cache: "no-store" });
}

export async function getAdminCustomer(id: string) {
  requireFeature("adminCustomers");
  return apiFetch<AdminCustomer | null>(`/admin/customers/${encodeURIComponent(id)}`, { allow404: true, cache: "no-store" });
}

// ---------- returns ----------

export async function listAdminReturns(f: { status?: ReturnStatus; page?: number; size?: number } = {}) {
  requireFeature("adminReturns");
  return apiFetch<Paged<AdminReturn>>(`/admin/returns${qs({ ...f })}`, { cache: "no-store" });
}

export async function getAdminReturn(id: string) {
  requireFeature("adminReturns");
  return apiFetch<AdminReturn | null>(`/admin/returns/${encodeURIComponent(id)}`, { allow404: true, cache: "no-store" });
}

export type ReturnAction = "approve" | "reject" | "receive" | "refund";

/** refund needs refundPaise; reject needs a note. */
export async function actOnAdminReturn(id: string, action: ReturnAction, body: { note?: string; refundPaise?: number } = {}) {
  requireFeature("adminReturns");
  return apiFetch<AdminReturn>(`/admin/returns/${encodeURIComponent(id)}/${action}`, { method: "POST", body });
}

// ---------- coupons ----------

export async function listCoupons() {
  requireFeature("adminCoupons");
  return apiFetch<Coupon[]>("/admin/coupons", { cache: "no-store" });
}

export async function createCoupon(body: CouponRequest) {
  requireFeature("adminCoupons");
  return apiFetch<Coupon>("/admin/coupons", { method: "POST", body });
}

export async function updateCoupon(id: string, body: CouponRequest) {
  requireFeature("adminCoupons");
  return apiFetch<Coupon>(`/admin/coupons/${encodeURIComponent(id)}`, { method: "PUT", body });
}

export async function deleteCoupon(id: string) {
  requireFeature("adminCoupons");
  return apiFetch<void>(`/admin/coupons/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---------- enquiries ----------

export async function listEnquiries(f: { status?: EnquiryStatus; type?: AdminEnquiry["type"]; page?: number; size?: number } = {}) {
  requireFeature("adminEnquiries");
  return apiFetch<Paged<AdminEnquiry>>(`/admin/enquiries${qs({ ...f })}`, { cache: "no-store" });
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  requireFeature("adminEnquiries");
  return apiFetch<AdminEnquiry>(`/admin/enquiries/${encodeURIComponent(id)}/status`, { method: "PUT", body: { status } });
}
