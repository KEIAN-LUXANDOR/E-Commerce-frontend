"use client";

import { ChevronLeft, ChevronRight, X, Sparkles, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortMenu } from "@/components/store/SortMenu";
import { storeQueryHref, toRupees } from "@/lib/store-query";
import type { StoreCategory, StoreProductFilters, StoreProductPage } from "@/lib/types/store";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import type { Shape } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

/** Price ranges in rupees (the URL uses rupees; the shop converts to paise for the API). */
const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: "Under ₹1L", max: 100000 },
  { label: "₹1–3L", min: 100000, max: 300000 },
  { label: "₹3–6L", min: 300000, max: 600000 },
  { label: "₹6–15L", min: 600000, max: 1500000 },
  { label: ">₹15L", min: 1500000 },
];

const SHAPE_LIST: { name: string; value: Shape }[] = [
  { name: "Round", value: "ROUND" },
  { name: "Oval", value: "OVAL" },
  { name: "Princess", value: "PRINCESS" },
  { name: "Cushion", value: "CUSHION" },
  { name: "Emerald", value: "EMERALD" },
  { name: "Pear", value: "PEAR" },
  { name: "Marquise", value: "MARQUISE" },
  { name: "Heart", value: "HEART" },
  { name: "Radiant", value: "RADIANT" },
  { name: "Asscher", value: "ASSCHER" },
];

