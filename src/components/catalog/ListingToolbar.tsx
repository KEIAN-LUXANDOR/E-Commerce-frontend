"use client";

import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { useListing } from "@/components/catalog/ListingState";
import { Dialog } from "@/components/ui/dialog";
import { CUTS, FINISHES, FLUORESCENCES, SHAPES, SORTS } from "@/lib/catalog/labels";
import { countActiveFilters } from "@/lib/catalog/query";
import { formatINR } from "@/lib/format";
import type { ProductQuery, SortOption } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface Chip {
  key: string;
  label: string;
  remove: Partial<ProductQuery>;
}

function labelFor<T extends string>(list: { value: T; label: string }[], v: T) {
  return list.find((x) => x.value === v)?.label ?? v;
}

/** One removable chip per filter in use. */
function activeChips(q: ProductQuery): Chip[] {
  const chips: Chip[] = [];
  const listChips = <T extends string>(key: keyof ProductQuery, values: T[] | undefined, title: string, labels?: { value: T; label: string }[]) => {
    for (const v of values ?? []) {
      const rest = (values ?? []).filter((x) => x !== v);
      chips.push({ key: `${String(key)}-${v}`, label: `${title}: ${labels ? labelFor(labels, v) : v}`, remove: { [key]: rest.length ? rest : undefined } as Partial<ProductQuery> });
    }
  };
  listChips("shape", q.shape, "Shape", SHAPES);
  if (q.minCarat !== undefined || q.maxCarat !== undefined) {
    chips.push({ key: "carat", label: `Carat: ${q.minCarat ?? 0}–${q.maxCarat ?? "any"}`, remove: { minCarat: undefined, maxCarat: undefined } });
  }
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    const from = q.minPrice === undefined ? "₹0" : formatINR(q.minPrice);
    const to = q.maxPrice === undefined ? "any" : formatINR(q.maxPrice);
    chips.push({ key: "price", label: `Price: ${from}–${to}`, remove: { minPrice: undefined, maxPrice: undefined } });
  }
  listChips("color", q.color, "Colour");
  listChips("clarity", q.clarity, "Clarity");
  listChips("cut", q.cut, "Cut", CUTS);
  listChips("polish", q.polish, "Polish", FINISHES);
  listChips("symmetry", q.symmetry, "Symmetry", FINISHES);
  listChips("fluorescence", q.fluorescence, "Fluorescence", FLUORESCENCES);
  listChips("lab", q.lab, "Lab");
  if (q.withImage) chips.push({ key: "photo", label: "With photos", remove: { withImage: undefined } });
  if (q.quickShip) chips.push({ key: "quick", label: "Ships fast", remove: { quickShip: undefined } });
  if (q.q) chips.push({ key: "q", label: `Search: “${q.q}”`, remove: { q: undefined } });
  return chips;
}

/** Above the results: how many, active filters, sort order, grid/list, and "Filters" on phones. */
export function ListingToolbar({ total }: { total: number }) {
  const { query, update, view, setView, clearAll } = useListing();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const chips = activeChips(query);
  const active = countActiveFilters(query);
  const sort = query.sort ?? "recommended";

  let countText = `${total.toLocaleString("en-IN")} diamonds`;
  if (total === 1) countText = "1 diamond";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-3 py-2.5">
        <p className="text-sm font-medium" aria-live="polite">
          {countText}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-secondary min-h-10 px-3 text-xs lg:hidden">
            <SlidersHorizontal className="size-4" aria-hidden /> Filters{active > 0 && ` (${active})`}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
              className="field min-h-10 w-auto py-1.5 pr-8 text-sm"
              aria-label="Sort diamonds"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="hidden border border-line sm:flex" role="group" aria-label="Layout">
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("grid size-10 place-items-center", view === "grid" ? "bg-ink text-white" : "hover:bg-stone")} title="Grid">
              <LayoutGrid className="size-4" aria-hidden />
              <span className="sr-only">Show as grid</span>
            </button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("grid size-10 place-items-center border-l border-line", view === "list" ? "bg-ink text-white" : "hover:bg-stone")} title="List">
              <List className="size-4" aria-hidden />
              <span className="sr-only">Show as list</span>
            </button>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2" aria-label="Filters in use">
          {chips.map((c) => (
            <li key={c.key}>
              <button type="button" onClick={() => update(c.remove)} className="inline-flex min-h-8 items-center gap-1.5 border border-line bg-stone px-2.5 text-sm hover:border-ink" aria-label={`Remove ${c.label}`}>
                {c.label} <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={clearAll} className="min-h-8 px-2 text-sm underline underline-offset-4 hover:text-accent-deep">
              Clear all
            </button>
          </li>
        </ul>
      )}

      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="left"
        footer={
          <button type="button" className="btn btn-primary w-full" onClick={() => setFiltersOpen(false)}>
            Show {countText}
          </button>
        }
      >
        <FilterPanel />
      </Dialog>
    </div>
  );
}
