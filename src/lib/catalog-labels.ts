import type {
  CertificateLab,
  Clarity,
  CutGrade,
  DiamondColor,
  DiamondSummary,
  Fluorescence,
  Origin,
  Shape,
  SortOption,
} from "@/lib/types/catalog";

/**
 * Allowed values and their display labels, in the order shoppers expect.
 * These must match the database rules on the backend (Phase 2B).
 */

export const SHAPES: { value: Shape; label: string; slug: string }[] = [
  { value: "ROUND", label: "Round", slug: "round" },
  { value: "OVAL", label: "Oval", slug: "oval" },
  { value: "PRINCESS", label: "Princess", slug: "princess" },
  { value: "CUSHION", label: "Cushion", slug: "cushion" },
  { value: "EMERALD", label: "Emerald", slug: "emerald" },
  { value: "PEAR", label: "Pear", slug: "pear" },
  { value: "MARQUISE", label: "Marquise", slug: "marquise" },
  { value: "HEART", label: "Heart", slug: "heart" },
  { value: "RADIANT", label: "Radiant", slug: "radiant" },
  { value: "ASSCHER", label: "Asscher", slug: "asscher" },
];

export const COLORS: { value: DiamondColor; label: string }[] = (
  ["D", "E", "F", "G", "H", "I", "J", "K"] as DiamondColor[]
).map((c) => ({ value: c, label: c }));

export const CLARITIES: { value: Clarity; label: string }[] = (
  ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as Clarity[]
).map((c) => ({ value: c, label: c }));

export const CUTS: { value: CutGrade; label: string }[] = [
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very good" },
  { value: "GOOD", label: "Good" },
];

export const ORIGINS: { value: Origin; label: string; slug: string; plural: string }[] = [
  { value: "NATURAL", label: "Natural", slug: "natural", plural: "Natural diamonds" },
  { value: "LAB_GROWN", label: "Lab-grown", slug: "lab-grown", plural: "Lab-grown diamonds" },
];

export const LABS: { value: CertificateLab; label: string }[] = [
  { value: "GIA", label: "GIA" },
  { value: "IGI", label: "IGI" },
];

export const FLUORESCENCES: { value: Fluorescence; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "FAINT", label: "Faint" },
  { value: "MEDIUM", label: "Medium" },
  { value: "STRONG", label: "Strong" },
];

export const SORTS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "carat_desc", label: "Carat: high to low" },
  { value: "carat_asc", label: "Carat: low to high" },
];

export const CERTIFICATE_VERIFY_URL: Record<CertificateLab, (n: string) => string> = {
  GIA: (n) => `https://www.gia.edu/report-check?reportno=${encodeURIComponent(n)}`,
  IGI: (n) => `https://www.igi.org/verify-your-report/?r=${encodeURIComponent(n)}`,
};

export function labelOf<T extends string>(list: { value: T; label: string }[], value: T) {
  return list.find((x) => x.value === value)?.label ?? value;
}

export const shapeLabel = (s: Shape) => labelOf(SHAPES, s);
export const originLabel = (o: Origin) => labelOf(ORIGINS, o);
export const cutLabel = (c: CutGrade) => labelOf(CUTS, c);
export const fluorescenceLabel = (f: Fluorescence) => labelOf(FLUORESCENCES, f);
export const shapeSlug = (s: Shape) => SHAPES.find((x) => x.value === s)!.slug;
export const originSlug = (o: Origin) => ORIGINS.find((x) => x.value === o)!.slug;
export const shapeFromSlug = (slug?: string) => SHAPES.find((x) => x.slug === slug)?.value;
export const originFromSlug = (slug?: string) => ORIGINS.find((x) => x.slug === slug)?.value;

/** "1.02 ct Round" */
export function diamondTitle(d: Pick<DiamondSummary, "carat" | "shape">) {
  return `${d.carat.toFixed(2)} ct ${shapeLabel(d.shape)}`;
}

/** "F colour, VS1, Excellent cut" */
export function gradeLine(d: Pick<DiamondSummary, "color" | "clarity" | "cut">) {
  return `${d.color} colour, ${d.clarity}, ${cutLabel(d.cut)} cut`;
}
