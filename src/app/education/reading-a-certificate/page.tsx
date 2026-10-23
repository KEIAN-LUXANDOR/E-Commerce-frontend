import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Anatomy of a GIA/IGI Diamond Certificate | Keian Luxandor",
  description:
    "A collector guide to interpreting official GIA and IGI gemological grading dossiers, proportions diagrams, and clarity plots.",
};

export default function ReadingCertificatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <Link
            href="/education"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-slate)] hover:text-[var(--color-ink)] mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to 4Cs Academy</span>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Metrological Verification
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Anatomy of a Diamond Dossier
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-2xl leading-relaxed">
            Every Keian Luxandor loose solitaire is accompanied by an independent laboratory report from either the Gemological Institute of America (GIA) or International Gemological Institute (IGI). Here is how to decode every data field.
          </p>
        </div>
      </div>

      {/* Main Educational Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {/* Section 1: Report Number & Inscription */}
        <section className="border border-[var(--color-line)] p-6 md:p-8 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--color-stone)] border border-[var(--color-line)]">
              01
            </span>
            <h2 className="font-serif text-xl text-[var(--color-ink)]">
              Unique Report Number & Laser Inscription
            </h2>
          </div>
          <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
            The laboratory dossier begins with a distinct serial number (e.g. 10 digits for GIA). This number is micro-lasered directly onto the diamond&rsquo;s girdle using cold laser pulses that do not penetrate the crystal lattice or affect clarity.
          </p>
          <div className="bg-[var(--color-stone)] p-4 border border-[var(--color-line)] font-mono text-xs text-[var(--color-ink)]">
            <span className="text-[var(--color-slate)] block text-[10px] uppercase">Forensic Check</span>
            Inspect the girdle under a 20x gemological loupe. The characters etched on the stone must match the laboratory dossier exactly.
          </div>
        </section>

        {/* Section 2: Proportions Diagram */}
        <section className="border border-[var(--color-line)] p-6 md:p-8 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--color-stone)] border border-[var(--color-line)]">
              02
            </span>
            <h2 className="font-serif text-xl text-[var(--color-ink)]">
              The Proportions Diagram
            </h2>
          </div>
          <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
            The proportions profile outlines the exact mathematical dimensions of the solitaire. For ideal light return in round solitaires, verify these benchmark thresholds:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-[var(--color-line)] p-4 bg-[var(--color-stone)]">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)] block">Table Percentage: 54% - 57%</span>
              <p className="font-sans text-xs text-[var(--color-slate)] mt-1">
                The flat top facet ratio relative to total diamond diameter.
              </p>
            </div>
            <div className="border border-[var(--color-line)] p-4 bg-[var(--color-stone)]">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)] block">Total Depth: 61.0% - 62.5%</span>
              <p className="font-sans text-xs text-[var(--color-slate)] mt-1">
                Total height from table to culet; ensures light doesn&rsquo;t leak through the pavilion.
              </p>
            </div>
            <div className="border border-[var(--color-line)] p-4 bg-[var(--color-stone)]">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)] block">Crown Angle: 34.0&deg; - 35.0&deg;</span>
              <p className="font-sans text-xs text-[var(--color-slate)] mt-1">
                Dictates the spectral fire and dispersion of rainbow hues.
              </p>
            </div>
            <div className="border border-[var(--color-line)] p-4 bg-[var(--color-stone)]">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)] block">Pavilion Angle: 40.6&deg; - 40.9&deg;</span>
              <p className="font-sans text-xs text-[var(--color-slate)] mt-1">
                Acts as a mirror to bounce light directly back out through the crown.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Clarity Characteristic Plot */}
        <section className="border border-[var(--color-line)] p-6 md:p-8 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--color-stone)] border border-[var(--color-line)]">
              03
            </span>
            <h2 className="font-serif text-xl text-[var(--color-ink)]">
              Clarity Plot & Key to Symbols
            </h2>
          </div>
          <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
            The certificate includes top-down crown and pavilion diagrams illustrating the location, size, and nature of internal inclusions (red symbols) and external blemishes (green symbols).
          </p>
          <ul className="space-y-2 text-xs font-mono text-[var(--color-slate)] list-disc pl-5">
            <li><strong className="text-[var(--color-ink)]">Crystal:</strong> A tiny mineral grain trapped during crystallization.</li>
            <li><strong className="text-[var(--color-ink)]">Feather:</strong> A microscopic fracture along the cleavage plane.</li>
            <li><strong className="text-[var(--color-ink)]">Pinpoint:</strong> A microscopic dot inclusion, negligible in VS+ stones.</li>
            <li><strong className="text-[var(--color-ink)]">Cloud:</strong> A tight cluster of pinpoints that may affect transparency if dense.</li>
          </ul>
        </section>

        {/* Verification CTA */}
        <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-emerald-700 shrink-0" />
            <div>
              <p className="font-serif text-base text-[var(--color-ink)]">Real-Time Database Verification</p>
              <p className="font-mono text-xs text-[var(--color-slate)]">Direct API cross-check against official GIA / IGI servers</p>
            </div>
          </div>
          <Link
            href="/diamonds/natural"
            className="inline-flex h-10 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 text-white font-mono text-xs uppercase tracking-[0.08em] hover:bg-[var(--color-slate)] transition-colors"
          >
            Browse Certified Solitaires
          </Link>
        </div>
      </div>
    </div>
  );
}
