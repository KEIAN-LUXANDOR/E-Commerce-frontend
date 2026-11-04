/**
 * Products as the backend sends them (docs/API-ENDPOINTS.md, "Products").
 * The store sells loose diamonds: every product is one stone with ONE variant
 * (its price and stock) and a `diamond` object with its grades.
 * All money is in cents ($1 = 100 cents); the fields keep their *Paise names from the backend.
 */

export const SHAPE_VALUES = ["ROUND", "OVAL", "CUSHION", "EMERALD", "PEAR", "PRINCESS", "RADIANT", "ASSCHER", "MARQUISE", "HEART"] as const;
export const COLOR_VALUES = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
export const CLARITY_VALUES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"] as const;
export const CUT_VALUES = ["IDEAL", "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"] as const;
export const FINISH_VALUES = ["EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"] as const;
export const FLUORESCENCE_VALUES = ["NONE", "FAINT", "MEDIUM", "STRONG", "VERY_STRONG"] as const;
export const LAB_VALUES = ["GIA", "IGI", "HRD"] as const;
export const ORIGIN_VALUES = ["NATURAL", "LAB_GROWN"] as const;
export const SORT_VALUES = ["recommended", "newest", "price_asc", "price_desc", "carat_asc", "carat_desc"] as const;

export type Shape = (typeof SHAPE_VALUES)[number];
export type DiamondColor = (typeof COLOR_VALUES)[number];
export type Clarity = (typeof CLARITY_VALUES)[number];
export type Cut = (typeof CUT_VALUES)[number];
export type Finish = (typeof FINISH_VALUES)[number];
export type Fluorescence = (typeof FLUORESCENCE_VALUES)[number];
export type Lab = (typeof LAB_VALUES)[number];
export type Origin = (typeof ORIGIN_VALUES)[number];
export type SortOption = (typeof SORT_VALUES)[number];

/** Grades of one diamond. Optional certificate fields arrive later (backend "certificate details"). */
export interface Diamond {
  origin: Origin;
  shape: Shape;
  carat: number;
  color: DiamondColor;
  clarity: Clarity;
  /** null for most fancy shapes ("Not graded") */
  cut: Cut | null;
  polish: Finish;
  symmetry: Finish;
  fluorescence: Fluorescence;
  lab: Lab;
  quickShip: boolean;
  // ---- planned (certificate details). Shown only when the backend sends them. ----
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  verifyUrl?: string | null;
  laserInscription?: boolean;
  lengthMm?: number | null;
  widthMm?: number | null;
  depthMm?: number | null;
  lwRatio?: number | null;
  tablePct?: number | null;
  depthPct?: number | null;
  girdle?: string | null;
  culet?: string | null;
}

export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  pricePaise: number;
  /** Crossed-out price; null when there isn't one */
  mrpPaise: number | null;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** null for a product without diamond details: hide the grades then */
  diamond: Diamond | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductPage {
  items: Product[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

/** Filters for GET /products. Lists are sent as comma-separated values. Prices in paise. */
export interface ProductQuery {
  q?: string;
  origin?: Origin;
  shape?: Shape[];
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: DiamondColor[];
  clarity?: Clarity[];
  cut?: Cut[];
  polish?: Finish[];
  symmetry?: Finish[];
  fluorescence?: Fluorescence[];
  lab?: Lab[];
  withImage?: boolean;
  quickShip?: boolean;
  sort?: SortOption;
  page?: number;
  size?: number;
}
