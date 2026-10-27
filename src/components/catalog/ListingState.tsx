"use client";

import { createContext, useContext, ReactNode } from "react";
import Link from "next/link";
import { SearchX, AlertCircle } from "lucide-react";

// ==========================================
// 1. STATE MANAGEMENT (Provider & Hook)
// ==========================================

export type ShopParams = Record<string, any>;

export interface ListingStateContext {
  params: ShopParams;
  setParam: (key: string, value: any) => void;
  isPending: boolean;
  totalItems: number;
}

const ListingContext = createContext<ListingStateContext | null>(null);

export function useListing() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListing must be used within a ListingProvider");
  }
  return context;
}

export function ListingProvider({
  children,
  params,
  setParam,
  isPending,
  totalItems,
}: {
  children: ReactNode;
  params: ShopParams;
  setParam: (key: string, value: any) => void;
  isPending: boolean;
  totalItems: number;
}) {
  return (
    <ListingContext.Provider value={{ params, setParam, isPending, totalItems }}>
      {children}
    </ListingContext.Provider>
  );
}


// ==========================================
// 2. VISUAL UI (Empty / Error States)
// ==========================================

export interface ListingStateProps {
  kind: "empty" | "error" | "no-results" | string;
  message?: string;
  resetHref?: string;
}

export function ListingState({ kind, message, resetHref }: ListingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
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
          className="inline-flex h-11 items-center justify-center border border-ink bg-surface px-8 text-xs font-medium uppercase tracking-widest text-ink hover:bg-platinum transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
        >
          Clear Filters
        </Link>
      )}
    </div>
  );
}

// Export the visual component as default for standard page imports
export default ListingState;