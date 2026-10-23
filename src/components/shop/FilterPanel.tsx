"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FilterControls } from "@/components/shop/FilterControls";
import { useListing } from "@/components/shop/ListingProvider";
import { Dialog } from "@/components/ui/dialog";
import { activeChips, clearedFilters, withFilters } from "@/lib/filters";
import type { ProductFilters } from "@/lib/types/catalog";

/** Desktop: filters apply as soon as they change. */
export function FilterSidebar({ hide }: { hide?: (keyof ProductFilters)[] }) {
  const { filters, navigate } = useListing();
  return <FilterControls value={filters} hide={hide} onChange={(patch) => navigate(withFilters(filters, patch))} />;
}

/** Mobile: filters are chosen in a drawer and applied together with "Show results". */
export function MobileFilterButton({ hide, total }: { hide?: (keyof ProductFilters)[]; total: number }) {
  const { filters, navigate } = useListing();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProductFilters>(filters);
  const count = activeChips(filters).length;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDraft(filters);
          setOpen(true);
        }}
        className="btn btn-secondary shrink-0 px-3.5 lg:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters{count ? ` (${count})` : ""}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        side="bottom"
        footer={
          <div className="flex gap-3">
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setDraft(clearedFilters(filters))}>
              Clear all
            </button>
            <button
              type="button"
              className="btn btn-primary flex-[2]"
              onClick={() => {
                navigate(draft);
                setOpen(false);
              }}
            >
              Show results
            </button>
          </div>
        }
      >
        <p className="sr-only">{total} results before changes</p>
        <FilterControls value={draft} hide={hide} onChange={(patch) => setDraft((d) => withFilters(d, patch))} />
      </Dialog>
    </>
  );
}
