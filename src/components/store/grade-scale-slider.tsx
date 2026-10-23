"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { DiamondColor, Clarity, CutGrade } from "@/lib/types/catalog";
import { COLORS, CLARITIES, CUTS } from "@/lib/catalog-labels";

interface ColorScaleProps {
  selectedColors: DiamondColor[];
  onToggleColor: (color: DiamondColor) => void;
  className?: string;
}

export function ColorScaleSelector({
  selectedColors,
  onToggleColor,
  className,
}: ColorScaleProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs tracking-[0.06em]">
        <span className="font-medium uppercase text-[var(--color-ink)]">
          Color Grade
        </span>
        <span className="text-[11px] text-[var(--color-muted)]">
          D (Colorless) &rarr; K (Warm)
        </span>
      </div>

      <div className="grid grid-cols-8 gap-1 border border-[var(--color-line)] p-1 bg-white">
        {COLORS.map((item) => {
          const isSelected = selectedColors.includes(item.value);

          let buttonStyle = "bg-transparent text-[var(--color-slate)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)]";
          if (isSelected) {
            buttonStyle = "bg-[var(--color-ink)] text-white font-semibold";
          }

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleColor(item.value)}
              className={cn(
                "h-9 flex items-center justify-center text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-loupe)]",
                buttonStyle
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ClarityScaleProps {
  selectedClarities: Clarity[];
  onToggleClarity: (clarity: Clarity) => void;
  className?: string;
}

export function ClarityScaleSelector({
  selectedClarities,
  onToggleClarity,
  className,
}: ClarityScaleProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs tracking-[0.06em]">
        <span className="font-medium uppercase text-[var(--color-ink)]">
          Clarity Grade
        </span>
        <span className="text-[11px] text-[var(--color-muted)]">
          FL (Flawless) &rarr; SI2 (Slightly Included)
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 border border-[var(--color-line)] p-1 bg-white">
        {CLARITIES.map((item) => {
          const isSelected = selectedClarities.includes(item.value);

          let buttonStyle = "bg-transparent text-[var(--color-slate)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)]";
          if (isSelected) {
            buttonStyle = "bg-[var(--color-ink)] text-white font-semibold";
          }

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleClarity(item.value)}
              className={cn(
                "h-9 flex items-center justify-center text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-loupe)]",
                buttonStyle
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CutSelectorProps {
  selectedCuts: CutGrade[];
  onToggleCut: (cut: CutGrade) => void;
  className?: string;
}

export function CutSelector({
  selectedCuts,
  onToggleCut,
  className,
}: CutSelectorProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs tracking-[0.06em]">
        <span className="font-medium uppercase text-[var(--color-ink)]">
          Cut Quality
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 border border-[var(--color-line)] p-1 bg-white">
        {CUTS.map((item) => {
          const isSelected = selectedCuts.includes(item.value);

          let buttonStyle = "bg-transparent text-[var(--color-slate)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)]";
          if (isSelected) {
            buttonStyle = "bg-[var(--color-ink)] text-white font-semibold";
          }

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleCut(item.value)}
              className={cn(
                "h-9 flex items-center justify-center text-xs uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-loupe)]",
                buttonStyle
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
