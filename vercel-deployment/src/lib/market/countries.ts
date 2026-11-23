/**
 * Customer-facing market choices for the first international storefront release.
 * Selecting a country saves a shopping preference; it does NOT confirm that
 * shipping, tax collection, or checkout is available for that destination.
 */

export interface MarketCountry {
  code: string;
  name: string;
}

export interface MarketGroup {
  label: string;
  countries: readonly MarketCountry[];
}

export const DEFAULT_MARKET_COUNTRY_CODE = "US";
export const MARKET_CURRENCY = "USD" as const;
export const MARKET_CURRENCY_LOCALE = "en-US";
export const MARKET_COOKIE_NAME = "kl_market_country";
export const MARKET_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const MARKET_GROUPS: readonly MarketGroup[] = [
  {
    label: "North America",
    countries: [
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
    ],
  },
  {
    label: "United Kingdom",
    countries: [{ code: "GB", name: "United Kingdom" }],
  },
  {
    label: "Middle East",
    countries: [{ code: "AE", name: "United Arab Emirates" }],
  },
  {
    // Europe scope for this first release: EU-27, EEA and Switzerland.
    label: "Europe · EU / EEA / Switzerland",
    countries: [
      { code: "AT", name: "Austria" },
      { code: "BE", name: "Belgium" },
      { code: "BG", name: "Bulgaria" },
      { code: "HR", name: "Croatia" },
      { code: "CY", name: "Cyprus" },
      { code: "CZ", name: "Czechia" },
      { code: "DK", name: "Denmark" },
      { code: "EE", name: "Estonia" },
      { code: "FI", name: "Finland" },
      { code: "FR", name: "France" },
      { code: "DE", name: "Germany" },
      { code: "GR", name: "Greece" },
      { code: "HU", name: "Hungary" },
      { code: "IE", name: "Ireland" },
      { code: "IT", name: "Italy" },
      { code: "LV", name: "Latvia" },
      { code: "LT", name: "Lithuania" },
      { code: "LU", name: "Luxembourg" },
      { code: "MT", name: "Malta" },
      { code: "NL", name: "Netherlands" },
      { code: "PL", name: "Poland" },
      { code: "PT", name: "Portugal" },
      { code: "RO", name: "Romania" },
      { code: "SK", name: "Slovakia" },
      { code: "SI", name: "Slovenia" },
      { code: "ES", name: "Spain" },
      { code: "SE", name: "Sweden" },
      { code: "IS", name: "Iceland" },
      { code: "LI", name: "Liechtenstein" },
      { code: "NO", name: "Norway" },
      { code: "CH", name: "Switzerland" },
    ],
  },
  {
    label: "Australia",
    countries: [{ code: "AU", name: "Australia" }],
  },
  {
    // Keep the existing domestic customer market available during the rollout.
    label: "India",
    countries: [{ code: "IN", name: "India" }],
  },
] as const;

export const MARKET_COUNTRIES: readonly MarketCountry[] = MARKET_GROUPS.flatMap(
  (group) => group.countries
);

const MARKET_COUNTRY_BY_CODE = new Map(
  MARKET_COUNTRIES.map((country) => [country.code, country])
);

export type MarketCountryCode = (typeof MARKET_COUNTRIES)[number]["code"];

export function isMarketCountryCode(value: string): value is MarketCountryCode {
  return MARKET_COUNTRY_BY_CODE.has(value.toUpperCase());
}

export function getMarketCountry(code: string): MarketCountry {
  return (
    MARKET_COUNTRY_BY_CODE.get(code.toUpperCase()) ??
    MARKET_COUNTRY_BY_CODE.get(DEFAULT_MARKET_COUNTRY_CODE)!
  );
}

/**
 * A useful display locale for non-currency numbers and dates.
 * All product and checkout prices remain USD / en-US regardless of this value.
 */
export function getMarketLocale(code: string): string {
  switch (code.toUpperCase()) {
    case "GB":
      return "en-GB";
    case "AE":
      return "en-AE";
    case "CA":
      return "en-CA";
    case "AU":
      return "en-AU";
    case "IN":
      return "en-IN";
    case "US":
      return "en-US";
    default:
      return "en-GB";
  }
}
