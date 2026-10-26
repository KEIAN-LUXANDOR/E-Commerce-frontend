"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { fetchProductsBySlug } from "@/lib/api/products-browser";
import { cutLabel, finishLabel, fluorescenceLabel, originLabel, shapeLabel } from "@/lib/catalog/labels";
import { isAvailable, mainVariant, pricePerCaratPaise, productHref, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import { clearCompare, removeFromCompare, useCompare } from "@/lib/stores";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface Row {
  label: string;
  value: (p: Product) => string;
}

function priceText(p: Product): string {
  const v = mainVariant(p);
  if (!v) return "—";
  return formatINR(v.pricePaise);
}

function perCaratText(p: Product): string {
  const v = pricePerCaratPaise(p);
  if (v === null) return "—";
  return formatINR(v);
}

const ROWS: Row[] = [
  { label: "Price", value: priceText },
  { label: "Price per carat", value: perCaratText },
  { label: "Shape", value: (p) => (p.diamond ? shapeLabel(p.diamond.shape) : "—") },
  { label: "Carat", value: (p) => (p.diamond ? p.diamond.carat.toFixed(2) : "—") },
  { label: "Colour", value: (p) => p.diamond?.color ?? "—" },
  { label: "Clarity", value: (p) => p.diamond?.clarity ?? "—" },
  { label: "Cut", value: (p) => (p.diamond ? cutLabel(p.diamond.cut) : "—") },
  { label: "Polish", value: (p) => (p.diamond ? finishLabel(p.diamond.polish) : "—") },
  { label: "Symmetry", value: (p) => (p.diamond ? finishLabel(p.diamond.symmetry) : "—") },
  { label: "Fluorescence", value: (p) => (p.diamond ? fluorescenceLabel(p.diamond.fluorescence) : "—") },
  { label: "Type", value: (p) => (p.diamond ? originLabel(p.diamond.origin) : "—") },
  { label: "Grading lab", value: (p) => p.diamond?.lab ?? "—" },
  { label: "Available", value: (p) => (isAvailable(p) ? "Yes" : "Sold") },
];

/** Loads the ticked diamonds from the live catalogue and lays them out side by side. */
export function CompareView() {
  const slugs = useCompare();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const key = slugs.join(",");

  useEffect(() => {
    const ctrl = new AbortController();
    if (key === "") return;
    fetchProductsBySlug(key.split(","), ctrl.signal)
      .then((list) => {
        setProducts(list);
        setError(false);
      })
      .catch(() => setError(true));
    return () => ctrl.abort();
  }, [key]);

  if (slugs.length === 0) {
    return (
      <EmptyState className="mt-10" icon={<ArrowLeftRight className="size-8" />} title="Nothing to compare yet" action={{ label: "Browse diamonds", href: "/diamonds" }}>
        Tick “Compare” on any diamond (up to four), then come back here.
      </EmptyState>
    );
  }
  if (error) return <p className="mt-10 text-out">We couldn’t load these diamonds. Please try again in a minute.</p>;
  if (!products) return <Spinner className="mt-10" label="Loading diamonds" />;

  // Diamonds that were sold and removed from the catalogue
  const missing = slugs.filter((s) => !products.some((p) => p.slug === s));
  const shown = slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));

  return (
    <div className="mt-8">
      {missing.length > 0 && (
        <p className="mb-4 border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn">
          {missing.length} diamond{missing.length > 1 ? "s are" : " is"} no longer available and {missing.length > 1 ? "were" : "was"} left out.{" "}
          <button type="button" className="underline" onClick={() => missing.forEach(removeFromCompare)}>
            Remove from list
          </button>
        </p>
      )}
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <caption className="sr-only">Diamonds compared side by side</caption>
          <thead>
            <tr>
              <th scope="col" className="w-40 p-4 text-left align-bottom">
                <button type="button" onClick={clearCompare} className="text-sm font-normal text-slate underline underline-offset-4 hover:text-ink">
                  Clear all
                </button>
              </th>
              {shown.map((p) => (
                <th key={p.id} scope="col" className="relative min-w-48 border-l border-line p-4 text-left align-top font-normal">
                  <button type="button" onClick={() => removeFromCompare(p.slug)} className="absolute right-2 top-2 grid size-8 place-items-center text-slate hover:bg-stone hover:text-ink" aria-label={`Remove ${p.name}`}>
                    <X className="size-4" aria-hidden />
                  </button>
                  <Link href={productHref(p.slug)} className="block">
                    <span className="relative block aspect-square w-32 border border-line bg-stone">
                      <ProductImage product={p} sizes="128px" />
                    </span>
                    <span className="mt-3 block font-serif text-xl hover:underline">{shortTitle(p)}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map((row) => {
              const values = shown.map((p) => row.value(p));
              const differs = new Set(values).size > 1;
              return (
                <tr key={row.label}>
                  <th scope="row" className="p-4 text-left font-medium text-slate">
                    {row.label}
                  </th>
                  {values.map((v, i) => (
                    <td key={shown[i].id} className={cn("border-l border-line p-4", differs ? "bg-accent-muted/30 font-medium" : "")}>
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <th scope="row" className="p-4">
                <span className="sr-only">Buy</span>
              </th>
              {shown.map((p) => (
                <td key={p.id} className="border-l border-line p-4">
                  <AddToCartButton product={p} size="sm" className="w-full" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate">Highlighted rows are where the diamonds differ. Prices include GST.</p>
    </div>
  );
}
