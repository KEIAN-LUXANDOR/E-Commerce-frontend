import type { Clarity, Cut, DiamondColor, Finish, Fluorescence, Lab, Origin, Shape, SortOption } from "@/lib/types/product";

/**
 * Display labels and plain-language explanations for every grade.
 * Order of each list = the order shoppers expect (best first for grades).
 */

export const SHAPES: { value: Shape; label: string }[] = [
  { value: "ROUND", label: "Round" },
  { value: "OVAL", label: "Oval" },
  { value: "CUSHION", label: "Cushion" },
  { value: "EMERALD", label: "Emerald" },
  { value: "PEAR", label: "Pear" },
  { value: "PRINCESS", label: "Princess" },
  { value: "RADIANT", label: "Radiant" },
  { value: "ASSCHER", label: "Asscher" },
  { value: "MARQUISE", label: "Marquise" },
  { value: "HEART", label: "Heart" },
];

export const ORIGINS: { value: Origin; label: string; plural: string; slug: "natural" | "lab-grown" }[] = [
  { value: "NATURAL", label: "Natural", plural: "Natural diamonds", slug: "natural" },
  { value: "LAB_GROWN", label: "Lab-grown", plural: "Lab-grown diamonds", slug: "lab-grown" },
];

export const COLORS: { value: DiamondColor; label: string; group: string }[] = [
  { value: "D", label: "D", group: "Colourless" },
  { value: "E", label: "E", group: "Colourless" },
  { value: "F", label: "F", group: "Colourless" },
  { value: "G", label: "G", group: "Near colourless" },
  { value: "H", label: "H", group: "Near colourless" },
  { value: "I", label: "I", group: "Near colourless" },
  { value: "J", label: "J", group: "Near colourless" },
  { value: "K", label: "K", group: "Faint colour" },
  { value: "L", label: "L", group: "Faint colour" },
  { value: "M", label: "M", group: "Faint colour" },
];

export const CLARITIES: { value: Clarity; label: string; meaning: string }[] = [
  { value: "FL", label: "FL", meaning: "Flawless" },
  { value: "IF", label: "IF", meaning: "Internally flawless" },
  { value: "VVS1", label: "VVS1", meaning: "Very, very slightly included" },
  { value: "VVS2", label: "VVS2", meaning: "Very, very slightly included" },
  { value: "VS1", label: "VS1", meaning: "Very slightly included" },
  { value: "VS2", label: "VS2", meaning: "Very slightly included" },
  { value: "SI1", label: "SI1", meaning: "Slightly included" },
  { value: "SI2", label: "SI2", meaning: "Slightly included" },
  { value: "I1", label: "I1", meaning: "Included" },
  { value: "I2", label: "I2", meaning: "Included" },
  { value: "I3", label: "I3", meaning: "Included" },
];

export const CUTS: { value: Cut; label: string }[] = [
  { value: "IDEAL", label: "Ideal" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
];

export const FINISHES: { value: Finish; label: string }[] = [
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
];

export const FLUORESCENCES: { value: Fluorescence; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "FAINT", label: "Faint" },
  { value: "MEDIUM", label: "Medium" },
  { value: "STRONG", label: "Strong" },
  { value: "VERY_STRONG", label: "Very strong" },
];

export const LABS: { value: Lab; label: string; full: string }[] = [
  { value: "GIA", label: "GIA", full: "Gemological Institute of America" },
  { value: "IGI", label: "IGI", full: "International Gemological Institute" },
  { value: "HRD", label: "HRD", full: "HRD Antwerp" },
];

export const SORTS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "carat_desc", label: "Carat: large to small" },
  { value: "carat_asc", label: "Carat: small to large" },
];

/** Ready-made price bands in rupees for the filter panel. */
export const PRICE_BANDS: { label: string; min?: number; max?: number }[] = [
  { label: "Under ₹1 lakh", max: 100000 },
  { label: "₹1–3 lakh", min: 100000, max: 300000 },
  { label: "₹3–6 lakh", min: 300000, max: 600000 },
  { label: "₹6–15 lakh", min: 600000, max: 1500000 },
  { label: "Above ₹15 lakh", min: 1500000 },
];

/** Ready-made carat bands for the filter panel. */
export const CARAT_BANDS: { label: string; min: number; max?: number }[] = [
  { label: "0.30–0.69", min: 0.3, max: 0.69 },
  { label: "0.70–0.99", min: 0.7, max: 0.99 },
  { label: "1.00–1.49", min: 1, max: 1.49 },
  { label: "1.50–1.99", min: 1.5, max: 1.99 },
  { label: "2.00+", min: 2 },
];

function labelFrom<T extends string>(list: { value: T; label: string }[], value: T): string {
  const match = list.find((item) => item.value === value);
  if (match) return match.label;
  return value;
}

export const shapeLabel = (v: Shape) => labelFrom(SHAPES, v);
export const cutLabel = (v: Cut | null) => {
  if (v === null) return "Not graded";
  return labelFrom(CUTS, v);
};
export const finishLabel = (v: Finish) => labelFrom(FINISHES, v);
export const fluorescenceLabel = (v: Fluorescence) => labelFrom(FLUORESCENCES, v);

export function originLabel(v: Origin): string {
  const match = ORIGINS.find((o) => o.value === v);
  if (match) return match.label;
  return v;
}

export function colorGroup(v: DiamondColor): string {
  const match = COLORS.find((c) => c.value === v);
  if (match) return match.group;
  return "";
}

export function clarityMeaning(v: Clarity): string {
  const match = CLARITIES.find((c) => c.value === v);
  if (match) return match.meaning;
  return "";
}

/** Origin slug in the address bar ("natural", "lab-grown") → API value. */
export function originFromSlug(slug: string | undefined): Origin | undefined {
  const match = ORIGINS.find((o) => o.slug === slug);
  if (match) return match.value;
  return undefined;
}
