import { apiFetch } from "@/lib/api/client";
import { mainVariant, shapeFromName } from "@/lib/product-display";
import type { PincodeResult, SearchSuggestion } from "@/lib/types/catalog";
import type { StoreProductPage } from "@/lib/types/store";

/** Catalog calls made from the browser (Client Components). */

/**
 * Suggestions while typing in the search box.
 * Uses the existing GET /products?q= search (first 6 matches) until the backend
 * adds a dedicated suggestions endpoint.
 */
export async function fetchSuggestions(q: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
  const page = await apiFetch<StoreProductPage>(`/products?q=${encodeURIComponent(q)}&page=0&size=6`, { signal });
  return page.items.map((p) => ({
    type: "DIAMOND",
    label: p.name,
    href: `/product/${encodeURIComponent(p.slug)}`,
    pricePaise: mainVariant(p)?.pricePaise,
    shape: shapeFromName(p.name) ?? "ROUND",
  }));
}

/** Not in the backend yet (Phase 5). Kept for the PIN code check on the product page. */
export function fetchPincode(pin: string) {
  return apiFetch<PincodeResult>(`/pincodes/${encodeURIComponent(pin)}`);
}
