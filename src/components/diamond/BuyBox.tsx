"use client";

import { useState } from "react";
import { ShieldCheck, Truck, Sparkles, FileText } from "lucide-react";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { CertificateModal } from "@/components/diamond/CertificateModal";
import { compareAtPaise, mainVariant, originLine, shortTitle } from "@/lib/catalog/product";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types/product";

export function BuyBox({ product }: { product: Product }) {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const variant = mainVariant(product);
  const diamond = product.diamond;
  const crossedOutPrice = compareAtPaise(variant);

  return (
    <>
      <section className="sticky top-24 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-stone px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate">
            <span className="size-1.5 rounded-full bg-loupe" />
            {originLine(product) || "Certified Loose Diamond"}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-serif font-medium text-ink tracking-tight">
            {shortTitle(product)}
          </h1>
          {product.name !== shortTitle(product) && (
            <p className="mt-1 text-xs text-slate font-mono">{product.name}</p>
          )}
        </div>

        <div className="flex items-baseline gap-3 border-y border-line/60 py-4">
          <p className="text-2xl sm:text-3xl font-bold font-mono text-ink">
            {variant ? formatPrice(variant.pricePaise) : "Price on request"}
          </p>
          {crossedOutPrice !== null && (
            <p className="text-sm font-mono text-slate line-through">{formatPrice(crossedOutPrice)}</p>
          )}
        </div>

        <dl className="space-y-2.5 text-sm">
          <Spec label="Shape" value={diamond?.shape.replace(/_/g, " ") ?? "Loose diamond"} />
          {diamond && <Spec label="Carat Weight" value={`${diamond.carat.toFixed(2)} ct`} />}
          {diamond && <Spec label="Colour Grade" value={diamond.color} />}
          {diamond && <Spec label="Clarity Grade" value={diamond.clarity} />}
          {diamond && <Spec label="Cut Grade" value={diamond.cut ?? "Not graded"} />}
          {diamond && <Spec label="Grading Laboratory" value={diamond.lab} />}
        </dl>

        <div className="space-y-3 pt-2">
          <AddToCartButton product={product} />
          {diamond && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={<FileText className="size-4" />}
              onClick={() => setCertificateOpen(true)}
            >
              View {diamond.lab} Grading Report
            </Button>
          )}
          <SaveButton productId={product.id} variant="button" />
        </div>

        {/* TailGrids luxury trust points */}
        <div className="pt-4 border-t border-line/60 space-y-2.5 text-xs text-slate">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-ink shrink-0" />
            <span>Free delivery across India</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-ok shrink-0" />
            <span>Tamper-evident cassette with laser inscription verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-accent shrink-0" />
            <span>30-day inspection &amp; appraisal return guarantee</span>
          </div>
        </div>
      </section>
      {certificateOpen && <CertificateModal product={product} onClose={() => setCertificateOpen(false)} />}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/40 pb-2">
      <dt className="text-slate font-normal">{label}</dt>
      <dd className="text-right font-semibold font-mono text-ink uppercase">{value}</dd>
    </div>
  );
}

export default BuyBox;