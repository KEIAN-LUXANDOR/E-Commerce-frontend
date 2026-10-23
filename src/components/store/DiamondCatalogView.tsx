"use client";

/**
 * DiamondCatalogView.tsx
 *
 * Certified Diamond Catalog view matching:
 * mockups/shop_certified_diamonds_keian_luxandor/code.html
 *
 * Features:
 *   - Overview Hero with archival badges & editorial headings
 *   - Sticky Filter Sidebar (15.5rem wide):
 *       1. Inventory Type segmented badges with live counts
 *       2. 5x2 Geometric Shape selector with SVG vector outlines
 *       3. Carat dual range inputs & slider
 *       4. Price Range (INR) preset buttons (Under ₹1L, ₹1–3L, ₹3–6L, ₹6–15L, >₹15L) + dual inputs
 *       5. Colour segmented toggle scale (D through K)
 *       6. Clarity segmented toggle scale (FL through SI2)
 *       7. Cut Grade toggle buttons (Ideal/Ex, Very Good, Good)
 *       8. Advanced Gemology accordion (Fluorescence, Authority, Polish, Symmetry)
 *       9. Reset all filters button
 *   - Results Toolbar:
 *       - Live count, active filter chips with removal ×, clear all
 *       - Sort dropdown + Grid / Table view toggle
 *   - Zero nested ternaries in JSX
 */

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { DiamondCard } from "@/components/store/diamond-card";
import { DiamondTable } from "@/components/store/diamond-table";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useDiamondFilters } from "@/hooks/use-diamond-filters";
import { formatINR } from "@/lib/format";
import type { DiamondSummary, Shape, DiamondColor, Clarity, CutGrade, Origin } from "@/lib/types/catalog";
import { LayoutGrid, List, SlidersHorizontal, RotateCcw, X, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shape Definitions with SVG icons matching the mockup
// ---------------------------------------------------------------------------

interface ShapeOption {
  shape: Shape;
  label: string;
  renderIcon: () => React.ReactNode;
}

const SHAPE_OPTIONS: ShapeOption[] = [
  {
    shape: "ROUND",
    label: "Round",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" strokeDasharray="1 1" />
        <line x1="12" x2="12" y1="3" y2="7.5" />
        <line x1="12" x2="12" y1="16.5" y2="21" />
        <line x1="3" x2="7.5" y1="12" y2="12" />
        <line x1="16.5" x2="21" y1="12" y2="12" />
      </svg>
    ),
  },
  {
    shape: "OVAL",
    label: "Oval",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="6.5" ry="9" />
        <ellipse cx="12" cy="12" rx="3" ry="4.5" strokeDasharray="1 1" />
      </svg>
    ),
  },
  {
    shape: "PRINCESS",
    label: "Princ",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect height="14" width="14" x="5" y="5" />
        <line x1="5" x2="19" y1="5" y2="19" />
        <line x1="19" x2="5" y1="5" y2="19" />
      </svg>
    ),
  },
  {
    shape: "CUSHION",
    label: "Cush",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect height="14" rx="4" width="14" x="5" y="5" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
  {
    shape: "EMERALD",
    label: "Emer",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon points="7,4 17,4 20,7 20,17 17,20 7,20 4,17 4,7" />
        <rect height="10" width="8" x="8" y="7" />
      </svg>
    ),
  },
  {
    shape: "PEAR",
    label: "Pear",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 4 C12 4, 6 12, 6 16 A 6 6 0 0 0 18 16 C 18 12, 12 4, 12 4 Z" />
      </svg>
    ),
  },
  {
    shape: "RADIANT",
    label: "Radi",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon points="6,4 18,4 20,6 20,18 18,20 6,20 4,18 4,6" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    shape: "MARQUISE",
    label: "Marq",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 3 C17 8 19 16 12 21 C5 16 7 8 12 3 Z" />
      </svg>
    ),
  },
  {
    shape: "ASSCHER",
    label: "Asch",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon points="7,4 17,4 20,7 20,17 17,20 7,20 4,17 4,7" />
        <polygon points="9,7 15,7 17,9 17,15 15,17 9,17 7,15 7,9" />
      </svg>
    ),
  },
  {
    shape: "HEART",
    label: "Heart",
    renderIcon: () => (
      <svg className="w-5 h-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 20 L5.5 13.5 C4 12 3 10.5 3 8.5 C3 5.5 5.5 3.5 8.5 3.5 C10.2 3.5 11.5 4.5 12 5.5 C12.5 4.5 13.8 3.5 15.5 3.5 C18.5 3.5 21 5.5 21 8.5 C21 10.5 20 12 18.5 13.5 Z" />
      </svg>
    ),
  },
];

