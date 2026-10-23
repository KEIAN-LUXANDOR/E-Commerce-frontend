"use client";

import * as React from "react";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { diamonds } from "@/mocks/data";
import { formatINR } from "@/lib/format";
import { formatRupeesPerCarat } from "@/lib/money";
import { shapeLabel, originLabel, cutLabel } from "@/lib/catalog-labels";
import { DiamondArt } from "@/components/art/DiamondArt";
import {
  addToCart,
  toggleWishlist,
  useWishlist,
  addToCompare,
  removeFromCompare,
  useCompare,
  showToast,
} from "@/lib/stores";
import {
  Search,
  Heart,
  ArrowLeftRight,
  ShoppingBag,
  X,
  Sparkles,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  ShieldCheck,
} from "lucide-react";
import type { DiamondDetail, Shape } from "@/lib/types/catalog";

const SHAPE_BUTTONS: { name: string; value: Shape; svg: React.ReactNode }[] = [
  {
    name: "Round",
    value: "ROUND",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" />
        <circle cx="18" cy="18" r="7" strokeDasharray="1.5 1.5" />
        <line x1="18" x2="18" y1="4" y2="11" />
        <line x1="18" x2="18" y1="25" y2="32" />
        <line x1="4" x2="11" y1="18" y2="18" />
        <line x1="25" x2="32" y1="18" y2="18" />
      </svg>
    ),
  },
  {
    name: "Oval",
    value: "OVAL",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <ellipse cx="18" cy="18" rx="10" ry="14" />
        <ellipse cx="18" cy="18" rx="5" ry="7" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    name: "Princess",
    value: "PRINCESS",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <rect height="22" width="22" x="7" y="7" />
        <line x1="7" x2="29" y1="7" y2="29" />
        <line x1="29" x2="7" y1="7" y2="29" />
      </svg>
    ),
  },
  {
    name: "Cushion",
    value: "CUSHION",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <rect height="22" rx="6" width="22" x="7" y="7" />
        <circle cx="18" cy="18" r="5" />
      </svg>
    ),
  },
  {
    name: "Emerald",
    value: "EMERALD",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <polygon points="10,6 26,6 30,10 30,26 26,30 10,30 6,26 6,10" />
        <rect height="16" width="12" x="12" y="10" />
      </svg>
    ),
  },
  {
    name: "Pear",
    value: "PEAR",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <path d="M18 6 C18 6, 8 18, 8 24 A 10 10 0 0 0 28 24 C 28 18, 18 6, 18 6 Z" />
      </svg>
    ),
  },
  {
    name: "Marquise",
    value: "MARQUISE",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <path d="M18 4 C26 12 28 24 18 32 C10 24 10 12 18 4 Z" />
      </svg>
    ),
  },
  {
    name: "Heart",
    value: "HEART",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <path d="M18 30 L8 20 C6 18 4 15.5 4 12.5 C4 8 8 5 13 5 C15.5 5 17.5 6.5 18 8 C18.5 6.5 20.5 5 23 5 C28 5 32 8 32 12.5 C32 15.5 30 18 28 20 Z" />
      </svg>
    ),
  },
  {
    name: "Radiant",
    value: "RADIANT",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <polygon points="9,6 27,6 30,9 30,27 27,30 9,30 6,27 6,9" />
        <circle cx="18" cy="18" r="5" />
      </svg>
    ),
  },
  {
    name: "Asscher",
    value: "ASSCHER",
    svg: (
      <svg className="w-8 h-8 stroke-current stroke-[1.2] fill-none mb-1.5" viewBox="0 0 36 36">
        <polygon points="10,6 26,6 30,10 30,26 26,30 10,30 6,26 6,10" />
        <rect height="14" width="14" x="11" y="11" />
      </svg>
    ),
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "oval 1.5";
  const [query, setQuery] = useState(initialQuery);
  const [originFilter, setOriginFilter] = useState<string>("ALL");
  const [activeShape, setActiveShape] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortOption, setSortOption] = useState<string>("recommended");
  const [activeColor, setActiveColor] = useState<string>("ALL");
  const [activeClarity, setActiveClarity] = useState<string>("ALL");
  const [activeCut, setActiveCut] = useState<string>("ALL");

  const wishlist = useWishlist();
  const compareSlugs = useCompare();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const naturalMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return diamonds.filter((d) => {
      // Shape filter
      if (activeShape !== "ALL" && d.shape !== activeShape) {
        return false;
      }
      // Origin filter
      if (originFilter !== "ALL" && d.origin !== originFilter) {
        return false;
      }
      // Color filter
      if (activeColor !== "ALL" && d.color !== activeColor) {
        return false;
      }
      // Clarity filter
      if (activeClarity !== "ALL" && d.clarity !== activeClarity) {
        return false;
      }
      // Cut filter
      if (activeCut !== "ALL" && d.cut !== activeCut) {
        return false;
      }

      if (!q) return true;

      const searchable = `${d.shape} ${d.carat} ${d.color} ${d.clarity} ${d.cut} ${d.lab} ${d.certificateNumber} ${d.sku} ${d.origin}`.toLowerCase();
      const tokens = q.split(/\s+/);
      return tokens.every((token) => searchable.includes(token));
    });
  }, [query, activeShape, originFilter, activeColor, activeClarity, activeCut]);

  // Sort
  const sortedDiamonds = useMemo(() => {
    const list = [...naturalMatches];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => a.pricePaise - b.pricePaise);
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => b.pricePaise - a.pricePaise);
    }
    if (sortOption === "carat-desc") {
      return list.sort((a, b) => b.carat - a.carat);
    }
    return list;
  }, [naturalMatches, sortOption]);

  const naturalCount = useMemo(() => diamonds.filter((d) => d.origin === "NATURAL").length, []);
  const labCount = useMemo(() => diamonds.filter((d) => d.origin === "LAB_GROWN").length, []);

  const handleAddToCart = (diamond: DiamondDetail) => {
    const res = addToCart({
      diamondId: diamond.id,
      slug: diamond.slug,
      title: `${diamond.carat.toFixed(2)} ct ${diamond.shape} ${diamond.origin === "NATURAL" ? "Natural" : "Lab-Grown"}`,
      imageUrl: diamond.media[0]?.url,
      shape: diamond.shape,
      specLabel: `${diamond.color} / ${diamond.clarity} / ${diamond.cut} · ${diamond.lab} #${diamond.certificateNumber}`,
      certificateNumber: diamond.certificateNumber,
      pricePaise: diamond.pricePaise,
    });
    if (res === "already") {
      showToast("Diamond is already in your cart reserve.", "info");
      return;
    }
    showToast("Diamond added to your reserve cart.", "info");
  };

  const handleToggleCompare = (diamond: DiamondDetail) => {
    if (compareSlugs.includes(diamond.slug)) {
      removeFromCompare(diamond.slug);
      showToast("Removed from comparison matrix.", "info");
      return;
    }
    const res = addToCompare(diamond.slug);
    if (res === "already") {
      showToast("Diamond is already in your comparison matrix.", "info");
      return;
    }
    if (res === "full") {
      showToast("Comparison matrix is full (maximum 4 stones).", "error");
      return;
    }
    showToast("Diamond added to side-by-side comparison.", "info");
  };

  return (
    <div className="w-full bg-[#F9F8F6] text-[var(--color-ink)] min-h-screen">
      {/* Navigational Micro-Breadcrumb Bar */}
      <div className="w-full bg-white border-b border-[var(--color-line)] px-6 md:px-12 py-3">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between text-[12px] text-[var(--color-slate)] uppercase tracking-wider">
          <nav className="flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--color-line-dark)]">/</span>
            <span className="text-[var(--color-ink)] font-medium">Diamonds</span>
          </nav>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono tracking-wider uppercase text-[var(--color-muted)]">
            <span>Surat Atelier Vaults</span>
            <span>•</span>
            <span className="text-[var(--brand-accent)] font-medium">GIA &amp; IGI Certified</span>
          </div>
        </div>
      </div>

      {/* Search Query Archival Header */}
      <section className="w-full bg-[var(--canvas-light,#F9F8F6)] border-b border-[var(--color-line)] py-10 px-6 md:px-12">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-[0.16em] uppercase text-[var(--color-slate)]">
              SEARCH ARCHIVE · CERTIFIED SPECIMENS
            </span>
            <h1 className="font-serif text-[34px] sm:text-[44px] text-[var(--color-ink)] tracking-tight font-normal">
              Results for &ldquo;{query || "oval 1.5"}&rdquo;
            </h1>
          </div>

          {/* Search Input Container */}
          <div className="max-w-2xl w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border border-[var(--color-line)] h-12 transition-colors focus-within:border-[var(--color-ink)] shadow-xs">
              <Search className="size-5 text-[var(--color-slate)] ml-4 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shape, carat weight, cert ID or grade..."
                className="w-full h-full bg-transparent px-3.5 text-sm text-[var(--color-ink)] focus:outline-none placeholder:text-[var(--color-muted)] font-sans"
              />
              <div className="flex items-center pr-3 gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear input"
                    className="w-6 h-6 flex items-center justify-center text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <span className="hidden sm:inline-flex items-center border border-[var(--color-line)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-slate)] tracking-wider bg-[var(--canvas-light,#F9F8F6)] select-none">
                  ⌘K
                </span>
              </div>
            </form>
          </div>

          {/* Natural Parser & Query Translation Feedback */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--color-slate)] pt-1">
            <span>
              Showing <strong className="font-medium text-[var(--color-ink)]">{naturalMatches.length} diamonds</strong> matching query criteria.
            </span>
            <span className="text-[var(--color-line-dark)] hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1">
              Suggestions:
              <button
                type="button"
                onClick={() => handleSuggestionClick("Oval 1.5")}
                className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-line-dark)] hover:decoration-[var(--color-ink)] transition-colors font-medium ml-1 cursor-pointer"
              >
                1.50 ct Oval Diamonds
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick("Round 2.0")}
                className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-line-dark)] hover:decoration-[var(--color-ink)] transition-colors font-medium ml-2 cursor-pointer"
              >
                2.00 ct Round
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* 10 Shape Selector Row (Stitch All Diamonds Parity) */}
      <section className="w-full bg-[#F1F5F9] border-b border-[var(--color-line)] px-6 md:px-12 py-5">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] uppercase tracking-wider text-[var(--color-slate)] font-medium font-mono">
              Choose Shape {activeShape !== "ALL" && `· Selected: ${activeShape}`}
            </span>
            {activeShape !== "ALL" ? (
              <button
                type="button"
                onClick={() => setActiveShape("ALL")}
                className="text-[12px] text-[var(--color-ink)] hover:text-black transition-colors underline font-medium cursor-pointer"
              >
                Reset shape (view all)
              </button>
            ) : (
              <span className="text-[11px] text-[var(--color-muted)] font-mono">All 10 shapes available</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {SHAPE_BUTTONS.map((s) => {
              const isActive = activeShape === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setActiveShape(isActive ? "ALL" : s.value)}
                  className={`flex flex-col items-center justify-center py-3 px-2 border transition-all rounded-none group text-center cursor-pointer ${
                    isActive
                      ? "border-[var(--canvas-dark,#0A192F)] bg-white font-medium text-[var(--color-ink)] shadow-xs ring-1 ring-[var(--brand-accent,#8FA9C4)]"
                      : "border-[var(--color-line)] bg-white/70 hover:border-[var(--color-ink)] hover:bg-white text-[var(--color-slate)]"
                  }`}
                >
                  <span className={isActive ? "text-[var(--color-ink)]" : "text-[var(--color-slate)] group-hover:text-[var(--color-ink)]"}>
                    {s.svg}
                  </span>
                  <span className="text-[12px] font-medium tracking-wide group-hover:text-[var(--color-ink)]">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter & Refinement Engine Bar (Sticky) */}
      <section className="sticky top-0 z-30 w-full bg-white border-b border-[var(--color-line)] px-6 md:px-12 py-3.5 shadow-xs">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Quick Provenance Toggles & Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Origin Toggle Pills */}
            <div className="inline-flex p-0.5 bg-[var(--canvas-light,#F9F8F6)] border border-[var(--color-line)] mr-2">
              <button
                type="button"
                onClick={() => setOriginFilter("ALL")}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  originFilter === "ALL"
                    ? "bg-[var(--canvas-dark,#0A192F)] text-white font-medium"
                    : "text-[var(--color-ink)] hover:text-black"
                }`}
              >
                All ({diamonds.length})
              </button>
              <button
                type="button"
                onClick={() => setOriginFilter("NATURAL")}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  originFilter === "NATURAL"
                    ? "bg-[var(--canvas-dark,#0A192F)] text-white font-medium"
                    : "text-[var(--color-ink)] hover:text-black"
                }`}
              >
                Natural ({naturalCount})
              </button>
              <button
                type="button"
                onClick={() => setOriginFilter("LAB_GROWN")}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  originFilter === "LAB_GROWN"
                    ? "bg-[var(--canvas-dark,#0A192F)] text-white font-medium"
                    : "text-[var(--color-ink)] hover:text-black"
                }`}
              >
                Lab-grown ({labCount})
              </button>
            </div>

            {/* Colour filter trigger */}
            <div className="relative group">
              <select
                aria-label="Filter by Colour"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="h-9 pl-3 pr-7 bg-white border border-[var(--color-line)] text-[var(--color-ink)] text-xs appearance-none focus:outline-none focus:border-[var(--color-ink)] cursor-pointer rounded-none uppercase tracking-wider font-medium"
              >
                <option value="ALL">Colour: All</option>
                <option value="D">D (Colourless)</option>
                <option value="E">E (Colourless)</option>
                <option value="F">F (Colourless)</option>
                <option value="G">G (Near Colourless)</option>
                <option value="H">H (Near Colourless)</option>
              </select>
              <ChevronDown className="size-3.5 text-[var(--color-muted)] absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Clarity filter trigger */}
            <div className="relative group">
              <select
                aria-label="Filter by Clarity"
                value={activeClarity}
                onChange={(e) => setActiveClarity(e.target.value)}
                className="h-9 pl-3 pr-7 bg-white border border-[var(--color-line)] text-[var(--color-ink)] text-xs appearance-none focus:outline-none focus:border-[var(--color-ink)] cursor-pointer rounded-none uppercase tracking-wider font-medium"
              >
                <option value="ALL">Clarity: All</option>
                <option value="FL">FL / IF</option>
                <option value="VVS1">VVS1</option>
                <option value="VVS2">VVS2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
              </select>
              <ChevronDown className="size-3.5 text-[var(--color-muted)] absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Cut filter trigger */}
            <div className="relative group">
              <select
                aria-label="Filter by Cut"
                value={activeCut}
                onChange={(e) => setActiveCut(e.target.value)}
                className="h-9 pl-3 pr-7 bg-white border border-[var(--color-line)] text-[var(--color-ink)] text-xs appearance-none focus:outline-none focus:border-[var(--color-ink)] cursor-pointer rounded-none uppercase tracking-wider font-medium"
              >
                <option value="ALL">Cut: All</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="VERY_GOOD">Very Good</option>
                <option value="GOOD">Good</option>
              </select>
              <ChevronDown className="size-3.5 text-[var(--color-muted)] absolute right-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sorting & View Controls */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="search-sort-select"
                className="text-xs uppercase tracking-wider text-[var(--color-muted)] hidden lg:inline-block font-mono"
              >
                Sort:
              </label>
              <div className="relative">
                <select
                  id="search-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-9 pl-3 pr-8 bg-white border border-[var(--color-line)] text-[var(--color-ink)] text-[13px] appearance-none focus:outline-none focus:border-[var(--color-ink)] cursor-pointer rounded-none font-sans"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carat-desc">Carat: Largest First</option>
                </select>
                <ChevronDown className="size-4 text-[var(--color-muted)] absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--color-line)] bg-[var(--canvas-light,#F9F8F6)] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid layout view"
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[var(--color-ink)] shadow-2xs"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label="Table ledger layout view"
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[var(--color-ink)] shadow-2xs"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Filter Chips */}
      <div className="w-full bg-[var(--canvas-light,#F9F8F6)] border-b border-[var(--color-line)] px-6 md:px-12 py-3">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-mono">
              Filters:
            </span>
            {activeShape !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--color-line)] text-xs text-[var(--color-ink)] font-medium">
                Shape: {activeShape}
                <button
                  type="button"
                  onClick={() => setActiveShape("ALL")}
                  aria-label="Remove shape filter"
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            {originFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--color-line)] text-xs text-[var(--color-ink)] font-medium">
                Origin: {originFilter === "NATURAL" ? "Natural" : "Lab-Grown"}
                <button
                  type="button"
                  onClick={() => setOriginFilter("ALL")}
                  aria-label="Remove origin filter"
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            {activeColor !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--color-line)] text-xs text-[var(--color-ink)] font-medium">
                Color: {activeColor}
                <button
                  type="button"
                  onClick={() => setActiveColor("ALL")}
                  aria-label="Remove color filter"
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            {activeClarity !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--color-line)] text-xs text-[var(--color-ink)] font-medium">
                Clarity: {activeClarity}
                <button
                  type="button"
                  onClick={() => setActiveClarity("ALL")}
                  aria-label="Remove clarity filter"
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveShape("ALL");
              setOriginFilter("ALL");
              setActiveColor("ALL");
              setActiveClarity("ALL");
              setActiveCut("ALL");
            }}
            className="text-xs uppercase tracking-widest text-[var(--color-slate)] hover:text-black underline underline-offset-4 decoration-[var(--color-line)] hover:decoration-black transition-colors cursor-pointer"
          >
            CLEAR ALL FILTERS
          </button>
        </div>
      </div>

      {/* Primary Results Display */}
      <section className="w-full bg-white px-6 md:px-12 py-10 md:py-14">
        <div className="max-w-[1360px] mx-auto">
          {sortedDiamonds.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[var(--color-line)] p-8 max-w-xl mx-auto shadow-xs">
              <Sparkles className="mx-auto size-10 text-[var(--color-muted)] mb-3" />
              <h3 className="font-serif text-2xl font-medium">No Diamonds Match Your Query</h3>
              <p className="mt-2 text-sm text-[var(--color-slate)] leading-relaxed">
                We couldn&apos;t find any certified loose stones matching your exact criteria. Try widening your parameters or resetting filters.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveShape("ALL");
                    setOriginFilter("ALL");
                    setActiveColor("ALL");
                    setActiveClarity("ALL");
                    setActiveCut("ALL");
                  }}
                  className="border border-[var(--color-line)] bg-[var(--canvas-light,#F9F8F6)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[#eeece5] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <Link
                  href="/shop"
                  className="bg-[var(--canvas-dark,#0A192F)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-white hover:bg-black transition-colors"
                >
                  Browse Full Catalog
                </Link>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* 4-Column Diamond Archive Grid - Stitch Zero-Shadow Specimen Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {sortedDiamonds.map((diamond) => {
                const isWishlisted = wishlist.includes(diamond.slug);
                const isCompared = compareSlugs.includes(diamond.slug);
                const title = `${diamond.carat.toFixed(2)} ct ${shapeLabel(diamond.shape)}`;
                const certLink = `/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`;

                return (
                  <article
                    key={diamond.id}
                    className="group relative flex flex-col bg-white border border-[var(--color-line)] transition-all duration-300 hover:border-[var(--canvas-dark,#0A192F)]"
                  >
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
                      <span className="px-2 py-0.5 text-[11px] font-mono tracking-wider uppercase bg-white/95 backdrop-blur-xs border border-[var(--color-line)] text-[var(--color-ink)] font-medium">
                        {diamond.origin === "NATURAL" ? "Natural · GIA" : "Lab-grown · IGI"}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      aria-label="Add to wishlist"
                      onClick={() => {
                        toggleWishlist(diamond.slug);
                        showToast("Updated wishlist.", "info");
                      }}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-none bg-white/90 backdrop-blur-xs border border-[var(--color-line)] flex items-center justify-center text-[var(--color-slate)] hover:text-black transition-colors cursor-pointer"
                    >
                      <Heart className={`size-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
                    </button>

                    {/* Square Photo / Specimen Well (#F1F5F9 Stone) */}
                    <Link
                      href={certLink}
                      className="relative w-full aspect-square bg-[#F1F5F9] overflow-hidden flex items-center justify-center p-6 block cursor-pointer"
                    >
                      {diamond.media[0]?.url ? (
                        <>
                          <Image
                            src={diamond.media[0].url}
                            alt={diamond.media[0].alt || title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-contain p-4 transition-opacity duration-300 group-hover:opacity-0"
                          />
                          {diamond.media[1]?.url && (
                            <Image
                              src={diamond.media[1].url}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-contain p-4 absolute inset-0 m-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                          )}
                        </>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Face-up facet drawing */}
                          <div className="w-[85%] h-[85%] flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                            <DiamondArt
                              shape={diamond.shape}
                              view="top"
                              title={title}
                              className="w-full h-full text-[var(--color-ink)]"
                            />
                          </div>
                          {/* Profile side drawing on hover */}
                          <div className="w-[85%] h-[85%] absolute inset-0 m-auto flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <DiamondArt
                              shape={diamond.shape}
                              view="profile"
                              title=""
                              className="w-full h-full text-[var(--color-slate)]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Hover Compare Bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs border-t border-[var(--color-line)] py-2 px-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <label
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleCompare(diamond);
                          }}
                          className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[var(--color-ink)] font-medium select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isCompared}
                            readOnly
                            className="w-3.5 h-3.5 rounded-none border-[var(--color-line)] text-ink focus:ring-0 cursor-pointer"
                          />
                          <span>Compare</span>
                        </label>
                        <span className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider font-mono">
                          Quick view
                        </span>
                      </div>
                    </Link>

                    {/* Metadata & Specifications */}
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <Link href={certLink}>
                          <h2 className="font-serif text-[17px] font-medium leading-snug text-[var(--color-ink)] group-hover:underline underline-offset-2">
                            {title}
                          </h2>
                        </Link>
                        <p className="text-[14px] text-[var(--color-slate)] flex items-center gap-1 font-sans">
                          <span className="font-medium text-[var(--color-ink)]">{diamond.color}</span>
                          <span>·</span>
                          <span className="font-medium text-[var(--color-ink)]">{diamond.clarity}</span>
                          <span>·</span>
                          <span>{cutLabel(diamond.cut)}</span>
                        </p>
                        <p className="text-[12px] text-[var(--color-muted)] font-mono">
                          {diamond.origin === "NATURAL" ? "Natural" : "Lab-grown"} · {diamond.lab} #{diamond.certificateNumber}
                        </p>
                      </div>

                      {/* Price & Primary CTA */}
                      <div className="pt-3 border-t border-[var(--color-line)] flex items-end justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-sans text-[19px] font-medium text-[var(--color-ink)] tracking-tight">
                            {formatINR(diamond.pricePaise)}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--color-muted)]">
                            {formatRupeesPerCarat(diamond.pricePaise, diamond.carat)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(diamond)}
                          className="px-3.5 py-2 bg-[var(--canvas-dark,#0A192F)] text-white text-[11px] font-medium uppercase tracking-wider hover:bg-black transition-colors rounded-none cursor-pointer"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Table List View (Stitch Parity) */
            <div className="w-full overflow-x-auto border border-[var(--color-line)] bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F1F5F9] border-b border-[var(--color-line)] text-[11px] uppercase tracking-wider font-mono text-[var(--color-muted)]">
                    <th className="py-3 px-4">Specimen</th>
                    <th className="py-3 px-4">Shape</th>
                    <th className="py-3 px-4">Carat</th>
                    <th className="py-3 px-4">Colour</th>
                    <th className="py-3 px-4">Clarity</th>
                    <th className="py-3 px-4">Cut</th>
                    <th className="py-3 px-4">Provenance</th>
                    <th className="py-3 px-4">Lab Cert</th>
                    <th className="py-3 px-4 text-right">Price (incl. GST)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {sortedDiamonds.map((diamond) => (
                    <tr
                      key={diamond.id}
                      className="hover:bg-[#F9F8F6] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`}
                          className="relative block size-12 bg-[#F1F5F9] border border-[var(--color-line)] overflow-hidden"
                        >
                          {diamond.media[0]?.url ? (
                            <Image
                              src={diamond.media[0].url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full p-1 flex items-center justify-center">
                              <DiamondArt
                                shape={diamond.shape}
                                view="top"
                                title=""
                                className="w-full h-full text-[var(--color-ink)]"
                              />
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--color-ink)]">
                        <Link
                          href={`/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`}
                          className="hover:underline"
                        >
                          {shapeLabel(diamond.shape)}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">{diamond.carat.toFixed(2)} ct</td>
                      <td className="py-3 px-4 font-medium">{diamond.color}</td>
                      <td className="py-3 px-4 font-medium">{diamond.clarity}</td>
                      <td className="py-3 px-4">{cutLabel(diamond.cut)}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-[var(--color-line)] text-[var(--color-ink)] bg-white font-medium">
                          {diamond.origin === "NATURAL" ? "Natural" : "Lab-Grown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {diamond.lab} #{diamond.certificateNumber}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-[var(--color-ink)] text-right">
                        {formatINR(diamond.pricePaise)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(diamond)}
                          className="px-3 py-1.5 bg-[var(--canvas-dark,#0A192F)] text-white text-[11px] uppercase tracking-wider font-medium hover:bg-black transition-colors rounded-none cursor-pointer"
                        >
                          Reserve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-sm font-mono text-[var(--color-muted)]">
          Loading Certified Diamond Search Ledger...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
