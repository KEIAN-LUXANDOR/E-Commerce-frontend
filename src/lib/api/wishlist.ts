import { apiFetch } from "@/lib/api/client";
import type { Product } from "@/lib/types/product";

/** Saved diamonds on the server (live: docs/API-ENDPOINTS.md, "Wishlist"). Login required, max 100. */

export interface WishlistEntry {
  product: Product;
  addedAt: string;
}

export function getWishlist() {
  return apiFetch<WishlistEntry[]>("/account/wishlist", { cache: "no-store" });
}

export function getWishlistProductIds() {
  return apiFetch<string[]>("/account/wishlist/ids", { cache: "no-store" });
}

/** 204; adding twice does nothing. 404 if the product isn't on sale. */
export function addWishlistProduct(productId: string) {
  return apiFetch<void>(`/account/wishlist/${encodeURIComponent(productId)}`, { method: "PUT" });
}

export function removeWishlistProduct(productId: string) {
  return apiFetch<void>(`/account/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
}
