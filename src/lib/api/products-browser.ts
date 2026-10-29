import { apiFetch } from "@/lib/api/client";
import { toApiSearch } from "@/lib/catalog/query";
import type { Product, ProductPage, ProductQuery } from "@/lib/types/product";

/** Catalogue reads from the browser (search suggestions, guest wishlist). */

export function fetchProducts(query: ProductQuery, signal?: AbortSignal) {
  return apiFetch<ProductPage>(`/products${toApiSearch(query)}`, { signal });
}

/** One product, or null when it no longer exists (sold and archived). */
export function fetchProduct(slug: string, signal?: AbortSignal) {
  return apiFetch<Product | null>(`/products/${encodeURIComponent(slug)}`, { allow404: true, signal });
}

/** Several products by slug, in the same order; missing ones are left out. */
export async function fetchProductsBySlug(slugs: string[], signal?: AbortSignal): Promise<Product[]> {
  const results = await Promise.all(slugs.map((slug) => fetchProduct(slug, signal).catch(() => null)));
  return results.filter((p): p is Product => p !== null);
}
