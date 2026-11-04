import {
  CLARITY_VALUES,
  COLOR_VALUES,
  CUT_VALUES,
  FINISH_VALUES,
  FLUORESCENCE_VALUES,
  LAB_VALUES,
  ORIGIN_VALUES,
  SHAPE_VALUES,
  SORT_VALUES,
  type Origin,
  type ProductQuery,
} from "@/lib/types/product";

/**
 * The shop's filters live in the address bar, so links, refresh and the back button all work.
 *
 *   /diamonds/lab-grown?shape=oval,pear&minCarat=1&maxCarat=1.5&color=D,E,F&minPrice=100000&page=2
 *
 * Address format (made for people):        API format (docs/API-ENDPOINTS.md):
 *   shape=oval,pear      (lower case)          shape=OVAL,PEAR
 *   cut=very_good        (lower case)          cut=VERY_GOOD
 *   minPrice=1000        (dollars)             minPrice=100000   (cents)
 *   page=2               (starts at 1)         page=1 (starts at 0)
 *   photo=1 / quickShip=1                      withImage=true / quickShip=true
 */

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export const PAGE_SIZE = 24;

export interface ShopState {
  query: ProductQuery;
  /** "grid" (cards) or "list" (table) */
  view: "grid" | "list";
}

function first(params: SearchParamsRecord, key: string): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Reads a comma list ("oval,pear" or repeated keys) and keeps only allowed values. */
function list<T extends string>(params: SearchParamsRecord, key: string, allowed: readonly T[]): T[] | undefined {
  const raw = params[key];
  if (raw === undefined) return undefined;
  const parts = (Array.isArray(raw) ? raw : [raw]).flatMap((v) => v.split(","));
  const picked: T[] = [];
  for (const part of parts) {
    const upper = part.trim().toUpperCase().replace(/-/g, "_");
    const match = allowed.find((a) => a === upper);
    if (match && !picked.includes(match)) picked.push(match);
  }
  if (picked.length === 0) return undefined;
  return picked;
}

function positiveNumber(value: string | undefined, max: number): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) return undefined;
  return n;
}

function flag(value: string | undefined): boolean | undefined {
  if (value === "1" || value === "true") return true;
  return undefined;
}

/** Address bar → API query. `fixedOrigin` comes from the path (/diamonds/natural). */
export function parseShopParams(params: SearchParamsRecord, fixedOrigin?: Origin): ShopState {
  const pageNumber = positiveNumber(first(params, "page"), 10_000);
  const page = pageNumber && pageNumber >= 1 ? Math.floor(pageNumber) - 1 : 0;

  const minDollars = positiveNumber(first(params, "minPrice"), 1_000_000_000);
  const maxDollars = positiveNumber(first(params, "maxPrice"), 1_000_000_000);

  const sortRaw = first(params, "sort");
  const sort = SORT_VALUES.find((s) => s === sortRaw);

  const originFromQuery = list(params, "origin", ORIGIN_VALUES);
  let origin: Origin | undefined = fixedOrigin;
  if (!origin && originFromQuery && originFromQuery.length === 1) origin = originFromQuery[0];

  const q = first(params, "q")?.trim().slice(0, 100);

  const query: ProductQuery = {
    q: q || undefined,
    origin,
    shape: list(params, "shape", SHAPE_VALUES),
    minCarat: positiveNumber(first(params, "minCarat"), 50),
    maxCarat: positiveNumber(first(params, "maxCarat"), 50),
    minPrice: minDollars === undefined ? undefined : Math.round(minDollars) * 100,
    maxPrice: maxDollars === undefined ? undefined : Math.round(maxDollars) * 100,
    color: list(params, "color", COLOR_VALUES),
    clarity: list(params, "clarity", CLARITY_VALUES),
    cut: list(params, "cut", CUT_VALUES),
    polish: list(params, "polish", FINISH_VALUES),
    symmetry: list(params, "symmetry", FINISH_VALUES),
    fluorescence: list(params, "fluorescence", FLUORESCENCE_VALUES),
    lab: list(params, "lab", LAB_VALUES),
    withImage: flag(first(params, "photo")),
    quickShip: flag(first(params, "quickShip")),
    sort,
    page,
    size: PAGE_SIZE,
  };

  let view: ShopState["view"] = "grid";
  if (first(params, "view") === "list") view = "list";
  return { query, view };
}

