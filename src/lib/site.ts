/**
 * Company details used across the whole site (header, footer, contact page, policies,
 * invoices, structured data). Change a value here once and every page updates.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ FILL IN BEFORE LAUNCH: every value marked  // TODO(company)              │
 * │ Empty strings are hidden on the site, so nothing wrong is ever shown.    │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export const site = {
  name: "Keian Luxandor",
  /** Registered company name, shown in the footer, terms and invoices. */
  legalName: "Keian Luxandor Pvt. Ltd.", // TODO(company): confirm the registered name
  tagline: "Certified natural and lab-grown diamonds, from Pune",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Shown as "Call us". Leave empty to hide. */
  phone: "", // TODO(company): e.g. "+91 20 1234 5678"
  get phoneHref() {
    const digits = this.phone.replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "";
  },
  /** Customer care email. Leave empty to hide. */
  email: "", // TODO(company): e.g. "care@keianluxandor.com"
  /** WhatsApp number, digits only with country code, e.g. 919812345678. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // TODO(company)

  /** Showroom / registered office. Lines left empty are skipped. */
  address: {
    line1: "", // TODO(company): building, office number
    line2: "Baner",
    city: "Pune",
    state: "Maharashtra",
    pincode: "", // TODO(company): e.g. "411045"
  },
  /** Google Maps link for the showroom. Leave empty to hide the "Get directions" link. */
  mapUrl: "", // TODO(company)
  /** Opening hours, shown on the contact page and footer. */
  hours: "Monday to Saturday, 11 am to 7 pm", // TODO(company): confirm
  /** Viewings are by appointment only. */
  viewingsByAppointment: true,

  /** Tax and legal details. Shown in the footer and on invoices only when filled in. */
  legal: {
    gstin: "", // TODO(company): 15-character GSTIN, e.g. "27ABCDE1234F1Z5"
    cin: "", // TODO(company): company identification number, if any
    pan: "", // TODO(company): optional
    /** Grievance officer (required by India's consumer e-commerce rules). */
    grievanceOfficer: {
      name: "", // TODO(company)
      email: "", // TODO(company)
      phone: "", // TODO(company)
    },
  },

  /**
   * GST on diamonds. Prices on the site already INCLUDE GST (the backend sends final prices).
   * This rate is only used to show "includes ₹X GST" on the cart, order and invoice.
   * Set to null to hide that line.
   */
  gstRatePercent: 3 as number | null, // TODO(company): confirm with your CA
  /** HSN code printed on invoices (7102 = diamonds). */
  hsnCode: "7102", // TODO(company): confirm with your CA

  /** Return window in days, from the day the order is delivered. */
  returnDays: 30,
  /** Unpaid orders are released after this many minutes (matches the backend). */
  paymentWindowMinutes: 15,

  social: {
    instagram: "", // TODO(company): full URL
    youtube: "", // TODO(company): full URL
  },
} as const;

/** Address as one line, skipping empty parts. */
export function addressLine(): string {
  const a = site.address;
  const cityLine = [a.city, a.pincode].filter(Boolean).join(" ");
  return [a.line1, a.line2, cityLine, a.state].filter(Boolean).join(", ");
}

/** "tel:" link for a phone number, or "" when there's no number. */
export function phoneHref(phone: string = site.phone): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  return `tel:${digits}`;
}

/** WhatsApp chat link, or "" when no number is set. */
export function whatsappLink(message?: string): string {
  const number = site.whatsappNumber.replace(/\D/g, "");
  if (!number) return "";
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * GST already included in a GST-inclusive amount, for display only.
 * e.g. ₹1,03,000 at 3% → ₹3,000. Returns null when no rate is set.
 */
export function gstIncludedPaise(inclusivePaise: number): number | null {
  const rate = site.gstRatePercent;
  if (rate === null || rate <= 0) return null;
  return Math.round(inclusivePaise - inclusivePaise / (1 + rate / 100));
}
