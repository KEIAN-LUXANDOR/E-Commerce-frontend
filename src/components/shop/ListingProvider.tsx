"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useTransition, type ReactNode } from "react";
import { buildHref } from "@/lib/filters";
import type { ProductFilters } from "@/lib/types/catalog";

interface ListingContext {
  filters: ProductFilters;
  basePath: string;
  pending: boolean;
  /** Puts new filters in the URL; the server re-renders the results. */
  navigate: (next: ProductFilters) => void;
}

const Ctx = createContext<ListingContext | null>(null);

export function ListingProvider({ filters, basePath, children }: { filters: ProductFilters; basePath: string; children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = (next: ProductFilters) =>
    startTransition(() => {
      router.push(buildHref(basePath, next), { scroll: false });
    });
  return <Ctx value={{ filters, basePath, pending, navigate }}>{children}</Ctx>;
}

export function useListing() {
  const ctx = use(Ctx);
  if (!ctx) throw new Error("useListing must be used inside <ListingProvider>");
  return ctx;
}

/** Dims the results while new ones load, and tells screen readers. */
export function ResultsRegion({ children }: { children: ReactNode }) {
  const { pending } = useListing();
  return (
    <div aria-busy={pending} className={`transition-opacity ${pending ? "pointer-events-none opacity-50" : ""}`}>
      {children}
    </div>
  );
}
