"use client";

import { useEffect } from "react";
import { ApiError } from "@/lib/api/client";
import { addCartItem, getCart, removeCartItem, type Cart, type CartLine } from "@/lib/api/cart";
import { fetchProductsBySlug } from "@/lib/api/products-browser";
import { mainVariant } from "@/lib/catalog/product";
import { createLocalStore, createMemoryStore } from "@/lib/local-store";
import { useSession } from "@/lib/session";
import type { Product } from "@/lib/types/product";

/**
 * The cart, the same way for every page.
 *
 * Logged in → the server cart (GET/PUT/DELETE /account/cart). Prices and totals come from the server.
 * Guest     → a list kept in this browser. Prices are re-read from the live catalogue when the cart
 *             page opens, and the guest list is moved into the server cart right after login.
 *
 * Each diamond is one of a kind, so there are no quantities.
 */

export interface GuestCartItem {
  variantId: string;
  slug: string;
  addedAt: string;
  /** Snapshot for the drawer; the cart page reloads it live */
  product: Product;
}

export interface CartView {
  status: "loading" | "ready" | "error";
  mode: "guest" | "server";
  lines: CartLine[];
  itemCount: number;
  /** Sum of available items. From the server when logged in. */
  subtotalPaise: number;
  hasUnavailableItems: boolean;
  coupon: Cart["coupon"];
  discountPaise: number;
  /** Final total from the server (planned coupons), else the subtotal */
  totalPaise: number;
  error?: string;
}

const EMPTY: CartView = {
  status: "loading",
  mode: "guest",
  lines: [],
  itemCount: 0,
  subtotalPaise: 0,
  hasUnavailableItems: false,
  coupon: null,
  discountPaise: 0,
  totalPaise: 0,
};

const guestStore = createLocalStore<GuestCartItem[]>("kl.guest-cart.v1", []);
const viewStore = createMemoryStore<CartView>(EMPTY);
let mode: "guest" | "server" | "unknown" = "unknown";

export const useCart = viewStore.useValue;

function fromServer(cart: Cart): CartView {
  const discount = cart.discountPaise ?? 0;
  return {
    status: "ready",
    mode: "server",
    lines: cart.items,
    itemCount: cart.itemCount,
    subtotalPaise: cart.subtotalPaise,
    hasUnavailableItems: cart.hasUnavailableItems,
    coupon: cart.coupon ?? null,
    discountPaise: discount,
    totalPaise: cart.totalPaise ?? cart.subtotalPaise - discount,
  };
}

function guestLine(item: GuestCartItem, product: Product | undefined): CartLine {
  const live = product ?? item.product;
  const variant = live.variants.find((v) => v.id === item.variantId);
  const available = Boolean(product && variant && variant.inStock);
  return {
    variantId: item.variantId,
    product: live,
    pricePaise: variant ? variant.pricePaise : null,
    available,
    addedAt: item.addedAt,
  };
}

function fromGuest(items: GuestCartItem[], live?: Product[]): CartView {
  const lines = items.map((item) => {
    if (!live) return guestLine(item, item.product);
    return guestLine(
      item,
      live.find((p) => p.slug === item.slug),
    );
  });
  const subtotal = lines.filter((l) => l.available).reduce((sum, l) => sum + (l.pricePaise ?? 0), 0);
  return {
    ...EMPTY,
    status: "ready",
    mode: "guest",
    lines,
    itemCount: lines.length,
    subtotalPaise: subtotal,
    totalPaise: subtotal,
    hasUnavailableItems: lines.some((l) => !l.available),
  };
}

