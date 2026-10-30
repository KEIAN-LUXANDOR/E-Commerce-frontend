
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Eye,
  Gem,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Atelier | Keian Luxandor Certified Diamonds",
  description:
    "Discover Keian Luxandor's approach to certified diamond curation, transparent pricing and careful inspection.",
};

type AtelierTenet = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const ATELIER_TENETS: AtelierTenet[] = [
  {
    number: "01",
    icon: Award,
    title: "Independent Lab Certification",
    description:
      "Every loose diamond is accompanied by a grading report from the Gemological Institute of America (GIA) or International Gemological Institute (IGI).",
  },
  {
    number: "02",
    icon: Eye,
    title: "Laser Inscription Matching",
    description:
      "We match the microscopic laser inscription on each stone's girdle with its corresponding laboratory report before dispatch.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Transparent Digital Pricing",
    description:
      "Our digital-first model keeps the buying experience focused on certified stones, considered selection and clear pricing.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Inspection Before Dispatch",
    description:
      "Each diamond is checked against its grading report and securely sealed before dispatch. Complimentary delivery is available across India.",
  },
];

const INSPECTION_STEPS = [
  {
    number: "01",
    title: "A considered selection",
    subtitle: "Natural & lab-grown diamonds",
    description:
      "Explore certified loose diamonds online or arrange a private viewing at our Baner, Pune showroom. Compare grades, characteristics and pricing before making your selection.",
  },
  {
    number: "02",
    title: "A closer examination",
    subtitle: "Gemological inspection",
    description:
      "Before dispatch, our team verifies carat weight using calibrated Mettler Toledo micro-balances, examines clarity characteristics under 10× achromatic triplet loupes and matches the laser inscription with the corresponding GIA or IGI report.",
  },
  {
    number: "03",
    title: "Prepared for your collection",
    subtitle: "Final verification & delivery",
    description:
      "The diamond is matched to its grading report and securely sealed before dispatch. Prices are shown in US dollars, with complimentary delivery available across India.",
  },
];

const FAQS = [
  {
    question: "What is included with a diamond?",
    answer:
      "Every loose diamond is accompanied by its applicable GIA or IGI grading report. The report helps you review the stone's documented grading characteristics.",
  },
  {
    question: "Can I view a diamond before purchasing?",
    answer:
      "Yes. You can arrange a private viewing of selected diamonds at our Baner, Pune showroom. Please contact our team to arrange an appointment.",
  },
  {
    question: "What currency are prices shown in?",
    answer:
      "All prices are shown and charged in US dollars (USD), so what you see is what you pay.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "Complimentary delivery is available across India. Each diamond is checked against its grading report and securely sealed before dispatch.",
  },
];

const PRIMARY_BUTTON = buttonVariants({
  variant: "default",
  size: "lg",
  className:
    "group h-12 rounded-full bg-[var(--color-ink)] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-loupe)] hover:shadow-lg",
});

const OUTLINE_BUTTON = buttonVariants({
  variant: "outline",
  size: "lg",
  className:
    "group h-12 rounded-full border-[var(--color-line-dark)] bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)]",
});

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-7 rounded-full bg-[var(--color-loupe)]" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[var(--color-loupe)]">
        {children}
      </p>
    </div>
  );
}

