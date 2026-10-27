"use client";

import Link from "next/link";
import { Calendar, CheckCircle2, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import type { Product } from "@/lib/types/product";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { SaveButton } from "@/components/product/SaveButton";
import { ShareButton } from "@/components/diamond/ShareButton";
import { CopyText } from "@/components/diamond/CopyText";
import { PincodeCheck } from "@/components/diamond/PincodeCheck";

interface BuyBoxProps {
  product: Product;
}

function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

function formatEnumLabel(val?: string | null): string {
  if (!val) return "—";
  if (val === "LAB_GROWN") return "Lab-Grown";
  if (val === "NATURAL") return "Natural";
  return val
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function BuyBox({ product }: BuyBoxProps) {
  const variant = product.variants?.[0] ?? null;
  const d = product.diamond;
  const inStock = variant?.inStock ?? false;

  const perCaratPaise =
    variant && d && d.carat > 0 ? Math.round(variant.pricePaise / d.carat) : null;

  const waText = `Hello, I have a question about ${product.name}${
    variant?.sku ? ` (SKU: ${variant.sku})` : ""
  }.`;
  const waUrl = whatsappUrl(waText);
  const returnDays = site.returnDays;

  return (
    <div className="space-y-6">
      {/* Eyebrow & Title */}
      <div>
        <p className="eyebrow">
          {d
            ? `${formatEnumLabel(d.origin)} · ${d.lab} Certified`
            : "Certified Loose Diamond"}
          {variant?.sku ? ` · SKU ${variant.sku}` : ""}
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-medium text-ink tracking-tight">
          {product.name}
        </h1>
        {product.description && (
          <p className="mt-2 text-sm text-slate leading-relaxed">{product.description}</p>
        )}
      </div>

      {/* Key 4Cs Grid */}
      {d && (
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-line bg-surface divide-y sm:divide-y-0 sm:divide-x divide-line">
          <div className="p-3.5">
            <p className="text-xs text-slate">Carat</p>
            <p className="mt-1 text-lg font-medium tabular-nums text-ink">
              {d.carat.toFixed(2)} ct
            </p>
          </div>
          <div className="p-3.5">
            <p className="text-xs text-slate">Colour</p>
            <p className="mt-1 text-lg font-medium text-ink">{d.color}</p>
          </div>
          <div className="p-3.5">
            <p className="text-xs text-slate">Clarity</p>
            <p className="mt-1 text-lg font-medium text-ink">{d.clarity}</p>
          </div>
          <div className="p-3.5">
            <p className="text-xs text-slate">{d.cut ? "Cut" : "Polish"}</p>
            <p className="mt-1 text-lg font-medium text-ink">
              {formatEnumLabel(d.cut ?? d.polish)}
            </p>
          </div>
        </div>
      )}

      {/* Price Block */}
      <div className="border-t border-b border-line py-4">
        {variant ? (
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-medium tabular-nums text-ink">
                {formatINR(variant.pricePaise)}
              </span>
              {variant.mrpPaise && variant.mrpPaise > variant.pricePaise && (
                <span className="text-sm tabular-nums text-slate line-through">
                  {formatINR(variant.mrpPaise)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate">
              {perCaratPaise ? `${formatINR(perCaratPaise)} per carat · ` : ""}
              Final price including GST · Insured shipping included
            </p>
          </div>
        ) : (
          <p className="text-lg font-medium text-out">This diamond has been sold.</p>
        )}

        {/* Availability line */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${inStock ? "bg-ok" : "bg-out"}`}
            aria-hidden="true"
          />
          {inStock ? (
            <span className="text-ok font-medium">
              Available · One of a kind: this exact stone
              {d?.quickShip ? " · Dispatches within 24 hours" : ""}
            </span>
          ) : (
            <span className="text-out font-medium">
              Sold ·{" "}
              <Link
                href={d ? `/diamonds?shape=${d.shape.toLowerCase()}` : "/diamonds"}
                className="underline hover:text-ink"
              >
                See similar diamonds
              </Link>
            </span>
          )}
        </div>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <AddToCartButton product={product} />
          </div>
          <SaveButton product={product} withLabel />
          <ShareButton title={product.name} />
        </div>

        {/* Help & Showroom Visit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href={`/contact?type=VIEWING&product=${encodeURIComponent(product.slug)}`}
            className="flex items-center gap-2.5 rounded-[3px] border border-line bg-surface px-3.5 py-2.5 text-xs font-medium text-ink hover:border-ink transition-colors"
          >
            <Calendar className="h-4 w-4 text-loupe shrink-0" />
            <span>Book a Showroom Visit</span>
          </Link>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-[3px] border border-line bg-surface px-3.5 py-2.5 text-xs font-medium text-ink hover:border-ink transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-ok shrink-0" />
              <span>Ask an Expert on WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Certificate Box */}
      {d && (
        <div className="rounded-[4px] border border-line bg-platinum/40 p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              {d.lab} Grading Report
            </span>
            {d.certificateNumber && (
              <CopyText text={d.certificateNumber} label="Copy certificate number">
                <span>{d.certificateNumber}</span>
              </CopyText>
            )}
          </div>
          <p className="text-xs text-slate">
            {formatEnumLabel(d.shape)} · {d.carat.toFixed(2)} ct · {d.color} colour ·{" "}
            {d.clarity} clarity · {formatEnumLabel(d.fluorescence)} fluorescence
          </p>
          {d.verifyUrl && (
            <a
              href={d.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-loupe hover:underline pt-1"
            >
              <span>Verify on {d.lab}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Pincode Serviceability Check */}
      <PincodeCheck />

      {/* Trust promises */}
      <ul className="space-y-2 border-t border-line pt-4 text-xs text-slate">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
          <span>Graded by {d?.lab ?? "GIA or IGI"} and checked before dispatch</span>
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-ok shrink-0" />
          <span>Insured, tamper-evident delivery across India</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
          <span>{returnDays}-day returns with the original grading certificate</span>
        </li>
      </ul>
    </div>
  );
}

export default BuyBox;