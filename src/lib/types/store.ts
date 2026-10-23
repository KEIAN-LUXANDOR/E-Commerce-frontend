export interface StoreCategory {
  id: string;
  slug: string;
  name: string;
}

export interface StoreImage {
  url: string;
  altText: string | null;
}

export interface StoreVariant {
  id: string;
  sku: string;
  name: string;
  pricePaise: number;
  mrpPaise: number | null;
  inStock: boolean;
}

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: StoreImage[];
  variants: StoreVariant[];
}

export interface StoreProductPage {
  items: StoreProduct[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface StoreProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "name" | "newest";
  page?: number;
  size?: number;
}
