import Link from "next/link";
import type { ReactNode } from "react";
import { FilterChips } from "@/components/shop/FilterChips";
import { FilterSidebar, MobileFilterButton } from "@/components/shop/FilterPanel";
import { ListingProvider, ResultsRegion } from "@/components/shop/ListingProvider";
import { Pagination } from "@/components/shop/Pagination";
import { DiamondCard } from "@/components/shop/DiamondCard";
import { DiamondTable } from "@/components/shop/DiamondTable";
import { SortSelect } from "@/components/shop/SortSelect";
import { ViewToggle } from "@/components/shop/ViewToggle";
import { activeChips, buildHref, clearedFilters } from "@/lib/filters";
import type { DiamondPage, ProductFilters } from "@/lib/types/catalog";

export interface CategoryLink {
  label: string;
  href: string;
  active: boolean;
}

interface Props {
  result: DiamondPage;
  filters: ProductFilters;
  basePath: string;
  /** Page heading area (title, intro, breadcrumbs) */
  header: ReactNode;
  categoryLinks?: CategoryLink[];
  hide?: (keyof ProductFilters)[];
  /** Shown instead of the default empty message */
  empty?: ReactNode;
}

/** Shared layout for the shop, category and search pages. */
export function ProductListing({ result, filters, basePath, header, categoryLinks, hide, empty }: Props) {
  const hasFilters = activeChips(filters).length > 0;
  const from = (result.page - 1) * result.pageSize + 1;
  const to = from + result.items.length - 1;

  return (
    <ListingProvider filters={filters} basePath={basePath}>
      <div className="page pt-8">
        {header}

        <div className="mt-8 grid gap-10 lg:grid-cols-[15.5rem_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            {categoryLinks && categoryLinks.length > 0 && (
              <nav aria-label="Categories" className="mb-6 border-b border-line pb-6">
                <ul className="space-y-1.5 text-[0.9375rem]">
                  {categoryLinks.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} aria-current={c.active ? "page" : undefined} className={c.active ? "font-semibold text-ink" : "text-slate hover:text-ink"}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <FilterSidebar hide={hide} />
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <p className="w-full text-sm text-slate sm:w-auto" aria-live="polite">
                {result.total === 0
                  ? "No diamonds found"
                  : result.totalPages > 1
                    ? `Showing ${from}–${to} of ${result.total} diamonds`
                    : `${result.total} ${result.total === 1 ? "diamond" : "diamonds"}`}
              </p>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <MobileFilterButton hide={hide} total={result.total} />
                <SortSelect />
                <ViewToggle />
              </div>
            </div>

            {categoryLinks && categoryLinks.length > 1 && (
              <ul className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 lg:hidden" aria-label="Categories">
                {categoryLinks.map((c) => (
                  <li key={c.href} className="shrink-0">
                    <Link
                      href={c.href}
                      aria-current={c.active ? "page" : undefined}
                      className={`inline-block rounded-full border px-3.5 py-1.5 text-sm ${c.active ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <FilterChips filters={filters} basePath={basePath} />
            </div>

            <ResultsRegion>
              {result.items.length > 0 ? (
                <>
                  {filters.view === "list" ? (
                    <DiamondTable diamonds={result.items} />
                  ) : (
                    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
                      {result.items.map((d, i) => (
                        <li key={d.id}>
                          <DiamondCard diamond={d} priority={i < 3} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <Pagination page={result.page} totalPages={result.totalPages} filters={filters} basePath={basePath} />
                </>
              ) : (
                (empty ?? (
                  <div className="mt-10 max-w-lg">
                    <h2 className="text-2xl">Nothing matches these filters</h2>
                    <p className="mt-2 text-slate">
                      {hasFilters
                        ? "Try removing a filter or two. Colour and clarity together narrow things down fast."
                        : "There are no diamonds here yet. New stones arrive every month."}
                    </p>
                    {hasFilters && (
                      <Link href={buildHref(basePath, clearedFilters(filters))} className="btn btn-primary mt-6">
                        Clear all filters
                      </Link>
                    )}
                  </div>
                ))
              )}
            </ResultsRegion>
          </div>
        </div>
      </div>
    </ListingProvider>
  );
}

/** Loading state that matches the real layout, so nothing jumps when results arrive. */
export function ListingSkeleton() {
  return (
    <div className="page pt-8" aria-busy="true" aria-label="Loading diamonds">
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton mt-4 h-10 w-72 rounded" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[15.5rem_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-8 rounded" />
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}>
              <div className="skeleton aspect-square" />
              <div className="skeleton mt-3 h-4 w-3/4 rounded" />
              <div className="skeleton mt-2 h-4 w-1/2 rounded" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
