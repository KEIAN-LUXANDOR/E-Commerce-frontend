"use client";

import { useId } from "react";
import { useListing } from "@/components/shop/ListingProvider";
import { SORTS } from "@/lib/catalog-labels";
import { withFilters } from "@/lib/filters";
import type { SortOption } from "@/lib/types/catalog";

export function SortSelect() {
  const { filters, navigate } = useListing();
  const id = useId();
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
      <label htmlFor={id} className="hidden text-sm text-slate sm:block">
        Sort by
      </label>
      <select
        id={id}
        value={filters.sort ?? "featured"}
        onChange={(e) => navigate(withFilters(filters, { sort: e.target.value as SortOption }))}
        className="field min-h-11 w-full cursor-pointer pr-8 text-sm sm:w-auto"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
