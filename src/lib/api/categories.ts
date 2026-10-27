import { apiFetch } from "./client";

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getCategoryProducts(slug: string): Promise<any[]> {
  return apiFetch<any[]>(`/categories/${slug}/products`);
}