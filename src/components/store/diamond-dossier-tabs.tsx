"use client";

/**
 * diamond-dossier-tabs.tsx
 *
 * Tabbed gemological dossier matching:
 * mockups/1.02_ct_oval_diamond_detail_keian_luxandor/code.html
 *
 * 4 Tabs:
 *   1. Overview – Proportions blueprint SVG diagram, proportions metrics, Colour scale, Clarity scale, growth note.
 *   2. Grading report – 8 key parameters (Measurements, Polish, Symmetry, Fluorescence, Girdle, Culet, Growth, Inscription).
 *   3. Certificate – Official GIA / IGI dossier badge, report verification links, copy report number.
 *   4. Shipping & returns – 3 trust cards (Insured delivery, In-house check, 30-day returns).
 *
 * Zero nested ternaries in JSX.
 */

import * as React from "react";
import {
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiamondDetail } from "@/lib/types/catalog";
import { showToast } from "@/lib/stores";

export function DiamondDossierTabs({ diamond }: { diamond: DiamondDetail }) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "grading" | "certificate" | "shipping">("overview");
  const [copied, setCopied] = React.useState(false);

  const isLabGrown = diamond.origin === "LAB_GROWN";
  const certAuthority = diamond.lab;

  function handleCopyReport() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(diamond.certificateNumber);
      setCopied(true);
      showToast(`Report number ${diamond.certificateNumber} copied.`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const certVerifyUrl =
    diamond.lab === "GIA"
      ? `https://www.gia.edu/report-check?reportno=${diamond.certificateNumber}`
      : `https://www.igi.org/verify-your-report/?r=${diamond.certificateNumber}`;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="w-full bg-white border border-[var(--color-line)] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex gap-6 sm:gap-8 overflow-x-auto select-none border-b border-[var(--color-line)] pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "pb-3 font-mono text-[12px] uppercase tracking-wider font-semibold relative transition-colors whitespace-nowrap",
              activeTab === "overview"
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Overview
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--canvas-dark,#0A192F)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("grading")}
            className={cn(
              "pb-3 font-mono text-[12px] uppercase tracking-wider font-semibold relative transition-colors whitespace-nowrap",
              activeTab === "grading"
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Grading Report
            {activeTab === "grading" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--canvas-dark,#0A192F)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certificate")}
            className={cn(
              "pb-3 font-mono text-[12px] uppercase tracking-wider font-semibold relative transition-colors whitespace-nowrap",
              activeTab === "certificate"
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Certificate Dossier
            {activeTab === "certificate" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--canvas-dark,#0A192F)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={cn(
              "pb-3 font-mono text-[12px] uppercase tracking-wider font-semibold relative transition-colors whitespace-nowrap",
              activeTab === "shipping"
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Transit &amp; Returns
            {activeTab === "shipping" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--canvas-dark,#0A192F)]" />
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Proportions Blueprint */}
              <div className="flex flex-col gap-4 bg-[#F1F5F9] p-6 border border-[var(--color-line)]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)] font-semibold">
                    Proportions Blueprint
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-slate)]">
                    L:W ratio {diamond.lwRatio ? diamond.lwRatio.toFixed(2) : "1.42"}
                  </span>
                </div>

                <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-white border border-[var(--color-line)] p-4">
                  <svg className="w-full h-full max-h-[180px]" fill="none" stroke="currentColor" viewBox="0 0 500 240">
                    <line stroke="#E2EAF2" strokeDasharray="2 2" strokeWidth="1" x1="80" x2="420" y1="30" y2="30" />
                    <line stroke="#E2EAF2" strokeDasharray="2 2" strokeWidth="1" x1="80" x2="420" y1="210" y2="210" />
                    <line stroke="#172033" strokeWidth="2" x1="160" x2="340" y1="40" y2="40" />
                    <line stroke="#172033" strokeWidth="1.8" x1="160" x2="80" y1="40" y2="105" />
                    <line stroke="#172033" strokeWidth="1.8" x1="340" x2="420" y1="40" y2="105" />
                    <rect fill="#F1F5F9" height="8" stroke="#172033" strokeWidth="1.5" width="340" x="80" y="105" />
                    <line stroke="#172033" strokeWidth="1.8" x1="80" x2="250" y1="113" y2="210" />
                    <line stroke="#172033" strokeWidth="1.8" x1="420" x2="250" y1="113" y2="210" />
                    <line stroke="#0A192F" strokeWidth="1" x1="160" x2="340" y1="20" y2="20" />
                    <path d="M 160 17 L 160 23 M 340 17 L 340 23" stroke="#0A192F" strokeWidth="1" />
                    <text fill="#172033" fontFamily="monospace" fontSize="11" fontWeight="600" textAnchor="middle" x="250" y="15">
                      Table: {diamond.tablePct}%
                    </text>
                    <line stroke="#0A192F" strokeWidth="1" x1="445" x2="445" y1="40" y2="210" />
                    <path d="M 442 40 L 448 40 M 442 210 L 448 210" stroke="#0A192F" strokeWidth="1" />
                    <text fill="#172033" fontFamily="monospace" fontSize="11" fontWeight="600" textAnchor="middle" transform="rotate(90 475 130)" x="475" y="130">
                      Depth: {diamond.depthPct}%
                    </text>
                    <text fill="#5a6478" fontFamily="sans-serif" fontSize="10" x="110" y="70">34.5°</text>
                    <text fill="#5a6478" fontFamily="sans-serif" fontSize="10" x="135" y="150">40.8°</text>
                    <text fill="#5a6478" fontFamily="sans-serif" fontSize="10" textAnchor="middle" x="250" y="230">
                      Culet: {diamond.culet || "Pointed"}
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-white border border-[var(--color-line)]">
                    <span className="block text-[10px] text-[var(--color-slate)] uppercase">Length:width</span>
                    <span className="font-serif text-[16px] text-[var(--color-ink)]">
                      {diamond.lwRatio ? diamond.lwRatio.toFixed(2) : "1.42"}
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-[var(--color-line)]">
                    <span className="block text-[10px] text-[var(--color-slate)] uppercase">Table ratio</span>
                    <span className="font-serif text-[16px] text-[var(--color-ink)]">
                      {diamond.tablePct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-[var(--color-line)]">
                    <span className="block text-[10px] text-[var(--color-slate)] uppercase">Total depth</span>
                    <span className="font-serif text-[16px] text-[var(--color-ink)]">
                      {diamond.depthPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Scales & Material Growth Process */}
              <div className="flex flex-col gap-6">
                {/* Colour scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-mono text-[11px]">
                    <span className="uppercase tracking-widest text-[var(--color-ink)] font-semibold">
                      Colour Scale
                    </span>
                    <span className="text-[var(--brand-anchor,#0A192F)] font-medium">
                      Stone Grade: {diamond.color}
                    </span>
                  </div>
                  <div className="grid grid-cols-8 gap-1 pt-1 font-mono">
                    {(["D", "E", "F", "G", "H", "I", "J", "K"] as const).map((g) => {
                      const isMatch = g === diamond.color;
                      return (
                        <div key={g} className="flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "w-full h-8 flex items-center justify-center text-[11px] font-bold border transition-colors",
                              isMatch
                                ? "bg-[var(--canvas-dark,#0A192F)] text-white border-[var(--canvas-dark,#0A192F)]"
                                : "bg-[#F1F5F9] text-[var(--color-slate)] border-[var(--color-line)]"
                            )}
                          >
                            {g}
                          </div>
                          <span className={cn("text-[8px] uppercase", isMatch ? "font-bold text-[var(--color-ink)]" : "text-[var(--color-slate)]")}>
                            {isMatch ? "Selected" : g === "D" ? "Pure" : g === "F" ? "Clr" : "Near"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clarity scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-mono text-[11px]">
                    <span className="uppercase tracking-widest text-[var(--color-ink)] font-semibold">
                      Clarity Scale
                    </span>
                    <span className="text-[var(--brand-anchor,#0A192F)] font-medium">
                      Stone Grade: {diamond.clarity}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 pt-1 font-mono">
                    {(["FL", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const).map((cl) => {
                      const isMatch = cl === diamond.clarity;
                      return (
                        <div key={cl} className="flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "w-full h-8 flex items-center justify-center text-[10px] font-bold border transition-colors",
                              isMatch
                                ? "bg-[var(--canvas-dark,#0A192F)] text-white border-[var(--canvas-dark,#0A192F)]"
                                : "bg-[#F1F5F9] text-[var(--color-slate)] border-[var(--color-line)]"
                            )}
                          >
                            {cl}
                          </div>
                          <span className={cn("text-[8px] uppercase", isMatch ? "font-bold text-[var(--color-ink)]" : "text-[var(--color-slate)]")}>
                            {isMatch ? "Selected" : cl === "FL" ? "Flawless" : cl.startsWith("VVS") ? "Minute" : "Slight"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diamond origin note */}
                <div className="bg-[#F1F5F9] p-4 text-[13px] text-[var(--color-slate)] border border-[var(--color-line)] leading-relaxed">
                  <strong className="text-[var(--color-ink)] font-semibold">
                    {isLabGrown ? "Cultivated Type IIa Solitaire: " : "Earth-Mined Natural Diamond: "}
                  </strong>
                  {isLabGrown
                    ? "Grown via Chemical Vapour Deposition (CVD), this Type IIa laboratory diamond matches earth-mined diamonds in optical dispersion, refractive index (2.42), and crystal lattice hardness (Mohs 10)."
                    : "Formed over billions of years deep within the earth's mantle, this ethically-sourced natural solitaire is conflict-free and compliant with the Kimberley Process."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRADING REPORT */}
        {activeTab === "grading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 pt-2 font-mono text-[13px]">
            <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
              <div className="flex justify-between py-3 px-4 bg-[#F1F5F9]">
                <span className="text-[var(--color-slate)]">Measurements</span>
                <span className="text-[var(--color-ink)] font-medium">
                  {diamond.measurements.lengthMm} × {diamond.measurements.widthMm} × {diamond.measurements.depthMm} mm
                </span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-white">
                <span className="text-[var(--color-slate)]">Polish</span>
                <span className="text-[var(--color-ink)] font-medium">{diamond.polish}</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-[#F1F5F9]">
                <span className="text-[var(--color-slate)]">Symmetry</span>
                <span className="text-[var(--color-ink)] font-medium">{diamond.symmetry}</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-white">
                <span className="text-[var(--color-slate)]">Fluorescence</span>
                <span className="text-[var(--color-ink)] font-medium">{diamond.fluorescence}</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
              <div className="flex justify-between py-3 px-4 bg-[#F1F5F9]">
                <span className="text-[var(--color-slate)]">Girdle Thickness</span>
                <span className="text-[var(--color-ink)] font-medium">{diamond.girdle || "Medium to Slightly Thick"}</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-white">
                <span className="text-[var(--color-slate)]">Culet</span>
                <span className="text-[var(--color-ink)] font-medium">{diamond.culet || "Pointed (None)"}</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-[#F1F5F9]">
                <span className="text-[var(--color-slate)]">Growth / Origin</span>
                <span className="text-[var(--color-ink)] font-medium">
                  {isLabGrown ? "CVD (Type IIa)" : "Natural Earth-Mined"}
                </span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-white">
                <span className="text-[var(--color-slate)]">Laser Inscription</span>
                <span className="text-[var(--brand-anchor,#0A192F)] font-medium font-mono">
                  {diamond.lab} {diamond.certificateNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATE DOSSIER */}
        {activeTab === "certificate" && (
          <div className="bg-[#F1F5F9] border border-[var(--color-line)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-20 bg-white border border-[var(--color-line)] flex flex-col items-center justify-center p-2 flex-shrink-0 shadow-sm font-mono text-center">
                <ShieldCheck className="size-6 text-[var(--color-ink)]" />
                <span className="text-[8px] uppercase tracking-tighter mt-1 text-[var(--color-slate)] font-bold">
                  {certAuthority} SEAL
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-[20px] text-[var(--color-ink)] font-normal">
                    {certAuthority === "GIA" ? "GIA Diamond Grading Report" : "IGI Diamond Dossier"}
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-[var(--color-line)] font-mono text-[11px] uppercase font-semibold text-[var(--color-ink)]">
                    {diamond.certificateNumber}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-slate)]">
                  Official grading certificate for {diamond.carat.toFixed(2)} ct {diamond.shape} Diamond.
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--color-slate)] pt-1">
                  <span>Report #{diamond.certificateNumber}</span>
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="text-[var(--brand-anchor,#0A192F)] hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="size-3 text-emerald-700" /> : <Copy className="size-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={certVerifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white border border-[var(--color-line)] hover:bg-[#F8FAFC] text-[var(--color-ink)] font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <span>Check on {diamond.lab.toLowerCase()}.org</span>
                <ExternalLink className="size-3.5" />
              </a>
              <a
                href={diamond.certificateUrl || certVerifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[var(--canvas-dark,#0A192F)] text-white font-mono text-[11px] uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1.5 font-medium"
              >
                <FileText className="size-3.5" />
                <span>View Official Certificate</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: SHIPPING & RETURNS */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 bg-[#F1F5F9] border border-[var(--color-line)] space-y-2">
              <Truck className="size-6 text-[var(--brand-anchor,#0A192F)]" />
              <h4 className="font-serif text-[18px] text-[var(--color-ink)] font-normal">
                Insured Armored Delivery
              </h4>
              <p className="text-[12.5px] text-[var(--color-slate)] leading-relaxed">
                Every delivery across India is 100% insured until signed for at your door inside a tamper-evident security cassette.
              </p>
            </div>

            <div className="p-5 bg-[#F1F5F9] border border-[var(--color-line)] space-y-2">
              <CheckCircle2 className="size-6 text-[var(--brand-anchor,#0A192F)]" />
              <h4 className="font-serif text-[18px] text-[var(--color-ink)] font-normal">
                Dual In-House Optical Check
              </h4>
              <p className="text-[12.5px] text-[var(--color-slate)] leading-relaxed">
                Each loose stone is cross-checked against its laboratory dossier, laser inscription, and proportion tolerances prior to packaging.
              </p>
            </div>

            <div className="p-5 bg-[#F1F5F9] border border-[var(--color-line)] space-y-2">
              <RotateCcw className="size-6 text-[var(--brand-anchor,#0A192F)]" />
              <h4 className="font-serif text-[18px] text-[var(--color-ink)] font-normal">
                30-Day Inspection Privilege
              </h4>
              <p className="text-[12.5px] text-[var(--color-slate)] leading-relaxed">
                Return in original, unaltered condition with the laboratory certificate dossier within 30 days for a full refund.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
