"use client";

import * as React from "react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { SHAPES } from "@/lib/catalog-labels";
import type { Shape } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

interface ShapeSelectorProps {
  selectedShapes: Shape[];
  onToggleShape: (shape: Shape) => void;
  className?: string;
}

/**
 * Visual diamond shape selector with precision SVG facet silhouettes.
 * Allows multi-shape facet filtering for collectors and buyers.
 */
export function ShapeSelector({
  selectedShapes,
  onToggleShape,
  className,
}: ShapeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs tracking-[0.06em]">
        <span className="font-medium uppercase text-[var(--color-ink)]">
          Diamond Silhouette
        </span>
        {selectedShapes.length > 0 && (
          <span className="text-[11px] font-mono text-[var(--color-slate)]">
            {`${selectedShapes.length} selected`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {SHAPES.map((item) => {
          const isSelected = selectedShapes.includes(item.value);

          let buttonClasses = "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-ink)] hover:bg-[var(--color-stone)]";
          let iconClasses = "text-[var(--color-ink)]";

          if (isSelected) {
            buttonClasses = "border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-sm";
            iconClasses = "text-white";
          }

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleShape(item.value)}
              className={cn(
                "group flex flex-col items-center justify-center p-2.5 border rounded-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-loupe)] select-none",
                buttonClasses
              )}
            >
              <ShapeIcon
                shape={item.value}
                detailed
                className={cn("size-8 transition-transform group-hover:scale-105", iconClasses)}
              />
              <span className="mt-1.5 text-[11px] font-medium tracking-[0.04em] truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
