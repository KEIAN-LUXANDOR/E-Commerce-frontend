"use client";

import { LayoutGrid, List } from "lucide-react";
import { useListing } from "@/components/shop/ListingProvider";

/** Switch between cards and the comparison table. Kept in the URL as ?view=list. */
export function ViewToggle() {
  const { filters, navigate } = useListing();
  const list = filters.view === "list";
  const btn = "grid size-11 place-items-center";
  return (
    <div role="group" aria-label="Layout" className="flex shrink-0 overflow-hidden rounded-[3px] border border-line bg-surface">
      <button type="button" aria-pressed={!list} aria-label="Show as cards" onClick={() => navigate({ ...filters, view: undefined })} className={`${btn} ${!list ? "bg-ink text-white" : "hover:bg-platinum"}`}>
        <LayoutGrid className="size-4" aria-hidden />
      </button>
      <button type="button" aria-pressed={list} aria-label="Show as a table" onClick={() => navigate({ ...filters, view: "list" })} className={`${btn} border-l border-line ${list ? "bg-ink text-white" : "hover:bg-platinum"}`}>
        <List className="size-4" aria-hidden />
      </button>
    </div>
  );
}
