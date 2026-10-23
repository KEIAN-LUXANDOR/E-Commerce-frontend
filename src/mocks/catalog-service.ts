/**
 * Pretend backend. Each function behaves like the matching Spring Boot endpoint
 * (see the API list in SETUP.md) so pages can be built and tested before the API exists.
 */
import { banners, categories, diamonds, toSummary } from "@/mocks/data";
import { ORIGINS, SHAPES, cutLabel, diamondTitle, originFromSlug, shapeFromSlug } from "@/lib/catalog-labels";
import type {
  Banner,
  Category,
  DiamondDetail,
  DiamondPage,
  DiamondSummary,
  PincodeResult,
  ProductFilters,
  SearchSuggestion,
} from "@/lib/types/catalog";

export const PAGE_SIZE = 12;

export function mockCategories(): Category[] {
  return categories;
}

export function mockActiveBanners(now: Date): Banner[] {
  return banners.filter((b) => new Date(b.startsAt) <= now && now <= new Date(b.endsAt));
}

export function mockDiamond(slug: string): DiamondDetail | undefined {
  return diamonds.find((d) => d.slug === slug);
}

// ---------- search with typo tolerance ----------

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

const ORIGIN_WORDS = {
  NATURAL: ["natural", "mined", "earth"],
  LAB_GROWN: ["lab", "grown", "lab-grown", "labgrown", "lgd", "cvd", "hpht", "man-made", "synthetic"],
};

function wordsOf(d: DiamondDetail): string[] {
  return [
    ...SHAPES.find((s) => s.value === d.shape)!.label.toLowerCase().split(" "),
    ...ORIGIN_WORDS[d.origin],
    d.lab.toLowerCase(),
    d.color.toLowerCase(),
    d.clarity.toLowerCase(),
    ...cutLabel(d.cut).toLowerCase().split(" "),
    d.sku.toLowerCase(),
    d.certificateNumber.toLowerCase(),
    "diamond",
    "diamonds",
    "loose",
    "stone",
    "certified",
    "ct",
    "carat",
    "colour",
    "color",
    "clarity",
    "cut",
  ];
}

const VOCABULARY = [...new Set(diamonds.flatMap(wordsOf))];

/** Matches a typed word to a known word, allowing 1 typo (2 for long words). */
function closestWord(word: string): string | undefined {
  if (VOCABULARY.includes(word)) return word;
  if (word.length < 3) return VOCABULARY.find((w) => w.startsWith(word));
  const allowed = word.length >= 8 ? 2 : 1;
  let best: { w: string; d: number } | undefined;
  for (const w of VOCABULARY) {
    if (w.startsWith(word)) return w;
    const dist = editDistance(word, w);
    if (dist <= allowed && (!best || dist < best.d)) best = { w, d: dist };
  }
  return best?.w;
}

/**
 * Words must all match. Numbers are read as carat weight, so "1.5 oval" finds ovals of about 1.5 ct.
 */
function searchMatch(q: string): { ids: Set<string>; corrected?: string } {
  const typed = q
    .toLowerCase()
    .replace(/(\d)\s*(ct|carat|carats)\b/g, "$1 ct")
    .split(/[^a-z0-9.-]+/)
    .filter(Boolean);
  const numbers = typed.filter((w) => /^\d+(\.\d+)?$/.test(w)).map(Number);
  const words = typed.filter((w) => !/^\d+(\.\d+)?$/.test(w));
  // Words we don't recognise (e.g. "ring", "solitaire") are dropped, as long as something else matched
  const known = words.map((w) => closestWord(w)).filter((w): w is string => !!w);
  if (!known.length && !numbers.length) return { ids: new Set() };
  const ids = new Set(
    diamonds
      .filter((d) => known.every((w) => wordsOf(d).includes(w)))
      .filter((d) => numbers.every((n) => d.carat >= n - 0.05 && d.carat <= n + 0.25))
      .map((d) => d.id),
  );
  const correctedWords = typed.map((w) => (/^\d/.test(w) ? w : closestWord(w))).filter(Boolean);
  const corrected = correctedWords.join(" ") !== typed.join(" ") ? correctedWords.join(" ") : undefined;
  return { ids, corrected };
}

// ---------- diamond list ----------

function matchesFilters(d: DiamondDetail, f: ProductFilters): boolean {
  const pathOrigin = originFromSlug(f.category);
  const pathShape = shapeFromSlug(f.sub);
  if (pathOrigin && d.origin !== pathOrigin) return false;
  if (pathShape && d.shape !== pathShape) return false;
  if (f.shape?.length && !f.shape.includes(d.shape)) return false;
  if (f.origin?.length && !f.origin.includes(d.origin)) return false;
  if (f.lab?.length && !f.lab.includes(d.lab)) return false;
  if (f.color?.length && !f.color.includes(d.color)) return false;
  if (f.clarity?.length && !f.clarity.includes(d.clarity)) return false;
  if (f.cut?.length && !f.cut.includes(d.cut)) return false;
  if (f.fluorescence?.length && !f.fluorescence.includes(d.fluorescence)) return false;
  if (f.caratMin !== undefined && d.carat < f.caratMin) return false;
  if (f.caratMax !== undefined && d.carat > f.caratMax) return false;
  const rupees = d.pricePaise / 100;
  if (f.priceMin !== undefined && rupees < f.priceMin) return false;
  if (f.priceMax !== undefined && rupees > f.priceMax) return false;
  return true;
}