/** Reloads the cart: from the server when logged in, else from this browser (with live prices). */
export async function refreshCart(): Promise<void> {
  if (mode === "server") {
    try {
      viewStore.set(fromServer(await getCart()));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        mode = "guest";
        return refreshCart();
      }
      viewStore.set({ ...viewStore.get(), status: "error", error: messageOf(e) });
    }
    return;
  }
  const items = guestStore.read();
  viewStore.set(fromGuest(items));
  if (items.length === 0) return;
  try {
    const live = await fetchProductsBySlug(items.map((i) => i.slug));
    viewStore.set(fromGuest(guestStore.read(), live));
  } catch {
    // Catalogue unreachable: keep showing the saved snapshot
  }
}

export type AddResult = { ok: true; already: boolean } | { ok: false; message: string };

/** Adds one diamond. Returns a message the button can show. */
export async function addToCart(product: Product): Promise<AddResult> {
  const variant = mainVariant(product);
  if (!variant || !variant.inStock) return { ok: false, message: "Sorry, this diamond has just been sold." };
  const already = viewStore.get().lines.some((l) => l.variantId === variant.id);
  if (already) return { ok: true, already: true };

  if (mode === "server") {
    try {
      await addCartItem(variant.id);
      await refreshCart();
      return { ok: true, already: false };
    } catch (e) {
      return { ok: false, message: messageOf(e) };
    }
  }

  const items = guestStore.read();
  if (items.length >= 20) return { ok: false, message: "Your cart can hold up to 20 diamonds. Please remove one first." };
  const snapshot: Product = { ...product, description: null, images: product.images.slice(0, 1) };
  guestStore.set([{ variantId: variant.id, slug: product.slug, addedAt: new Date().toISOString(), product: snapshot }, ...items]);
  viewStore.set(fromGuest(guestStore.read()));
  return { ok: true, already: false };
}

export async function removeFromCart(variantId: string): Promise<void> {
  if (mode === "server") {
    // Remove from the screen straight away, then confirm with the server
    const current = viewStore.get();
    viewStore.set({ ...current, lines: current.lines.filter((l) => l.variantId !== variantId) });
    try {
      await removeCartItem(variantId);
    } finally {
      await refreshCart();
    }
    return;
  }
  guestStore.set((items) => items.filter((i) => i.variantId !== variantId));
  viewStore.set(fromGuest(guestStore.read(), viewStore.get().lines.map((l) => l.product)));
}

export function isInCart(variantId: string | undefined, view: CartView): boolean {
  if (!variantId) return false;
  return view.lines.some((l) => l.variantId === variantId);
}

/**
 * After login: moves the guest cart into the server cart. Sold diamonds are skipped.
 * Returns how many couldn't be moved, so the page can say so.
 */
async function mergeGuestCart(): Promise<number> {
  const items = guestStore.read();
  let skipped = 0;
  for (const item of items) {
    try {
      await addCartItem(item.variantId);
    } catch (e) {
      // 409 sold / 404 gone / 400 full: skip it, keep going
      if (e instanceof ApiError && e.status === 401) throw e;
      skipped += 1;
    }
  }
  guestStore.set([]);
  return skipped;
}

let syncing: Promise<void> | null = null;

async function switchMode(next: "guest" | "server") {
  if (mode === next) return;
  mode = next;
  if (next === "server") {
    try {
      const skipped = await mergeGuestCart();
      if (skipped > 0) {
        const { showToast } = await import("@/lib/stores");
        showToast(`${skipped} diamond${skipped > 1 ? "s" : ""} from your cart had already been sold and ${skipped > 1 ? "were" : "was"} removed.`);
      }
    } catch {
      // Session ended while merging: fall back to the guest cart
      mode = "guest";
    }
  }
  await refreshCart();
}

/** Keeps the cart in step with who is logged in. Rendered once in the store layout. */
export function useCartSync() {
  const session = useSession();
  useEffect(() => {
    if (session.status === "loading") return;
    const next = session.status === "user" ? "server" : "guest";
    syncing = (syncing ?? Promise.resolve()).then(() => switchMode(next));
  }, [session.status]);
}

function messageOf(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  return "Something went wrong. Please try again.";
}
