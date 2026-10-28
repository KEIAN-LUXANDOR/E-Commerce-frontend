"use client";

import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { sessionStore } from "@/lib/session";
import { ApiError, apiFetch } from "@/lib/api/client";
import { addCartItem, type Cart } from "@/lib/api/cart";
import type { Product } from "@/lib/types/product";
import { mainVariant } from "@/lib/catalog/product";
import { showToast } from "@/lib/stores";

const localCartStore = createLocalStore<string[]>("kl_guest_cart_v1", []);

interface CartSnapshot {
  items: Array<Pick<Cart["items"][number], "variantId">>;
  itemCount: number;
  subtotalPaise: number;
}

let serverCart: CartSnapshot | null = null;
const cartListeners = new Set<() => void>();

function notifyCart() {
  cartListeners.forEach((l) => l());
}

export async function fetchServerCart() {
  try {
    const data = await apiFetch<Cart>("/account/cart");
    serverCart = data;
    notifyCart();
    return data;
  } catch {
    return null;
  }
}

export async function addToCart(product: Product) {
  const variant = mainVariant(product);
  if (!variant) {
    showToast("Product is unavailable", { tone: "error" });
    return;
  }
  
  const session = sessionStore.get();
  if (session.status === "authenticated") {
    try {
      await apiFetch(`/account/cart/items/${variant.id}`, { method: "PUT" });
      await fetchServerCart();
      showToast("Added to cart");
    } catch (cause: unknown) {
      showToast(
        cause instanceof ApiError ? cause.detail || "Could not add to cart" : "Could not add to cart",
        { tone: "error" },
      );
    }
  } else {
    const current = localCartStore.read();
    if (!current.includes(variant.id)) {
      localCartStore.set([variant.id, ...current].slice(0, 20));
    }
    showToast("Added to cart");
  }
}

export async function removeFromCart(variantId: string) {
  const session = sessionStore.get();
  if (session.status === "authenticated") {
    try {
      await apiFetch(`/account/cart/items/${variantId}`, { method: "DELETE" });
      await fetchServerCart();
    } catch (cause: unknown) {
      showToast(
        cause instanceof ApiError ? cause.detail || "Could not remove item" : "Could not remove item",
        { tone: "error" },
      );
    }
  } else {
    const current = localCartStore.read();
    localCartStore.set(current.filter((id: string) => id !== variantId));
  }
}


/**
 * Move browser-only guest selections into the signed-in server cart.
 * The API accepts one unique diamond per variant; duplicate adds are idempotent.
 * Items rejected by the server (for example sold-out diamonds) are dropped from
 * the guest list and reported to the caller.
 */
export async function syncGuestCartToServer(): Promise<{ migrated: number; failed: number }> {
  if (sessionStore.get().status !== "authenticated") {
    return { migrated: 0, failed: 0 };
  }

  const guestIds = localCartStore.read();
  let migrated = 0;
  let failed = 0;

  for (const variantId of guestIds) {
    try {
      await addCartItem(variantId);
      migrated += 1;
    } catch {
      failed += 1;
    }
  }

  // The account cart becomes the source of truth after login.
  if (guestIds.length > 0) {
    localCartStore.set([]);
  }

  await fetchServerCart();
  return { migrated, failed };
}

// Cache for the local cart snapshot to prevent infinite loops in useSyncExternalStore
let cachedLocalIds: string[] = [];
let cachedLocalCart: CartSnapshot = { items: [], itemCount: 0, subtotalPaise: 0 };

export const cartStore = {
  get: () => serverCart,
  useCount: () => {
    const session = sessionStore.useSession();
    const localIds = localCartStore.useValue();
    
    return useSyncExternalStore(
      (listener) => {
        cartListeners.add(listener);
        return () => cartListeners.delete(listener);
      },
      () => {
        if (session.status === "authenticated") {
          return serverCart?.itemCount || 0;
        }
        return localIds.length;
      },
      () => 0
    );
  },
  useCart: () => {
    const session = sessionStore.useSession();
    const localIds = localCartStore.useValue();
    
    return useSyncExternalStore(
      (listener) => {
        cartListeners.add(listener);
        return () => cartListeners.delete(listener);
      },
      () => {
        if (session.status === "authenticated") {
          return serverCart;
        }
        
        // Memoize the local cart object reference to prevent infinite loops
        if (localIds !== cachedLocalIds) {
          cachedLocalIds = localIds;
          cachedLocalCart = { 
            items: localIds.map((id: string) => ({ variantId: id })), 
            itemCount: localIds.length,
            subtotalPaise: 0 
          };
        }
        return cachedLocalCart;
      },
      () => null
    );
  }
};

// Expose aliases
export function useCartCount() {
  return cartStore.useCount();
}

export function useCart() {
  return cartStore.useCart();
}