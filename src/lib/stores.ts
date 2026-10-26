"use client";

import { createLocalStore, createMemoryStore } from "@/lib/local-store";
import type { Product } from "@/lib/types/product";

/**
 * Small browser-side stores for things that don't need the server:
 * compare list, recently viewed, recent searches, toasts, the mini cart and the WhatsApp text.
 * The cart and wishlist live in src/lib/shop/ (they sync with the backend after login).
 */

// ---------- compare (up to 4 diamonds, by slug) ----------

export const COMPARE_LIMIT = 4;
const compareStore = createLocalStore<string[]>("kl.compare.v3", []);
export const useCompare = compareStore.useValue;

export function addToCompare(slug: string): "added" | "already" | "full" {
  const list = compareStore.read();
  if (list.includes(slug)) return "already";
  if (list.length >= COMPARE_LIMIT) return "full";
  compareStore.set([...list, slug]);
  return "added";
}

/** Adds or removes; returns what happened so the button can say so. */
export function toggleCompare(slug: string): "added" | "removed" | "full" {
  if (compareStore.read().includes(slug)) {
    removeFromCompare(slug);
    return "removed";
  }
  const result = addToCompare(slug);
  if (result === "full") return "full";
  return "added";
}

export function removeFromCompare(slug: string) {
  compareStore.set((list) => list.filter((s) => s !== slug));
}

export function clearCompare() {
  compareStore.set([]);
}

// ---------- recently viewed (card data only, to keep storage small) ----------

const recentStore = createLocalStore<Product[]>("kl.recent.v3", []);
export const useRecentlyViewed = recentStore.useValue;

export function rememberViewed(p: Product) {
  const card: Product = { ...p, description: null, images: p.images.slice(0, 1) };
  recentStore.set((list) => [card, ...list.filter((x) => x.slug !== p.slug)].slice(0, 8));
}

// ---------- recent searches ----------

const recentSearchStore = createLocalStore<string[]>("kl.recent-search.v1", []);
export const useRecentSearches = recentSearchStore.useValue;

export function rememberSearch(q: string) {
  const term = q.trim();
  if (!term) return;
  recentSearchStore.set((list) => [term, ...list.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 5));
}

export function clearRecentSearches() {
  recentSearchStore.set([]);
}

// ---------- toasts ----------

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "error";
  action?: { label: string; href: string };
}

const toastStore = createMemoryStore<Toast[]>([]);
export const useToasts = toastStore.useValue;
let toastId = 0;

export function showToast(message: string, tone: Toast["tone"] = "info", action?: Toast["action"]) {
  const id = ++toastId;
  toastStore.set((list) => [...list.slice(-2), { id, message, tone, action }]);
  window.setTimeout(() => toastStore.set((list) => list.filter((t) => t.id !== id)), 5000);
}

export function dismissToast(id: number) {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

// ---------- mini cart drawer ----------

const miniCartStore = createMemoryStore(false);
export const useMiniCartOpen = miniCartStore.useValue;
export const setMiniCartOpen = (open: boolean) => miniCartStore.set(open);

// ---------- WhatsApp button text (the diamond page sets it) ----------

const whatsappStore = createMemoryStore<string | undefined>(undefined);
export const useWhatsAppMessage = whatsappStore.useValue;
export const setWhatsAppMessage = (msg: string | undefined) => whatsappStore.set(msg);
