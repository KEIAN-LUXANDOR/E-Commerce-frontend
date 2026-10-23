import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/config";
import { toSearchParams } from "@/lib/filters";
import { mockActiveBanners, mockCategories, mockDiamond, mockFeatured, mockListDiamonds, mockSimilar } from "@/mocks/catalog-service";
import type { Banner, Category, DiamondDetail, DiamondPage, DiamondSummary, ProductFilters } from "@/lib/types/catalog";

/**
 * Catalog data for Server Components (SEO pages).
 *
 * Each function is cached with "use cache". Cache tags let the admin panel refresh
 * a page right after a diamond is saved (Phase F3: call revalidateTag("product-<slug>")).
 */

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  if (USE_MOCK) return mockCategories();
  return apiFetch<Category[]>("/categories");
}

export async function getActiveBanners(): Promise<Banner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("banners");
  if (USE_MOCK) return mockActiveBanners(new Date());
  return apiFetch<Banner[]>("/banners/active");
}

export async function getDiamonds(filters: ProductFilters): Promise<DiamondPage> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  if (USE_MOCK) return mockListDiamonds(filters);
  const sp = toSearchParams({ ...filters, view: undefined });
  if (filters.category) sp.set("origin", filters.category);
  if (filters.sub) sp.set("shapeSlug", filters.sub);
  return apiFetch<DiamondPage>(`/products?${sp.toString()}`);
}

export async function getDiamond(slug: string): Promise<DiamondDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);
  if (USE_MOCK) return mockDiamond(slug) ?? null;
  return apiFetch<DiamondDetail | null>(`/products/${encodeURIComponent(slug)}`, { allow404: true });
}

export async function getSimilarDiamonds(slug: string): Promise<DiamondSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);
  if (USE_MOCK) return mockSimilar(slug);
  return apiFetch<DiamondSummary[]>(`/products/${encodeURIComponent(slug)}/similar`);
}

export async function getFeaturedDiamonds(kind: "new" | "best"): Promise<DiamondSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  if (USE_MOCK) return mockFeatured(kind);
  return apiFetch<DiamondSummary[]>(`/products/featured?type=${kind}`);
}
