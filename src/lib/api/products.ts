import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api/client";
import { toApiSearch } from "@/lib/catalog/query";
import type { Product, ProductPage, ProductQuery } from "@/lib/types/product";

/**
 * Catalogue reads on the server (live endpoints: GET /products, GET /products/{slug}).
 *
 * Results are cached for a few minutes. If the backend can't be reached, the page still
 * renders (with an "unavailable" message) and the failure is only cached for seconds,
 * so the site recovers by itself as soon as the API is back.
 */

const EMPTY_PAGE: ProductPage = { items: [], page: 0, size: 0, totalItems: 0, totalPages: 0 };

export interface ProductPageResult {
  page: ProductPage;
  /** true when the backend couldn't be reached (show a message, not "no results") */
  unavailable: boolean;
  /** Backend's message for a bad filter value (400), shown above the results */
  error?: string;
}

export async function getProducts(query: ProductQuery): Promise<ProductPageResult> {
  "use cache";
  cacheTag("products");
  try {
    const page = await apiFetch<ProductPage>(`/products${toApiSearch(query)}`);
    cacheLife("minutes");
    return { page, unavailable: false };
  } catch (e) {
    cacheLife("seconds");
    if (e instanceof ApiError && e.status === 400) return { page: EMPTY_PAGE, unavailable: false, error: e.message };
    return { page: EMPTY_PAGE, unavailable: true };
  }
}

export interface ProductResult {
  product: Product | null;
  unavailable: boolean;
}

export async function getProduct(slug: string): Promise<ProductResult> {
  "use cache";
  cacheTag("products", `product-${slug}`);
  try {
    const product = await apiFetch<Product | null>(`/products/${encodeURIComponent(slug)}`, { allow404: true });
    cacheLife("minutes");
    return { product, unavailable: false };
  } catch {
    cacheLife("seconds");
    return { product: null, unavailable: true };
  }
}

/** Newest diamonds for the home page and "You may also like". */
export async function getNewArrivals(size = 8): Promise<Product[]> {
  const result = await getProducts({ sort: "newest", page: 0, size });
  return result.page.items;
}

/** Diamonds like this one: same shape and origin, closest first by carat. */
export async function getSimilar(product: Product, size = 4): Promise<Product[]> {
  const d = product.diamond;
  if (!d) return getNewArrivals(size + 1).then((list) => list.filter((p) => p.id !== product.id).slice(0, size));
  const result = await getProducts({
    origin: d.origin,
    shape: [d.shape],
    minCarat: Math.max(0.01, Math.round((d.carat - 0.3) * 100) / 100),
    maxCarat: Math.round((d.carat + 0.3) * 100) / 100,
    sort: "recommended",
    page: 0,
    size: size + 1,
  });
  return result.page.items.filter((p) => p.id !== product.id).slice(0, size);
}
