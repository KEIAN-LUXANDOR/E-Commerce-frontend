/**
 * Prices are US dollars. The backend sends amounts in the smallest unit (cents) in fields
 * still named *Paise (e.g. pricePaise): 123400 → "$1,234", 123450 → "$1,234.50".
 */
export const CURRENCY = "USD";
const wholeDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 });
const withCents = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(cents: number): string {
  if (!Number.isFinite(cents)) return "";
  return cents % 100 === 0 ? wholeDollars.format(cents / 100) : withCents.format(cents / 100);
}

/** 1 → "1.00 ct", 0.5 → "0.50 ct" */
export function formatCarat(carat: number): string {
  return `${carat.toFixed(2)} ct`;
}

/** Date shown in India time, e.g. "Fri, 24 Oct". */
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

/** "29 Oct 2026" from an ISO string or Date (Indian English). Empty string for missing/invalid input. */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
