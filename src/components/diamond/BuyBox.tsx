"use client";

import { useState } from "react";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { CertificateModal } from "@/components/diamond/CertificateModal";
import { compareAtPaise, mainVariant, originLine, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types/product";

export function BuyBox({ product }: { product: Product }) {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const variant = mainVariant(product);
  const diamond = product.diamond;
  const crossedOutPrice = compareAtPaise(variant);

  return (
    <>
      <section className="sticky top-24 border border-line bg-surface p-6">
        <p className="eyebrow">{originLine(product) || "Certified loose diamond"}</p>
        <h1 className="mt-2 text-2xl font-serif text-ink">{shortTitle(product)}</h1>
        {product.name !== shortTitle(product) && (
          <p className="mt-1 text-sm text-slate">{product.name}</p>
        )}

        <div className="mt-6 flex items-baseline gap-3">
          <p className="text-xl font-medium text-ink">
            {variant ? formatINR(variant.pricePaise) : "Price on request"}
          </p>
          {crossedOutPrice !== null && (
            <p className="text-sm text-slate line-through">{formatINR(crossedOutPrice)}</p>
          )}
        </div>

        <dl className="mt-6 space-y-3 text-sm text-slate">
          <Spec label="Shape" value={diamond?.shape.replace(/_/g, " ") ?? "Loose diamond"} />
          {diamond && <Spec label="Carat" value={`${diamond.carat.toFixed(2)} ct`} />}
          {diamond && <Spec label="Colour" value={diamond.color} />}
          {diamond && <Spec label="Clarity" value={diamond.clarity} />}
          {diamond && <Spec label="Cut" value={diamond.cut ?? "Not graded"} />}
        </dl>

        <div className="mt-8 flex flex-col gap-3">
          <AddToCartButton product={product} />
          {diamond && (
            <button type="button" className="btn btn-secondary" onClick={() => setCertificateOpen(true)}>
              View grading report
            </button>
          )}
          <SaveButton productId={product.id} variant="button" />
        </div>

        <p className="mt-5 text-xs text-slate">
          {variant?.inStock ? "Available for purchase" : "Currently unavailable"}
        </p>
      </section>
      {certificateOpen && <CertificateModal product={product} onClose={() => setCertificateOpen(false)} />}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt>{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

export default BuyBox;