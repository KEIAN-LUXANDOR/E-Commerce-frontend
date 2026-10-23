/**
 * Store details used across the site. Change these once and every page updates.
 * Values marked "placeholder" must be replaced before launch.
 */
export const site = {
  name: "Keian Luxandor",
  legalName: "Keian Luxandor Pvt. Ltd.", // confirm the registered company name
  tagline: "Certified natural and lab-grown loose diamonds, from Pune",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+91 20 4000 0000", // placeholder
  phoneHref: "tel:+912040000000",
  email: "care@example.com", // placeholder
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919800000000", // placeholder, digits only
  address: {
    line1: "Surat Vault Custody & Precision Diamond Atelier, Diamond Bourse",
    city: "Surat",
    state: "Gujarat",
    pincode: "395007",
  },
  hours: "Concierge & Dispatch: Monday to Saturday, 9 am to 7 pm IST",
  googleReviewsUrl: "https://www.google.com/maps", // replace with your Google Business Profile link
  instagramUrl: "https://www.instagram.com/", // replace with your handle
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
