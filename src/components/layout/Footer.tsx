import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Logo } from "@/components/layout/Logo";
import { getStoreCategories } from "@/lib/api/store";
import { site, whatsappLink } from "@/lib/site";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

const HELP_LINKS = [
  { href: "/contact", label: "Digital Concierge" },
  { href: "/order-tracking", label: "Track an Insured Order" },
  { href: "/faq", label: "Questions & Answers" },
  { href: "/compare", label: "Comparison Matrix" },
];

const LEARN_LINKS = [
  { href: "/education", label: "The 4Cs Masterclass" },
  { href: "/education/reading-a-certificate", label: "Reading a Certificate" },
  { href: "/education/natural-vs-lab", label: "Natural vs. Lab-Grown" },
  { href: "/education/shapes", label: "Diamond Shapes Anatomy" },
  { href: "/about", label: "Atelier Philosophy" },
  { href: "/shipping", label: "Shipping & Transit Insurance" },
  { href: "/returns", label: "Returns & Forensic Inspection" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const FORENSIC_PROMISES = [
  {
    icon: Award,
    title: "GIA & IGI Graded",
    text: "Every loose diamond is certified with microscopic laser inscription on the girdle.",
  },
  {
    icon: ShieldCheck,
    title: "10x Loupe Verified",
    text: "Inspected by our gemologists before dispatch to verify report specs.",
  },
  {
    icon: Truck,
    title: "100% Insured Transit",
    text: "Tamper-evident security packaging with armored courier coverage across India.",
  },
  {
    icon: RotateCcw,
    title: "14-Day Return Guarantee",
    text: "Return in original condition with intact grading report for a full refund.",
  },
];

export async function Footer() {
  "use cache";
  cacheLife("hours");
  const categories = await getStoreCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-line)] bg-white text-[var(--color-ink)]">
      <div className="page">
        {/* Forensic Assurance Grid */}
        <ul className="grid gap-x-8 gap-y-6 border-b border-[var(--color-line)] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FORENSIC_PROMISES.map((promise) => {
            const IconComponent = promise.icon;
            return (
              <li key={promise.title} className="group flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-stone border border-[var(--brand-accent)]/50 transition-colors group-hover:bg-[var(--brand-accent)]/10">
                    <IconComponent className="h-4 w-4 text-[var(--brand-accent-deep)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-serif text-base font-medium">{promise.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-slate)] leading-relaxed">
                    {promise.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 5-Column Navigation Grid */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr]">
          {/* Column 1: Direct Atelier (No showroom) */}
          <div className="space-y-3">
            <Logo size="compact" />
            <p className="text-xs text-[var(--color-slate)] leading-relaxed">
              Online Certified Loose Diamond Atelier.
              <br />
              Insured courier delivery direct to your door nationwide.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-xs">
              <a
                href={site.phoneHref}
                className="text-[var(--color-ink)] hover:text-[var(--color-loupe)] font-medium"
              >
                {site.phone}
              </a>
              <a
                href={whatsappLink("Hello Keian Luxandor, I would like to inquire about diamonds.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-loupe)] hover:underline font-medium"
              >
                Direct WhatsApp Advisory
              </a>
            </div>
          </div>

          {/* Column 2: Catalog Collections */}
          <FooterList
            title="Diamonds"
            links={[
              { href: "/shop/natural-diamonds", label: "Natural Diamonds" },
              { href: "/shop/lab-grown-diamonds", label: "Lab-Grown Diamonds" },
              ...categories.slice(0, 4).map((c) => ({
                href: `/shop/${encodeURIComponent(c.slug)}`,
                label: c.name,
              })),
              { href: "/shop", label: "All Solitaires" },
            ]}
          />

          {/* Column 3: Customer Care & Concierge */}
          <FooterList title="Concierge" links={HELP_LINKS} />

          {/* Column 4: Gemological Education */}
          <FooterList title="Education" links={LEARN_LINKS} />

          {/* Column 5: Private Dispatch Newsletter */}
          <div className="space-y-3">
            <p className="font-serif text-lg font-medium">The Solitaire Dispatch</p>
            <p className="text-xs text-[var(--color-slate)] leading-relaxed">
              Receive curated monthly dossiers on newly acquired gemological parcels. Zero promotional spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Legal & Copyright Hairline Bar */}
        <div className="flex flex-col gap-3 border-t border-[var(--color-line)] py-6 text-xs text-[var(--color-slate)] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; {currentYear} {site.legalName}. All rights reserved.</span>
            <span aria-hidden="true" className="text-[var(--brand-accent-deep)]">◆</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]">Surat Precision Atelier</span>
          </p>
          <ul className="flex gap-5">
            {LEGAL_LINKS.map((legal) => (
              <li key={legal.href}>
                <Link
                  href={legal.href}
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  {legal.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)]">
        {title}
      </p>
      <ul className="mt-3.5 space-y-2 text-xs text-[var(--color-slate)]">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-[var(--color-ink)] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