export function mockListDiamonds(f: ProductFilters): DiamondPage {
  // Sold stones are hidden from the list, but their pages stay reachable
  let list = diamonds.filter((d) => d.available && matchesFilters(d, f));
  let didYouMean: string | undefined;

  if (f.q) {
    const { ids, corrected } = searchMatch(f.q);
    list = list.filter((d) => ids.has(d.id));
    didYouMean = corrected;
  }

  const sorted = [...list];
  const byId = (a: DiamondDetail, b: DiamondDetail) => Number(a.id.slice(1)) - Number(b.id.slice(1));
  switch (f.sort) {
    case "price_asc":
      sorted.sort((a, b) => a.pricePaise - b.pricePaise);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.pricePaise - a.pricePaise);
      break;
    case "carat_desc":
      sorted.sort((a, b) => b.carat - a.carat || a.pricePaise - b.pricePaise);
      break;
    case "carat_asc":
      sorted.sort((a, b) => a.carat - b.carat || a.pricePaise - b.pricePaise);
      break;
    case "newest":
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || byId(b, a));
      break;
    default:
      // featured: best cut first, then catalogue order
      sorted.sort((a, b) => Number(b.cut === "EXCELLENT") - Number(a.cut === "EXCELLENT") || byId(a, b));
  }

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(f.page ?? 1, totalPages);
  const items = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toSummary);
  return { items, total, page, pageSize: PAGE_SIZE, totalPages, didYouMean };
}

/** Same shape, preferably same origin, close in carat. */
export function mockSimilar(slug: string): DiamondSummary[] {
  const d = mockDiamond(slug);
  if (!d) return [];
  return diamonds
    .filter((o) => o.slug !== slug && o.available && o.shape === d.shape)
    .map((o) => ({ o, score: Math.abs(o.carat - d.carat) + (o.origin === d.origin ? 0 : 0.6) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((x) => toSummary(x.o));
}

export function mockFeatured(kind: "new" | "best"): DiamondSummary[] {
  const available = diamonds.filter((d) => d.available);
  const list =
    kind === "new"
      ? available.filter((d) => d.isNew)
      : available
          .filter((d) => d.cut === "EXCELLENT" && ["IF", "VVS1", "VVS2", "VS1"].includes(d.clarity) && "DEFG".includes(d.color))
          .sort((a, b) => b.carat - a.carat);
  return list.slice(0, 4).map(toSummary);
}

export function mockSuggest(q: string): SearchSuggestion[] {
  const term = q.trim().toLowerCase();
  if (term.length < 2) return [];
  const cats: SearchSuggestion[] = [
    ...ORIGINS.filter((o) => o.plural.toLowerCase().includes(term) || ORIGIN_WORDS[o.value].some((w) => w.startsWith(term))).map(
      (o) => ({ type: "CATEGORY" as const, label: o.plural, href: `/shop/${o.slug}` }),
    ),
    ...SHAPES.filter((s) => s.label.toLowerCase().startsWith(term)).map((s) => ({
      type: "CATEGORY" as const,
      label: `${s.label} diamonds`,
      href: `/shop?shape=${s.slug}`,
    })),
  ].slice(0, 3);
  const { ids } = searchMatch(term);
  const stones: SearchSuggestion[] = diamonds
    .filter((d) => d.available && ids.has(d.id))
    .slice(0, 8 - cats.length)
    .map((d) => ({
      type: "DIAMOND",
      label: `${diamondTitle(d)}, ${d.color} ${d.clarity}, ${d.origin === "NATURAL" ? "natural" : "lab-grown"}`,
      href: `/product/${d.slug}`,
      pricePaise: d.pricePaise,
      shape: d.shape,
    }));
  return [...cats, ...stones];
}

/**
 * Sample PIN rules: Maharashtra (starts with 40–44) 2–3 days, most of India 4–6 days,
 * the North-East (78–79) not serviceable for insured diamond shipments.
 */
export function mockPincode(pin: string): PincodeResult {
  if (!/^[1-9]\d{5}$/.test(pin)) return { pincode: pin, serviceable: false };
  const prefix = Number(pin.slice(0, 2));
  if (prefix >= 78 && prefix <= 79) return { pincode: pin, serviceable: false, state: "Assam / North-East" };
  if (prefix >= 40 && prefix <= 44) {
    return { pincode: pin, serviceable: true, city: prefix === 41 ? "Pune" : prefix === 40 ? "Mumbai" : undefined, state: "Maharashtra", minDays: 2, maxDays: 3 };
  }
  return { pincode: pin, serviceable: true, minDays: 4, maxDays: 6 };
}
