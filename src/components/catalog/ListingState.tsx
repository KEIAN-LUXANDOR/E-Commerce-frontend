"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { toShopSearch } from "@/lib/catalog/query";
import type { Origin, ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/**
 * Shared state for one shop page: the current filters (from the address bar) and a `navigate`
 * function that changes them. Results dim while the new list loads.
 */

interface ListingContextValue {
  query: ProductQuery;
  view: "grid" | "list";
  /** Path without filters, e.g. /diamonds/natural */
  basePath: string;
  /** Origin fixed by the path (/diamonds/natural); undefined on /diamonds */
  fixedOrigin?: Origin;
  isPending: boolean;
  /** Apply new filters. Any filter change goes back to page 1. */
  update: (patch: Partial<ProductQuery>) => void;
  setView: (view: "grid" | "list") => void;
  /** Link to another origin's page keeping the other filters */
  originHref: (origin: Origin | undefined) => string;
  clearAll: () => void;
}

const ListingContext = createContext<ListingContextValue | null>(null);

export function useListing(): ListingContextValue {
  const value = useContext(ListingContext);
  if (!value) throw new Error("useListing must be used inside <ListingProvider>");
  return value;
}

function pathForOrigin(origin: Origin | undefined): string {
  if (origin === "NATURAL") return "/diamonds/natural";
  if (origin === "LAB_GROWN") return "/diamonds/lab-grown";
  return "/diamonds";
}

export function ListingProvider({
  query,
  view,
  basePath,
  fixedOrigin,
  children,
}: {
  query: ProductQuery;
  view: "grid" | "list";
  basePath: string;
  fixedOrigin?: Origin;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function go(href: string) {
    startTransition(() => router.push(href, { scroll: false }));
  }

  const value: ListingContextValue = {
    query,
    view,
    basePath,
    fixedOrigin,
    isPending,
    update(patch) {
      const next: ProductQuery = { ...query, ...patch, page: 0 };
      if (fixedOrigin) next.origin = fixedOrigin;
      go(basePath + toShopSearch(next, view, !fixedOrigin));
    },
    setView(nextView) {
      go(basePath + toShopSearch(query, nextView, !fixedOrigin));
    },
    originHref(origin) {
      const next: ProductQuery = { ...query, origin: undefined, page: 0 };
      return pathForOrigin(origin) + toShopSearch(next, view);
    },
    clearAll() {
      let keep: ProductQuery = {};
      if (query.q) keep = { q: query.q };
      go(basePath + toShopSearch(keep, view));
    },
  };

  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>;
}

/** Wraps the results; fades them while the next set loads. */
export function ListingResults({ children }: { children: React.ReactNode }) {
  const { isPending } = useListing();
  return (
    <div aria-busy={isPending} className={cn("transition-opacity duration-200", isPending ? "pointer-events-none opacity-50" : "opacity-100")}>
      {children}
    </div>
  );
}
