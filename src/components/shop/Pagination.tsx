import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buildHref } from "@/lib/filters";
import type { ProductFilters } from "@/lib/types/catalog";

/** Numbered pages with previous/next, e.g. 1 … 4 5 6 … 12. Real links, so Google can follow them. */
export function Pagination({ page, totalPages, filters, basePath }: { page: number; totalPages: number; filters: ProductFilters; basePath: string }) {
  if (totalPages <= 1) return null;
  const href = (p: number) => buildHref(basePath, { ...filters, page: p });

  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  const cell = "grid h-10 min-w-10 place-items-center rounded-[3px] px-2 text-sm tabular-nums";
  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${cell} hover:bg-platinum`} aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={`${cell} text-line`} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pages.map((p, i) =>
        p === "gap" ? (
          <span key={`g${i}`} className={`${cell} text-slate`} aria-hidden>
            …
          </span>
        ) : (
          <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined} className={`${cell} ${p === page ? "bg-ink text-white" : "hover:bg-platinum"}`}>
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${cell} hover:bg-platinum`} aria-label="Next page">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={`${cell} text-line`} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
