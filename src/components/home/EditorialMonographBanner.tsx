import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/**
 * Editorial Monograph Campaign Banner.
 * Designed for high-fashion photoshooted campaign assets with custom editorial typography,
 * deep organic travertine accents, and luxury soft borders.
 */
export function EditorialMonographBanner() {
  return (
    <section aria-labelledby="monograph-heading" className="border-y border-line bg-[#faf8f5] py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle organic travertine grain and vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5dfd5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="page relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] items-center gap-12 xl:gap-20">
          {/* Photoshooted Campaign Asset Area */}
          <div className="relative group">
            <div
              className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden rounded-3xl border border-line-dark/30 shadow-xl bg-stone"
              style={{ position: "relative" }}
            >
              <Image
                src="/editorial/atelier-dossier.jpg"
                alt="Keian Luxandor editorial photoshoot showcasing loose certified diamonds, evaluation dossier, and brass loupe on warm travertine"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />
              
              {/* Floating editorial caption pill */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white/90 text-xs backdrop-blur-md bg-ink/40 p-3 rounded-xl border border-white/15">
                <span className="font-serif italic tracking-wide">Plate No. 04 · The Solitaire Monograph</span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/70">Surat Atelier Vaults</span>
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xl">
              <div className="size-11 rounded-xl bg-stone border border-line grid place-items-center text-loupe">
                <Microscope className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink">40x Forensic Video</p>
                <p className="text-[11px] text-slate">GIA Inscription Confirmed</p>
              </div>
            </div>
          </div>

          {/* High-Fashion Editorial Typography Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="cert" className="px-3 py-1 text-[11px] shadow-2xs">
                <Sparkles className="size-3 mr-1 text-loupe" />
                Special Campaign Issue
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-slate">
                Volume IV · Autumn Monograph
              </span>
            </div>

            <h2
              id="monograph-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-ink leading-[1.08] text-balance"
            >
              Beyond The Loupe: <br />
              <span className="italic font-normal text-slate">The Architecture of Pure Light.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate leading-relaxed max-w-xl">
              Every loose diamond in our private vault is individually curated for optical fire and scintillation. We bypass traditional multi-tiered luxury retail channels to deliver museum-grade GIA and IGI certified solitaires directly to discerning collectors.
            </p>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-3 gap-4 border-y border-line py-5 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate block mb-1">
                  Optical Cut
                </span>
                <span className="font-serif text-base font-medium text-ink">Triple Ideal</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate block mb-1">
                  Clarity Standard
                </span>
                <span className="font-serif text-base font-medium text-ink">Eye-Clean VS+</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate block mb-1">
                  Origin Integrity
                </span>
                <span className="font-serif text-base font-medium text-ink">100% Conflict-Free</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/shop">
                <ShimmerButton className="rounded-xl px-7 py-3.5 shadow-md">
                  <span>Explore The Curated Vault</span>
                  <ArrowRight className="size-3.5 ml-2" />
                </ShimmerButton>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ink hover:bg-stone transition-all"
              >
                Our Direct Sourcing Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