const CARAT_PRESETS: { label: string; query: string }[] = [
  { label: "0.5–1.0 ct", query: "0.75 ct" },
  { label: "1.0–1.5 ct", query: "1.0 ct" },
  { label: "1.5–2.0 ct", query: "1.5 ct" },
  { label: "2.0+ ct", query: "2.0 ct" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function getListingCountSummary(totalItems: number, totalPages: number, from: number, to: number): string {
  if (totalItems === 0) {
    return "0 specimens found";
  }
  if (totalPages > 1) {
    return `Showing ${from}–${to} of ${totalItems} certified diamonds`;
  }
  const noun = totalItems === 1 ? "certified diamond" : "certified diamonds";
  return `${totalItems} ${noun}`;
}

interface Props {
  result: StoreProductPage;
  /** Filters as sent to the API (prices in paise) */
  filters: StoreProductFilters;
  basePath: string;
  header: ReactNode;
  categories: StoreCategory[];
  currentSlug?: string;
  emptyMessage?: string;
  /** Hide the "search words" chip, e.g. on the search page where the words are the heading */
  hideQueryChip?: boolean;
}

/** Shared layout for the shop, category and search pages, in the archival diamond atelier design. */
export function StoreListing({
  result,
  filters,
  basePath,
  header,
  categories,
  currentSlug,
  emptyMessage,
  hideQueryChip,
}: Props) {
  const minR = toRupees(filters.minPrice);
  const maxR = toRupees(filters.maxPrice);
  const hasPrice = minR !== undefined || maxR !== undefined;
  const from = result.page * result.size + 1;
  const to = from + result.items.length - 1;

  const withPrice = (min?: number, max?: number) =>
    storeQueryHref(
      basePath,
      {
        ...filters,
        minPrice: min === undefined ? undefined : min * 100,
        maxPrice: max === undefined ? undefined : max * 100,
      },
      0
    );

  const withQuery = (q?: string) =>
    storeQueryHref(basePath, { ...filters, q }, 0);

  const chips: { key: string; label: string; href: string }[] = [];
  if (filters.q && !hideQueryChip) {
    chips.push({
      key: "q",
      label: `“${filters.q}”`,
      href: storeQueryHref(basePath, { ...filters, q: undefined }, 0),
    });
  }
  if (hasPrice) {
    chips.push({
      key: "price",
      label: `${inr(minR ?? 0)} – ${maxR !== undefined ? inr(maxR) : "any"}`,
      href: withPrice(undefined, undefined),
    });
  }

  const categoryLinks = [
    { label: "All diamonds", href: "/shop", active: !currentSlug },
    ...categories.map((c) => ({
      label: c.name,
      href: `/shop/${encodeURIComponent(c.slug)}`,
      active: c.slug === currentSlug,
    })),
  ];

  const priceForm = (
    <form action={basePath} className="mt-3 flex items-end gap-2">
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}
      <label className="flex-1 text-[11px] font-mono text-[var(--color-slate)] uppercase">
        Min ₹
        <input
          name="minPrice"
          inputMode="numeric"
          placeholder="0"
          defaultValue={minR}
          className="mt-1 h-8 w-full px-2 text-xs font-mono bg-white border border-[var(--color-line)] text-[var(--color-ink)] outline-none rounded-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="flex-1 text-[11px] font-mono text-[var(--color-slate)] uppercase">
        Max ₹
        <input
          name="maxPrice"
          inputMode="numeric"
          placeholder="Any"
          defaultValue={maxR}
          className="mt-1 h-8 w-full px-2 text-xs font-mono bg-white border border-[var(--color-line)] text-[var(--color-ink)] outline-none rounded-none focus:border-[var(--color-ink)]"
        />
      </label>
      <button
        type="submit"
        className="h-8 px-3 text-[11px] font-mono uppercase tracking-wider bg-[var(--color-ink)] text-white hover:bg-black transition-colors rounded-none shrink-0"
      >
        Apply
      </button>
    </form>
  );

  return (
    <div className="w-full bg-[#F9F8F6] min-h-screen text-[var(--color-ink)] pb-16">
      {/* Header Banner Section */}
      <div className="w-full bg-white border-b border-[var(--color-line)] py-8 px-6 md:px-12">
        <div className="max-w-[1360px] mx-auto">
          <div className="border-l-2 border-[var(--brand-accent)] pl-5">
            {header}
          </div>
        </div>
      </div>

      {/* 10 Geometric Shape Visual Selector */}
      <section className="w-full bg-[#F6F4EF] border-b border-[var(--color-line)] px-6 md:px-12 py-5">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[var(--color-slate)] font-mono font-semibold">
              Filter By Geometric Shape
            </span>
            {filters.q && (
              <Link
                href={withQuery(undefined)}
                className="text-xs text-[var(--color-ink)] hover:underline font-mono"
              >
                Clear shape query
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {SHAPE_LIST.map((s) => {
              const isMatch = filters.q?.toLowerCase() === s.name.toLowerCase();
              return (
                <Link
                  key={s.value}
                  href={isMatch ? withQuery(undefined) : withQuery(s.name.toLowerCase())}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 px-2 border transition-all rounded-none text-center group",
                    isMatch
                      ? "border-[var(--canvas-dark,#0D0D0D)] bg-white text-[var(--color-ink)] font-bold ring-1 ring-[var(--brand-accent,#D4AF37)] shadow-xs"
                      : "border-[var(--color-line)] bg-white/70 hover:border-[var(--brand-accent)] hover:bg-white hover:shadow-[0_4px_16px_rgba(212,175,55,0.10)] text-[var(--color-slate)]"
                  )}
                >
                  <ShapeIcon
                    shape={s.value}
                    className={cn(
                      "size-7 mb-1 transition-colors",
                      isMatch ? "text-[var(--color-ink)]" : "text-[var(--color-slate)] group-hover:text-[var(--color-ink)]"
                    )}
                  />
                  <span className="text-[11px] font-mono tracking-tight">
                    {s.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Stream & Sticky Filter Sidebar */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 pt-8">
        <div className="grid gap-10 lg:grid-cols-[15.5rem_1fr]">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block space-y-6 rounded-sm bg-[var(--surface-warm)] p-3" aria-label="Filters">
            {/* Provenance Origin & Categories */}
            <div className="border border-[var(--color-line)] bg-white p-4 shadow-xs">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold border-b border-[var(--color-line)] pb-2 mb-3">
                Inventory Category
              </h3>
              <ul className="space-y-1.5 text-xs font-mono">
                {categoryLinks.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      aria-current={c.active ? "page" : undefined}
                      className={cn(
                        "block px-2.5 py-1.5 transition-colors",
                        c.active
                          ? "bg-[var(--canvas-dark,#0D0D0D)] text-white font-medium"
                          : "text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:bg-[#F6F4EF]"
                      )}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter Box */}
            <div className="border border-[var(--color-line)] bg-white p-4 shadow-xs">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold border-b border-[var(--color-line)] pb-2 mb-3">
                Acquisition Price
              </h3>
              <ul className="flex flex-wrap gap-1.5 mb-3">
                {PRICE_PRESETS.map((p) => {
                  const on = minR === p.min && maxR === p.max;
                  return (
                    <li key={p.label}>
                      <Link
                        href={on ? withPrice(undefined, undefined) : withPrice(p.min, p.max)}
                        aria-current={on ? "true" : undefined}
                        className={cn(
                          "inline-block border px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors",
                          on
                            ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[var(--canvas-dark)] font-medium"
                            : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--brand-accent)]"
                        )}
                      >
                        {p.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {priceForm}
            </div>

            {/* Carat Presets Box */}
            <div className="border border-[var(--color-line)] bg-white p-4 shadow-xs">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold border-b border-[var(--color-line)] pb-2 mb-3">
                Carat Weight Presets
              </h3>
              <ul className="grid grid-cols-2 gap-1.5">
                {CARAT_PRESETS.map((cp) => {
                  const on = filters.q === cp.query;
                  return (
                    <li key={cp.label}>
                      <Link
                        href={on ? withQuery(undefined) : withQuery(cp.query)}
                        className={cn(
                          "block p-2 text-center text-xs font-mono border transition-colors",
                          on
                            ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[var(--canvas-dark)] font-bold"
                            : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--brand-accent)]"
                        )}
                      >
                        {cp.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Reset All Filters Link */}
            {(chips.length > 0 || currentSlug) && (
              <Link
                href="/shop"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-mono uppercase tracking-wider border border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors shadow-xs"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset All Filters</span>
              </Link>
            )}
          </aside>

          {/* RESULTS STREAM & TOOLBAR */}
          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--color-slate)] uppercase tracking-wider" aria-live="polite">
                  {getListingCountSummary(result.totalItems, result.totalPages, from, to)}
                </span>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <SortMenu basePath={basePath} filters={filters} />
              </div>
            </div>

            {/* Active Filter Chips */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-slate)]">
                  Active:
                </span>
                <ul className="flex flex-wrap gap-2" aria-label="Active filters">
                  {chips.map((c) => (
                    <li key={c.key}>
                      <Link
                        href={c.href}
                        scroll={false}
                        aria-label={`Remove filter: ${c.label}`}
                        className="inline-flex items-center gap-1.5 border border-[var(--brand-accent)] bg-white py-1 pl-2.5 pr-1.5 text-xs font-mono text-[var(--color-ink)] hover:bg-[var(--brand-accent)]/10"
                      >
                        {c.label}
                        <X className="size-3 text-[var(--color-slate)] hover:text-black" aria-hidden />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={basePath}
                      scroll={false}
                      className="inline-flex items-center text-xs font-mono text-[var(--color-slate)] hover:text-[var(--color-ink)] underline ml-1"
                    >
                      Clear all
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="mt-6">
              <ProductGrid products={result.items} emptyMessage={emptyMessage} />
            </div>

            {/* Pagination Controls */}
            <Pages
              page={result.page}
              totalPages={result.totalPages}
              href={(p) => storeQueryHref(basePath, filters, p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Numbered pages (the API counts from 0; people count from 1). */
function Pages({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  href: (p: number) => string;
}) {
  if (totalPages <= 1) return null;
  const items: (number | "gap")[] = [];
  for (let p = 0; p < totalPages; p++) {
    if (p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1) items.push(p);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  const cell = "grid h-9 min-w-9 place-items-center border px-2 text-xs font-mono tabular-nums transition-colors";
  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 0 ? (
        <Link
          href={href(page - 1)}
          className={`${cell} border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]`}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" aria-hidden />
        </Link>
      ) : (
        <span className={`${cell} border-[var(--color-line)] bg-[#F6F4EF] text-[var(--color-muted)]`} aria-hidden>
          <ChevronLeft className="size-3.5" />
        </span>
      )}
      {items.map((p, i) =>
        p === "gap" ? (
          <span key={`g${i}`} className={`${cell} border-transparent text-[var(--color-muted)]`} aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${cell} ${
              p === page
                ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[var(--canvas-dark)] font-bold"
                : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-ink)]"
            }`}
          >
            {p + 1}
          </Link>
        )
      )}
      {page < totalPages - 1 ? (
        <Link
          href={href(page + 1)}
          className={`${cell} border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]`}
          aria-label="Next page"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      ) : (
        <span className={`${cell} border-[var(--color-line)] bg-[#F6F4EF] text-[var(--color-muted)]`} aria-hidden>
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </nav>
  );
}

/** Loading skeleton matching the store listing layout for suspense boundaries. */
export function ListingSkeleton() {
  return (
    <div className="w-full bg-[#F9F8F6] min-h-screen pt-8 px-6 md:px-12" aria-busy="true" aria-label="Loading diamonds">
      <div className="max-w-[1360px] mx-auto">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-4 h-10 w-72" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[15.5rem_1fr]">
          <div className="hidden space-y-4 lg:block">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-12" />
            ))}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <div className="skeleton aspect-square" />
                <div className="skeleton mt-3 h-4 w-3/4" />
                <div className="skeleton mt-2 h-4 w-1/2" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
