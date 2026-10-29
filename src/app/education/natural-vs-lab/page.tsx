import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft,    } from "lucide-react";

export const metadata: Metadata = {
  title: "Natural vs. Lab-Grown Diamonds: A Gemological Comparison | Keian Luxandor",
  description:
    "An objective, scientific comparison between billion-year-old mined solitaires and high-pressure laboratory created diamonds.",
};

export default function NaturalVsLabPage() {
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
            Scientific & Market Clarity
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Natural vs. Lab-Grown Solitaires
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-2xl leading-relaxed">
            Both are 100% genuine diamonds with identical physical, optical, and chemical compositions. Here is how their provenance, growth physics, and market value differ.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {/* Metrological Comparison Table */}
        <div className="border border-[var(--color-line)] overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-ink)]">
              <tr>
                <th className="py-4 px-6">Characteristic</th>
                <th className="py-4 px-6">Natural Solitaire</th>
                <th className="py-4 px-6">Lab-Grown Solitaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Chemical Composition</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">Pure Crystallized Carbon (sp3)</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">Pure Crystallized Carbon (sp3)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Mohs Hardness</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">10 (Hardest Known Mineral)</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">10 (Hardest Known Mineral)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Refractive Index</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">2.417</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">2.417</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Formation Environment</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">Earth&rsquo;s Mantle (150-200 km depth)</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">HPHT / CVD Reactor Chambers</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Time to Crystallize</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">1 to 3 Billion Years</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">4 to 12 Weeks</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Laboratory Grading</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">GIA &bull; IGI Dossier</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">GIA &bull; IGI LG Dossier</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono font-medium text-[var(--color-ink)]">Laser Inscription</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">Report Number</td>
                <td className="py-4 px-6 text-[var(--color-slate)]">&ldquo;LAB GROWN&rdquo; + Report Number</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deep Dive Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[var(--color-line)] p-6 md:p-8 bg-white space-y-4">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">The Case for Natural</h2>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Natural diamonds are miraculous relics of Earth&rsquo;s primordial origins. Each stone has endured billions of years of tectonic upheaval, volcanic kimberlite transport, and painstaking mining. Their finite supply makes them timeless family heirlooms and assets of enduring historical sentiment.
            </p>
            <Link
              href="/diamonds/natural"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] underline pt-2 hover:text-[var(--color-slate)]"
            >
              <span>Explore Natural Solitaires &rarr;</span>
            </Link>
          </div>

          <div className="border border-[var(--color-line)] p-6 md:p-8 bg-white space-y-4">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">The Case for Lab-Grown</h2>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Lab-grown diamonds replicate the exact conditions of the Earth&rsquo;s mantle using advanced HPHT (High Pressure High Temperature) or CVD (Chemical Vapor Deposition) technology. They allow collectors to acquire stones of extraordinary carat weight, D color, and VVS clarity at accessible valuations.
            </p>
            <Link
              href="/diamonds/lab-grown"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] underline pt-2 hover:text-[var(--color-slate)]"
            >
              <span>Explore Lab-Grown Solitaires &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
