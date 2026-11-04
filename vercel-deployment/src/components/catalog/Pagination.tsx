import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toShopSearch } from "@/lib/catalog/query";
import type { ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/** Page numbers as real links (so Google and the back button work). Shows 1 … 4 5 6 … 20. */
export function Pagination({
  basePath,
  query,
  view,
  totalPages,
  includeOrigin,
}: {
  basePath: string;
  query: ProductQuery;
  view: "grid" | "list";
  totalPages: number;
  includeOrigin?: boolean;
}) {
  const current = query.page ?? 0;
  if (totalPages <= 1) return null;

  const href = (page: number) => basePath + toShopSearch({ ...query, page }, view, includeOrigin);
  const pages: (number | "gap")[] = [];
  for (let i = 0; i < totalPages; i++) {
    const near = Math.abs(i - current) <= 1;
    if (i === 0 || i === totalPages - 1 || near) pages.push(i);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  return (
    <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-1">
      {current > 0 && (
        <Link href={href(current - 1)} className="grid size-11 place-items-center border border-line hover:border-ink" aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      )}
      {pages.map((p, i) => {
        if (p === "gap") {
          return (
            <span key={`gap-${i}`} className="px-2 text-slate" aria-hidden>
              …
            </span>
          );
        }
        const isCurrent = p === current;
        return (
          <Link
            key={p}
            href={href(p)}
            aria-current={isCurrent ? "page" : undefined}
            className={cn("grid size-11 place-items-center border text-sm tabular-nums", isCurrent ? "border-ink bg-ink text-white" : "border-line hover:border-ink")}
          >
            {p + 1}
          </Link>
        );
      })}
      {current < totalPages - 1 && (
        <Link href={href(current + 1)} className="grid size-11 place-items-center border border-line hover:border-ink" aria-label="Next page">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
