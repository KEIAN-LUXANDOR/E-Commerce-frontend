"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { SearchX, AlertCircle } from "lucide-react";
import { toShopSearch } from "@/lib/catalog/query";
import type { Origin, ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils";

export interface ListingContextValue {
  query: ProductQuery;
  view: "grid" | "list";
  basePath: string;
  fixedOrigin?: Origin;
  isPending: boolean;
  update: (patch: Partial<ProductQuery>) => void;
  setView: (view: "grid" | "list") => void;
  originHref: (origin: Origin | undefined) => string;
  clearAll: () => void;
  totalItems?: number;
  total?: number;
  params?: Record<string, unknown>;
  setParam?: (k: string, v: unknown) => void;
}

const ListingContext = createContext<ListingContextValue | null>(null);

function pathForOrigin(origin: Origin | undefined): string {
  if (origin === "NATURAL") return "/diamonds/natural";
  if (origin === "LAB_GROWN") return "/diamonds/lab-grown";
  return "/diamonds";
}

const fallbackListingContext: ListingContextValue = {
  query: {},
  view: "grid",
  basePath: "/diamonds",
  fixedOrigin: undefined,
  isPending: false,
  update: () => {},
  setView: () => {},
  originHref: (origin) => pathForOrigin(origin),
  clearAll: () => {},
  totalItems: 0,
  total: 0,
  params: {},
  setParam: () => {},
};

/**
 * Access the active listing state. Safely returns a default fallback
 * rather than throwing a fatal error if mounted outside a provider.
 */
export function useListing(): ListingContextValue {
  const value = useContext(ListingContext);
  return value ?? fallbackListingContext;
}

export function ListingProvider({
  query = {},
  view = "grid",
  basePath = "/diamonds",
  fixedOrigin,
  children,
  totalItems = 0,
  total,
  params,
  setParam,
  ...rest
}: {
  query?: ProductQuery;
  view?: "grid" | "list";
  basePath?: string;
  fixedOrigin?: Origin;
  children: ReactNode;
  totalItems?: number;
  total?: number;
  params?: Record<string, unknown>;
  setParam?: (k: string, v: unknown) => void;
  [key: string]: unknown;
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
    totalItems,
    total: total ?? totalItems,
    params: params ?? (query as Record<string, unknown>),
    setParam: setParam ?? ((k, v) => value.update({ [k]: v as ProductQuery[keyof ProductQuery] })),
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

  return (
    <ListingContext.Provider value={value}>
      <div {...rest}>{children}</div>
    </ListingContext.Provider>
  );
}

// Backward-compatibility alias
export const ListingStateProvider = ListingProvider;

/** Wraps catalog results and fades them while the next query transition loads. */
export function ListingResults({ children }: { children: ReactNode }) {
  const { isPending } = useListing();
  return (
    <div
      aria-busy={isPending}
      className={cn("transition-opacity duration-200", isPending ? "pointer-events-none opacity-50" : "opacity-100")}
    >
      {children}
    </div>
  );
}

export interface ListingEmptyProps {
  kind?: "empty" | "error" | "no-results" | string;
  message?: string;
  resetHref?: string;
  total?: number;
  totalItems?: number;
  [key: string]: unknown;
}

// `total` and `totalItems` are taken out so they are not passed on to the DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListingState({ kind = "empty", message, resetHref, total, totalItems, ...rest }: ListingEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center" {...rest}>
      {kind === "error" ? (
        <AlertCircle className="h-12 w-12 text-out mb-4 opacity-80" strokeWidth={1.5} />
      ) : (
        <SearchX className="h-12 w-12 text-slate mb-4 opacity-80" strokeWidth={1.5} />
      )}
      
      <h3 className="text-lg font-medium text-ink mb-2">
        {kind === "error" ? "Something went wrong" : "No results found"}
      </h3>
      
      <p className="text-sm text-slate max-w-md mx-auto mb-8">
        {message || "We couldn't find any diamonds matching your exact criteria."}
      </p>
      
      {resetHref && (
        <Link
          href={resetHref}
          className="inline-flex h-11 items-center justify-center border border-ink bg-surface px-8 text-xs font-medium uppercase tracking-widest text-ink hover:bg-platinum transition-colors"
        >
          Clear Filters
        </Link>
      )}
    </div>
  );
}

export default ListingState;