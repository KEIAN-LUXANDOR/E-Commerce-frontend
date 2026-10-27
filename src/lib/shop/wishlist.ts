"use client";

import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { sessionStore } from "@/lib/session";
import { apiFetch } from "@/lib/api/client";

// Safe toast import fallback
import * as storesMod from "@/lib/stores";
const toastStoreObj = storesMod as Record<string, any>;
const showToast = typeof toastStoreObj.showToast === "function" 
  ? toastStoreObj.showToast 
  : (msg: string) => console.log(msg);

const localWishlistStore = createLocalStore<string[]>("kl_guest_wishlist_v1", []);
let serverWishlistIds: string[] = [];
const wishlistListeners = new Set<() => void>();

function notifyWishlist() {
  wishlistListeners.forEach((l) => l());
}

export async function fetchServerWishlistIds() {
  try {
    const ids = await apiFetch<string[]>("/account/wishlist/ids");
    serverWishlistIds = ids || [];
    notifyWishlist();
    return serverWishlistIds;
  } catch (e) {
    return [];
  }
}

export async function addWishlistProduct(productId: string) {
  return toggleWishlist(productId, "add");
}

export async function removeWishlistProduct(productId: string) {
  return toggleWishlist(productId, "remove");
}

export async function toggleWishlist(productId: string, action?: "add" | "remove") {
  const session = sessionStore.get();
  const isAuthenticated = session.status === "authenticated";
  
  const currentList = isAuthenticated ? serverWishlistIds : localWishlistStore.read();
  const isSaved = currentList.includes(productId);
  
  const isAdding = action === "add" || (action === undefined && !isSaved);
  
  if (isAuthenticated) {
    try {
      if (isAdding) {
        await apiFetch(`/account/wishlist/${productId}`, { method: "PUT" });
        showToast("Saved to your wishlist");
      } else {
        await apiFetch(`/account/wishlist/${productId}`, { method: "DELETE" });
        showToast("Removed from your wishlist");
      }
      await fetchServerWishlistIds();
    } catch (e: any) {
      showToast(e.detail || "Could not update wishlist", { tone: "error" });
    }
  } else {
    if (isAdding) {
      localWishlistStore.set([productId, ...currentList].slice(0, 100));
      showToast("Saved to your wishlist");
    } else {
      localWishlistStore.set(currentList.filter((id: string) => id !== productId));
      showToast("Removed from your wishlist");
    }
  }
}

export const wishlistStore = {
  getIds: () => {
    const session = sessionStore.get();
    return session.status === "authenticated" ? serverWishlistIds : localWishlistStore.read();
  },
  useIds: () => {
    const session = sessionStore.useSession();
    const localIds = localWishlistStore.useValue();
    
    return useSyncExternalStore(
      (listener) => {
        wishlistListeners.add(listener);
        return () => wishlistListeners.delete(listener);
      },
      () => {
        if (session.status === "authenticated") {
          return serverWishlistIds;
        }
        return localIds;
      },
      () => []
    );
  },
  toggle: toggleWishlist,
  has: (id: string) => {
    const session = sessionStore.get();
    const list = session.status === "authenticated" ? serverWishlistIds : localWishlistStore.read();
    return list.includes(id);
  }
};

// Aliases for component usage
export function useWishlistIds() {
  return wishlistStore.useIds();
}

export function useWishlist() {
  const ids = wishlistStore.useIds();
  return {
    ids,
    toggle: toggleWishlist,
    has: (id: string) => ids.includes(id),
  };
}