const COLOR_LIST: DiamondColor[] = ["D", "E", "F", "G", "H", "I", "J", "K"];
const CLARITY_LIST: Clarity[] = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

interface DiamondCatalogViewProps {
  initialDiamonds: DiamondSummary[];
  title: string;
  description: string;
  originLock?: Origin;
  totalCount?: number;
}

export function DiamondCatalogView({
  initialDiamonds,
  title,
  description,
  originLock,
  totalCount,
}: DiamondCatalogViewProps) {
  const { filters, updateFilters, clearAllFilters } = useDiamondFilters();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Client-side filtering over dataset
  const filteredDiamonds = React.useMemo(() => {
    return initialDiamonds.filter((diamond) => {
      // Origin check
      const effectiveOrigin = originLock || (filters.origins.length > 0 ? filters.origins[0] : undefined);
      if (effectiveOrigin && diamond.origin !== effectiveOrigin) {
        return false;
      }

      // Shape check
      if (filters.shapes.length > 0 && !filters.shapes.includes(diamond.shape)) {
        return false;
      }

      // Color check
      if (filters.colors.length > 0 && !filters.colors.includes(diamond.color)) {
        return false;
      }

      // Clarity check
      if (filters.clarities.length > 0 && !filters.clarities.includes(diamond.clarity)) {
        return false;
      }

      // Cut check
      if (filters.cuts.length > 0 && !filters.cuts.includes(diamond.cut)) {
        return false;
      }

      // Carat check
      if (filters.caratMin !== undefined && diamond.carat < filters.caratMin) {
        return false;
      }
      if (filters.caratMax !== undefined && diamond.carat > filters.caratMax) {
        return false;
      }

      // Price check (paise)
      if (filters.minPrice !== undefined && diamond.pricePaise < filters.minPrice * 100) {
        return false;
      }
      if (filters.maxPrice !== undefined && diamond.pricePaise > filters.maxPrice * 100) {
        return false;
      }

      return true;
    });
  }, [initialDiamonds, originLock, filters]);

  // Sorting
  const sortedDiamonds = React.useMemo(() => {
    const list = [...filteredDiamonds];
    if (filters.sort === "price_asc") {
      list.sort((a, b) => a.pricePaise - b.pricePaise);
    } else if (filters.sort === "price_desc") {
      list.sort((a, b) => b.pricePaise - a.pricePaise);
    } else if (filters.sort === "carat_desc") {
      list.sort((a, b) => b.carat - a.carat);
    } else if (filters.sort === "carat_asc") {
      list.sort((a, b) => a.carat - b.carat);
    }
    return list;
  }, [filteredDiamonds, filters.sort]);

  const activeCount = sortedDiamonds.length;
  const countDisplay = totalCount !== undefined ? totalCount : activeCount;

  // Toggle handlers
  const handleToggleShape = (shape: Shape) => {
    const next = filters.shapes.includes(shape)
      ? filters.shapes.filter((s) => s !== shape)
      : [...filters.shapes, shape];
    updateFilters({ shapes: next });
  };

  const handleToggleColor = (color: DiamondColor) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    updateFilters({ colors: next });
  };

  const handleToggleClarity = (clarity: Clarity) => {
    const next = filters.clarities.includes(clarity)
      ? filters.clarities.filter((c) => c !== clarity)
      : [...filters.clarities, clarity];
    updateFilters({ clarities: next });
  };

  const handleToggleCut = (cut: CutGrade) => {
    const next = filters.cuts.includes(cut)
      ? filters.cuts.filter((c) => c !== cut)
      : [...filters.cuts, cut];
    updateFilters({ cuts: next });
  };

  const handlePricePreset = (min: number | undefined, max: number | undefined) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const hasActiveFilters =
    filters.shapes.length > 0 ||
    filters.colors.length > 0 ||
    filters.clarities.length > 0 ||
    filters.cuts.length > 0 ||
    filters.caratMin !== undefined ||
    filters.caratMax !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  // Inventory count badges
  const labCount = initialDiamonds.filter((d) => d.origin === "LAB_GROWN").length;
  const naturalCount = initialDiamonds.filter((d) => d.origin === "NATURAL").length;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[var(--color-ink)]">
      {/* 1. Archival Dossier Top Bar & Breadcrumb Matrix */}
      <section className="w-full bg-[#F1F5F9] border-b border-[var(--color-line)] px-6 md:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[var(--color-slate)]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--color-ink)] transition-colors">All diamonds</Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">{title}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-600 inline-block"></span>
            <span>Vault Reserve In Stock</span>
          </div>
        </div>
      </section>

      {/* 2. Dossier Headline & Overview Hero */}
      <header className="w-full bg-white border-b border-[var(--color-line)] px-6 md:px-10 pt-8 pb-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#F1F5F9] border border-[var(--color-line)] font-mono text-[10px] uppercase tracking-widest text-[var(--brand-anchor,#0A192F)] font-semibold">
              <Sparkles className="size-3" />
              <span>
                {originLock === "LAB_GROWN"
                  ? "CVD & HPHT Certified Inventory"
                  : originLock === "NATURAL"
                  ? "Rare Earth-Mined Certified Inventory"
                  : "Certified Dual Inventory (Surat Lapidary Atelier)"}
              </span>
            </div>
            <h1 className="font-serif text-[32px] sm:text-[42px] text-[var(--color-ink)] tracking-tight font-normal">
              {title}
            </h1>
            <p className="text-[14px] text-[var(--color-slate)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </header>

      {/* 3. Main Catalogue Layout: Sticky Filter Sidebar + Results Stream */}
      <main className="w-full px-6 md:px-10 py-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT FILTER SIDEBAR (Sticky, exactly 15.5rem wide) */}
          <aside
            className={cn(
              "w-full lg:w-[15.5rem] flex-shrink-0 lg:sticky lg:top-[100px] space-y-5 bg-white border border-[var(--color-line)] p-4 shadow-sm",
              mobileFilterOpen ? "block" : "hidden lg:block"
            )}
          >
            {/* Inventory Type */}
            {!originLock && (
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-[var(--color-slate)] uppercase tracking-widest font-semibold">
                  Inventory Type
                </label>
                <div className="flex flex-col space-y-1 font-mono text-[12px]">
                  <button
                    type="button"
                    onClick={() => updateFilters({ origins: ["LAB_GROWN"] })}
                    className={cn(
                      "px-2.5 py-1.5 flex items-center justify-between text-left transition-colors",
                      filters.origins.includes("LAB_GROWN")
                        ? "bg-[var(--canvas-dark,#0A192F)] text-white"
                        : "bg-[#F1F5F9] text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                    )}
                  >
                    <span>Lab-grown diamonds</span>
                    <span className="text-[10px] opacity-80">{labCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilters({ origins: ["NATURAL"] })}
                    className={cn(
                      "px-2.5 py-1.5 flex items-center justify-between text-left transition-colors",
                      filters.origins.includes("NATURAL")
                        ? "bg-[var(--canvas-dark,#0A192F)] text-white"
                        : "bg-[#F1F5F9] text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                    )}
                  >
                    <span>Natural diamonds</span>
                    <span className="text-[10px] opacity-80">{naturalCount}</span>
                  </button>
                </div>
                <div className="w-full h-px bg-[var(--color-line)] pt-1"></div>
              </div>
            )}

            {/* 1. Geometric Shapes (5x2 Matrix with precise SVG outlines) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] text-[var(--color-ink)] uppercase tracking-widest font-semibold">
                  Shape
                </label>
                {filters.shapes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ shapes: [] })}
                    className="font-mono text-[10px] text-[var(--brand-anchor,#0A192F)] hover:underline"
                  >
                    All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-1 pt-1">
                {SHAPE_OPTIONS.map((opt) => {
                  const isSelected = filters.shapes.includes(opt.shape);
                  return (
                    <button
                      key={opt.shape}
                      type="button"
                      onClick={() => handleToggleShape(opt.shape)}
                      title={opt.label}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 border transition-all",
                        isSelected
                          ? "bg-[var(--canvas-dark,#0A192F)] text-white border-[var(--canvas-dark,#0A192F)]"
                          : "bg-[#F1F5F9] border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                      )}
                    >
                      {opt.renderIcon()}
                      <span className="font-mono text-[9px] mt-1 uppercase tracking-tighter">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* 2. Carat Weight Slider & Dual Input Boxes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <label className="text-[var(--color-ink)] uppercase tracking-widest font-semibold">
                  Carat (ct)
                </label>
                <span className="text-[var(--color-slate)]">
                  {(filters.caratMin || 0.5).toFixed(2)} – {(filters.caratMax || 5.0).toFixed(2)} ct
                </span>
              </div>
              <div className="py-2">
                <Slider
                  min={0.5}
                  max={5.0}
                  step={0.05}
                  value={[filters.caratMin || 0.5, filters.caratMax || 5.0]}
                  onValueChange={([minVal, maxVal]) =>
                    updateFilters({ caratMin: minVal, caratMax: maxVal })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="flex items-center bg-[#F1F5F9] border border-[var(--color-line)] px-2 py-1">
                  <span className="text-[var(--color-slate)] mr-1 text-[10px]">Min</span>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.caratMin || 0.5}
                    onChange={(e) => updateFilters({ caratMin: parseFloat(e.target.value) || 0.5 })}
                    className="w-full bg-transparent text-[var(--color-ink)] outline-none"
                  />
                  <span className="text-[var(--color-slate)] text-[10px]">ct</span>
                </div>
                <div className="flex items-center bg-[#F1F5F9] border border-[var(--color-line)] px-2 py-1">
                  <span className="text-[var(--color-slate)] mr-1 text-[10px]">Max</span>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.caratMax || 5.0}
                    onChange={(e) => updateFilters({ caratMax: parseFloat(e.target.value) || 5.0 })}
                    className="w-full bg-transparent text-[var(--color-ink)] outline-none"
                  />
                  <span className="text-[var(--color-slate)] text-[10px]">ct</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* 3. Price Range Preset Buttons & Numerical Inputs */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[var(--color-ink)] uppercase tracking-widest font-semibold block">
                Price (INR)
              </label>
              {/* Presets */}
              <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handlePricePreset(undefined, 100000)}
                  className="px-2 py-1 bg-[#F1F5F9] border border-[var(--color-line)] hover:bg-[#E2EAF2] text-[var(--color-ink)]"
                >
                  Under ₹1L
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(100000, 300000)}
                  className="px-2 py-1 bg-[#F1F5F9] border border-[var(--color-line)] hover:bg-[#E2EAF2] text-[var(--color-ink)]"
                >
                  ₹1–3L
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(300000, 600000)}
                  className="px-2 py-1 bg-[#F1F5F9] border border-[var(--color-line)] hover:bg-[#E2EAF2] text-[var(--color-ink)]"
                >
                  ₹3–6L
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(600000, 1500000)}
                  className="px-2 py-1 bg-[#F1F5F9] border border-[var(--color-line)] hover:bg-[#E2EAF2] text-[var(--color-ink)]"
                >
                  ₹6–15L
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(1500000, undefined)}
                  className="px-2 py-1 bg-[#F1F5F9] border border-[var(--color-line)] hover:bg-[#E2EAF2] text-[var(--color-ink)]"
                >
                  &gt;₹15L
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="flex items-center bg-[#F1F5F9] border border-[var(--color-line)] px-2 py-1">
                  <span className="text-[var(--color-slate)] mr-1 text-[10px]">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      updateFilters({ minPrice: e.target.value ? parseInt(e.target.value, 10) : undefined })
                    }
                    className="w-full bg-transparent text-[var(--color-ink)] outline-none"
                  />
                </div>
                <div className="flex items-center bg-[#F1F5F9] border border-[var(--color-line)] px-2 py-1">
                  <span className="text-[var(--color-slate)] mr-1 text-[10px]">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      updateFilters({ maxPrice: e.target.value ? parseInt(e.target.value, 10) : undefined })
                    }
                    className="w-full bg-transparent text-[var(--color-ink)] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* 4. Colour Segmented Toggle Group */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <label className="text-[var(--color-ink)] uppercase tracking-widest font-semibold">
                  Colour
                </label>
                <span className="text-[var(--color-slate)] font-medium">
                  {filters.colors.length > 0 ? filters.colors.join(", ") : "D through K"}
                </span>
              </div>
              <div className="grid grid-cols-8 gap-0.5 border border-[var(--color-line)] p-0.5 bg-[#F1F5F9]">
                {COLOR_LIST.map((c) => {
                  const isSelected = filters.colors.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleToggleColor(c)}
                      className={cn(
                        "py-1 text-center font-mono text-[11px] font-semibold transition-colors",
                        isSelected
                          ? "bg-[var(--canvas-dark,#0A192F)] text-white"
                          : "text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-[9px] text-[var(--color-slate)] leading-tight">
                D is colourless; each step down reveals faint optical warmth.
              </p>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* 5. Clarity Segmented Toggle Group */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <label className="text-[var(--color-ink)] uppercase tracking-widest font-semibold">
                  Clarity
                </label>
                <span className="text-[var(--color-slate)] font-medium">
                  {filters.clarities.length > 0 ? filters.clarities.join(", ") : "FL – SI2"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
                {CLARITY_LIST.map((cl) => {
                  const isSelected = filters.clarities.includes(cl);
                  return (
                    <button
                      key={cl}
                      type="button"
                      onClick={() => handleToggleClarity(cl)}
                      className={cn(
                        "py-1 text-center border font-semibold transition-colors",
                        isSelected
                          ? "bg-[var(--canvas-dark,#0A192F)] text-white border-[var(--canvas-dark,#0A192F)]"
                          : "bg-[#F1F5F9] border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                      )}
                    >
                      {cl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* 6. Cut Grade Toggle Group */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[var(--color-ink)] uppercase tracking-widest font-semibold block">
                Cut Grade
              </label>
              <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
                {(["EXCELLENT", "VERY_GOOD", "GOOD"] as CutGrade[]).map((grade) => {
                  const isSelected = filters.cuts.includes(grade);
                  const label = grade === "EXCELLENT" ? "Ideal / Ex" : grade === "VERY_GOOD" ? "Very Good" : "Good";
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleToggleCut(grade)}
                      className={cn(
                        "py-1 text-center border font-semibold transition-colors",
                        isSelected
                          ? "bg-[var(--canvas-dark,#0A192F)] text-white border-[var(--canvas-dark,#0A192F)]"
                          : "bg-[#F1F5F9] border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[#E2EAF2]"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[var(--color-line)]"></div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={clearAllFilters}
              className="w-full py-2 bg-transparent hover:bg-[#F1F5F9] text-[var(--color-slate)] hover:text-[var(--color-ink)] font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-dashed border-[var(--color-line)]"
            >
              <RotateCcw className="size-3" />
              <span>Reset all filters</span>
            </button>
          </aside>

          {/* RIGHT RESULTS PANE */}
          <section className="flex-1 w-full min-w-0 space-y-4">
            {/* Results Toolbar */}
            <div className="bg-white p-3.5 border border-[var(--color-line)] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              {/* Count & Active Filter Tags */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] font-semibold whitespace-nowrap">
                  Showing {activeCount} of {countDisplay} certified diamonds
                </span>

                {hasActiveFilters && (
                  <>
                    <span className="text-[var(--color-line-dark)] hidden sm:inline">|</span>
                    <div className="flex items-center flex-wrap gap-1">
                      {filters.shapes.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F1F5F9] text-[var(--color-ink)] text-[10px] font-mono border border-[var(--color-line)]"
                        >
                          Shape: {s}
                          <button
                            type="button"
                            onClick={() => handleToggleShape(s)}
                            className="hover:text-red-700 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {filters.colors.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F1F5F9] text-[var(--color-ink)] text-[10px] font-mono border border-[var(--color-line)]">
                          Colour: {filters.colors.join(", ")}
                          <button
                            type="button"
                            onClick={() => updateFilters({ colors: [] })}
                            className="hover:text-red-700 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="font-mono text-[10px] text-[var(--brand-anchor,#0A192F)] hover:underline ml-1 uppercase"
                      >
                        Clear all
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* View Switcher & Sort Toolbar */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Drawer Trigger */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFilterOpen((prev) => !prev)}
                  className="lg:hidden h-8 text-[11px] font-mono"
                >
                  <SlidersHorizontal className="h-3 w-3 mr-1" />
                  <span>Filters</span>
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <label htmlFor="catalog-sort" className="text-[var(--color-slate)] uppercase hidden sm:inline">
                    Sort:
                  </label>
                  <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                    className="h-8 border border-[var(--color-line)] bg-[#F1F5F9] px-2 text-[11px] text-[var(--color-ink)] font-mono outline-none focus:border-[var(--color-ink)]"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="carat_desc">Carat: High to Low</option>
                    <option value="carat_asc">Carat: Low to High</option>
                  </select>
                </div>

                {/* Grid / Table View Switcher */}
                <div className="flex items-center border border-[var(--color-line)] bg-[#F1F5F9] p-0.5">
                  <button
                    type="button"
                    onClick={() => updateFilters({ view: "grid" })}
                    className={cn(
                      "p-1.5 transition-colors",
                      filters.view === "grid"
                        ? "bg-[var(--canvas-dark,#0A192F)] text-white"
                        : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFilters({ view: "table" })}
                    className={cn(
                      "p-1.5 transition-colors",
                      filters.view === "table"
                        ? "bg-[var(--canvas-dark,#0A192F)] text-white"
                        : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
                    )}
                    aria-label="High-density table view"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Diamonds Stream (Grid or Table) */}
            {sortedDiamonds.length === 0 ? (
              <div className="py-20 text-center border border-[var(--color-line)] bg-white p-8 space-y-3">
                <p className="font-serif text-xl text-[var(--color-ink)] font-normal">
                  No diamonds match the selected criteria.
                </p>
                <p className="text-xs font-mono text-[var(--color-slate)] max-w-sm mx-auto leading-relaxed">
                  Try widening your carat boundaries or resetting your color and clarity filters.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[var(--canvas-dark,#0A192F)] text-white font-mono text-[11px] uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : filters.view === "table" ? (
              <DiamondTable diamonds={sortedDiamonds} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedDiamonds.map((diamond, index) => (
                  <DiamondCard
                    key={diamond.id}
                    diamond={diamond}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
