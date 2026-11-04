import {
  MARKET_CURRENCY,
  MARKET_CURRENCY_LOCALE,
} from "@/lib/market/countries";

export { MARKET_CURRENCY };

/**
 * Format a backend amount in its currency's minor unit.
 * Examples: 123456 USD cents -> $1,234.56; 123400 USD cents -> $1,234.
 * Currency-specific fraction digits are derived from Intl rather than assuming
 * every currency uses 100 minor units.
 */
export function formatMinorCurrency(
  amountMinor: number,
  currency: string = MARKET_CURRENCY,
  locale: string = MARKET_CURRENCY_LOCALE
): string {
  if (!Number.isFinite(amountMinor)) return "";

  try {
    const currencyOptions = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).resolvedOptions();
    const fractionDigits = currencyOptions.maximumFractionDigits ?? 2;
    const divisor = 10 ** fractionDigits;
    const amountMajor = amountMinor / divisor;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    }).format(amountMajor);
  } catch {
    return `${currency.toUpperCase()} ${amountMinor}`;
  }
}

/** Format a value already expressed in major currency units. */
export function formatMajorCurrency(
  amountMajor: number,
  currency: string = MARKET_CURRENCY,
  locale: string = MARKET_CURRENCY_LOCALE
): string {
  if (!Number.isFinite(amountMajor)) return "";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amountMajor);
  } catch {
    return `${currency.toUpperCase()} ${amountMajor}`;
  }
}
