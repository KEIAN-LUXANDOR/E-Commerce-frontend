"use client";

/**
 * four-cs-breakdown.tsx
 *
 * Editorial 4Cs panel displayed on the diamond PDP below the buy box.
 *
 * Presents Cut, Colour, Clarity and Carat weight as four vertically stacked
 * sections, each showing:
 *   – The grade or value in large serif type.
 *   – A visual scale bar showing where this diamond sits in the GIA range.
 *   – A short human-readable description of what the grade means.
 *
 * Also shows advanced metrology in a collapsible "Proportions & Finish" section
 * (table %, depth %, L/W ratio, polish, symmetry, fluorescence, measurements,
 * girdle and culet).
 *
 * Design contract:
 *   - Pure-white canvas, hairline lines (--color-line), no rounded corners.
 *   - No nested ternaries.
 */

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CutGrade, DiamondColor, Clarity, Fluorescence } from "@/lib/types/catalog";

// ---------------------------------------------------------------------------
// Scale configs
// ---------------------------------------------------------------------------

const COLOR_SCALE: DiamondColor[] = ["D", "E", "F", "G", "H", "I", "J", "K"];
const CLARITY_SCALE: Clarity[] = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const CUT_SCALE: CutGrade[] = ["EXCELLENT", "VERY_GOOD", "GOOD"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cutLabel(g: CutGrade): string {
  if (g === "EXCELLENT") return "Excellent";
  if (g === "VERY_GOOD") return "Very Good";
  return "Good";
}

function fluoLabel(f: Fluorescence): string {
  if (f === "NONE") return "None";
  if (f === "FAINT") return "Faint";
  if (f === "MEDIUM") return "Medium";
  return "Strong";
}

function colorDescription(c: DiamondColor): string {
  if ("DEF".includes(c)) {
    return "Colourless — the highest grade. No colour detectable even under magnification.";
  }
  if ("GH".includes(c)) {
    return "Near-colourless. The faintest trace of warmth, invisible when the stone is mounted.";
  }
  return "Faint warmth visible when compared side-by-side with a colourless stone. Flattering in yellow or rose gold.";
}

function clarityDescription(c: Clarity): string {
  if (c === "FL" || c === "IF") {
    return "Flawless or internally flawless — no inclusions visible even under 10× magnification.";
  }
  if (c === "VVS1" || c === "VVS2") {
    return "Very, very slightly included — minute inclusions that are extremely difficult to see under 10× magnification.";
  }
  if (c === "VS1" || c === "VS2") {
    return "Very slightly included — minor inclusions ranging from difficult to somewhat easy to see under 10× magnification.";
  }
  return "Slightly included — inclusions are noticeable under 10× magnification but are not visible to the naked eye face-up.";
}

function cutDescription(g: CutGrade): string {
  if (g === "EXCELLENT") {
    return "Maximum brilliance and fire. The stone reflects almost all light entering through the table.";
  }
  if (g === "VERY_GOOD") {
    return "Very bright, with minor deviations from ideal proportions. Excellent value.";
  }
  return "Reflects most light. Chosen by those who prioritise carat weight over maximum brightness.";
}

// ---------------------------------------------------------------------------
// Sub-component: Scale Bar
// ---------------------------------------------------------------------------

interface ScaleBarProps<T extends string> {
  scale: T[];
  active: T;
  leftLabel: string;
  rightLabel: string;
}

function ScaleBar<T extends string>({ scale, active, leftLabel, rightLabel }: ScaleBarProps<T>) {
  const activeIndex = scale.indexOf(active);

  return (
    <div className="mt-3">
      <div className="flex gap-0.5">
        {scale.map((item, i) => {
          const isActive = item === active;
          const isPast = i < activeIndex;

          let segClass = "bg-[var(--color-line)]";
          if (isActive) segClass = "bg-[var(--color-ink)]";
          if (isPast) segClass = "bg-[var(--color-slate)]/40";

          return (
            <div
              key={item}
              className={cn("flex-1 h-1 transition-colors", segClass)}
              title={item}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[9px] text-[var(--color-muted)] uppercase tracking-[0.06em]">
          {leftLabel}
        </span>
        <span className="font-mono text-[9px] text-[var(--color-muted)] uppercase tracking-[0.06em]">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: 4C Card
// ---------------------------------------------------------------------------

interface FourCCardProps {
  /** Short label, e.g. "Cut" */
  category: string;
  /** Large displayed grade, e.g. "Excellent" or "VVS1" */
  grade: string;
  description: string;
  scale: React.ReactNode;
}

function FourCCard({ category, grade, description, scale }: FourCCardProps) {
  return (
    <div className="py-5 border-b border-[var(--color-line)] last:border-b-0">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-slate)] w-14 flex-shrink-0">
          {category}
        </span>
        <span className="font-serif text-xl text-[var(--color-ink)]">{grade}</span>
      </div>
      <p className="text-[12px] text-[var(--color-slate)] leading-relaxed pl-[68px]">
        {description}
      </p>
      <div className="pl-[68px]">{scale}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Metrology row
// ---------------------------------------------------------------------------

function MetrologyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-[var(--color-line)] last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--color-slate)]">
        {label}
      </span>
      <span className="font-mono text-[12px] text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props & main export
// ---------------------------------------------------------------------------

interface FourCsBreakdownProps {
  carat: number;
  color: DiamondColor;
  clarity: Clarity;
  cut: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  tablePct: number;
  depthPct: number;
  lwRatio: number;
  girdle: string;
  culet: string;
  measurements: { lengthMm: number; widthMm: number; depthMm: number };
  className?: string;
}

export function FourCsBreakdown({
  carat,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  tablePct,
  depthPct,
  lwRatio,
  girdle,
  culet,
  measurements,
  className,
}: FourCsBreakdownProps) {
  const [metrologyOpen, setMetrologyOpen] = React.useState(false);
  const measurementStr = `${measurements.lengthMm} × ${measurements.widthMm} × ${measurements.depthMm} mm`;

  return (
    <section className={cn("border border-[var(--color-line)]", className)} aria-label="4Cs grading details">
      {/* Section header */}
      <div className="px-5 py-4 border-b border-[var(--color-line)] bg-[var(--color-stone)]">
        <h2 className="font-serif text-lg text-[var(--color-ink)]">4Cs Breakdown</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] mt-0.5">
          As reported by the grading laboratory
        </p>
      </div>

      <div className="px-5">
        {/* Cut */}
        <FourCCard
          category="Cut"
          grade={cutLabel(cut)}
          description={cutDescription(cut)}
          scale={
            <ScaleBar
              scale={CUT_SCALE}
              active={cut}
              leftLabel="Excellent"
              rightLabel="Good"
            />
          }
        />

        {/* Colour */}
        <FourCCard
          category="Colour"
          grade={color}
          description={colorDescription(color)}
          scale={
            <ScaleBar
              scale={COLOR_SCALE}
              active={color}
              leftLabel="D (Colourless)"
              rightLabel="K (Light)"
            />
          }
        />

        {/* Clarity */}
        <FourCCard
          category="Clarity"
          grade={clarity}
          description={clarityDescription(clarity)}
          scale={
            <ScaleBar
              scale={CLARITY_SCALE}
              active={clarity}
              leftLabel="FL (Flawless)"
              rightLabel="SI2"
            />
          }
        />

        {/* Carat */}
        <FourCCard
          category="Carat"
          grade={`${carat.toFixed(2)} ct`}
          description={`${carat.toFixed(2)} carats. One metric carat = 0.2 grams. The physical weight measured to two decimal places.`}
          scale={<div />}
        />
      </div>

      {/* Collapsible Proportions & Finish */}
      <div className="border-t border-[var(--color-line)]">
        <button
          type="button"
          onClick={() => setMetrologyOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-stone)] transition-colors"
          aria-expanded={metrologyOpen}
          aria-controls="metrology-panel"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink)]">
            Proportions &amp; Finish
          </span>
          {metrologyOpen ? (
            <ChevronUp className="size-4 text-[var(--color-slate)]" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4 text-[var(--color-slate)]" aria-hidden="true" />
          )}
        </button>

        {metrologyOpen && (
          <div id="metrology-panel" className="px-5 pb-5">
            <MetrologyRow label="Measurements" value={measurementStr} />
            <MetrologyRow label="Table %" value={`${tablePct}%`} />
            <MetrologyRow label="Total Depth %" value={`${depthPct}%`} />
            <MetrologyRow label="L/W Ratio" value={lwRatio.toFixed(2)} />
            <MetrologyRow label="Polish" value={cutLabel(polish)} />
            <MetrologyRow label="Symmetry" value={cutLabel(symmetry)} />
            <MetrologyRow label="Fluorescence" value={fluoLabel(fluorescence)} />
            <MetrologyRow label="Girdle" value={girdle} />
            <MetrologyRow label="Culet" value={culet} />
          </div>
        )}
      </div>
    </section>
  );
}
