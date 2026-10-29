"use client";

import { useListing } from "@/components/catalog/ListingState";
import { RotateCcw, Sparkles, Zap } from "lucide-react";
import type { Shape, DiamondColor as Color, Clarity } from "@/lib/types/product";

const POPULAR_SHAPES: { label: string; value: Shape }[] = [
  { label: "Round", value: "ROUND" },
  { label: "Oval", value: "OVAL" },
  { label: "Emerald", value: "EMERALD" },
  { label: "Pear", value: "PEAR" },
  { label: "Cushion", value: "CUSHION" },
  { label: "Princess", value: "PRINCESS" },
  { label: "Radiant", value: "RADIANT" },
  { label: "Heart", value: "HEART" },
];

const CARAT_RANGES = [
  { label: "All Carats", min: undefined, max: undefined },
  { label: "1.00+ ct", min: 1.0, max: undefined },
  { label: "1.50+ ct", min: 1.5, max: undefined },
  { label: "2.00+ ct", min: 2.0, max: undefined },
  { label: "2.50+ ct", min: 2.5, max: undefined },
];

const COLORS: Color[] = ["D", "E", "F", "G", "H"];
const CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"];

export function FilterPanel() {
  const { query, update, clearAll } = useListing();

  const selectedShapes = query.shape ?? [];
  const selectedColors = query.color ?? [];
  const selectedClarities = query.clarity ?? [];
  const isQuickShip = query.quickShip === true;

  function toggleShape(shape: Shape) {
    const next = selectedShapes.includes(shape)
      ? selectedShapes.filter((s) => s !== shape)
      : [...selectedShapes, shape];
    update({ shape: next.length ? next : undefined });
  }

  function toggleColor(color: Color) {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    update({ color: next.length ? next : undefined });
  }

  function toggleClarity(clarity: Clarity) {
    const next = selectedClarities.includes(clarity)
      ? selectedClarities.filter((c) => c !== clarity)
      : [...selectedClarities, clarity];
    update({ clarity: next.length ? next : undefined });
  }

  const hasFilters =
    selectedShapes.length > 0 ||
    selectedColors.length > 0 ||
    selectedClarities.length > 0 ||
    query.minCarat !== undefined ||
    isQuickShip;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
            Atelier Diamond Filters
          </h3>
        </div>

        {hasFilters && clearAll && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate hover:text-ink hover:bg-stone transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" /> Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Shape Pills */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate block font-mono">
            Shape
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SHAPES.map((shape) => {
              const active = selectedShapes.includes(shape.value);
              return (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => toggleShape(shape.value)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 bg-ink text-white shadow-xs"
                      : "border border-line bg-stone text-ink hover:border-slate hover:bg-surface"
                  }`}
                >
                  {shape.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carat Quick Ranges */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate block font-mono">
            Carat Weight
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CARAT_RANGES.map((range) => {
              const active = query.minCarat === range.min;
              return (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => update({ minCarat: range.min })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 bg-ink text-white shadow-xs"
                      : "border border-line bg-stone text-ink hover:border-slate hover:bg-surface"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Grade */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate block font-mono">
            Colour Grade
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map((color) => {
              const active = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={`rounded-lg min-w-8 py-1 text-xs font-semibold text-center transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 bg-ink text-white shadow-xs"
                      : "border border-line bg-stone text-ink hover:border-slate hover:bg-surface"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clarity & Quick Ship */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate block font-mono">
            Clarity &amp; Speed
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CLARITIES.map((clarity) => {
              const active = selectedClarities.includes(clarity);
              return (
                <button
                  key={clarity}
                  type="button"
                  onClick={() => toggleClarity(clarity)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 bg-ink text-white shadow-xs"
                      : "border border-line bg-stone text-ink hover:border-slate hover:bg-surface"
                  }`}
                >
                  {clarity}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => update({ quickShip: isQuickShip ? undefined : true })}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                isQuickShip
                  ? "bg-ok text-white shadow-xs"
                  : "border border-line bg-stone text-ink hover:border-ok hover:bg-surface"
              }`}
            >
              <Zap className="size-3" /> Quick-Ship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;