function DiamondArtwork({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const outerLine = dark
    ? "rgba(255,255,255,.42)"
    : "var(--color-line-dark)";

  const innerLine = dark
    ? "rgba(190,211,235,.78)"
    : "var(--color-loupe)";

  const softLine = dark
    ? "rgba(255,255,255,.16)"
    : "var(--color-line)";

  const outerFill = dark
    ? "rgba(255,255,255,.035)"
    : "var(--color-stone)";

  const innerFill = dark
    ? "rgba(190,211,235,.08)"
    : "rgba(255,255,255,.72)";

  const centerFill = dark
    ? "rgba(190,211,235,.16)"
    : "var(--color-stone)";

  return (
    <svg
      viewBox="0 0 600 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="300"
        cy="260"
        rx="252"
        ry="163"
        transform="rotate(-24 300 260)"
        stroke={outerLine}
        strokeOpacity=".7"
      />

      <ellipse
        cx="300"
        cy="260"
        rx="218"
        ry="187"
        transform="rotate(34 300 260)"
        stroke={softLine}
      />

      <ellipse
        cx="300"
        cy="260"
        rx="190"
        ry="218"
        transform="rotate(-54 300 260)"
        stroke={softLine}
        strokeDasharray="2 11"
      />

      <circle
        cx="300"
        cy="260"
        r="206"
        stroke={softLine}
        strokeDasharray="2 10"
      />

      <polygon
        points="300,55 405,84 477,151 516,253 474,356 390,426 300,462 210,426 126,356 84,253 123,151 195,84"
        fill={outerFill}
        stroke={outerLine}
        strokeWidth="1.5"
      />

      <g stroke={innerLine} strokeOpacity=".6" strokeWidth="1.05">
        <path d="M300 55L300 119L215 148L195 84" />
        <path d="M300 55L385 148L405 84" />
        <path d="M405 84L447 215L477 151" />
        <path d="M477 151L461 285L516 253" />
        <path d="M516 253L412 353L474 356" />
        <path d="M474 356L300 411L390 426" />
        <path d="M390 426L300 462L300 411" />
        <path d="M300 462L188 353L210 426" />
        <path d="M210 426L126 356" />
        <path d="M126 356L139 285L84 253" />
        <path d="M84 253L153 215L123 151" />
        <path d="M123 151L215 148L195 84" />
      </g>

      <polygon
        points="300,119 385,148 447,215 461,285 412,353 300,411 188,353 139,285 153,215 215,148"
        fill={innerFill}
        stroke={innerLine}
        strokeOpacity=".8"
        strokeWidth="1.25"
      />

      <g stroke={innerLine} strokeOpacity=".72" strokeWidth="1.05">
        <path d="M300 119L300 190L244 215L215 148Z" />
        <path d="M300 119L385 148L356 215L300 190Z" />
        <path d="M385 148L447 215L385 260L356 215Z" />
        <path d="M447 215L461 285L356 305L385 260Z" />
        <path d="M461 285L412 353L356 305Z" />
        <path d="M412 353L300 411L300 330L356 305Z" />
        <path d="M300 411L188 353L244 305L300 330Z" />
        <path d="M188 353L139 285L244 305Z" />
        <path d="M139 285L153 215L215 260L244 305Z" />
        <path d="M153 215L215 148L244 215L215 260Z" />
      </g>

      <polygon
        points="300,190 356,215 385,260 356,305 300,330 244,305 215,260 244,215"
        fill={centerFill}
        stroke={outerLine}
        strokeWidth="1.4"
      />

      <g stroke={innerLine} strokeOpacity=".9" strokeWidth="1.15">
        <path d="M300 190V330" />
        <path d="M215 260H385" />
        <path d="M244 215L356 305" />
        <path d="M356 215L244 305" />
        <path d="M244 215L300 190L356 215" />
        <path d="M215 260L244 215" />
        <path d="M385 260L356 215" />
        <path d="M244 305L215 260" />
        <path d="M356 305L385 260" />
        <path d="M244 305L300 330L356 305" />
      </g>

      <g stroke={innerLine} strokeWidth="1.3">
        <path d="M300 25V39M293 32H307" />
        <path d="M530 260H544M537 253V267" />
        <path d="M300 481V495M293 488H307" />
        <path d="M56 260H70M63 253V267" />
      </g>

      <circle cx="300" cy="260" r="3.5" fill={innerLine} />
      <circle cx="300" cy="260" r="9" stroke={innerLine} strokeOpacity=".5" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="w-full overflow-hidden bg-white text-[var(--color-ink)]">
      {/* Hero */}
      <section className="relative isolate border-b border-[var(--color-line)] bg-white">
        <div className="page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:py-24">
          <div className="relative z-10 min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="mb-10 flex items-center gap-2 text-[11px] font-medium tracking-wide text-[var(--color-muted)]"
            >
              <Link
                href="/"
                className="transition-colors hover:text-[var(--color-ink)]"
              >
                Home
              </Link>

              <span aria-hidden="true">/</span>

              <span aria-current="page" className="text-[var(--color-ink)]">
                About
              </span>
            </nav>

            <SectionEyebrow>The Keian Luxandor Atelier</SectionEyebrow>

            <h1 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.8rem]">
              A diamond deserves
              <span className="mt-2 block font-normal italic text-[var(--color-loupe)]">
                a closer look.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[var(--color-slate)] sm:text-lg sm:leading-8">
              A beautiful diamond deserves more than a beautiful
              presentation. It deserves careful selection, independent
              certification and a clear understanding of what makes it
              special. That is the approach behind Keian Luxandor.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/diamonds/natural" className={PRIMARY_BUTTON}>
                Explore Diamonds
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <Link href="/contact" className={OUTLINE_BUTTON}>
                Arrange a Private Viewing
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 border-t border-[var(--color-line)] pt-5">
              <div className="pr-2">
                <p className="font-serif text-lg text-[var(--color-ink)]">
                  Natural
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--color-muted)]">
                  Diamonds
                </p>
              </div>

              <div className="border-l border-[var(--color-line)] px-3">
                <p className="font-serif text-lg text-[var(--color-ink)]">
                  Lab-grown
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--color-muted)]">
                  Diamonds
                </p>
              </div>

              <div className="border-l border-[var(--color-line)] pl-3">
                <p className="font-serif text-lg text-[var(--color-ink)]">
                  GIA / IGI
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--color-muted)]">
                  Certification
                </p>
              </div>
            </div>
          </div>

          {/* Organic diamond composition */}
          <div className="relative mx-auto w-full max-w-[530px] px-3 pb-5">
            <div
              className="group relative isolate aspect-square overflow-hidden border border-white/20 bg-[var(--color-ink)] shadow-[0_24px_70px_rgba(19,36,58,0.16)]"
              style={{
                borderRadius:
                  "47% 53% 48% 52% / 43% 46% 54% 57%",
                backgroundImage:
                  "radial-gradient(ellipse at 48% 42%, var(--color-loupe), var(--color-ink) 69%)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-[5%] rounded-full border border-white/10"
              />

              <div
                aria-hidden="true"
                className="absolute inset-[13%] rounded-full border border-white/10"
              />

              <div
                aria-hidden="true"
                className="absolute inset-[22%] rounded-full border border-white/5"
              />

              <div
                aria-hidden="true"
                className="absolute left-[20%] top-[18%] size-44 rounded-full bg-white/10 blur-[75px]"
              />

              <DiamondArtwork
                dark
                className="relative z-10 h-full w-full scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />

              <div className="absolute left-[3%] top-[25%] z-20 hidden rounded-r-xl border border-l-0 border-white/15 bg-[var(--color-ink)]/80 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[var(--color-loupe)]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/65">
                    Examination
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-white">
                  Detail matters
                </p>
              </div>

              <div className="absolute bottom-[23%] right-[1%] z-20 hidden rounded-l-xl border border-r-0 border-white/15 bg-[var(--color-ink)]/80 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className="size-3.5 text-[var(--color-loupe)]"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/65">
                    Provenance
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-white">
                  Independently graded
                </p>
              </div>

              <div className="absolute bottom-[8%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[var(--color-ink)]/75 px-5 py-2.5 backdrop-blur-md">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/75">
                  The art of the diamond
                </p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-0 -z-10 h-2/3 w-2/3 rounded-br-[4rem] border-b border-r border-[var(--color-line-dark)]"
            />

            <div className="absolute -bottom-4 left-7 hidden items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 shadow-sm sm:flex">
              <Gem className="size-3.5 text-[var(--color-loupe)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-slate)]">
                Atelier / Diamond study
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="relative overflow-hidden bg-[var(--color-stone)] py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full border border-[var(--color-line)]"
        />

        <div className="page relative">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <SectionEyebrow>Our Standards</SectionEyebrow>

              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
                Confidence is built
                <span className="italic"> into the details.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-[var(--color-slate)]">
              Behind every selection is a process that puts certification,
              careful checks and clear information first.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
            {ATELIER_TENETS.map((tenet, index) => {
              const Icon = tenet.icon;
              const wide = index === 0 || index === 3;

              return (
                <article
                  key={tenet.number}
                  className={`group relative flex min-w-0 flex-col overflow-hidden border border-[var(--color-line)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-loupe)] hover:shadow-[0_18px_40px_rgba(19,36,58,0.07)] sm:p-7 lg:p-8 ${
                    wide ? "xl:col-span-7" : "xl:col-span-5"
                  } ${index % 2 === 0 ? "rounded-tl-[2rem] rounded-br-[2rem]" : "rounded-tr-[2rem] rounded-bl-[2rem]"} `}
                >
                  <div className="absolute inset-x-7 top-0 h-px origin-left scale-x-0 bg-[var(--color-loupe)] transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="flex items-center justify-between">
                    <div className="grid size-11 place-items-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-stone)] text-[var(--color-loupe)] transition-all duration-300 group-hover:rounded-full group-hover:border-[var(--color-ink)] group-hover:bg-[var(--color-ink)] group-hover:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>

                    <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--color-muted)]">
                      {tenet.number}
                    </span>
                  </div>

                  <div className="mt-8 max-w-md">
                    <h3 className="font-serif text-xl font-medium leading-snug text-[var(--color-ink)]">
                      {tenet.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[var(--color-slate)]">
                      {tenet.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-2 border-t border-[var(--color-line)] pt-5">
                    <span className="h-px w-5 rounded-full bg-[var(--color-loupe)] transition-all duration-300 group-hover:w-9" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-muted)]">
                      Keian standard
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inspection journey */}
      <section className="border-y border-[var(--color-line)] bg-white py-16 sm:py-20 lg:py-28">
        <div className="page grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          {/* Sticky artwork */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-24">
              <div
                className="relative overflow-hidden rounded-t-[2.5rem] rounded-br-[2.5rem] border border-[var(--color-line)] bg-[var(--color-ink)]"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 50% 38%, var(--color-loupe), var(--color-ink) 75%)",
                }}
              >
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 px-5 py-5 sm:px-7">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-white/60">
                      Behind every stone
                    </p>
                    <p className="mt-1 font-serif text-xl text-white">
                      A closer look.
                    </p>
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.14em] text-white/45">
                    KL / 02
                  </span>
                </div>

                <div className="relative z-10 overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-[8%] rounded-full border border-white/10"
                  />

                  <DiamondArtwork
                    dark
                    className="relative w-full p-5 transition-transform duration-700 hover:scale-[1.04] sm:p-8"
                  />
                </div>

                <div className="relative z-10 rounded-t-[1.5rem] border-t border-white/15 bg-[var(--color-ink)]/70 px-5 py-5 backdrop-blur-sm sm:px-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/60">
                      Precision / Inspection / Care
                    </span>
                    <ShieldCheck className="size-4 text-[var(--color-loupe)]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-b border-[var(--color-line)] pb-4">
                <p className="text-xs text-[var(--color-slate)]">
                  Every detail has a place.
                </p>
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-muted)]">
                  Inspection / 02
                </span>
              </div>
            </div>
          </aside>

          {/* Timeline */}
          <div className="min-w-0">
            <div className="mb-9">
              <SectionEyebrow>The Experience</SectionEyebrow>

              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
                From certified stone
                <span className="block font-normal italic text-[var(--color-loupe)]">
                  to your collection.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--color-slate)] sm:text-base">
                Choosing is personal. So is the care that follows. Here is
                what happens before your selected diamond is prepared for
                delivery.
              </p>
            </div>

            <div className="relative">
              <div className="absolute bottom-12 left-[19px] top-9 w-px bg-[var(--color-line)]" />

              {INSPECTION_STEPS.map((step, index) => (
                <article
                  key={step.number}
                  className="group relative border-b border-[var(--color-line)] py-8 pl-16 last:border-b-0 sm:py-10"
                >
                  <div className="absolute left-0 top-8 z-10 grid size-10 place-items-center rounded-full border border-[var(--color-line-dark)] bg-white font-mono text-[10px] text-[var(--color-loupe)] transition-all duration-300 group-hover:border-[var(--color-loupe)] group-hover:bg-[var(--color-ink)] group-hover:text-white sm:top-10">
                    {step.number}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-loupe)]">
                      {step.subtitle}
                    </p>

                    <span className="hidden h-px w-5 bg-[var(--color-line-dark)] sm:block" />

                    <span className="font-mono text-[9px] text-[var(--color-muted)]">
                      STAGE {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-[var(--color-ink)] sm:text-[1.8rem]">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--color-slate)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showroom */}
      <section className="bg-[var(--color-stone)] py-16 sm:py-20 lg:py-24">
        <div className="page">
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white px-6 py-8 sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-28 -z-10 size-[300px] rounded-full border border-[var(--color-line)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-16 -z-10 size-[210px] rounded-full border border-[var(--color-line)]"
            />

            <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
              <div className="max-w-2xl">
                <SectionEyebrow>A visit to the atelier</SectionEyebrow>

                <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                  Some things are better
                  <span className="block font-normal italic text-[var(--color-loupe)]">
                    seen in person.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--color-slate)] sm:text-base">
                  You can arrange a private viewing of selected diamonds at
                  our Baner, Pune showroom. See the stones up close, compare
                  your options and speak with our team. There is no need to
                  rush a decision.
                </p>
              </div>

              <div className="flex flex-col gap-5 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between lg:min-w-[310px] lg:flex-col lg:items-start lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-stone)] text-[var(--color-loupe)]">
                    <MapPin className="size-4" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      Baner, Pune
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Private viewings by appointment
                    </p>
                  </div>
                </div>

                <Link href="/contact" className={OUTLINE_BUTTON}>
                  Arrange a Viewing
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative isolate overflow-hidden bg-[var(--color-ink)] py-16 text-white sm:py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse at 76% 50%, var(--color-loupe), var(--color-ink) 67%)",
            opacity: 0.45,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -right-48 top-1/2 -z-10 hidden size-[680px] -translate-y-1/2 rounded-full border border-white/10 lg:block"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 top-1/2 -z-10 hidden size-[520px] -translate-y-1/2 rounded-full border border-white/10 lg:block"
        />

        <DiamondArtwork
          dark
          className="pointer-events-none absolute -right-44 top-1/2 -z-10 hidden w-[650px] -translate-y-1/2 opacity-35 lg:block"
        />

        <div className="page relative z-10">
          <div className="max-w-3xl">
            <SectionEyebrow>The Keian Luxandor Philosophy</SectionEyebrow>

            <blockquote className="mt-7 font-serif text-3xl font-normal leading-[1.2] tracking-tight sm:text-4xl lg:text-[3.5rem]">
              A diamond should be chosen with confidence — in its character,
              <span className="italic text-white/65">
                {" "}its certification and the clarity of its price.
              </span>
            </blockquote>

            <div className="mt-9 flex items-center gap-4">
              <span className="h-px w-12 rounded-full bg-white/50" />
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                A more considered way to discover diamonds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer FAQ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="page grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="max-w-md">
            <SectionEyebrow>A few useful details</SectionEyebrow>

            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Before you make your choice.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[var(--color-slate)]">
              A few things worth knowing before you explore the collection.
              And when you have a question that is not answered here, our
              team is happy to help.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-loupe)] transition-colors hover:text-[var(--color-ink)]"
            >
              Ask our team
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[var(--color-line)] px-5 transition-colors open:border-[var(--color-line-dark)] open:bg-[var(--color-paper)] sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-serif text-lg font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-loupe)] [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>

                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-loupe)] transition-all duration-300 group-open:rotate-45 group-open:border-[var(--color-ink)] group-open:bg-[var(--color-ink)] group-open:text-white">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>

                <div className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-[var(--color-slate)]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[var(--color-paper)] py-14 sm:py-20">
        <div className="page">
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white px-6 py-9 sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-32 -z-10 size-[340px] rounded-full border border-[var(--color-line)]"
            />

            <div
              aria-hidden="true"
              className="absolute -right-10 -top-20 -z-10 size-[230px] rounded-full border border-[var(--color-line)]"
            />

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl">
                <SectionEyebrow>Your Selection Begins Here</SectionEyebrow>

                <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
                  The right diamond is worth taking your time over.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--color-slate)]">
                  Explore the collection, ask us a question or arrange a
                  private viewing. We are here to help you make an informed
                  choice.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-56">
                <Link href="/diamonds/natural" className={PRIMARY_BUTTON}>
                  Browse Diamonds
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <Link href="/contact" className={OUTLINE_BUTTON}>
                  Contact the Atelier
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
