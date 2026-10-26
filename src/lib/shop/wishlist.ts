"use client";

import { useEffect } from "react";
import { ApiError } from "@/lib/api/client";
import { addWishlistProduct, getWishlistProductIds, removeWishlistProduct } from "@/lib/api/wishlist";
import { createLocalStore, createMemoryStore } from "@/lib/local-store";
import { useSession } from "@/lib/session";
import type { Product } from "@/lib/types/product";

/**
 * Saved diamonds (the heart button).
 *
 * Logged in → the server wishlist (/account/wishlist). Guest → kept in this browser and moved
 * to the account right after login, so nothing a shopper saved is lost.
 */

interface GuestSaved {
  productId: string;
  slug: string;
}

interface WishlistView {
  mode: "guest" | "server";
  /** Product ids that are saved */
  ids: string[];
}

const guestStore = createLocalStore<GuestSaved[]>("kl.guest-wishlist.v1", []);
const viewStore = createMemoryStore<WishlistView>({ mode: "guest", ids: [] });
let mode: "guest" | "server" | "unknown" = "unknown";

export const useWishlist = viewStore.useValue;

/** Slugs saved as a guest (the wishlist page loads these from the catalogue). */
export const useGuestWishlist = guestStore.useValue;

export function isSaved(productId: string, view: WishlistView): boolean {
  return view.ids.includes(productId);
}

/** Saves or un-saves. Returns the new state, or an error message. */
export async function toggleSaved(product: Product): Promise<{ saved: boolean } | { error: string }> {
  const saved = viewStore.get().ids.includes(product.id);

  if (mode === "server") {
    const before = viewStore.get();
    const ids = saved ? before.ids.filter((id) => id !== product.id) : [product.id, ...before.ids];
    viewStore.set({ ...before, ids });
    try {
      if (saved) await removeWishlistProduct(product.id);
      else await addWishlistProduct(product.id);
      return { saved: !saved };
    } catch (e) {
      viewStore.set(before);
      if (e instanceof Error) return { error: e.message };
      return { error: "Couldn’t update your wishlist. Please try again." };
    }
  }

  if (saved) {
    guestStore.set((list) => list.filter((s) => s.productId !== product.id));
  } else {
    guestStore.set((list) => [{ productId: product.id, slug: product.slug }, ...list].slice(0, 100));
  }
  viewStore.set({ mode: "guest", ids: guestStore.read().map((s) => s.productId) });
  return { saved: !saved };
}

/** Removes a product by id (used on the wishlist page). */
export async function removeSaved(productId: string): Promise<void> {
  if (mode === "server") {
    const before = viewStore.get();
    viewStore.set({ ...before, ids: before.ids.filter((id) => id !== productId) });
    await removeWishlistProduct(productId);
    return;
  }
  guestStore.set((list) => list.filter((s) => s.productId !== productId));
  viewStore.set({ mode: "guest", ids: guestStore.read().map((s) => s.productId) });
}

async function loadServerIds() {
  const ids = await getWishlistProductIds();
  viewStore.set({ mode: "server", ids });
}

async function switchMode(next: "guest" | "server") {
  if (mode === next) return;
  mode = next;
  if (next === "guest") {
    viewStore.set({ mode: "guest", ids: guestStore.read().map((s) => s.productId) });
    return;
  }
  // Move what was saved as a guest into the account
  for (const item of guestStore.read()) {
    try {
      await addWishlistProduct(item.productId);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        mode = "guest";
        return;
      }
      // 404 (no longer on sale) or full: skip it
    }
  }
  guestStore.set([]);
  try {
    await loadServerIds();
  } catch {
    viewStore.set({ mode: "server", ids: [] });
  }
}

let queue: Promise<void> = Promise.resolve();

/** Keeps the wishlist in step with who is logged in. Rendered once in the store layout. */
export function useWishlistSync() {
  const session = useSession();
  useEffect(() => {
    if (session.status === "loading") return;
    const next = session.status === "user" ? "server" : "guest";
    queue = queue.then(() => switchMode(next));
  }, [session.status]);
}
