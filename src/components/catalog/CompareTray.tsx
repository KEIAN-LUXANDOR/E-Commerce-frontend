"use client";

import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { COMPARE_LIMIT, clearCompare, useCompare } from "@/lib/stores";

/** Small bar at the bottom of the shop when diamonds are ticked for comparison. */
export function CompareTray() {
  const list = useCompare();
  if (list.length === 0) return null;
  const ready = list.length >= 2;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur" role="region" aria-label="Compare">
      <div className="page flex items-center justify-between gap-3 py-3">
        <p className="flex items-center gap-2 text-sm">
          <ArrowLeftRight className="size-4" aria-hidden />
          <span>
            <strong className="font-medium">{list.length}</strong> of {COMPARE_LIMIT} selected to compare
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clearCompare} className="min-h-11 px-2 text-sm underline underline-offset-4">
            Clear
          </button>
          <Link href="/compare" className="btn btn-primary min-h-11" aria-disabled={!ready}>
            {ready ? "Compare now" : "Pick one more"}
          </Link>
        </div>
      </div>
    </div>
  );
}
