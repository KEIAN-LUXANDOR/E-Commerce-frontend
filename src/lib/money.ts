import { formatINR } from "./format";

/** Formats paise to INR currency display string (e.g. 47320000 -> "₹4,73,200") */
export function formatRupees(paise: number): string {
  return formatINR(paise);
}

/** Formats paise per carat to INR currency display string */
export function formatRupeesPerCarat(paise: number, carat: number): string {
  if (carat <= 0) return "₹0";
  const perCaratPaise = Math.round(paise / carat);
  return formatINR(perCaratPaise);
}
