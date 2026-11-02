import { MARKET_CURRENCY } from "@/lib/market/countries";
import { formatMinorCurrency } from "@/lib/market/currency";

/**
 * The storefront displays prices in USD. Current backend product/order fields
 * are supplied in cents despite legacy names ending in `Paise`.
 */
export const CURRENCY = MARKET_CURRENCY;

export function formatPrice(cents: number): string {
  return formatMinorCurrency(cents, CURRENCY, "en-US");
}

/** 1 → "1.00 ct", 0.5 → "0.50 ct" */
export function formatCarat(carat: number): string {
  return `${carat.toFixed(2)} ct`;
}

/** Operational date shown in India business time, e.g. "Fri, 24 Oct". */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatGrams(g: number): string {
  return `${g.toFixed(2)} g`;
}

/** Operational date in India business time. Empty string for missing/invalid input. */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
