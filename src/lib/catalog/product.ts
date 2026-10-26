import { clarityMeaning, colorGroup, cutLabel, originLabel, shapeLabel } from "@/lib/catalog/labels";
import type { Product, ProductVariant, Shape } from "@/lib/types/product";

/** Helpers for showing a product. Each diamond has one variant: its price and stock. */

export function productHref(slug: string): string {
  return `/diamond/${encodeURIComponent(slug)}`;
}

/** The variant to sell: the first one in stock, else the first one. */
export function mainVariant(product: Product): ProductVariant | undefined {
  return product.variants.find((v) => v.inStock) ?? product.variants[0];
}

export function isAvailable(product: Product): boolean {
  return product.variants.some((v) => v.inStock);
}

/** The crossed-out price, only when it's really higher than the price. */
export function compareAtPaise(variant: ProductVariant | undefined): number | null {
  if (!variant || variant.mrpPaise === null) return null;
  if (variant.mrpPaise <= variant.pricePaise) return null;
  return variant.mrpPaise;
}

/** Shape for the drawing: from the grades, else guessed from the name, else round. */
export function productShape(product: Pick<Product, "name" | "diamond">): Shape {
  if (product.diamond) return product.diamond.shape;
  const lower = product.name.toLowerCase();
  const shapes: Shape[] = ["ROUND", "OVAL", "CUSHION", "EMERALD", "PEAR", "PRINCESS", "RADIANT", "ASSCHER", "MARQUISE", "HEART"];
  const found = shapes.find((s) => lower.includes(s.toLowerCase()));
  return found ?? "ROUND";
}

/** "1.02 ct Oval" — short title used on cards; falls back to the product name. */
export function shortTitle(product: Product): string {
  const d = product.diamond;
  if (!d) return product.name;
  return `${d.carat.toFixed(2)} ct ${shapeLabel(d.shape)}`;
}

/** "F colour · VS1 clarity · Excellent cut" */
export function gradeLine(product: Product): string {
  const d = product.diamond;
  if (!d) return "";
  const parts = [`${d.color} colour`, `${d.clarity} clarity`];
  if (d.cut) parts.push(`${cutLabel(d.cut)} cut`);
  return parts.join(" · ");
}

/** "Lab-grown · IGI certified" */
export function originLine(product: Product): string {
  const d = product.diamond;
  if (!d) return "";
  return `${originLabel(d.origin)} · ${d.lab} certified`;
}

/** One-sentence plain-language summary of the stone, for the product page. */
export function plainSummary(product: Product): string {
  const d = product.diamond;
  if (!d) return product.description ?? "";
  const color = colorGroup(d.color).toLowerCase();
  const clarity = clarityMeaning(d.clarity).toLowerCase();
  const kind = originLabel(d.origin).toLowerCase();
  return `A ${d.carat.toFixed(2)} carat ${shapeLabel(d.shape).toLowerCase()} ${kind} diamond: ${color} (${d.color}), ${clarity} (${d.clarity}), graded by ${d.lab}.`;
}

/** Price per carat, for the product page. */
export function pricePerCaratPaise(product: Product): number | null {
  const v = mainVariant(product);
  const carat = product.diamond?.carat;
  if (!v || !carat || carat <= 0) return null;
  return Math.round(v.pricePaise / carat);
}

/** "7.84 × 5.62 × 3.48 mm" when the backend sends measurements, else "". */
export function measurementsLine(product: Product): string {
  const d = product.diamond;
  if (!d || !d.lengthMm || !d.widthMm || !d.depthMm) return "";
  return `${d.lengthMm.toFixed(2)} × ${d.widthMm.toFixed(2)} × ${d.depthMm.toFixed(2)} mm`;
}
