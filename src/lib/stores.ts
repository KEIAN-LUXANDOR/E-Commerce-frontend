"use client";

import { createLocalStore, createMemoryStore } from "@/lib/local-store";
import type { DiamondSummary, Shape } from "@/lib/types/catalog";
import type { StoreProduct } from "@/lib/types/store";

/**
 * TEMPORARY browser-only cart and wishlist so the header counts, cart drawer and
 * diamond page buttons work now. In Phase F1 (wishlist API) and F4 (server cart) these
 * functions will call the backend instead; components using them won't need to change.
 * Prices shown here are for display only. The server always works out the real total.
 */

export interface CartLine {
  /** Unique id of what's being bought: the variant id for store products */
  diamondId: string;
  slug: string;
  /** e.g. "1.02 ct Round" */
  title: string;
  /** Product photo; when missing, a drawing of `shape` is shown */
  imageUrl?: string;
  shape?: Shape;
  /** e.g. "F colour, VS1, Excellent cut, natural" or the variant name and SKU */
  specLabel: string;
  certificateNumber?: string;
  pricePaise: number;
}

const cartStore = createLocalStore<CartLine[]>("ad.cart.v2", []);
const wishlistStore = createLocalStore<string[]>("ad.wishlist.v2", []);
const compareStore = createLocalStore<string[]>("ad.compare.v2", [
  "0-72-ct-round-i-vs1-natural-ad1001",
  "1-01-ct-oval-f-vs1-lab-grown-ad1002",
  "1-05-ct-round-d-vvs2-natural-ad1003",
]);
const recentStore = createLocalStore<DiamondSummary[]>("ad.recent.v2", []);
const recentSearchStore = createLocalStore<string[]>("ad.recent-search.v1", []);
const recentProductStore = createLocalStore<StoreProduct[]>("kl.recent-products.v1", []);

export const useCart = cartStore.useValue;
export const useWishlist = wishlistStore.useValue;
export const useCompare = compareStore.useValue;
export const useRecentlyViewed = recentStore.useValue;
export const useRecentSearches = recentSearchStore.useValue;
export const useRecentProducts = recentProductStore.useValue;

export function addToCompare(slug: string): "added" | "already" | "full" {
  const list = compareStore.read();
  if (list.includes(slug)) return "already";
  if (list.length >= 4) return "full";
  compareStore.set([...list, slug]);
  return "added";
}

export function removeFromCompare(slug: string) {
  compareStore.set((list) => list.filter((s) => s !== slug));
}

export function clearCompare() {
  compareStore.set([]);
}

/** Remembers a store product for "Recently viewed" (first two photos only, to keep storage small). */
export function rememberProduct(p: StoreProduct) {
  const card: StoreProduct = { ...p, description: null, images: p.images.slice(0, 2) };
  recentProductStore.set((list) => [card, ...list.filter((x) => x.slug !== p.slug)].slice(0, 9));
}

/** Adds a diamond. Each stone is one of a kind, so it can only be in the cart once. */
export function addToCart(line: CartLine): "added" | "already" {
  const lines = cartStore.read();
  if (lines.some((l) => l.diamondId === line.diamondId)) return "already";
  cartStore.set([...lines, line]);
  return "added";
}

export function removeFromCart(diamondId: string) {
  cartStore.set((lines) => lines.filter((l) => l.diamondId !== diamondId));
}

/** Returns true when the diamond is now in the wishlist. */
export function toggleWishlist(slug: string): boolean {
  const has = wishlistStore.read().includes(slug);
  wishlistStore.set((list) => (has ? list.filter((s) => s !== slug) : [slug, ...list]));
  return !has;
}

export function addToWishlist(slug: string) {
  const has = wishlistStore.read().includes(slug);
  if (!has) {
    wishlistStore.set((list) => [slug, ...list]);
  }
}

/** Keeps only the card fields so storage stays small. */
export function rememberViewed(d: DiamondSummary) {
  const card: DiamondSummary = {
    id: d.id,
    slug: d.slug,
    sku: d.sku,
    shape: d.shape,
    carat: d.carat,
    color: d.color,
    clarity: d.clarity,
    cut: d.cut,
    polish: d.polish,
    symmetry: d.symmetry,
    fluorescence: d.fluorescence,
    origin: d.origin,
    lab: d.lab,
    certificateNumber: d.certificateNumber,
    pricePaise: d.pricePaise,
    available: d.available,
    isNew: d.isNew,
    media: d.media.slice(0, 2),
  };
  recentStore.set((list) => [card, ...list.filter((x) => x.slug !== d.slug)].slice(0, 9));
}

export function rememberSearch(q: string) {
  const term = q.trim();
  if (!term) return;
  recentSearchStore.set((list) => [term, ...list.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 5));
}

export function clearRecentSearches() {
  recentSearchStore.set([]);
}

// ---------- UI state ----------

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "error";
}

const toastStore = createMemoryStore<Toast[]>([]);
export const useToasts = toastStore.useValue;
let toastId = 0;

export function showToast(message: string, tone: Toast["tone"] = "info") {
  const id = ++toastId;
  toastStore.set((list) => [...list.slice(-2), { id, message, tone }]);
  window.setTimeout(() => toastStore.set((list) => list.filter((t) => t.id !== id)), 4500);
}

export function dismissToast(id: number) {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

const miniCartStore = createMemoryStore(false);
export const useMiniCartOpen = miniCartStore.useValue;
export const setMiniCartOpen = (open: boolean) => miniCartStore.set(open);

/** Text pre-filled in the floating WhatsApp button; the product page sets it. */
const whatsappStore = createMemoryStore<string | undefined>(undefined);
export const useWhatsAppMessage = whatsappStore.useValue;
export const setWhatsAppMessage = (msg: string | undefined) => whatsappStore.set(msg);
