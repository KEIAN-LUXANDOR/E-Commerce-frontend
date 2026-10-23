import type { StoreProductFilters } from "@/lib/types/store";

export type PageSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(params: PageSearchParams, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseStoreFilters(params: PageSearchParams, category?: string): StoreProductFilters {
  const pageValue = Number(firstParam(params, "page"));
  const page = Number.isInteger(pageValue) && pageValue >= 0 ? pageValue : 0;
  const rawSize = Number(firstParam(params, "size"));
  const size = Number.isInteger(rawSize) && rawSize > 0 ? Math.min(rawSize, 50) : 20;
  const rawSort = firstParam(params, "sort");
  const sort = rawSort === "newest" ? "newest" : "name";
  // Shoppers type rupees; the API filters in paise (₹1 = 100 paise)
  const minPrice = toPaise(nonNegativeInteger(firstParam(params, "minPrice")));
  const maxPrice = toPaise(nonNegativeInteger(firstParam(params, "maxPrice")));
  const q = firstParam(params, "q")?.trim();

  return {
    ...(q ? { q } : {}),
    ...(category ? { category } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    sort,
    page,
    size,
  };
}

function toPaise(rupees?: number): number | undefined {
  return rupees === undefined ? undefined : rupees * 100;
}

/** Paise back to whole rupees, for the price form and links. */
export function toRupees(paise?: number): number | undefined {
  return paise === undefined ? undefined : Math.round(paise / 100);
}

function nonNegativeInteger(value?: string): number | undefined {
  if (value === undefined || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

export function storeQueryHref(path: string, filters: StoreProductFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.minPrice !== undefined) params.set("minPrice", String(toRupees(filters.minPrice)));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(toRupees(filters.maxPrice)));
  if (filters.sort) params.set("sort", filters.sort);
  params.set("page", String(page));
  if (filters.size) params.set("size", String(filters.size));
  return `${path}?${params.toString()}`;
}
