"use client";

import { useListingContext } from "./ListingProvider";

export function SortSelect() {
  const { params, updateParams } = useListingContext();

  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "carat_desc", label: "Carat: High to Low" },
    { value: "carat_asc", label: "Carat: Low to High" }
  ];

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-xs uppercase tracking-widest text-slate">Sort By</label>
      <select
        id="sort"
        value={params.sort || "price_asc"}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="h-10 border border-line bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
      >
        {sortOptions.map((s: { value: string; label: string }) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SortSelect;