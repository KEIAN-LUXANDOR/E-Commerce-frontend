"use client";

import { X } from "lucide-react";

export function FilterChips({ activeFilters, onRemove, onClearAll }: { 
  activeFilters: { key: string; value: string; label: string }[];
  onRemove: (key: string, value: string) => void;
  onClearAll: () => void;
}) {
  if (!activeFilters || activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-[10px] uppercase tracking-widest text-slate mr-2">Filters:</span>
      {activeFilters.map((f, i) => (
        <button
          key={`${f.key}-${f.value}-${i}`}
          onClick={() => onRemove(f.key, f.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1 border border-line bg-surface text-xs text-ink hover:border-ink transition-colors"
        >
          {f.label}
          <X className="h-3 w-3 text-slate" />
        </button>
      ))}
      <button 
        onClick={onClearAll}
        className="ml-2 text-[10px] uppercase tracking-widest text-slate hover:text-ink transition-colors underline"
      >
        Clear All
      </button>
    </div>
  );
}

export default FilterChips;