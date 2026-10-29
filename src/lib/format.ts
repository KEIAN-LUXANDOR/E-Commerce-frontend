const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 12500000 paise → "₹1,25,000". Rounds to whole rupees for display only. */
export function formatINR(paise: number): string {
  return inr.format(Math.round(paise / 100));
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
