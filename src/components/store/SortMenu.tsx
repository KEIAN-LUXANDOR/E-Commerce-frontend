"use client";

import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { storeQueryHref } from "@/lib/store-query";
import type { StoreProductFilters } from "@/lib/types/store";

/** The two sorts the backend supports. Changing it reloads the results from page 1. */
export function SortMenu({ basePath, filters }: { basePath: string; filters: StoreProductFilters }) {
  const router = useRouter();
  const id = useId();
  const [pending, start] = useTransition();
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
      <label htmlFor={id} className="hidden text-sm text-slate sm:block">
        Sort by
      </label>
      <select
        id={id}
        value={filters.sort ?? "name"}
        disabled={pending}
        onChange={(e) => start(() => router.push(storeQueryHref(basePath, { ...filters, sort: e.target.value as StoreProductFilters["sort"] }, 0), { scroll: false }))}
        className="field min-h-11 w-full cursor-pointer pr-8 text-sm sm:w-auto"
      >
        <option value="name">Name (A–Z)</option>
        <option value="newest">Newest first</option>
      </select>
    </div>
  );
}
