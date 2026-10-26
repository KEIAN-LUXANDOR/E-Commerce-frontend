"use client";

import { useCartSync } from "@/lib/shop/cart";
import { useWishlistSync } from "@/lib/shop/wishlist";

/** Keeps the cart and saved diamonds in step with who is logged in. Renders nothing. */
export function ShopSync() {
  useCartSync();
  useWishlistSync();
  return null;
}
