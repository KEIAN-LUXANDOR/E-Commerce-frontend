import { apiFetch } from "@/lib/api/client";
import { requireFeature } from "@/config/features";
import type { Product } from "@/lib/types/product";

/**
 * The customer's cart on the server (live: docs/API-ENDPOINTS.md, "Cart").
 * Login required. One piece per diamond, up to 20 items. Prices are always the live price.
 */

export interface CartLine {
  variantId: string;
  product: Product;
  /** Live price; null if the variant was switched off */
  pricePaise: number | null;
  /** false = sold or switched off. Not counted in the subtotal. */
  available: boolean;
  addedAt: string;
}

export interface Cart {
  items: CartLine[];
  itemCount: number;
  subtotalPaise: number;
  hasUnavailableItems: boolean;
  // ---- planned (coupons). Present once the backend adds coupons. ----
  coupon?: { code: string; discountPaise: number; description: string | null } | null;
  discountPaise?: number;
  totalPaise?: number;
}

export function getCart() {
  return apiFetch<Cart>("/account/cart", { cache: "no-store" });
}

/** 204. 404 "Product not found.", 409 "Sorry, this diamond has just been sold.", 400 cart full. */
export function addCartItem(variantId: string) {
  return apiFetch<void>(`/account/cart/items/${encodeURIComponent(variantId)}`, { method: "PUT" });
}

export function removeCartItem(variantId: string) {
  return apiFetch<void>(`/account/cart/items/${encodeURIComponent(variantId)}`, { method: "DELETE" });
}

export function clearCart() {
  return apiFetch<void>("/account/cart", { method: "DELETE" });
}

// ---------- planned: coupons ----------

/** PLANNED. Applies a coupon; returns the updated cart. */
export async function applyCoupon(code: string) {
  requireFeature("coupons");
  return apiFetch<Cart>("/account/cart/coupon", { method: "POST", body: { code } });
}

/** PLANNED. Removes the coupon; returns the updated cart. */
export async function removeCoupon() {
  requireFeature("coupons");
  return apiFetch<Cart>("/account/cart/coupon", { method: "DELETE" });
}
