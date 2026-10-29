"use client";

import { useListing } from "@/components/catalog/ListingState";
import { LayoutGrid, Table } from "lucide-react";

export interface ListingToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  total?: number;
}

export function ListingToolbar({ total, className, ...rest }: ListingToolbarProps) {
  const { totalItems = 0, view = "grid", setView } = useListing();
  const displayTotal = total !== undefined ? total : totalItems;

  return (
    <div className={`flex items-center justify-between border-b border-line pb-4 mb-6 ${className || ""}`} {...rest}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate">
        Showing <span className="text-ink font-bold font-mono text-sm">{displayTotal}</span> Certified Solitaires
      </p>

      <div className="flex items-center gap-1.5 rounded-lg border border-line bg-stone p-1">
        <button
          type="button"
          onClick={() => setView("grid")}
          className={`flex items-center justify-center rounded-md p-2 text-xs font-medium transition-all cursor-pointer ${
            view === "grid"
              ? "bg-slate-900 bg-ink text-white shadow-xs"
              : "text-slate hover:text-ink hover:bg-surface"
          }`}
          aria-label="Grid View"
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          className={`flex items-center justify-center rounded-md p-2 text-xs font-medium transition-all cursor-pointer ${
            view === "list"
              ? "bg-slate-900 bg-ink text-white shadow-xs"
              : "text-slate hover:text-ink hover:bg-surface"
          }`}
          aria-label="Table View"
        >
          <Table className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default ListingToolbar;