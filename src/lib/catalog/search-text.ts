import {
  CLARITY_VALUES,
  COLOR_VALUES,
  SHAPE_VALUES,
  type ProductQuery,
} from "@/lib/types/product";

/**
 * Parses natural language search queries to extract diamond attributes.
 * Example: "1.5 ct oval lab F VS1 under 3 lakh"
 */
export function parseDiamondSearchText(query: string): Partial<ProductQuery> {
  if (!query) return {};

  const q = query.toLowerCase();
  const filters: Partial<ProductQuery> = {};

  // 1. Carat (e.g., "1.5 ct", "0.90 carat")
  const caratMatch = q.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*(?:ct|carats?)/);
  if (caratMatch && caratMatch[1]) {
    const val = parseFloat(caratMatch[1]);
    if (!isNaN(val)) {
      // Create a ±0.05ct range around the requested carat
      filters.minCarat = Math.max(0.1, val - 0.05);
      filters.maxCarat = val + 0.05;
    }
  }

  // 2. Origin (Natural vs Lab-Grown)
  if (q.includes("lab") || q.includes("lgd") || q.includes("grown")) {
    filters.origin = "LAB_GROWN";
  } else if (q.includes("natural") || q.includes("earth") || q.includes("mined")) {
    filters.origin = "NATURAL";
  }

  // 3. Shape
  const matchedShapes = SHAPE_VALUES.filter((shape) => q.includes(shape.toLowerCase()));
  if (matchedShapes.length > 0) {
    filters.shape = matchedShapes;
  }

  // 4. Color (Matches whole words D through K)
  const colorMatch = q.match(/\b([d-k])\b/);
  const matchedColor = COLOR_VALUES.find((color) => color.toLowerCase() === colorMatch?.[1]);
  if (matchedColor) {
    filters.color = [matchedColor];
  }

  // 5. Clarity
  const matchedClarity = CLARITY_VALUES.find((clarity) => {
    // Ensure we match whole words (e.g., "VS1" but not inside another word)
    const regex = new RegExp(`\\b${clarity.toLowerCase()}\\b`);
    return regex.test(q);
  });
  if (matchedClarity) {
    filters.clarity = [matchedClarity];
  }

  // 6. Price (e.g., "under 3 lakh")
  const lakhMatch = q.match(/(?:under|<|below)\s*(\d+(?:\.\d+)?)\s*lakh/);
  if (lakhMatch && lakhMatch[1]) {
    const lakhs = parseFloat(lakhMatch[1]);
    if (!isNaN(lakhs)) {
      // Convert lakhs to rupees, then to paise for the API
      filters.maxPrice = lakhs * 100000 * 100;
    }
  } else {
    // Standard numerical price (e.g., "under 50000")
    const priceMatch = q.match(/(?:under|<|below)\s*₹?\s*(\d+(?:,\d+)*)/);
    if (priceMatch && priceMatch[1]) {
      const rupees = parseFloat(priceMatch[1].replace(/,/g, ""));
      if (!isNaN(rupees)) {
        filters.maxPrice = rupees * 100;
      }
    }
  }

  // 7. Certification Lab
  if (q.includes("igi")) filters.lab = ["IGI"];
  if (q.includes("gia")) filters.lab = ["GIA"];

  // Always pass the raw query string back so the API can perform text matching 
  // on product names or SKU/Report numbers.
  filters.q = query;

  return filters;
}