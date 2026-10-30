
"use client";

import type { HTMLAttributes } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  LoaderCircle,
} from "lucide-react";

import { useListing } from "@/components/catalog/ListingState";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/lib/types/product";

export interface ListingToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  total?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "carat_asc", label: "Carat: low to high" },
  { value: "carat_desc", label: "Carat: high to low" },
];

export function ListingToolbar({
  total,
  className,
  ...rest
}: ListingToolbarProps) {
  const {
    query,
    totalItems = 0,
    view = "grid",
    setView,
    update,
    isPending,
  } = useListing();

  const displayTotal = total !== undefined ? total : totalItems;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...rest}
    >
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2.5"
      >
        <span className="font-serif text-2xl font-medium tracking-tight text-ink tabular-nums">
          {displayTotal.toLocaleString("en-IN")}
        </span>

        <span className="text-xs text-slate">
          {displayTotal === 1 ? "diamond found" : "diamonds found"}
        </span>

        {isPending && (
          <LoaderCircle
            className="size-3.5 animate-spin text-brand-accent"
            aria-label="Updating results"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
            Sort by
          </span>

          <span className="relative">
            <select
              aria-label="Sort diamonds"
              value={query.sort ?? "recommended"}
              onChange={(event) =>
                update({
                  sort: event.currentTarget.value as SortOption,
                })
              }
              className="h-10 min-w-[170px] appearance-none rounded-full border border-line bg-white py-2 pl-4 pr-10 text-xs font-medium text-ink outline-none transition-colors hover:border-line-dark focus:border-brand-accent focus:ring-2 focus:ring-[rgba(82,109,137,0.15)]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-accent"
              aria-hidden="true"
            />
          </span>
        </label>

        <div
          role="group"
          aria-label="Product display"
          className="flex items-center gap-1 rounded-full border border-line bg-stone p-1"
        >
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={cn(
              buttonVariants({
                variant: view === "grid" ? "default" : "ghost",
                size: "icon",
              }),
              "size-9 rounded-full",
            )}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={cn(
              buttonVariants({
                variant: view === "list" ? "default" : "ghost",
                size: "icon",
              }),
              "size-9 rounded-full",
            )}
          >
            <List className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingToolbar;
