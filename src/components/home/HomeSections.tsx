"use client";

import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
  Star,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { DiamondProfile } from "@/components/art/FacetDiagram";
import { site, whatsappLink } from "@/lib/site";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** Quick curation pills for human buyers */
export const POPULAR_CURATIONS = [
  { label: "Under $1,000", href: "/shop?sort=price_asc", badge: "Accessible Luxury" },
  { label: "1.00 – 1.50 Carat Solitaires", href: "/shop?q=1.0", badge: "Most Popular" },
  { label: "Triple Excellent Cut Rounds", href: "/shop?q=round", badge: "Maximum Brilliance" },
  { label: "Eye-Clean Step Cuts", href: "/shop?q=emerald", badge: "Understated Elegance" },
  { label: "GIA Certified Natural", href: "/shop?q=natural", badge: "Collector Grade" },
  { label: "IGI Certified Lab-Grown", href: "/shop?q=lab", badge: "Exceptional Value" },
];

/** Curated Quick Picks */
export function CuratedPills() {
  return (
    <section aria-label="Curated diamond shortcuts" className="border-b border-line bg-stone/40 py-6">
      <div className="page flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate flex items-center gap-2">
          <Sparkles className="size-3.5 text-[var(--brand-accent)]" />
          Quick Curations:
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CURATIONS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink transition-all hover:border-[var(--brand-accent)] hover:shadow-sm hover:-translate-y-px"
            >
              <span>{c.label}</span>
              <span className="text-[0.625rem] text-slate font-normal">({c.badge})</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT STRIP  — Anchor navy band with cool silver-blue icons
   ───────────────────────────────────────────────────────────── */
export function StatStrip() {
  const stats = [
    { icon: ShieldCheck, label: "GIA & IGI Certified" },
    { icon: CheckCircle2, label: "30-day free returns" },
    { icon: Truck, label: "Insured doorstep delivery" },
    { icon: Sparkles, label: "Surat precision atelier" },
  ];
  return (
    <section className="w-full bg-[var(--canvas-dark)] border-b border-[#23344D] py-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center justify-center gap-2.5 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Icon className="size-4 text-[var(--brand-accent)]" />
              <span className="text-[13.5px] font-medium tracking-wide text-white/90">{s.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHAPE ITEMS — SVG shape outlines
   ───────────────────────────────────────────────────────────── */
const SHAPE_ITEMS = [
  {
    name: "Round",
    subtitle: "Most sparkle",
    slug: "round",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="9" strokeDasharray="2 2" />
        <line strokeWidth="0.7" x1="24" x2="24" y1="6" y2="42" />
        <line strokeWidth="0.7" x1="6" x2="42" y1="24" y2="24" />
      </svg>
    ),
  },
  {
    name: "Oval",
    subtitle: "Looks larger",
    slug: "oval",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <ellipse cx="24" cy="24" rx="14" ry="19" />
        <ellipse cx="24" cy="24" rx="7" ry="10" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Princess",
    subtitle: "Modern square",
    slug: "princess",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <rect height="30" width="30" x="9" y="9" />
        <line strokeWidth="0.7" x1="9" x2="39" y1="9" y2="39" />
        <line strokeWidth="0.7" x1="39" x2="9" y1="9" y2="39" />
      </svg>
    ),
  },
  {
    name: "Cushion",
    subtitle: "Soft & romantic",
    slug: "cushion",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <rect height="32" rx="8" width="32" x="8" y="8" />
        <rect height="18" rx="3" strokeDasharray="2 2" width="18" x="15" y="15" />
      </svg>
    ),
  },
  {
    name: "Emerald",
    subtitle: "Clean step cut",
    slug: "emerald",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <polygon points="13,7 35,7 41,13 41,35 35,41 13,41 7,35 7,13" />
        <rect height="16" strokeWidth="0.75" width="16" x="16" y="16" />
      </svg>
    ),
  },
  {
    name: "Pear",
    subtitle: "Elegant teardrop",
    slug: "pear",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <path d="M24 7C24 7 11 23 11 32C11 39.5 16.8 43 24 43C31.2 43 37 39.5 37 32C37 23 24 7 24 7Z" />
      </svg>
    ),
  },
  {
    name: "Marquise",
    subtitle: "Long & slender",
    slug: "marquise",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <path d="M24 6C13 18 13 30 24 42C35 30 35 18 24 6Z" />
        <ellipse cx="24" cy="24" rx="5" ry="10" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Heart",
    subtitle: "Romantic",
    slug: "heart",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <path d="M24 15C21 10 13 8 9 14C4 21 8 30 24 41C40 30 44 21 39 14C35 8 27 10 24 15Z" />
      </svg>
    ),
  },
  {
    name: "Radiant",
    subtitle: "Bright & bold",
    slug: "radiant",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <polygon points="13,8 35,8 41,14 41,34 35,40 13,40 7,34 7,14" />
        <line strokeWidth="0.7" x1="7" x2="41" y1="40" y2="8" />
      </svg>
    ),
  },
  {
    name: "Asscher",
    subtitle: "Art deco square",
    slug: "asscher",
    svg: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 48 48">
        <polygon points="14,8 34,8 40,14 40,34 34,40 14,40 8,34 8,14" />
        <rect height="12" width="12" x="18" y="18" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   SHOP BY SHAPE — cool white band with restrained blue hover
   ───────────────────────────────────────────────────────────── */
export function ShopByShape() {
  return (
    <section
      aria-labelledby="shapes-heading"
      className="w-full bg-[#F5F0E8] border-b border-line py-16 lg:py-20"
      id="shapes"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-3">
          <div className="animate-fade-up">
            <span className="section-eyebrow mb-2">Start here</span>
            <h2
              id="shapes-heading"
              className="font-serif text-[36px] sm:text-[42px] text-ink font-normal leading-tight"
            >
              Choose your <span className="italic font-normal">shape</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[13px] uppercase font-medium tracking-[0.12em] text-ink hover:text-[var(--brand-accent)] transition-colors flex items-center gap-1.5 group"
          >
            View all diamonds
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {SHAPE_ITEMS.map((s, i) => (
            <Link
              key={s.name}
              href={`/shop?q=${s.slug}`}
              className="shape-tile bg-white p-4 text-center border border-line hover:border-[var(--brand-accent)] rounded-none flex flex-col items-center justify-between min-h-[160px] group animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-12 h-12 flex items-center justify-center text-ink my-auto transition-transform duration-300 group-hover:scale-110 group-hover:text-[var(--brand-accent)]">
                {s.svg}
              </div>
              <div>
                <div className="font-serif text-[16px] text-ink group-hover:text-[var(--brand-accent)] transition-colors">{s.name}</div>
                <div className="text-[11px] text-slate mt-0.5 font-sans">{s.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORIGIN COMPARE — asymmetric: clean white vs deep navy
   ───────────────────────────────────────────────────────────── */
export function OriginCompare({
  naturalHref = "/shop?q=natural",
  labHref = "/shop?q=lab",
}: {
  naturalHref?: string;
  labHref?: string;
}) {
  return (
    <section className="w-full bg-[#F5F0E8] border-b border-line py-16 lg:py-20" id="origin">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Natural diamonds — clean white */}
          <div className="relative bg-[#F8FAFC] p-8 sm:p-12 flex flex-col justify-between min-h-[360px] border border-line overflow-hidden group hover:border-[var(--brand-accent)] transition-colors duration-300">
            {/* Decorative circle */}
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-[var(--color-line-dark)] opacity-20 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-[var(--brand-accent)] opacity-10 pointer-events-none" />
            <div>
              <span className="section-eyebrow mb-3">Geological origin</span>
              <h3 className="font-serif text-[30px] sm:text-[34px] text-ink font-normal mb-4">
                Natural <span className="italic font-normal">diamonds</span>
              </h3>
              <p className="text-[16px] text-slate leading-[1.65] max-w-md">
                Formed over billions of years deep within the earth. Graded by GIA with microscopic
                laser inscriptions on every girdle.
              </p>
              <ul className="mt-5 space-y-2">
                {["GIA Certified", "Laser inscribed girdle", "Kimberley Process conflict-free"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-slate">
                    <span className="size-1.5 rounded-full bg-[var(--brand-accent)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href={naturalHref}
                className="inline-flex items-center gap-2 text-[13.5px] font-medium tracking-[0.12em] uppercase text-ink hover:text-[var(--brand-accent)] transition-colors group/link"
              >
                Shop Natural
                <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Lab-Grown Diamonds — deep navy */}
          <div className="relative bg-[var(--brand-anchor)] p-8 sm:p-12 flex flex-col justify-between min-h-[360px] overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            {/* Decorative circles on dark bg */}
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-[var(--brand-accent)]/20 pointer-events-none" />
            <div>
              <span className="editorial-eyebrow mb-3">Modern science</span>
              <h3 className="font-serif text-[30px] sm:text-[34px] text-white font-normal mb-4">
                Lab-grown <span className="italic font-normal text-[var(--brand-accent)]">diamonds</span>
              </h3>
              <p className="text-[16px] text-white/75 leading-[1.65] max-w-md">
                Grown in a laboratory, the same pure carbon crystal. Graded by IGI with certified
                growth disclosures and identical optical properties.
              </p>
              <ul className="mt-5 space-y-2">
                {["IGI Certified", "Identical optical fire", "Up to 70% better value"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-white/70">
                    <span className="size-1.5 rounded-full bg-[var(--brand-accent)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href={labHref}
                className="inline-flex items-center gap-2 text-[13.5px] font-medium tracking-[0.12em] uppercase text-[var(--brand-accent)] hover:text-white transition-colors group/link"
              >
                Shop Lab-Grown
                <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/education/natural-vs-lab"
            className="text-[14px] text-ink hover:text-[var(--brand-accent)] transition-colors inline-flex items-center gap-1.5 font-normal group"
          >
            What&apos;s the difference?
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHOOSE BY SIZE — concentric circles, restrained blue hover
   ───────────────────────────────────────────────────────────── */
export function ChooseBySize() {
  const tiers = [
    {
      title: "Under 1 carat",
      description: "Delicate and bright. Exceptional scintillation for understated everyday solitaire settings.",
      href: "/shop?maxCarat=0.99",
      rings: ["w-5 h-5", "w-9 h-9", "w-14 h-14"],
      dotSize: "w-3 h-3",
    },
    {
      title: "1 to 2 carats",
      description: "Our most chosen size. Classic visual presence with balanced spread and pavilion depth.",
      href: "/shop?minCarat=1.00&maxCarat=1.99",
      rings: ["w-7 h-7", "w-12 h-12", "w-18 h-18"],
      dotSize: "w-4 h-4",
      badge: "Most popular",
    },
    {
      title: "2 carats and above",
      description: "Statement stones. Commanding spread, maximum optical return, and rare pavilion fire.",
      href: "/shop?minCarat=2.00",
      rings: ["w-9 h-9", "w-14 h-14", "w-20 h-20"],
      dotSize: "w-6 h-6",
    },
  ];

  return (
    <section
      className="w-full bg-[#F5F0E8]border-b border-line py-16 lg:py-20"
      id="proportions"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 bg-[#F5F0E8]">
        <div className="text-center max-w-xl mx-auto mb-12 animate-fade-up">
          <span className="section-eyebrow mb-3">Proportions</span>
          <h2 className="font-serif text-[32px] sm:text-[38px] text-ink font-normal">
            Choose by <span className="italic font-normal">size</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <Link
              key={t.title}
              href={t.href}
              className="relative bg-white p-8 border border-line hover:border-[var(--brand-accent)] hover:shadow-[0_8px_24px_rgba(10, 25, 47,0.1)] transition-all duration-300 flex flex-col justify-between min-h-[240px] group animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {t.badge && (
                <Badge variant="gold" className="absolute right-4 top-4">
                  {t.badge}
                </Badge>
              )}
              <div>
                {/* Concentric circles visual */}
                <div className="flex items-center justify-center w-20 h-20 mb-6 relative">
                  <div className="absolute w-20 h-20 rounded-full border border-ink/10" />
                  <div className={`absolute ${t.rings[1]} rounded-full border border-ink/20`} />
                  <div className={`${t.rings[0]} rounded-full bg-[var(--canvas-dark)] group-hover:bg-[var(--brand-accent)] transition-colors duration-300`} />
                </div>
                <h3 className="font-serif text-[22px] text-ink font-normal mb-2">{t.title}</h3>
                <p className="text-[15px] text-slate leading-relaxed">{t.description}</p>
              </div>
              <div className="pt-6 text-[12.5px] uppercase font-medium tracking-[0.12em] text-ink group-hover:text-[var(--brand-accent)] transition-colors flex items-center gap-1.5">
                Explore tier
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS — numbered steps with silver-blue accents
   ───────────────────────────────────────────────────────────── */
export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose your diamond",
      text: "Browse natural or lab-grown stones filtered by shape, carat, colour, and clarity.",
    },
    {
      number: "02",
      title: "We inspect it",
      text: "Our gemologists verify the stone against its GIA or IGI certificate and girdle inscription before dispatch.",
    },
    {
      number: "03",
      title: "Insured delivery",
      text: "Fully insured transit across India, delivered directly to your doorstep in sealed tamper-evident packaging.",
    },
    {
      number: "04",
      title: "30 days to decide",
      text: "Examine the stone in person with absolute peace of mind, backed by our simple 30-day return policy.",
    },
  ];

  return (

    <section
      className="w-full bg-black border-b border-white/20 py-16 lg:py-20"
      id="process"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-14 animate-fade-up">
          <span className="section-eyebrow mb-3 text-white">
            Purchase process
          </span>

          <h2 className="font-serif text-[32px] sm:text-[38px] text-white font-normal">
            How it <span className="italic font-normal">works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.number}
              className="border-t-2 border-white/60 pt-6 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="font-serif text-[40px] text-white/70 block mb-3 leading-none">
                {s.number}
              </span>

              <h3 className="font-serif text-[20px] text-white font-normal mb-2">
                {s.title}
              </h3>

              <p className="text-[15px] text-white/80 leading-[1.65] font-sans">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
}

/* ─────────────────────────────────────────────────────────────
   GRADES MADE SIMPLE — 4Cs cards with silver-blue top accent
   ───────────────────────────────────────────────────────────── */
export function GradesMadeSimple() {
  return (
    <section
      className="w-full bg-[#F5F0E8] border-b border-line py-16 lg:py-20"
      id="grades"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-3">
          <div className="animate-fade-up">
            <span className="section-eyebrow mb-3">Buying guide</span>
            <h2 className="font-serif text-[32px] sm:text-[38px] text-ink font-normal">
              Grades made <span className="italic font-normal">simple</span>
            </h2>
          </div>
          <Link
            href="/education/4cs"
            className="text-[13px] uppercase font-medium tracking-[0.12em] text-ink hover:text-[var(--brand-accent)] transition-colors flex items-center gap-1.5 group"
          >
            Read the guide
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Carat */}
          <div className="bg-white border border-line hover:border-[var(--brand-accent)] hover:shadow-[0_8px_20px_rgba(10,25,47,0.08)] transition-all duration-300 flex flex-col min-h-[280px] group animate-fade-up">
            <div className="h-1 bg-[var(--brand-accent)]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-full h-24 bg-[#E8EEF5] mb-5 flex items-center justify-around px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-ink group-hover:bg-[var(--brand-accent)] transition-colors" />
                <div className="w-4 h-4 rounded-full bg-ink group-hover:bg-[var(--brand-accent)] transition-colors" />
                <div className="w-5 h-5 rounded-full bg-ink group-hover:bg-[var(--brand-accent)] transition-colors" />
                <div className="w-7 h-7 rounded-full bg-ink group-hover:bg-[var(--brand-accent)] transition-colors" />
              </div>
              <h3 className="font-serif text-[20px] text-ink font-normal mb-2">Carat</h3>
              <p className="text-[14px] text-slate leading-[1.6] font-sans flex-1">
                Carat measures the metric weight of the diamond, where 1 carat equals exactly 200 milligrams.
              </p>
              <Link href="/education/4cs" className="mt-4 text-[11px] uppercase tracking-wider text-[var(--brand-accent)] font-semibold hover:underline">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Colour */}
          <div className="bg-white border border-line hover:border-[var(--brand-accent)] hover:shadow-[0_8px_20px_rgba(10,25,47,0.08)] transition-all duration-300 flex flex-col min-h-[280px] group animate-fade-up delay-100">
            <div className="h-1 bg-[var(--brand-accent)]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-full h-24 bg-[#E8EEF5] mb-5 flex items-center justify-center px-4">
                <div className="w-full flex h-5 border border-line overflow-hidden rounded-sm">
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#F8FAFC]" />
                  <div className="flex-1 bg-[#F5F2E6]" />
                  <div className="flex-1 bg-[#EEEAD5]" />
                  <div className="flex-1 bg-[#E8E0C0]" />
                </div>
              </div>
              <h3 className="font-serif text-[20px] text-ink font-normal mb-2">Colour</h3>
              <p className="text-[14px] text-slate leading-[1.6] font-sans flex-1">
                Graded D to Z, representing the natural absence of warm nitrogen tint. D is pure colourless ice.
              </p>
              <Link href="/education/4cs" className="mt-4 text-[11px] uppercase tracking-wider text-[var(--brand-accent)] font-semibold hover:underline">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Clarity */}
          <div className="bg-white border border-line hover:border-[var(--brand-accent)] hover:shadow-[0_8px_20px_rgba(10,25,47,0.08)] transition-all duration-300 flex flex-col min-h-[280px] group animate-fade-up delay-200">
            <div className="h-1 bg-[var(--brand-accent)]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-full h-24 bg-[#E8EEF5] mb-5 flex items-center justify-center px-4">
                <div className="relative w-16 h-16 rounded-full border border-ink/30 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-ink" />
                  <div className="w-1.5 h-1.5 rounded-full bg-ink/30 absolute top-4 right-4" />
                </div>
              </div>
              <h3 className="font-serif text-[20px] text-ink font-normal mb-2">Clarity</h3>
              <p className="text-[14px] text-slate leading-[1.6] font-sans flex-1">
                Evaluates natural microscopic inclusions under 10× magnification from Flawless down to Included.
              </p>
              <Link href="/education/4cs" className="mt-4 text-[11px] uppercase tracking-wider text-[var(--brand-accent)] font-semibold hover:underline">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Cut */}
          <div className="bg-white border border-line hover:border-[var(--brand-accent)] hover:shadow-[0_8px_20px_rgba(10,25,47,0.08)] transition-all duration-300 flex flex-col min-h-[280px] group animate-fade-up delay-300">
            <div className="h-1 bg-[var(--brand-accent)]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-full h-24 bg-[#E8EEF5] mb-5 flex items-center justify-center px-4">
                <svg className="h-14 w-24 text-ink" fill="none" stroke="currentColor" viewBox="0 0 100 50">
                  <polygon points="15,15 85,15 92,22 50,45 8,22" strokeWidth="1" />
                  <path d="M30,0 L38,15 L70,36 L80,15 L90,0" stroke="#1E4A6D" strokeWidth="1" />
                </svg>
              </div>
              <h3 className="font-serif text-[20px] text-ink font-normal mb-2">Cut</h3>
              <p className="text-[14px] text-slate leading-[1.6] font-sans flex-1">
                The human craftsmanship dictating facet angles — the most critical factor in optical fire.
              </p>
              <Link href="/education/4cs" className="mt-4 text-[11px] uppercase tracking-wider text-[var(--brand-accent)] font-semibold hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOME FAQ — collapsible details with navy left accent
   ───────────────────────────────────────────────────────────── */
export function HomeFAQ() {
  const faqs = [
    {
      q: "Are all diamonds certified by independent laboratories?",
      a: "Yes. Every natural diamond is accompanied by its official grading report from the Gemological Institute of America (GIA), and every lab-grown diamond is graded by the International Gemological Institute (IGI). Each stone bears a microscopic laser inscription on its girdle matching the certificate number.",
    },
    {
      q: "What is the difference between natural and lab-grown diamonds?",
      a: "Both are physically, chemically, and optically identical pure crystallised carbon with a Mohs hardness of 10 and identical refractive properties. Natural diamonds formed in the earth over billions of years, while lab-grown diamonds are crystallised in specialised laboratories over several weeks.",
    },
    {
      q: "How does insured delivery across India work?",
      a: "All shipments are fully insured during transit and dispatched in tamper-evident sealed packaging. A signature and government identification are required upon doorstep delivery.",
    },
    {
      q: "What is your 30-day return policy?",
      a: "You have 30 days from receipt of your loose diamond to examine it in person. If you choose to return it, the stone must be in its original undamaged condition with its security seal intact and accompanying laboratory certificate.",
    },
    {
      q: "Can I inspect the diamond via 40x video before dispatch?",
      a: "Yes. Every certified diamond in our collection can be viewed in 40x ultra-high-definition video with a certified gemologist over WhatsApp or scheduled video consultation before dispatch.",
    },
    {
      q: "How are your diamond prices calculated?",
      a: "Our pricing directly reflects the Surat precision cutting bourse index with transparent wholesale margins, eliminating traditional high-street luxury markups.",
    },
  ];

  return (
    <section className="w-full bg-[#F5F0E8] border-b border-line py-16 lg:py-20" id="faq">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 animate-fade-up">
          <span className="section-eyebrow mb-3">Questions &amp; answers</span>
          <h2 className="font-serif text-[32px] sm:text-[38px] text-ink font-normal">
            Frequently <span className="italic font-normal">asked</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="border border-line bg-white px-5 transition-colors duration-200 hover:border-[var(--brand-accent)] data-[state=open]:border-l-2 data-[state=open]:border-l-[var(--brand-accent)] animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <AccordionTrigger className="py-5 text-left font-serif text-[18px] font-normal hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="border-t border-line/60 pt-4 text-[15px] font-sans">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-[var(--brand-accent)] transition-colors group"
          >
            View all FAQs
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARAT / COLOUR helpers for FourCs component
   ───────────────────────────────────────────────────────────── */
const CARAT_SIZES: [number, number][] = [
  [0.5, 5.1],
  [1.0, 6.4],
  [1.5, 7.4],
  [2.0, 8.1],
];

const COLOR_TINTS: [string, string][] = [
  ["D", "#ffffff"],
  ["E", "#fffefb"],
  ["F", "#fffdf6"],
  ["G", "#fffbee"],
  ["H", "#fff8e3"],
  ["I", "#fdf3d4"],
  ["J", "#fbeec5"],
  ["K", "#f8e6b3"],
];

/** The 4Cs with interactive tooltips */
export function FourCs() {
  return (
    <TooltipProvider>
      <section aria-labelledby="four-cs" className="page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="cert" className="mb-2">Gemologist Knowledge</Badge>
            <h2 id="four-cs" className="text-3xl sm:text-4xl">
              Understanding The 4Cs
            </h2>
            <p className="mt-2 max-w-xl text-slate text-sm sm:text-base">
              The universal language of diamond grading. Hover over any specification for expert shopping tips.
            </p>
          </div>
          <Link href="/education/shapes" className="text-xs font-semibold uppercase tracking-wider text-loupe hover:underline">
            Read Complete Buying Guide &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Carat */}
          <Card className="rounded-xl border-line p-6 hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold">1. Carat Weight</h3>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="size-4 text-slate hover:text-loupe" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Carat refers to weight (1 ct = 0.2g), not physical spread alone. Cut proportions determine face-up size.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <svg viewBox="0 0 220 90" className="h-20 w-full text-ink my-2" role="img" aria-label="Carat visual comparison">
              {CARAT_SIZES.map(([ct, mm], i) => {
                const r = mm * 3.8;
                const cx = 20 + i * 55;
                return (
                  <g key={ct}>
                    <circle cx={cx + 10} cy={45} r={r} fill="#fff" stroke="currentColor" strokeWidth={1} />
                    <text x={cx + 10} y={84} textAnchor="middle" fontSize="10" fill="var(--color-slate)">
                      {ct} ct
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-3 text-xs text-slate leading-relaxed">
              <strong>Gemologist tip:</strong> Diamonds just shy of full carats (e.g. 0.95ct or 1.45ct) look identical but offer major price savings.
            </p>
          </Card>

          {/* Color */}
          <Card className="rounded-xl border-line p-6 hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold">2. Color Grade</h3>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="size-4 text-slate hover:text-loupe" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>D is totally colorless. G–H stones are near-colorless and face up pure white once set in jewelry.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex h-20 items-center my-2" role="img" aria-label="Color grades D to K">
              {COLOR_TINTS.map(([g, hex]) => (
                <div key={g} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="size-5 rounded-full border border-ink/20 shadow-2xs" style={{ background: hex }} />
                  <span className="text-[0.625rem] tabular-nums text-slate font-medium">{g}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate leading-relaxed">
              <strong>Gemologist tip:</strong> G and H grades look completely ice-white in white gold or platinum, saving up to 25%.
            </p>
          </Card>

          {/* Clarity */}
          <Card className="rounded-xl border-line p-6 hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold">3. Clarity Grade</h3>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="size-4 text-slate hover:text-loupe" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Evaluates internal inclusions under 10x loupe. VS1 and VS2 are completely eye-clean to the naked eye.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <svg viewBox="0 0 220 90" className="h-20 w-full text-ink my-2" role="img" aria-label="Clarity scale">
              {[0, 2, 4, 7].map((n, i) => {
                const cx = 30 + i * 55;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={42} r={20} fill="#fff" stroke="currentColor" strokeWidth={1} />
                    {Array.from({ length: n }, (_, j) => (
                      <circle key={j} cx={cx - 8 + ((j * 7) % 16)} cy={34 + ((j * 11) % 16)} r={0.8 + i * 0.3} fill="currentColor" opacity={0.7} />
                    ))}
                    <text x={cx} y={82} textAnchor="middle" fontSize="10" fill="var(--color-slate)">
                      {["IF", "VVS", "VS", "SI"][i]}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-3 text-xs text-slate leading-relaxed">
              <strong>Gemologist tip:</strong> VS2 clarity stones are 100% eye-clean without paying premiums for microscope-only perfection.
            </p>
          </Card>

          {/* Cut */}
          <Card className="rounded-xl border-line p-6 hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold">4. Cut Precision</h3>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="size-4 text-slate hover:text-loupe" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The single most influential factor in optical fire, scintillation, and brightness.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <svg viewBox="0 0 220 90" className="h-20 w-full text-ink my-2" role="img" aria-label="Cut angle diagrams">
              <DiamondProfile cx={60} cy={30} w={85} strokeWidth={1} />
              <g transform="translate(110 -6) scale(1 1.25)">
                <DiamondProfile cx={50} cy={29} w={65} strokeWidth={1} />
              </g>
              <text x={60} y={84} textAnchor="middle" fontSize="10" fill="var(--color-slate)">
                Ideal Light Return
              </text>
              <text x={160} y={84} textAnchor="middle" fontSize="10" fill="var(--color-slate)">
                Light Leakage
              </text>
            </svg>
            <p className="mt-3 text-xs text-slate leading-relaxed">
              <strong>Gemologist tip:</strong> Never compromise on Cut. An Excellent cut stone sparkles brighter and appears larger than a poorly cut higher-carat stone.
            </p>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
}

/** 4-step doorstep delivery process */
export function Journey() {
  const steps = [
    {
      icon: ShieldCheck,
      title: "GIA or IGI Laboratory Report",
      text: "Every diamond includes an authentic, verifiable grading dossier with matching laser inscription on the girdle.",
    },
    {
      icon: Sparkles,
      title: "Dual Optical Loupe Inspection",
      text: "Prior to packaging, our gemologist verifies the report number under 40x magnification and records inspection video.",
    },
    {
      icon: Truck,
      title: "Tamper-Proof Armoured Transit",
      text: "Dispatched in high-security serialised tamper-evident lockboxes with 100% transit insurance.",
    },
    {
      icon: CheckCircle2,
      title: "Doorstep Verification & Sign-off",
      text: "Delivered directly into your hands with tamper seals intact, accompanied by original physical laboratory reports.",
    },
  ];

  return (
    <section aria-labelledby="journey" className="border-t border-line bg-surface py-20">
      <div className="page">
        <div className="max-w-2xl mb-12">
          <Badge variant="cert" className="mb-2">Secure Fulfillment</Badge>
          <h2 id="journey" className="text-3xl sm:text-4xl">
            From Our Vault Directly To Your Hands
          </h2>
          <p className="mt-2 text-slate text-sm sm:text-base">
            Every step is protected, certified, and handled with institutional care.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="border border-line bg-stone/20 p-6 flex flex-col justify-between hover:border-[var(--brand-accent)] hover:shadow-[0_4px_16px_rgba(10,25,47,0.08)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-8 bg-stone flex items-center justify-center font-display text-sm font-semibold text-ink">
                      {i + 1}
                    </span>
                    <Icon className="size-5 text-[var(--brand-accent)]" />
                  </div>
                  <h3 className="font-sans text-base font-semibold mb-2">{s.title}</h3>
                  <p className="text-xs text-slate leading-relaxed">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLIENT REVIEWS — dark navy background, silver-blue quote marks
   ───────────────────────────────────────────────────────────── */
export function ClientReviews() {
  const reviews = [
    {
      name: "Rohan & Meera M.",
      city: "Mumbai",
      diamond: "1.52 ct Round · E · VVS2 · GIA",
      quote:
        "We were nervous buying a diamond online without seeing it first. The team sent a 40x video loupe clip matching the GIA laser number. It arrived in an armoured box within 48 hours. Absolutely stunning fire.",
      rating: 5,
    },
    {
      name: "Aditya S.",
      city: "Bengaluru",
      diamond: "2.05 ct Emerald Cut · F · VS1 · IGI",
      quote:
        "The step-cut lines on this stone are immaculate. Price was almost 40% below retail jewellers in Indiranagar for the exact same IGI certificate. Highly recommend talking to their gemologist on WhatsApp.",
      rating: 5,
    },
    {
      name: "Pooja V.",
      city: "New Delhi",
      diamond: "1.20 ct Oval · D · VVS1 · GIA",
      quote:
        "The oval ratio is slender and elongated without any bowtie shadow. The certification arrived sealed with the original GIA document. Incredible transparency and concierge support.",
      rating: 5,
    },
  ];

  return (
    <section aria-labelledby="reviews" className="border-t border-[#23344D] bg-[var(--canvas-dark)] py-20">
      <div className="page">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="editorial-eyebrow mb-3">Verified clients</span>
            <h2 id="reviews" className="text-3xl sm:text-4xl text-white">
              Trusted by Discerning Collectors
            </h2>
            <p className="mt-2 max-w-xl text-white/60 text-sm sm:text-base font-sans">
              Real stories from clients across India who built bespoke engagement rings and collector portfolios with us.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <div className="flex text-[var(--brand-accent)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-[var(--brand-accent)] text-[var(--brand-accent)]" />
              ))}
            </div>
            <span className="font-semibold text-white ml-1">4.9 / 5.0</span>
            <span>(350+ diamonds delivered)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className="bg-white/5 border border-white/10 p-6 hover:border-[var(--brand-accent)]/40 hover:bg-white/8 transition-all duration-300 flex flex-col animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Large opening quote */}
              <div className="text-[56px] leading-none text-[var(--brand-accent)] opacity-40 font-serif mb-2 select-none">&ldquo;</div>

              <p className="text-sm text-white/75 italic leading-relaxed mb-5 flex-1 font-sans">
                {r.quote}
              </p>

              <div className="flex text-[var(--brand-accent)] mb-4">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-[var(--brand-accent)] text-[var(--brand-accent)]" />
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                <div className="size-9 rounded-full border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10 flex items-center justify-center text-[var(--brand-accent)] font-serif font-medium text-sm">
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-[0.6875rem] text-white/50 font-sans">{r.city} · Verified Buyer</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 text-[0.6875rem] text-[var(--brand-accent)]/70 font-sans">
                {r.diamond}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   GEMOLOGIST CONCIERGE BAND — dark navy with a silver-blue CTA
   ───────────────────────────────────────────────────────────── */
export function GemologistConciergeBand() {
  return (
    <section aria-labelledby="concierge" className="bg-[var(--brand-anchor)] text-white py-16 relative overflow-hidden">
      {/* Subtle decorative arc */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full border border-[var(--brand-accent)]/10 pointer-events-none" />

      <div className="page grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 text-xs text-white/90 mb-5 rounded-sm">
            <Headphones className="size-3.5 text-[var(--brand-accent)]" />
            <span>Personal Gemologist Assistance</span>
          </div>
          <h2 id="concierge" className="text-3xl sm:text-4xl text-white">
            Need Expert Guidance Choosing Your Diamond?
          </h2>
          <p className="mt-3 max-w-lg text-white/70 text-sm sm:text-base leading-relaxed font-sans">
            Every diamond in our collection is loose and held under laboratory condition. Speak directly with our
            certified graduate gemologist to review 40x magnified videos, compare proportions, and confirm
            eye-cleanliness before purchase.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappLink("Hello Keian Luxandor, I would like expert advice on selecting a diamond from your collection.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold rounded-sm px-6"
            >
              Consult On WhatsApp
            </a>
            <a
              href={site.phoneHref}
              className="btn btn-ghost-dark rounded-sm px-6"
            >
              Call {site.phone}
            </a>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-6 space-y-5">
          {[
            {
              icon: ShieldCheck,
              title: "100% Online Precision Atelier",
              text: "Zero brick-and-mortar retail markups. Direct vault-to-doorstep pricing.",
            },
            {
              icon: Truck,
              title: "Complimentary Armoured Delivery",
              text: "Fully insured transit across all Indian pin codes via Sequel & Malca-Amit.",
            },
            {
              icon: CheckCircle2,
              title: "30-Day Insured Return Guarantee",
              text: "Return in original tamper seal for 100% refund. Zero restocking fees.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3">
                <Icon className="size-5 text-[var(--brand-accent)] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-semibold">{item.title}</strong>
                  <span className="text-xs text-white/65 font-sans">{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Keep backwards-compatibility alias */
export const ShowroomBand = GemologistConciergeBand;
