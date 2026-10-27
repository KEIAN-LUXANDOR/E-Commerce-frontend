"use client";

import { FilterControls } from "./FilterControls";
import { FilterChips } from "./FilterChips";
import { RotateCcw } from "lucide-react";

export function FilterPanel({ query, update, clearAll }: { query: any; update: (updates: any) => void; clearAll: () => void }) {
  
  const extractActiveFilters = () => {
    const active: { key: string; value: string; label: string }[] = [];
    if (!query) return active;
    
    ["shape", "color", "clarity"].forEach((key) => {
      const val = query[key];
      if (Array.isArray(val)) {
        val.forEach(v => active.push({ key, value: v, label: v }));
      } else if (val) {
        active.push({ key, value: val, label: val });
      }
    });
    return active;
  };

  const activeFilters = extractActiveFilters();

  const handleRemoveFilter = (key: string, value: string) => {
    const current = Array.isArray(query[key]) ? query[key] : (query[key] ? [query[key]] : []);
    const updated = current.filter((v: string) => v !== value);
    update({ [key]: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="space-y-6 bg-surface border border-line p-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h3 className="text-xs font-medium uppercase tracking-widest text-ink">Filters</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center text-[10px] uppercase tracking-widest text-slate hover:text-ink transition-colors"
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Reset All
          </button>
        )}
      </div>

      <FilterChips 
        activeFilters={activeFilters} 
        onRemove={handleRemoveFilter} 
        onClearAll={clearAll} 
      />

      <FilterControls query={query || {}} onChange={update} />
    </div>
  );
}

export default FilterPanel;