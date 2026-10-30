
"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Image as ImageIcon,
  RotateCcw,
  SlidersHorizontal,
  Truck,
} from "lucide-react";

import { useListing } from "@/components/catalog/ListingState";
import { Dialog } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { countActiveFilters } from "@/lib/catalog/query";
import { cn } from "@/lib/utils";

import type {
  DiamondColor,
  Clarity,
  Cut,
  Finish,
  Fluorescence,
  Lab,
} from "@/lib/types/product";

const COLORS: readonly DiamondColor[] = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
];

const CLARITIES: readonly Clarity[] = [
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3",
];

const LABS: readonly Lab[] = ["GIA", "IGI", "HRD"];

const CUTS: readonly Cut[] = [
  "IDEAL", "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR",
];

const FINISHES: readonly Finish[] = [
  "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR",
];

const FLUORESCENCE: readonly Fluorescence[] = [
  "NONE", "FAINT", "MEDIUM", "STRONG", "VERY_STRONG",
];

function formatChoice(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatNumber(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

function FilterChip({
  active,
  children,
  onClick,
  className,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2",
        active
          ? "border-ink bg-ink text-white shadow-sm"
          : "border-line bg-white text-ink-secondary hover:border-brand-accent hover:bg-[var(--brand-accent-muted)] hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ChoiceGroup<T extends string>({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: readonly T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-accent">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <FilterChip
            key={value}
            active={selected.includes(value)}
            onClick={() => onToggle(value)}
          >
            {formatChoice(value)}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

interface NumberRangeFilterProps {
  label: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  domainMax: number;
  step: number;
  decimals: number;
  storageFactor?: number;
  onApply: (minimum?: number, maximum?: number) => void;
}

function NumberRangeFilter({
  label,
  unit,
  minValue,
  maxValue,
  domainMax,
  step,
  decimals,
  storageFactor = 1,
  onApply,
}: NumberRangeFilterProps) {
  const [minimum, setMinimum] = useState(
    minValue === undefined
      ? ""
      : formatNumber(minValue / storageFactor, decimals),
  );

  const [maximum, setMaximum] = useState(
    maxValue === undefined
      ? ""
      : formatNumber(maxValue / storageFactor, decimals),
  );

  const [error, setError] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState<"min" | "max">("max");

  // When the filter values change from outside (URL, "clear all"), reset the boxes during render
  // (derived state, no effect needed)
  const sourceKey = `${minValue ?? ""}|${maxValue ?? ""}|${storageFactor}|${decimals}`;
  const [syncedKey, setSyncedKey] = useState(sourceKey);
  if (syncedKey !== sourceKey) {
    setSyncedKey(sourceKey);
    setMinimum(minValue === undefined ? "" : formatNumber(minValue / storageFactor, decimals));
    setMaximum(maxValue === undefined ? "" : formatNumber(maxValue / storageFactor, decimals));
    setError(null);
  }

  const parsedMinimum =
    minimum.trim() === "" ? undefined : Number(minimum);

  const parsedMaximum =
    maximum.trim() === "" ? undefined : Number(maximum);

  const sliderMax = Math.max(
    domainMax,
    parsedMinimum !== undefined && Number.isFinite(parsedMinimum)
      ? parsedMinimum
      : domainMax,
    parsedMaximum !== undefined && Number.isFinite(parsedMaximum)
      ? parsedMaximum
      : domainMax,
  );

  const lowerValue = Math.min(
    sliderMax,
    Math.max(
      0,
      parsedMinimum !== undefined && Number.isFinite(parsedMinimum)
        ? parsedMinimum
        : 0,
    ),
  );

  const upperValue = Math.max(
    lowerValue,
    Math.min(
      sliderMax,
      parsedMaximum !== undefined && Number.isFinite(parsedMaximum)
        ? parsedMaximum
        : sliderMax,
    ),
  );

  const rangeWidth = Math.max(sliderMax, 1);
  const selectedLeft = (lowerValue / rangeWidth) * 100;
  const selectedWidth = ((upperValue - lowerValue) / rangeWidth) * 100;

  function handleMinimumSlider(value: number) {
    const next = Math.min(value, upperValue);
    setMinimum(next <= 0 ? "" : formatNumber(next, decimals));
    setError(null);
  }

  function handleMaximumSlider(value: number) {
    const next = Math.max(value, lowerValue);
    setMaximum(
      next >= sliderMax ? "" : formatNumber(next, decimals),
    );
    setError(null);
  }

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const min = minimum.trim() === "" ? undefined : Number(minimum);
    const max = maximum.trim() === "" ? undefined : Number(maximum);

    if (
      (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
      (max !== undefined && (!Number.isFinite(max) || max < 0))
    ) {
      setError("Enter valid, non-negative values.");
      return;
    }

    if (min !== undefined && max !== undefined && max < min) {
      setError("Maximum must be greater than or equal to minimum.");
      return;
    }

    const toStoredValue = (value: number | undefined) => {
      if (value === undefined) return undefined;

      return storageFactor === 1
        ? Number(value.toFixed(decimals))
        : Math.round(value * storageFactor);
    };

    onApply(toStoredValue(min), toStoredValue(max));
    setError(null);
  }

  return (
    <div className="min-w-0">
      <p className="mb-1 text-[11px] text-slate">
        Adjust the range or enter exact values.
      </p>

      <div className="relative mx-1 mb-4 mt-3 h-7">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />

        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-accent"
          style={{
            left: `${selectedLeft}%`,
            width: `${selectedWidth}%`,
          }}
        />

        <input
          className="catalog-range-input"
          type="range"
          min={0}
          max={upperValue}
          step={step}
          value={lowerValue}
          onChange={(event) =>
            handleMinimumSlider(Number(event.currentTarget.value))
          }
          onFocus={() => setActiveThumb("min")}
          onPointerDown={() => setActiveThumb("min")}
          aria-label={`Minimum ${label}`}
          aria-valuetext={`${lowerValue} ${unit}`}
          style={{ zIndex: activeThumb === "min" ? 6 : 4 }}
        />

        <input
          className="catalog-range-input"
          type="range"
          min={lowerValue}
          max={sliderMax}
          step={step}
          value={upperValue}
          onChange={(event) =>
            handleMaximumSlider(Number(event.currentTarget.value))
          }
          onFocus={() => setActiveThumb("max")}
          onPointerDown={() => setActiveThumb("max")}
          aria-label={`Maximum ${label}`}
          aria-valuetext={`${upperValue} ${unit}`}
          style={{ zIndex: activeThumb === "max" ? 6 : 5 }}
        />
      </div>

      <form onSubmit={handleApply}>
        <div className="grid grid-cols-2 gap-2">
          <label className="min-w-0">
            <span className="mb-1.5 block text-[10px] text-slate">
              Min ({unit})
            </span>

            <input
              type="number"
              min="0"
              step={step}
              inputMode={decimals > 0 ? "decimal" : "numeric"}
              value={minimum}
              onChange={(event) => {
                setMinimum(event.target.value);
                setError(null);
              }}
              placeholder="Any"
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-accent focus:ring-2 focus:ring-[rgba(82,109,137,0.15)]"
            />
          </label>

          <label className="min-w-0">
            <span className="mb-1.5 block text-[10px] text-slate">
              Max ({unit})
            </span>

            <input
              type="number"
              min="0"
              step={step}
              inputMode={decimals > 0 ? "decimal" : "numeric"}
              value={maximum}
              onChange={(event) => {
                setMaximum(event.target.value);
                setError(null);
              }}
              placeholder="Any"
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-accent focus:ring-2 focus:ring-[rgba(82,109,137,0.15)]"
            />
          </label>
        </div>

        <button
          type="submit"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "mt-3 w-full rounded-lg",
          )}
        >
          Apply range
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-xs text-out">
          {error}
        </p>
      )}

      <style jsx global>{`
        .catalog-range-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 28px;
          margin: 0;
          appearance: none;
          background: transparent;
          pointer-events: none;
          outline: none;
        }

        .catalog-range-input::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
        }

        .catalog-range-input::-moz-range-track {
          height: 6px;
          background: transparent;
        }

        .catalog-range-input::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          width: 16px;
          height: 16px;
          margin-top: -5px;
          border: 3px solid white;
          border-radius: 9999px;
          background: #0a192f;
          box-shadow: 0 0 0 1px #526d89, 0 2px 6px rgba(10, 25, 47, 0.18);
          cursor: grab;
        }

        .catalog-range-input::-moz-range-thumb {
          pointer-events: auto;
          width: 11px;
          height: 11px;
          border: 3px solid white;
          border-radius: 9999px;
          background: #0a192f;
          box-shadow: 0 0 0 1px #526d89, 0 2px 6px rgba(10, 25, 47, 0.18);
          cursor: grab;
        }

        .catalog-range-input:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(82, 109, 137, 0.25);
        }

        .catalog-range-input:focus-visible::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(82, 109, 137, 0.25);
        }
      `}</style>
    </div>
  );
}

