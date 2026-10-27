"use client";

import { LayoutGrid, List } from "lucide-react";
import { useListingContext } from "./ListingProvider";

export function ViewToggle() {
  const { params, updateParams } = useListingContext();
  const view = params.view || "grid";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateParams({ view: "grid" })}
        className={`p-2 border transition-colors ${
          view === "grid" ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:text-ink"
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => updateParams({ view: "list" })}
        className={`p-2 border transition-colors ${
          view === "list" ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:text-ink"
        }`}
        aria-label="List View"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ViewToggle;