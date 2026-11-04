import { getMarketLocale } from "@/lib/market/countries";

/** Format a count or quantity using the selected market's English conventions. */
export function formatMarketNumber(
  value: number,
  countryCode: string,
  options?: Intl.NumberFormatOptions
): string {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat(getMarketLocale(countryCode), options).format(value);
}

/**
 * Format a date for customer-facing UI using the selected market's locale.
 * The browser's local time zone is used. Prefer calling this in client UI;
 * keep operational/admin timestamps explicitly tied to the business time zone.
 */
export function formatMarketDate(
  value: string | Date | null | undefined,
  countryCode: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(getMarketLocale(countryCode), options).format(date);
}