/** API query → "?shape=OVAL&..." for GET /products. */
export function toApiSearch(query: ProductQuery): string {
  const p = new URLSearchParams();
  const put = (key: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === "" || value === false) return;
    p.set(key, String(value));
  };
  const putList = (key: string, values: readonly string[] | undefined) => {
    if (values && values.length) p.set(key, values.join(","));
  };
  put("q", query.q);
  put("origin", query.origin);
  putList("shape", query.shape);
  put("minCarat", query.minCarat);
  put("maxCarat", query.maxCarat);
  put("minPrice", query.minPrice);
  put("maxPrice", query.maxPrice);
  putList("color", query.color);
  putList("clarity", query.clarity);
  putList("cut", query.cut);
  putList("polish", query.polish);
  putList("symmetry", query.symmetry);
  putList("fluorescence", query.fluorescence);
  putList("lab", query.lab);
  put("withImage", query.withImage);
  put("quickShip", query.quickShip);
  if (query.sort && query.sort !== "recommended") put("sort", query.sort);
  put("page", query.page ?? 0);
  put("size", query.size ?? PAGE_SIZE);
  return `?${p.toString()}`;
}

/**
 * API query → address bar ("?shape=oval&page=2"), for links and the filter panel.
 * Leaves out origin when the path already has it.
 */
export function toShopSearch(query: ProductQuery, view: ShopState["view"] = "grid", includeOrigin = false): string {
  const p = new URLSearchParams();
  const lower = (values: readonly string[] | undefined) => values?.map((v) => v.toLowerCase()).join(",");
  const set = (key: string, value: string | undefined) => {
    if (value) p.set(key, value);
  };
  set("q", query.q);
  if (includeOrigin && query.origin) set("origin", query.origin.toLowerCase().replace("_", "-"));
  set("shape", lower(query.shape));
  set("minCarat", query.minCarat?.toString());
  set("maxCarat", query.maxCarat?.toString());
  if (query.minPrice !== undefined) set("minPrice", String(Math.round(query.minPrice / 100)));
  if (query.maxPrice !== undefined) set("maxPrice", String(Math.round(query.maxPrice / 100)));
  set("color", query.color?.join(","));
  set("clarity", query.clarity?.join(","));
  set("cut", lower(query.cut));
  set("polish", lower(query.polish));
  set("symmetry", lower(query.symmetry));
  set("fluorescence", lower(query.fluorescence));
  set("lab", lower(query.lab));
  if (query.withImage) set("photo", "1");
  if (query.quickShip) set("quickShip", "1");
  if (query.sort && query.sort !== "recommended") set("sort", query.sort);
  if (query.page && query.page > 0) set("page", String(query.page + 1));
  if (view === "list") set("view", "list");
  const text = p.toString();
  if (!text) return "";
  return `?${text}`;
}

/** How many filters are switched on (for the "Filters (3)" button on phones). */
export function countActiveFilters(query: ProductQuery): number {
  let count = 0;
  const lists = [query.shape, query.color, query.clarity, query.cut, query.polish, query.symmetry, query.fluorescence, query.lab];
  for (const l of lists) {
    if (l && l.length) count += 1;
  }
  if (query.minCarat !== undefined || query.maxCarat !== undefined) count += 1;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) count += 1;
  if (query.withImage) count += 1;
  if (query.quickShip) count += 1;
  return count;
}

/** True when the shopper narrowed the list (used to stop Google indexing filtered pages). */
export function isFiltered(query: ProductQuery): boolean {
  return countActiveFilters(query) > 0 || Boolean(query.q);
}
