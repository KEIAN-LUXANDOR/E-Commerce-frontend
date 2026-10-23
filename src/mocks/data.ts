/**
 * SAMPLE DATA for building the frontend before the backend APIs are ready.
 * Nothing here is real stock, real prices or real certificates.
 * It is used only when NEXT_PUBLIC_USE_MOCK_API=true.
 */
import { ORIGINS, SHAPES, diamondTitle, gradeLine, originLabel, originSlug, shapeLabel, shapeSlug } from "@/lib/catalog-labels";
import type {
  Banner,
  CertificateLab,
  Category,
  Clarity,
  CutGrade,
  DiamondColor,
  DiamondDetail,
  DiamondSummary,
  Fluorescence,
  Media,
  Origin,
  Shape,
} from "@/lib/types/catalog";

// ---------- categories: origin → shape ----------

const ORIGIN_TEXT: Record<Origin, string> = {
  NATURAL: "Diamonds formed in the earth over billions of years, each graded by GIA.",
  LAB_GROWN: "Diamonds grown in a laboratory. Physically and chemically identical to natural diamonds, graded by IGI.",
};

export const categories: Category[] = ORIGINS.map((o, i) => ({
  id: `c${i + 1}`,
  slug: o.slug,
  name: o.plural,
  description: ORIGIN_TEXT[o.value],
  children: SHAPES.map((s, j) => ({
    id: `c${i + 1}${j}`,
    slug: s.slug,
    name: `${o.label} ${s.label.toLowerCase()} diamonds`,
    parentSlug: o.slug,
    description: `${o.label} ${s.label.toLowerCase()} diamonds with ${o.value === "NATURAL" ? "GIA" : "IGI"} certificates.`,
  })),
}));

// ---------- helpers (deterministic so pages render the same every time) ----------

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
const pick = <T,>(list: readonly T[], seed: string) => list[hash(seed) % list.length];

const COLOR_MULT: Record<DiamondColor, number> = { D: 1.45, E: 1.32, F: 1.2, G: 1, H: 0.88, I: 0.76, J: 0.66, K: 0.58 };
const CLARITY_MULT: Record<Clarity, number> = { FL: 1.6, IF: 1.45, VVS1: 1.3, VVS2: 1.2, VS1: 1.1, VS2: 1, SI1: 0.86, SI2: 0.75 };
const CUT_MULT: Record<CutGrade, number> = { EXCELLENT: 1.05, VERY_GOOD: 1, GOOD: 0.9 };

/** Length ÷ width, typical table %, typical depth % */
const SHAPE_PROPS: Record<Shape, { ratio: number; table: number; depth: number }> = {
  ROUND: { ratio: 1, table: 57, depth: 61.8 },
  OVAL: { ratio: 1.42, table: 58, depth: 62.5 },
  PRINCESS: { ratio: 1.01, table: 69, depth: 71 },
  CUSHION: { ratio: 1.05, table: 61, depth: 66 },
  EMERALD: { ratio: 1.42, table: 64, depth: 66 },
  PEAR: { ratio: 1.55, table: 59, depth: 62 },
  MARQUISE: { ratio: 2, table: 58, depth: 61 },
  HEART: { ratio: 0.95, table: 59, depth: 60 },
  RADIANT: { ratio: 1.25, table: 66, depth: 67 },
  ASSCHER: { ratio: 1, table: 63, depth: 67 },
};

function priceRupees(d: { origin: Origin; carat: number; shape: Shape; color: DiamondColor; clarity: Clarity; cut: CutGrade; fluorescence: Fluorescence }) {
  const shapeMult = d.shape === "ROUND" ? 1.15 : 0.9;
  if (d.origin === "NATURAL") {
    const fl = d.fluorescence === "STRONG" ? 0.9 : d.fluorescence === "MEDIUM" ? 0.95 : 1;
    return 350000 * d.carat ** 1.65 * COLOR_MULT[d.color] * CLARITY_MULT[d.clarity] * CUT_MULT[d.cut] * shapeMult * fl;
  }
  // Lab-grown prices rise less steeply with size and grade
  return 62000 * d.carat ** 1.25 * Math.sqrt(COLOR_MULT[d.color] * CLARITY_MULT[d.clarity]) * CUT_MULT[d.cut] * Math.sqrt(shapeMult);
}

