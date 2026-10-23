/**
 * Catalog types shared by the website and the API.
 *
 * The store sells LOOSE DIAMONDS only. Every product is one certified stone,
 * so there are no variants: one diamond = one SKU = stock of 1.
 *
 * These are written by hand until the backend Swagger file is ready.
 * Later, run `npm run gen:api` and replace these with the generated types,
 * keeping the same names so components don't need to change.
 *
 * All money values are in PAISE (₹1 = 100 paise), the same as the database.
 */

export type Shape =
  | "ROUND"
  | "OVAL"
  | "PRINCESS"
  | "CUSHION"
  | "EMERALD"
  | "PEAR"
  | "MARQUISE"
  | "HEART"
  | "RADIANT"
  | "ASSCHER";

export type DiamondColor = "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
export type Clarity = "FL" | "IF" | "VVS1" | "VVS2" | "VS1" | "VS2" | "SI1" | "SI2";
export type CutGrade = "EXCELLENT" | "VERY_GOOD" | "GOOD";
export type Fluorescence = "NONE" | "FAINT" | "MEDIUM" | "STRONG";
export type Origin = "NATURAL" | "LAB_GROWN";
export type CertificateLab = "GIA" | "IGI";

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc" | "carat_desc" | "carat_asc";
export type ListView = "grid" | "list";

/**
 * Two top-level categories (natural, lab-grown), each with one child per shape.
 * URL: /shop/[origin]/[shape], e.g. /shop/lab-grown/oval
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentSlug?: string;
  children?: Category[];
}

export type MediaType = "IMAGE" | "VIDEO" | "SPIN_360";

export interface Media {
  id: string;
  type: MediaType;
  /** Image or video URL on media.yourbrand.com. Empty while using mock data. */
  url?: string;
  /** Poster image for videos. */
  posterUrl?: string;
  /** For SPIN_360: ordered frame image URLs (24–36 frames). */
  frames?: string[];
  alt: string;
}

/** Light version used on cards, the list view and search. */
export interface DiamondSummary {
  id: string;
  slug: string;
  sku: string;
  shape: Shape;
  carat: number;
  color: DiamondColor;
  clarity: Clarity;
  cut: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  origin: Origin;
  lab: CertificateLab;
  certificateNumber: string;
  pricePaise: number;
  /** false once sold or reserved in someone's checkout */
  available: boolean;
  isNew: boolean;
  /** First two media items (second shows on hover). */
  media: Media[];
}

export interface Breadcrumb {
  name: string;
  href: string;
}

export interface DiamondDetail extends DiamondSummary {
  certificateUrl?: string;
  measurements: { lengthMm: number; widthMm: number; depthMm: number };
  /** Table width as % of average diameter */
  tablePct: number;
  /** Total depth as % of average diameter */
  depthPct: number;
  /** Length ÷ width, e.g. 1.00 for round, ~1.40 for oval */
  lwRatio: number;
  girdle: string;
  culet: string;
  /** Report number laser-inscribed on the girdle */
  laserInscription: boolean;
  description: string;
  /** All media for the stone */
  gallery: Media[];
  /** Lowest monthly EMI, worked out by the server. Absent when EMI isn't allowed. */
  emiFromPaise?: number;
  breadcrumbs: Breadcrumb[];
  seo: { title: string; description: string };
}

export interface Banner {
  id: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl?: string;
  /** Used for the placeholder art when there's no image. */
  shape?: Shape;
  startsAt: string;
  endsAt: string;
}

/** Filters a shopper can apply. Every field is optional. */
export interface ProductFilters {
  /** Origin slug from the path: "natural" | "lab-grown" */
  category?: string;
  /** Shape slug from the path, e.g. "oval" */
  sub?: string;
  q?: string;
  shape?: Shape[];
  color?: DiamondColor[];
  clarity?: Clarity[];
  cut?: CutGrade[];
  origin?: Origin[];
  lab?: CertificateLab[];
  fluorescence?: Fluorescence[];
  caratMin?: number;
  caratMax?: number;
  /** In rupees (not paise) because shoppers type rupees. */
  priceMin?: number;
  priceMax?: number;
  sort?: SortOption;
  page?: number;
  /** Grid of cards or a comparison table. Display only; not sent to the API. */
  view?: ListView;
}

export interface DiamondPage {
  items: DiamondSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** For search: the corrected query when the typed one had a typo. */
  didYouMean?: string;
}

export interface SearchSuggestion {
  type: "DIAMOND" | "CATEGORY";
  label: string;
  href: string;
  /** Present for DIAMOND suggestions. */
  pricePaise?: number;
  shape?: Shape;
}

export interface PincodeResult {
  pincode: string;
  serviceable: boolean;
  city?: string;
  state?: string;
  minDays?: number;
  maxDays?: number;
}
