"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface RangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Optional label displayed above the slider */
  label?: string;
  /** Optional formatted value display (e.g. "1.50 ct - 3.20 ct") */
  valueDisplay?: React.ReactNode;
}

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, label, valueDisplay, value, defaultValue, ...props }, ref) => {
  // Determine how many thumbs to render based on value or defaultValue array length
  const activeValues = value || defaultValue || [0];
  const thumbCount = Array.isArray(activeValues) ? activeValues.length : 1;

  return (
    <div className="w-full space-y-2 select-none">
      {(label || valueDisplay) && (
        <div className="flex items-center justify-between text-xs tracking-[0.06em]">
          {label && (
            <span className="font-medium uppercase text-[var(--color-ink)]">
              {label}
            </span>
          )}
          {valueDisplay && (
            <span className="font-mono text-[var(--color-slate)]">
              {valueDisplay}
            </span>
          )}
        </div>
      )}

      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "relative flex w-full touch-none select-none items-center py-2 cursor-pointer",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden bg-[var(--color-line)] rounded-none">
          <SliderPrimitive.Range className="absolute h-full bg-[var(--color-ink)]" />
        </SliderPrimitive.Track>

        {Array.from({ length: thumbCount }).map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block h-4 w-4 rounded-none border border-[var(--color-ink)] bg-white shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-loupe)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label={label ? `${label} handle ${index + 1}` : `Slider handle ${index + 1}`}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;
