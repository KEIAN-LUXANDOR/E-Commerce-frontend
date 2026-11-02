import { getMarketCountry } from "@/lib/market/countries";

const CALLING_CODES: Record<string, string> = {
  US: "1", CA: "1", GB: "44", AE: "971", AU: "61", IN: "91",
  AT: "43", BE: "32", BG: "359", HR: "385", CY: "357", CZ: "420",
  DK: "45", EE: "372", FI: "358", FR: "33", DE: "49", GR: "30",
  HU: "36", IE: "353", IT: "39", LV: "371", LT: "370", LU: "352",
  MT: "356", NL: "31", PL: "48", PT: "351", RO: "40", SK: "421",
  SI: "386", ES: "34", SE: "46", IS: "354", LI: "423", NO: "47", CH: "41",
};

export function getCallingCode(countryCode: string): string {
  return CALLING_CODES[countryCode.toUpperCase()] ?? "1";
}

export function normalisePhoneForCountry(value: string, countryCode: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (trimmed.startsWith("+")) return `+${digits}`;
  const dialCode = getCallingCode(countryCode);
  const local = digits.replace(/^0+/, "");
  return `+${dialCode}${local}`;
}

/** Generic E.164 shape validation. The server remains the final authority. */
export function validatePhoneForCountry(value: string, countryCode: string): string | null {
  if (!value.trim()) return "Enter a telephone number.";
  const normalised = normalisePhoneForCountry(value, countryCode);
  const digits = normalised.replace(/\D/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(normalised) || digits.length < 8 || digits.length > 15) {
    return "Enter a valid international phone number, including its country calling code.";
  }
  return null;
}

export function getPostalCodeLabel(countryCode: string): string {
  switch (countryCode.toUpperCase()) {
    case "US": return "ZIP code";
    case "IN": return "PIN code";
    case "GB": return "Postcode";
    case "AE": return "Postal code / PO Box";
    default: return "Postal code";
  }
}

export function getPostalCodePlaceholder(countryCode: string): string {
  switch (countryCode.toUpperCase()) {
    case "US": return "10001 or 10001-1234";
    case "CA": return "M5V 3A8";
    case "GB": return "SW1A 1AA";
    case "AU": return "2000";
    case "AE": return "PO Box or postal code";
    case "IN": return "411001";
    default: return "Enter postal code";
  }
}

export function validatePostalCode(value: string, countryCode: string): string | null {
  const postal = value.trim().toUpperCase().replace(/\s+/g, " ");
  if (!postal) return `Enter a ${getPostalCodeLabel(countryCode).toLowerCase()}.`;

  let valid = false;
  switch (countryCode.toUpperCase()) {
    case "US":
      valid = /^\d{5}(?:-\d{4})?$/.test(postal);
      break;
    case "CA":
      valid = /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/.test(postal);
      break;
    case "GB":
      valid = /^(GIR 0AA|[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/.test(postal);
      break;
    case "AU":
      valid = /^\d{4}$/.test(postal);
      break;
    case "AE":
      // UAE addresses commonly use a PO Box; accept common PO Box and postal forms.
      valid = /^(?:P\.?\s*O\.?\s*BOX\s*)?[A-Z0-9][A-Z0-9 /-]{1,11}$/i.test(postal);
      break;
    case "IN":
      valid = /^[1-9]\d{5}$/.test(postal);
      break;
    default:
      // European postal formats vary by country. Validate a safe broad shape here;
      // destination serviceability is confirmed by the existing delivery endpoint.
      valid = /^[A-Z0-9][A-Z0-9 -]{1,10}[A-Z0-9]$/i.test(postal);
  }

  return valid ? null : `Enter a valid ${getPostalCodeLabel(countryCode).toLowerCase()}.`;
}

export function getAddressCountryName(countryCode?: string | null): string {
  return getMarketCountry(countryCode || "IN").name;
}

export function getAddressCountryCode(countryCode?: string | null): string {
  return countryCode?.toUpperCase() || "IN";
}
