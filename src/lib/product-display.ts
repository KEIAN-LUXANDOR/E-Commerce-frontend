import { SHAPES } from "@/lib/catalog-labels";
import type { Shape } from "@/lib/types/catalog";
import type { StoreProduct, StoreVariant } from "@/lib/types/store";

/**
 * Helpers for showing backend products in the diamond design.
 * The backend doesn't send grading details yet (Phase 2B), so a few things are read from the product name.
 */

/** Finds a shape word in the name ("1.02 ct Oval…" → OVAL). Used only for the drawing shown when there's no photo. */
export function shapeFromName(name: string): Shape | undefined {
  const lower = name.toLowerCase();
  return SHAPES.find((s) => new RegExp(`\\b${s.slug}\\b`).test(lower))?.value;
}

/** Cheapest variant that's in stock, else the cheapest overall. */
export function mainVariant(product: StoreProduct): StoreVariant | undefined {
  const sorted = [...product.variants].sort((a, b) => a.pricePaise - b.pricePaise);
  return sorted.find((v) => v.inStock) ?? sorted[0];
}

export function isAvailable(product: StoreProduct) {
  return product.variants.some((v) => v.inStock);
}

/** True when the variants have different prices, so the card should say "From". */
export function hasPriceRange(product: StoreProduct) {
  return new Set(product.variants.map((v) => v.pricePaise)).size > 1;
}

/** MRP is shown struck through only when it's higher than the selling price. */
export function showMrp(v: StoreVariant) {
  return v.mrpPaise !== null && v.mrpPaise > v.pricePaise;
}
