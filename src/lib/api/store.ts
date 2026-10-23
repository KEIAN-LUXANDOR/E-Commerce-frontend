import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import type { StoreCategory, StoreProduct, StoreProductFilters, StoreProductPage } from "@/lib/types/store";

export async function getStoreCategories(): Promise<StoreCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return apiFetch<StoreCategory[]>("/categories");
}

export async function getStoreProducts(filters: StoreProductFilters = {}): Promise<StoreProductPage> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const params = new URLSearchParams();
  for (const key of ["q", "category", "minPrice", "maxPrice", "sort", "page", "size"] as const) {
    const value = filters[key];
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  return apiFetch<StoreProductPage>(`/products?${params.toString()}`);
}

export async function getStoreProduct(slug: string): Promise<StoreProduct | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);
  return apiFetch<StoreProduct | null>(`/products/${encodeURIComponent(slug)}`, { allow404: true });
}