const CARATS = [0.5, 0.52, 0.7, 0.72, 0.9, 1.0, 1.01, 1.02, 1.05, 1.2, 1.31, 1.5, 1.51, 1.72, 2.0, 2.01, 2.5, 3.02];
const NATURAL_COLORS: DiamondColor[] = ["D", "E", "F", "F", "G", "G", "H", "H", "I", "J"];
const LAB_COLORS: DiamondColor[] = ["D", "E", "E", "F", "F", "G", "G", "H"];
const CLARITY_POOL: Clarity[] = ["IF", "VVS1", "VVS2", "VVS2", "VS1", "VS1", "VS2", "VS2", "SI1", "SI2"];
const CUT_POOL: CutGrade[] = ["EXCELLENT", "EXCELLENT", "EXCELLENT", "VERY_GOOD", "VERY_GOOD", "GOOD"];
const FLUO_POOL: Fluorescence[] = ["NONE", "NONE", "NONE", "NONE", "FAINT", "FAINT", "MEDIUM", "STRONG"];
/** Round sells most, so there are more of them */
const SHAPE_POOL: Shape[] = ["ROUND", "ROUND", "ROUND", "OVAL", "OVAL", "EMERALD", "CUSHION", "PEAR", "PRINCESS", "RADIANT", "MARQUISE", "HEART", "ASSCHER"];

const STEP_CUTS: Shape[] = ["EMERALD", "ASSCHER"];

function describe(d: { shape: Shape; origin: Origin; color: DiamondColor; clarity: Clarity; cut: CutGrade; fluorescence: Fluorescence }) {
  const colour =
    "DEF".includes(d.color) ? "Colourless, with no tint to the eye." : "GH".includes(d.color) ? "Near-colourless; it looks white once set." : "Shows a faint warmth, which suits yellow or rose gold settings.";
  const clarity = d.clarity.startsWith("SI") ? "Inclusions are small and not visible face-up without magnification." : "Eye-clean: no inclusions visible without a loupe.";
  const step = STEP_CUTS.includes(d.shape) ? "A step cut with long, even facets that show clarity more than sparkle." : "A brilliant-style cut chosen for its light return.";
  const origin = d.origin === "NATURAL" ? "Mined and graded by GIA." : "Grown in a laboratory and graded by IGI.";
  return `${step} ${colour} ${clarity} ${origin}`;
}

function gallery(slug: string, title: string): Media[] {
  // No real photos yet: entries without a url are drawn as illustrations
  return [
    { id: `${slug}-top`, type: "IMAGE", alt: `${title}, face-up view` },
    { id: `${slug}-profile`, type: "IMAGE", alt: `${title}, side profile` },
    { id: `${slug}-spin`, type: "SPIN_360", alt: `${title}, 360° view` },
  ];
}

