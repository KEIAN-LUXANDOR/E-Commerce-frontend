"use client";

/**
 * 4Cs Interactive Gemological Guide
 * Route: /education
 *
 * Comprehensive education suite covering the 4Cs of diamond grading:
 *   1. Cut – Proportions, angles, light return, scintillation
 *   2. Color – D through Z scale, fluorescence, undertones
 *   3. Clarity – Inclusions, FL to I1 scale, eye-clean thresholds
 *   4. Carat – Weight vs millimeter spread, finger coverage
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Editorial typography and accessible tabs.
 */

import * as React from "react";
import Link from "next/link";
import { Sparkles, Eye, Scale, Palette, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type FourCTab = "cut" | "color" | "clarity" | "carat";

interface TabConfig {
  key: FourCTab;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  { key: "cut", label: "Cut", subtitle: "Light Performance", icon: Sparkles },
  { key: "color", label: "Color", subtitle: "Absence of Tint", icon: Palette },
  { key: "clarity", label: "Clarity", subtitle: "Internal Purity", icon: Eye },
  { key: "carat", label: "Carat", subtitle: "Mass & Proportions", icon: Scale },
];

export default function EducationHubPage() {
  const [activeTab, setActiveTab] = React.useState<FourCTab>("cut");

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Hero */}
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Keian Luxandor &bull; Gemological Academy
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[var(--color-ink)]">
            The Science of the 4Cs
          </h1>
          <p className="font-sans text-base text-[var(--color-slate)] max-w-2xl mx-auto leading-relaxed">
            Understanding the metrological parameters established by the Gemological Institute of America (GIA) to evaluate rarity, optical brilliance, and value.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/education/reading-a-certificate"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-line)] bg-white font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
            >
              <span>Reading a Laboratory Dossier</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/education/natural-vs-lab"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-line)] bg-white font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
            >
              <span>Natural vs. Lab-Grown Solitaires</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4Cs Interactive Navigator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--color-line)] bg-[var(--color-stone)]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            let tabStyle = "bg-transparent text-[var(--color-slate)] hover:bg-white/60";
            if (isActive) {
              tabStyle = "bg-white text-[var(--color-ink)] shadow-sm font-semibold";
            }

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "p-5 text-left border-b md:border-b-0 md:border-r border-[var(--color-line)] last:border-r-0 transition-colors flex flex-col justify-between",
                  tabStyle
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs uppercase tracking-[0.1em]">
                    {tab.label}
                  </span>
                  <Icon className="size-4 shrink-0 opacity-70" />
                </div>
                <span className="font-serif text-lg">{tab.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Panels */}
        <div className="mt-8 border border-[var(--color-line)] p-6 md:p-10 bg-white shadow-sm space-y-8">
          {activeTab === "cut" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-line)] pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Primary Optical Driver
                </span>
                <h2 className="font-serif text-3xl text-[var(--color-ink)] mt-1">
                  Diamond Cut: The Architecture of Fire & Brilliance
                </h2>
              </div>
              <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
                While nature dictates color, clarity, and carat weight, cut is the sole factor entirely in the hands of the master lapidary. Cut does not refer to the diamond&rsquo;s shape, but rather how precisely its 57 or 58 facets are aligned to capture and refract light back into the viewer&rsquo;s eye.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-5">
                  <h3 className="font-serif text-base text-[var(--color-ink)] mb-1">Brilliance</h3>
                  <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
                    The total amount of white light reflected back from the crown facets. Maximum brilliance requires a table percentage between 54% and 57%.
                  </p>
                </div>
                <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-5">
                  <h3 className="font-serif text-base text-[var(--color-ink)] mb-1">Fire (Dispersion)</h3>
                  <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
                    The scattering of white light into spectral rainbow flashes, caused by steep crown angles between 34&deg; and 35&deg;.
                  </p>
                </div>
                <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-5">
                  <h3 className="font-serif text-base text-[var(--color-ink)] mb-1">Scintillation</h3>
                  <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
                    The pattern of sparkle and contrasting light/dark reflections generated when either the diamond or observer moves.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 border border-[var(--color-line)] p-5">
                <p className="font-mono text-xs text-[var(--color-ink)] font-semibold uppercase tracking-[0.08em] mb-1">
                  Atelier Recommendation
                </p>
                <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
                  Never compromise on Cut. An Excellent cut diamond with slightly lower color or clarity will appear dramatically brighter and larger than a poorly cut stone of superior color grades.
                </p>
              </div>
            </div>
          )}

          {activeTab === "color" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-line)] pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  GIA D-Z Scale
                </span>
                <h2 className="font-serif text-3xl text-[var(--color-ink)] mt-1">
                  Diamond Color: The Absence of Tint
                </h2>
              </div>
              <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
                In white diamonds, the grading scale actually measures the degree of colorless purity. GIA grades diamonds from D (completely colorless) through Z (light yellow or brown tint).
              </p>

              {/* Color Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-[var(--color-line)] p-4 text-center bg-[var(--color-stone)]">
                  <span className="font-mono text-xl font-bold text-[var(--color-ink)] block">D - F</span>
                  <span className="font-serif text-xs uppercase tracking-wider text-[var(--color-slate)] block mt-1">Colorless</span>
                  <p className="font-sans text-[11px] text-[var(--color-muted)] mt-2">Icy, pure, rarest in nature. Set ideally in Platinum.</p>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-white">
                  <span className="font-mono text-xl font-bold text-[var(--color-ink)] block">G - H</span>
                  <span className="font-serif text-xs uppercase tracking-wider text-[var(--color-slate)] block mt-1">Near Colorless</span>
                  <p className="font-sans text-[11px] text-[var(--color-muted)] mt-2">Appears completely white to the naked eye. Exceptional value.</p>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-white">
                  <span className="font-mono text-xl font-bold text-[var(--color-ink)] block">I - J</span>
                  <span className="font-serif text-xs uppercase tracking-wider text-[var(--color-slate)] block mt-1">Warm Tint</span>
                  <p className="font-sans text-[11px] text-[var(--color-muted)] mt-2">Slight warm presence; pairs gorgeously with Yellow and Rose Gold.</p>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-white">
                  <span className="font-mono text-xl font-bold text-[var(--color-ink)] block">K - Z</span>
                  <span className="font-serif text-xs uppercase tracking-wider text-[var(--color-slate)] block mt-1">Faint to Light</span>
                  <p className="font-sans text-[11px] text-[var(--color-muted)] mt-2">Noticeable champagne or yellow saturation.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clarity" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-line)] pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Forensic Microscopic Purity
                </span>
                <h2 className="font-serif text-3xl text-[var(--color-ink)] mt-1">
                  Diamond Clarity: Nature&rsquo;s Fingerprint
                </h2>
              </div>
              <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
                Diamonds form deep within the Earth under extreme heat (1,100&deg;C) and pressure (50,000 atmospheres). Clarity grades assess internal inclusions (crystals, clouds, feathers) and surface blemishes under 10x magnification.
              </p>

              <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
                <div className="p-4 flex items-center justify-between bg-[var(--color-stone)]">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">FL / IF (Flawless / Internally Flawless)</span>
                    <p className="font-sans text-xs text-[var(--color-slate)]">Zero internal inclusions visible under 10x loupe. Extremely rare.</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 bg-white border border-[var(--color-line)]">Top 0.5%</span>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">VVS1 / VVS2 (Very Very Slightly Included)</span>
                    <p className="font-sans text-xs text-[var(--color-slate)]">Inclusions extremely difficult for expert gemologists to locate under 10x magnification.</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 bg-[var(--color-stone)] border border-[var(--color-line)]">Collector Standard</span>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">VS1 / VS2 (Very Slightly Included)</span>
                    <p className="font-sans text-xs text-[var(--color-slate)]">Minor internal characteristics invisible to the unassisted eye. The sweet spot of value.</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 bg-[var(--color-stone)] border border-[var(--color-line)]">Eye-Clean</span>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">SI1 / SI2 (Slightly Included)</span>
                    <p className="font-sans text-xs text-[var(--color-slate)]">Inclusions noticeable under 10x magnification; SI1 is typically eye-clean when viewed from 20cm.</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 bg-[var(--color-stone)] border border-[var(--color-line)]">Inspect Loupe</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "carat" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-line)] pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Physical Metric Unit
                </span>
                <h2 className="font-serif text-3xl text-[var(--color-ink)] mt-1">
                  Carat Weight: Mass & Finger Spread
                </h2>
              </div>
              <p className="font-sans text-sm text-[var(--color-slate)] leading-relaxed">
                One metric carat equals exactly 200 milligrams (0.20 grams). Each carat is subdivided into 100 &ldquo;points&rdquo;. Because large diamond crystals form far less frequently in nature, diamond price increases exponentially rather than linearly with carat weight.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-[var(--color-line)] p-4 text-center bg-[var(--color-stone)]">
                  <span className="font-mono text-lg font-bold text-[var(--color-ink)]">1.00 Carat</span>
                  <span className="font-mono text-xs text-[var(--color-slate)] block mt-1">~6.50 mm (Round)</span>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-[var(--color-stone)]">
                  <span className="font-mono text-lg font-bold text-[var(--color-ink)]">1.50 Carat</span>
                  <span className="font-mono text-xs text-[var(--color-slate)] block mt-1">~7.30 mm (Round)</span>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-[var(--color-stone)]">
                  <span className="font-mono text-lg font-bold text-[var(--color-ink)]">2.00 Carat</span>
                  <span className="font-mono text-xs text-[var(--color-slate)] block mt-1">~8.10 mm (Round)</span>
                </div>
                <div className="border border-[var(--color-line)] p-4 text-center bg-[var(--color-stone)]">
                  <span className="font-mono text-lg font-bold text-[var(--color-ink)]">3.00 Carat</span>
                  <span className="font-mono text-xs text-[var(--color-slate)] block mt-1">~9.30 mm (Round)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-12 text-center">
          <Link
            href="/diamonds/natural"
            className="inline-flex h-12 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 text-white font-mono text-xs uppercase tracking-[0.08em] hover:bg-[var(--color-slate)] transition-colors"
          >
            Apply Knowledge in Solitaire Search &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
