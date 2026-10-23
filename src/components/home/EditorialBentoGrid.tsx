import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Scale, Sparkles, Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight";

/**
 * TailGrids & Aceternity UI style Editorial Bento Grid.
 * Displays high-contrast organic cards with soft borders, deep accents,
 * and prominent photoshoot macro asset display.
 */
export function EditorialBentoGrid() {
  return (
    <section aria-labelledby="bento-heading" className="page py-20 lg:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Badge variant="cert" className="mb-2">Institutional Standards</Badge>
          <h2 id="bento-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
            The Anatomy of Direct Fine Jewelry
          </h2>
          <p className="mt-3 text-slate text-sm sm:text-base max-w-xl">
            How we eliminate four layers of traditional retail markup while preserving institutional gemological rigor.
          </p>
        </div>
        <Link
          href="/education"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-loupe hover:underline"
        >
          <span>Explore Complete Education Suite</span>
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-12">
        {/* Card 1: 7-column Macro Photoshoot Hero Showcase */}
        <SpotlightCard className="md:col-span-3 lg:col-span-7 rounded-3xl p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-surface to-stone/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-slate">
                Macro Metrology · 0.01% Optical Cut
              </span>
              <Badge variant="outline" className="text-[10px]">40x Loupe Certified</Badge>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-3 text-ink">
              Microscopic Fire & Scintillation Inspection
            </h3>
            <p className="text-xs sm:text-sm text-slate leading-relaxed mb-6 max-w-lg">
              Before any loose stone is dispatched, our graduate gemologists inspect the facet alignment under daylight-balanced 40x magnification, verifying zero visible carbon crystals or feather inclusions.
            </p>
          </div>

          {/* Photo container */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line shadow-inner bg-ink/5 mt-4 group">
            <Image
              src="/editorial/diamond-macro.jpg"
              alt="High-magnification jeweler tweezers holding a certified round brilliant diamond"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs backdrop-blur-md bg-ink/30 p-2.5 rounded-xl border border-white/20">
              <span className="font-mono text-[11px]">GIA 2.05ct · Triple Excellent</span>
              <span className="font-mono text-[10px] text-white/80">Surat Inspection Desk</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: 5-column Direct Sourcing Pricing Model */}
        <SpotlightCard className="md:col-span-3 lg:col-span-5 rounded-3xl p-8 flex flex-col justify-between bg-surface border-line">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-slate">
                Direct Atelier Advantage
              </span>
              <Badge variant="cert" className="text-[10px]">Zero Middlemen</Badge>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-3 text-ink">
              Surat Diamond Bourse Directly To Your Door
            </h3>
            <p className="text-xs text-slate leading-relaxed mb-6">
              Traditional high-street jewelers mark up diamonds by 30% to 75% to fund retail showrooms, commissions, and regional distributors. We operate purely online from Surat cutting vaults.
            </p>

            {/* Comparison Bar */}
            <div className="space-y-3 rounded-2xl bg-stone/50 p-4 border border-line/60 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate">Traditional Retail Showroom</span>
                  <span className="text-rose-700 font-mono">+45% to +80% Markup</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-deep overflow-hidden">
                  <div className="h-full w-full bg-rose-400 rounded-full" />
                </div>
              </div>
              <div className="pt-2 border-t border-line/40">
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-ink font-semibold">Keian Luxandor Direct Vault</span>
                  <span className="text-emerald-700 font-mono font-bold">Direct Atelier Rate</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-deep overflow-hidden">
                  <div className="h-full w-[40%] bg-emerald-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/shop"
              className="btn btn-secondary w-full rounded-xl text-xs py-3 font-semibold uppercase tracking-wider"
            >
              Compare Live Prices
            </Link>
          </div>
        </SpotlightCard>

        {/* Card 3: 6-column Laser Inscription Verification */}
        <SpotlightCard className="md:col-span-3 lg:col-span-6 rounded-3xl p-8 bg-surface">
          <div className="size-12 rounded-2xl bg-stone border border-line grid place-items-center text-loupe mb-6">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium mb-2 text-ink">
            Microscopic Girdle Laser Inscription
          </h3>
          <p className="text-xs text-slate leading-relaxed mb-4">
            Every stone is micro-inscribed on its girdle with its unique GIA or IGI certificate number. It is invisible to the naked eye but easily verified under a 10x jeweler loupe against the laboratory report.
          </p>
          <ul className="space-y-2 text-xs text-slate border-t border-line/60 pt-4">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Independent GIA or IGI physical laminated certificate included</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Direct online verification on GIA.edu and IGI.org databases</span>
            </li>
          </ul>
        </SpotlightCard>

        {/* Card 4: 6-column Armoured Courier Security */}
        <SpotlightCard className="md:col-span-3 lg:col-span-6 rounded-3xl p-8 bg-surface">
          <div className="size-12 rounded-2xl bg-stone border border-line grid place-items-center text-loupe mb-6">
            <Truck className="size-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium mb-2 text-ink">
            100% Insured Armoured Security Transit
          </h3>
          <p className="text-xs text-slate leading-relaxed mb-4">
            Dispatched in high-security serialized tamper-evident lockboxes via Sequel Logistics and Malca-Amit. Full insurance covers the parcel until you inspect the unbroken seals and sign at your doorstep.
          </p>
          <ul className="space-y-2 text-xs text-slate border-t border-line/60 pt-4">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Real-time GPS tracking and dedicated security escort</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Complimentary insured 14-day return authorization</span>
            </li>
          </ul>
        </SpotlightCard>
      </div>
    </section>
  );
}
