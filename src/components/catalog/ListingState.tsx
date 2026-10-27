"use client";

import { createContext, useContext, ReactNode } from "react";
import Link from "next/link";
import { SearchX, AlertCircle } from "lucide-react";

// Safely define ShopParams locally to prevent missing export errors from query.ts
export type ShopParams = Record<string, any>;

export interface ListingStateContext {
  params: ShopParams;
  setParam: (key: string, value: any) => void;
  isPending: boolean;
  totalItems: number;
  total?: number;
  query?: ShopParams;
  update?: (updates: Partial<ShopParams>) => void;
  view?: "grid" | "table";
  setView?: (view: "grid" | "table") => void;
  originHref?: string;
  fixedOrigin?: boolean;
  clearAll?: () => void;
}

const ListingContext = createContext<ListingStateContext | null>(null);

export function useListing() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListing must be used within a ListingState provider");
  }
  return context;
}

export function ListingStateProvider({
  children,
  params,
  setParam,
  isPending,
  totalItems,
  total,
  view = "grid",
  setView = () => {},
  clearAll = () => {},
  originHref,
  fixedOrigin,
  ...rest // Absorbs any legacy props passed by page wrappers
}: {
  children: ReactNode;
  params: ShopParams;
  setParam: (key: string, value: any) => void;
  isPending: boolean;
  totalItems: number;
  total?: number;
  view?: "grid" | "table";
  setView?: (view: "grid" | "table") => void;
  clearAll?: () => void;
  originHref?: string;
  fixedOrigin?: boolean;
  [key: string]: any;
}) {
  const update = (updates: Partial<ShopParams>) => {
    Object.entries(updates).forEach(([k, v]) => setParam(k, v));
  };

  return (
    <ListingContext.Provider
      value={{
        params,
        setParam,
        isPending,
        totalItems,
        total: total ?? totalItems,
        query: params,
        update,
        view,
        setView,
        clearAll,
        originHref,
        fixedOrigin,
      }}
    >
      <div {...rest}>{children}</div>
    </ListingContext.Provider>
  );
}

export interface ListingEmptyProps {
  kind?: "empty" | "error" | "no-results" | string;
  message?: string;
  resetHref?: string;
  total?: number;
  totalItems?: number;
  [key: string]: any; // Bypasses strict prop checks for `total`
}

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