function buildDiamond(i: number): DiamondDetail {
  const seed = `stone-${i}`;
  const origin: Origin = i % 5 < 3 ? "NATURAL" : "LAB_GROWN";
  const shape = pick(SHAPE_POOL, `${seed}-shape`);
  const carat = origin === "LAB_GROWN" ? pick(CARATS.slice(5), `${seed}-ct`) : pick(CARATS.slice(0, 15), `${seed}-ct`);
  const color = pick(origin === "NATURAL" ? NATURAL_COLORS : LAB_COLORS, `${seed}-col`);
  const clarity = pick(CLARITY_POOL, `${seed}-cla`);
  const cut = shape === "ROUND" ? pick(CUT_POOL.slice(0, 4), `${seed}-cut`) : pick(CUT_POOL, `${seed}-cut`);
  const polish: CutGrade = hash(`${seed}-pol`) % 4 === 0 ? "VERY_GOOD" : "EXCELLENT";
  const symmetry: CutGrade = hash(`${seed}-sym`) % 3 === 0 ? "VERY_GOOD" : "EXCELLENT";
  const fluorescence: Fluorescence = origin === "LAB_GROWN" ? "NONE" : pick(FLUO_POOL, `${seed}-flu`);
  const lab: CertificateLab = origin === "NATURAL" ? "GIA" : "IGI";
  const sku = `AD${String(1001 + i)}`;
  const n = String(hash(`${seed}-cert`) % 100000000).padStart(8, "0");
  const certificateNumber = lab === "GIA" ? `22${n}` : `LG6${n.slice(0, 7)}`;

  const props = SHAPE_PROPS[shape];
  const lwRatio = +(props.ratio + ((hash(`${seed}-r`) % 7) - 3) * 0.01).toFixed(2);
  const avg = 6.45 * Math.cbrt(carat); // average diameter of an equivalent round, mm
  const widthMm = +(avg / Math.sqrt(lwRatio)).toFixed(2);
  const lengthMm = +(avg * Math.sqrt(lwRatio)).toFixed(2);
  const depthPct = +(props.depth + ((hash(`${seed}-d`) % 9) - 4) * 0.2).toFixed(1);
  const tablePct = +(props.table + ((hash(`${seed}-t`) % 5) - 2)).toFixed(0);

  const base = { shape, carat, color, clarity, cut, polish, symmetry, fluorescence, origin, lab };
  const pricePaise = Math.round(priceRupees(base) / 100) * 100 * 100;
  const title = diamondTitle(base);
  const slug = `${title.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-")}-${color.toLowerCase()}-${clarity.toLowerCase()}-${originSlug(origin)}-${sku.toLowerCase()}`;
  const parent = categories.find((c) => c.slug === originSlug(origin))!;

  return {
    id: `d${i + 1}`,
    slug,
    sku,
    ...base,
    certificateNumber,
    pricePaise,
    available: hash(`${seed}-sold`) % 11 !== 0,
    isNew: i % 7 === 0,
    media: gallery(slug, title).slice(0, 2),
    gallery: gallery(slug, title),
    measurements: { lengthMm, widthMm, depthMm: +((widthMm * depthPct) / 100).toFixed(2) },
    tablePct,
    depthPct,
    lwRatio,
    girdle: STEP_CUTS.includes(shape) ? "Medium to slightly thick" : "Thin to medium",
    culet: "None",
    laserInscription: true,
    description: describe(base),
    emiFromPaise: pricePaise >= 5000000 ? Math.round(pricePaise / 12 / 10000) * 10000 : undefined,
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: parent.name, href: `/shop/${parent.slug}` },
      { name: `${shapeLabel(shape)}`, href: `/shop/${parent.slug}/${shapeSlug(shape)}` },
    ],
    seo: {
      title: `${title}, ${gradeLine(base)} | ${originLabel(origin)} ${lab} certified diamond`,
      description: `${title} ${originLabel(origin).toLowerCase()} diamond, ${gradeLine(base)}. ${lab} report ${certificateNumber}. Insured delivery across India.`,
    },
  };
}

// ---------- exports ----------

export const diamonds: DiamondDetail[] = Array.from({ length: 64 }, (_, i) => buildDiamond(i));

export function toSummary(d: DiamondDetail): DiamondSummary {
  return {
    id: d.id,
    slug: d.slug,
    sku: d.sku,
    shape: d.shape,
    carat: d.carat,
    color: d.color,
    clarity: d.clarity,
    cut: d.cut,
    polish: d.polish,
    symmetry: d.symmetry,
    fluorescence: d.fluorescence,
    origin: d.origin,
    lab: d.lab,
    certificateNumber: d.certificateNumber,
    pricePaise: d.pricePaise,
    available: d.available,
    isNew: d.isNew,
    media: d.media,
  };
}

export const banners: Banner[] = [
  {
    id: "b1",
    title: "Every stone, graded and inscribed",
    text: "Each diamond comes with its GIA or IGI report, and the report number is laser-inscribed on the stone so you can check it yourself.",
    ctaLabel: "Browse natural diamonds",
    ctaHref: "/shop/natural",
    shape: "ROUND",
    startsAt: "2026-01-01T00:00:00+05:30",
    endsAt: "2027-12-31T23:59:59+05:30",
  },
  {
    id: "b2",
    title: "Lab-grown, the same fire",
    text: "Chemically and physically identical to mined diamonds, graded by IGI, and a fraction of the price.",
    ctaLabel: "Browse lab-grown diamonds",
    ctaHref: "/shop/lab-grown",
    shape: "OVAL",
    startsAt: "2026-01-01T00:00:00+05:30",
    endsAt: "2027-12-31T23:59:59+05:30",
  },
  {
    id: "b3",
    title: "Step cuts, long and calm",
    text: "Emerald and asscher diamonds trade sparkle for clean lines, so clarity matters more. Every one here is eye-clean.",
    ctaLabel: "See emerald cuts",
    ctaHref: "/shop?shape=emerald,asscher",
    shape: "EMERALD",
    startsAt: "2026-01-01T00:00:00+05:30",
    endsAt: "2027-12-31T23:59:59+05:30",
  },
  {
    id: "b-expired",
    title: "Diwali offer",
    text: "This banner has ended and must not appear.",
    ctaLabel: "Shop",
    ctaHref: "/shop",
    startsAt: "2025-10-01T00:00:00+05:30",
    endsAt: "2025-11-15T23:59:59+05:30",
  },
];