function FilterControls({ compact = false }: { compact?: boolean }) {
  const { query, update, clearAll, isPending } = useListing();

  const selectedColors = query.color ?? [];
  const selectedClarities = query.clarity ?? [];
  const selectedLabs = query.lab ?? [];
  const selectedCuts = query.cut ?? [];
  const selectedPolish = query.polish ?? [];
  const selectedSymmetry = query.symmetry ?? [];
  const selectedFluorescence = query.fluorescence ?? [];

  const activeCount = countActiveFilters(query);

  function toggleValue<T extends string>(
    current: readonly T[],
    value: T,
  ): T[] | undefined {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    return next.length ? next : undefined;
  }

  return (
    <div
      className={cn(
        "min-w-0 bg-white",
        compact
          ? "rounded-xl"
          : "rounded-2xl border border-line shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-b border-line px-4 py-4",
          compact && "px-0 pt-0",
        )}
      >
        {!compact ? (
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-[var(--brand-accent-muted)] text-brand-accent">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="font-serif text-lg font-medium text-ink">
                Refine selection
              </h2>
              <p className="mt-0.5 text-[10px] text-slate">
                Find the right diamond.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-ink">Your filters</p>
            <p className="mt-0.5 text-[10px] text-slate">
              {activeCount} active
            </p>
          </div>
        )}

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold text-brand-accent transition-colors hover:bg-[var(--brand-accent-muted)] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>

      {isPending && (
        <p
          role="status"
          className="border-b border-line px-4 py-2 text-[10px] text-brand-accent"
        >
          Updating diamonds…
        </p>
      )}

      <Accordion
        type="multiple"
        defaultValue={["carat", "price"]}
        className="px-4"
      >
        <AccordionItem value="carat" className="border-line">
          <AccordionTrigger className="py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Carat weight
          </AccordionTrigger>

          <AccordionContent>
            <NumberRangeFilter
              label="carat weight"
              unit="ct"
              minValue={query.minCarat}
              maxValue={query.maxCarat}
              domainMax={10}
              step={0.01}
              decimals={2}
              onApply={(minimum, maximum) =>
                update({
                  minCarat: minimum,
                  maxCarat: maximum,
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-line">
          <AccordionTrigger className="py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Price range
          </AccordionTrigger>

          <AccordionContent>
            <NumberRangeFilter
              label="price"
              unit="$"
              minValue={query.minPrice}
              maxValue={query.maxPrice}
              domainMax={10_000_000}
              step={1_000}
              decimals={0}
              storageFactor={100}
              onApply={(minimum, maximum) =>
                update({
                  minPrice: minimum,
                  maxPrice: maximum,
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colour" className="border-line">
          <AccordionTrigger className="py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Colour grade
          </AccordionTrigger>

          <AccordionContent>
            <ChoiceGroup
              label="Select colour"
              values={COLORS}
              selected={selectedColors}
              onToggle={(value) =>
                update({
                  color: toggleValue(selectedColors, value),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clarity" className="border-line">
          <AccordionTrigger className="py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Clarity grade
          </AccordionTrigger>

          <AccordionContent>
            <ChoiceGroup
              label="Select clarity"
              values={CLARITIES}
              selected={selectedClarities}
              onToggle={(value) =>
                update({
                  clarity: toggleValue(selectedClarities, value),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border-line">
          <AccordionTrigger className="py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Advanced filters
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-5">
              <ChoiceGroup
                label="Certification laboratory"
                values={LABS}
                selected={selectedLabs}
                onToggle={(value) =>
                  update({
                    lab: toggleValue(selectedLabs, value),
                  })
                }
              />

              <ChoiceGroup
                label="Cut grade"
                values={CUTS}
                selected={selectedCuts}
                onToggle={(value) =>
                  update({
                    cut: toggleValue(selectedCuts, value),
                  })
                }
              />

              <ChoiceGroup
                label="Polish"
                values={FINISHES}
                selected={selectedPolish}
                onToggle={(value) =>
                  update({
                    polish: toggleValue(selectedPolish, value),
                  })
                }
              />

              <ChoiceGroup
                label="Symmetry"
                values={FINISHES}
                selected={selectedSymmetry}
                onToggle={(value) =>
                  update({
                    symmetry: toggleValue(selectedSymmetry, value),
                  })
                }
              />

              <ChoiceGroup
                label="Fluorescence"
                values={FLUORESCENCE}
                selected={selectedFluorescence}
                onToggle={(value) =>
                  update({
                    fluorescence: toggleValue(
                      selectedFluorescence,
                      value,
                    ),
                  })
                }
              />

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-accent">
                  Availability
                </p>

                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={query.quickShip === true}
                    onClick={() =>
                      update({
                        quickShip: query.quickShip ? undefined : true,
                      })
                    }
                  >
                    <Truck className="size-3.5" aria-hidden="true" />
                    Quick ship
                  </FilterChip>

                  <FilterChip
                    active={query.withImage === true}
                    onClick={() =>
                      update({
                        withImage: query.withImage ? undefined : true,
                      })
                    }
                  >
                    <ImageIcon className="size-3.5" aria-hidden="true" />
                    With images
                  </FilterChip>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function FilterPanel() {
  const { query, totalItems } = useListing();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = countActiveFilters(query);

  return (
    <>
      <div className="min-w-0">
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full justify-between rounded-xl normal-case tracking-normal",
            )}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal
                className="size-4 text-brand-accent"
                aria-hidden="true"
              />
              Filters
            </span>

            <span className="inline-flex items-center gap-2">
              {activeCount > 0 && (
                <span className="grid size-6 place-items-center rounded-full bg-ink text-[10px] font-semibold text-white">
                  {activeCount}
                </span>
              )}

              <span className="text-[11px] text-slate">
                Refine results
              </span>
            </span>
          </button>
        </div>

        {/* Natural height: the panel grows with expanded filters. */}
        <aside className="hidden min-w-0 lg:sticky lg:top-24 lg:block">
          <FilterControls />
        </aside>
      </div>

      <Dialog
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Refine diamonds"
        side="left"
        footer={
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full",
            )}
          >
            View {(totalItems ?? 0).toLocaleString("en-IN")} diamonds
          </button>
        }
      >
        <FilterControls compact />
      </Dialog>
    </>
  );
}

export default FilterPanel;
