import { X } from "lucide-react";
import Link from "next/link";
import { activeChips, buildHref, clearedFilters } from "@/lib/filters";
import type { ProductFilters } from "@/lib/types/catalog";

/** Chosen filters as removable chips. Plain links, so they work before JavaScript loads. */
export function FilterChips({ filters, basePath }: { filters: ProductFilters; basePath: string }) {
  const chips = activeChips(filters);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="flex flex-wrap gap-2" aria-label="Active filters">
        {chips.map((c) => (
          <li key={c.key}>
            <Link
              href={buildHref(basePath, c.without)}
              scroll={false}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-3 pr-2 text-sm hover:border-ink"
              aria-label={`Remove filter: ${c.label}`}
            >
              {c.label}
              <X className="size-3.5 text-slate" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={buildHref(basePath, clearedFilters(filters))} scroll={false} className="ml-1 text-sm text-slate underline hover:text-ink">
        Clear all
      </Link>
    </div>
  );
}
