"use client";

import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { sessionStore } from "@/lib/session";
import { apiFetch } from "@/lib/api/client";
import type { Product } from "@/lib/types/product";

// Safe toast import fallback
import * as storesMod from "@/lib/stores";
const toastStoreObj = storesMod as Record<string, any>;
const showToast = typeof toastStoreObj.showToast === "function" 
  ? toastStoreObj.showToast 
  : (msg: string) => console.log(msg);

const localCartStore = createLocalStore<string[]>("kl_guest_cart_v1", []);

let serverCart: any = null;
const cartListeners = new Set<() => void>();

function notifyCart() {
  cartListeners.forEach((l) => l());
}

export async function fetchServerCart() {
  try {
    const data = await apiFetch<any>("/account/cart");
    serverCart = data;
    notifyCart();
    return data;
  } catch (e) {
    return null;
  }
}

export async function addToCart(product: Product) {
  const variant = product.variants?.[0];
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
    } catch (e: any) {
      showToast(e.detail || "Could not add to cart", { tone: "error" });
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
    } catch (e: any) {
      showToast(e.detail || "Could not remove item", { tone: "error" });
    }
  } else {
    const current = localCartStore.read();
    localCartStore.set(current.filter((id: string) => id !== variantId));
  }
}

// Cache for the local cart snapshot to prevent infinite loops in useSyncExternalStore
let cachedLocalIds: string[] = [];
let cachedLocalCart: any = { items: [], itemCount: 0, subtotalPaise: 0 };

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