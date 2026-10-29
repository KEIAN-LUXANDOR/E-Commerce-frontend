export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneHref: string | undefined;
  whatsapp: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  hours: string;
  gstin: string;
  cin: string;
  hsn: string;
  gstRatePercent: number;
  returnDays: number;
  paymentWindowMinutes: number;
  grievanceOfficer: {
    name: string;
    email: string;
    phone: string;
  };
}

export const site: SiteConfig = {
  name: "Keian Luxandor",
  legalName: "Keian Luxandor Private Limited",
  tagline: "Certified Loose Diamonds",
  description:
    "Natural (GIA) and lab-grown (IGI) certified loose diamonds, inspected in our Pune showroom and delivered free across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "",
  get phoneHref() {
    const cleaned = this.phone.trim();
    return cleaned ? `tel:${cleaned.replace(/\s+/g, "")}` : undefined;
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: "info@keianluxandor.com",
  addressLine: "Baner, Pune, Maharashtra",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411045",
  hours: "Mon–Sat, 11:00 am – 7:30 pm IST",
  gstin: "",
  cin: "",
  hsn: "7102",
  gstRatePercent: 3,
  returnDays: 30,
  paymentWindowMinutes: 15,
  grievanceOfficer: {
    name: "",
    email: "",
    phone: "",
  },
};

export const SITE = site;

export function gstIncludedPaise(
  totalPaise: number,
  gstRatePercent: number = site.gstRatePercent
): number {
  if (!Number.isFinite(totalPaise) || totalPaise <= 0 || gstRatePercent <= 0) {
    return 0;
  }
  return Math.round((totalPaise * gstRatePercent) / (100 + gstRatePercent));
}

export function whatsappUrl(message?: string): string | undefined {
  const digits = (site.whatsapp || "").replace(/\D/g, "");
  if (!digits || digits.includes("X")) return undefined;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const whatsappHref = whatsappUrl;
export const whatsappLink = whatsappUrl;
export const phoneHref = telUrl;

export function telUrl(): string | undefined {
  const cleaned = (site.phone || "").trim();
  if (!cleaned) return undefined;
  return `tel:${cleaned.replace(/\s+/g, "")}`;
}

export function mailtoUrl(subject?: string): string | null {
  const cleaned = (site.email || "").trim();
  if (!cleaned) return null;
  return subject
    ? `mailto:${cleaned}?subject=${encodeURIComponent(subject)}`
    : `mailto:${cleaned}`;
}

export default site;