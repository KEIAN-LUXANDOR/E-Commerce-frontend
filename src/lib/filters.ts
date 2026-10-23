import {
  CLARITIES,
  COLORS,
  CUTS,
  FLUORESCENCES,
  LABS,
  ORIGINS,
  SHAPES,
  SORTS,
  labelOf,
} from "@/lib/catalog-labels";
import type { ProductFilters, SortOption } from "@/lib/types/catalog";

/**
 * Filters live in the URL so links can be shared and the back button works.
 *
 *   /shop/natural?shape=round,oval&carat=0.5-1.5&price=50000-300000&sort=price_asc&page=2&view=list
 *
 * Values are written in lowercase with hyphens (LAB_GROWN → lab-grown)
 * and turned back into the API's enum values here.
 */

type RawParams = Record<string, string | string[] | undefined>;

const LIST_KEYS = {
  shape: SHAPES,
  color: COLORS,
  clarity: CLARITIES,
  cut: CUTS,
  origin: ORIGINS,
  lab: LABS,
  fluorescence: FLUORESCENCES,
} as const;

export type ListFilterKey = keyof typeof LIST_KEYS;
export const LIST_FILTER_KEYS = Object.keys(LIST_KEYS) as ListFilterKey[];

export const CARAT_BOUNDS = { min: 0.3, max: 3.5 } as const;
export const PRICE_BOUNDS = { min: 20000, max: 5000000 } as const;

export const toParam = (v: string) => v.toLowerCase().replace(/_/g, "-");
const fromParam = (v: string) => v.toUpperCase().replace(/-/g, "_");

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function parseRange(v: string | undefined): [number | undefined, number | undefined] {
  if (!v) return [undefined, undefined];
  const [a, b] = v.split("-");
  const min = a ? Number(a) : undefined;
  const max = b ? Number(b) : undefined;
  return [
    min !== undefined && Number.isFinite(min) && min >= 0 ? min : undefined,
    max !== undefined && Number.isFinite(max) && max >= 0 ? max : undefined,
  ];
}

/** Reads the URL query into filters. Unknown or invalid values are ignored, never trusted. */
export function parseFilters(params: RawParams, path?: { category?: string; sub?: string }): ProductFilters {
  const filters: ProductFilters = {};
  if (path?.category) filters.category = path.category;
  if (path?.sub) filters.sub = path.sub;

  const q = first(params.q)?.trim();
  if (q) filters.q = q.slice(0, 100);

  for (const key of LIST_FILTER_KEYS) {
    const raw = first(params[key]);
    if (!raw) continue;
    const allowed = new Set<string>(LIST_KEYS[key].map((o) => o.value));
    const values = [...new Set(raw.split(",").map(fromParam))].filter((v) => allowed.has(v));
    // The cast is safe: every value was checked against the allowed list above.
    if (values.length) (filters as Record<string, unknown>)[key] = values;
  }

  const [caratMin, caratMax] = parseRange(first(params.carat));
  if (caratMin !== undefined) filters.caratMin = caratMin;
  if (caratMax !== undefined) filters.caratMax = caratMax;

  const [priceMin, priceMax] = parseRange(first(params.price));
  if (priceMin !== undefined) filters.priceMin = priceMin;
  if (priceMax !== undefined) filters.priceMax = priceMax;

  const sort = first(params.sort);
  if (sort && SORTS.some((s) => s.value === sort)) filters.sort = sort as SortOption;

  const page = Number(first(params.page));
  if (Number.isInteger(page) && page > 1) filters.page = page;

  if (first(params.view) === "list") filters.view = "list";

  return filters;
}

/** Turns filters back into a query string. Category and sub-category stay in the path. */
export function toSearchParams(filters: ProductFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  for (const key of LIST_FILTER_KEYS) {
    const values = filters[key] as string[] | undefined;
    if (values?.length) sp.set(key, values.map(toParam).join(","));
  }
  if (filters.caratMin !== undefined || filters.caratMax !== undefined) {
    sp.set("carat", `${filters.caratMin ?? ""}-${filters.caratMax ?? ""}`);
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    sp.set("price", `${filters.priceMin ?? ""}-${filters.priceMax ?? ""}`);
  }
  if (filters.sort && filters.sort !== "featured") sp.set("sort", filters.sort);
  if (filters.page && filters.page > 1) sp.set("page", String(filters.page));
  if (filters.view === "list") sp.set("view", "list");
  return sp;
}

export function buildHref(basePath: string, filters: ProductFilters): string {
  const qs = toSearchParams(filters).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Any filter change sends the shopper back to page 1. */
export function withFilters(filters: ProductFilters, patch: Partial<ProductFilters>): ProductFilters {
  const next = { ...filters, ...patch, page: undefined };
  for (const k of Object.keys(next) as (keyof ProductFilters)[]) {
    const v = next[k];
    if (v === undefined || (Array.isArray(v) && v.length === 0)) delete next[k];
  }
  return next;
}

export function toggleValue<T extends string>(list: T[] | undefined, value: T): T[] {
  const set = new Set(list ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return [...set];
}

export interface ActiveChip {
  key: string;
  label: string;
  /** Filters with this one removed. */
  without: ProductFilters;
}

/** The "chips" shown above results, each with a link that removes it. */
export function activeChips(filters: ProductFilters): ActiveChip[] {
  const chips: ActiveChip[] = [];
  for (const key of LIST_FILTER_KEYS) {
    const values = (filters[key] as string[] | undefined) ?? [];
    for (const v of values) {
      chips.push({
        key: `${key}:${v}`,
        label: labelOf(LIST_KEYS[key] as { value: string; label: string }[], v),
        without: withFilters(filters, { [key]: values.filter((x) => x !== v) }),
      });
    }
  }
  if (filters.caratMin !== undefined || filters.caratMax !== undefined) {
    chips.push({
      key: "carat",
      label: `${filters.caratMin ?? CARAT_BOUNDS.min}–${filters.caratMax ?? CARAT_BOUNDS.max} ct`,
      without: withFilters(filters, { caratMin: undefined, caratMax: undefined }),
    });
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const f = (n: number) => `₹${n.toLocaleString("en-IN")}`;
    chips.push({
      key: "price",
      label: `${f(filters.priceMin ?? PRICE_BOUNDS.min)}–${f(filters.priceMax ?? PRICE_BOUNDS.max)}`,
      without: withFilters(filters, { priceMin: undefined, priceMax: undefined }),
    });
  }
  return chips;
}

/** Filters with everything cleared except the place the shopper is (category, search words). */
export function clearedFilters(filters: ProductFilters): ProductFilters {
  return { category: filters.category, sub: filters.sub, q: filters.q, sort: filters.sort, view: filters.view };
}
