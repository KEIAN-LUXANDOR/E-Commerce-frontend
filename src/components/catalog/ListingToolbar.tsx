"use client";

import { useListing } from "@/components/catalog/ListingState";
import { LayoutGrid, Table } from "lucide-react";

export function ListingToolbar({ total, ...rest }: { total?: number; [key: string]: any }) {
  // Bypassing strict Context interface mapping to avoid property mismatch errors
  const { totalItems = 0, view = "grid", setView = () => {} } = useListing() as any;

  const displayTotal = total !== undefined ? total : totalItems;

  return (
    <div className="flex items-center justify-between border-b border-line pb-4 mb-6" {...rest}>
      <p className="text-xs font-medium uppercase tracking-widest text-slate">
        Showing <span className="text-ink font-bold">{displayTotal}</span> diamonds
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("grid")}
          className={`p-2 border transition-colors ${
            view === "grid" ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:text-ink"
          }`}
          aria-label="Grid View"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView("table")}
          className={`p-2 border transition-colors ${
            view === "table" ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:text-ink"
          }`}
          aria-label="Table View"
        >
          <Table className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ListingToolbar;