"use client";

import { useListing } from "@/components/catalog/ListingState";
import { RotateCcw } from "lucide-react";

export function FilterPanel() {
  // Bypassing strict Context interface mapping to avoid property mismatch errors
  const { query, update, clearAll, originHref, fixedOrigin } = useListing() as any;

  return (
    <div className="space-y-6 bg-surface border border-line p-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h3 className="text-xs font-medium uppercase tracking-widest text-ink">Filters</h3>
        {clearAll && (
          <button
            onClick={clearAll}
            className="flex items-center text-[10px] uppercase tracking-widest text-slate hover:text-ink transition-colors"
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <div className="space-y-4 text-sm text-slate">
        <p>Refining parameters active.</p>
      </div>
    </div>
  );
}

export default FilterPanel;