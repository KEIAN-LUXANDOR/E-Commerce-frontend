
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { SaveButton } from "@/components/product/SaveButton";
import {
  compareAtPaise,
  gradeLine,
  mainVariant,
  originLine,
  productHref,
  productShape,
  shortTitle,
} from "@/lib/catalog/product";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({
  product,
  compact = false,
}: ProductCardProps) {
  const variant = mainVariant(product);
  const image = product.images[0];

  const title = shortTitle(product);
  const subtitle = gradeLine(product) || product.description;
  const certification = originLine(product);
  const shape = productShape(product).replace(/_/g, " ");

  const href = productHref(product.slug);
  const crossedOutPrice = compareAtPaise(variant);

  return (
    <article
      className={[
        "group relative flex h-full min-w-0 flex-col overflow-hidden",
        "rounded-2xl border border-line bg-surface",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-brand-accent/40",
        "hover:shadow-[0_18px_45px_-28px_rgba(10,25,47,0.3)]",
      ].join(" ")}
    >
      {/* Consistent photography stage */}
      <div className="relative isolate w-full overflow-hidden bg-stone">
        <Link
          href={href}
          aria-label={`View ${title}`}
          className="relative block aspect-square w-full overflow-hidden"
        >
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-2xl text-slate/70">
                {shape}
              </span>
            </div>
          )}

          {/* Shape label */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-[2]">
            <span className="inline-flex items-center border border-white/80 bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur-sm">
              {shape}
            </span>
          </div>

          {/* Image hover action */}
          <span
            aria-hidden="true"
            className={[
              "absolute bottom-4 right-4 z-[2]",
              "flex h-10 w-10 items-center justify-center rounded-full",
              "border border-white/80 bg-white/90 text-ink shadow-sm backdrop-blur-sm",
              "translate-y-2 opacity-0",
              "transition-all duration-300",
              "group-hover:translate-y-0 group-hover:opacity-100",
            ].join(" ")}
          >
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
          </span>
        </Link>

        {/* Save action */}
        <div className="absolute right-4 top-4 z-[3]">
          <SaveButton
            productId={product.id}
            className={[
              "h-11 w-11 rounded-full",
              "border border-white/80 bg-white/95",
              "shadow-sm backdrop-blur-sm",
              "transition-all duration-200",
              "hover:scale-105 hover:bg-white",
            ].join(" ")}
          />
        </div>
      </div>

      {/* Equal-height information area */}
      <div
        className={[
          "flex flex-1 flex-col",
          compact ? "p-4" : "p-4 sm:p-5",
        ].join(" ")}
      >
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2.5 sm:gap-3">

          {/* Left: consistent product information slots */}
          <div className="min-w-0">

            {/* Certification: always reserves two lines */}
            <div className="mb-2 h-8 overflow-hidden">
              {certification ? (
                <p className="line-clamp-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.18em] text-brand-accent">
                  {certification}
                </p>
              ) : (
                <span aria-hidden="true">&nbsp;</span>
              )}
            </div>

            {/* Product name: always reserves two lines */}
            <div className="h-[3.5rem] overflow-hidden">
              <Link
                href={href}
                className={[
                  "block line-clamp-2",
                  "font-serif text-xl leading-[1.12] tracking-tight text-ink",
                  "transition-colors duration-200 hover:text-brand-accent",
                  "sm:text-2xl",
                ].join(" ")}
              >
                {title}
              </Link>
            </div>

            {/* Grading details: always reserves two lines */}
            <div className="mt-2 h-11 overflow-hidden">
              {subtitle ? (
                <p className="line-clamp-2 text-sm leading-[1.375rem] text-slate">
                  {subtitle}
                </p>
              ) : (
                <span aria-hidden="true">&nbsp;</span>
              )}
            </div>
          </div>

          {/* Right: price consistently aligned to bottom */}
          <div className="flex min-w-0 flex-col items-end justify-end pb-0.5 text-right">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate">
              Price
            </p>

            <p className="whitespace-nowrap font-serif text-base leading-tight tracking-tight text-ink sm:text-xl">
              {variant
                ? formatPrice(variant.pricePaise)
                : "On request"}
            </p>

            {crossedOutPrice !== null ? (
              <p className="mt-1 whitespace-nowrap text-xs text-slate/75 line-through">
                {formatPrice(crossedOutPrice)}
              </p>
            ) : (
              <span aria-hidden="true" className="mt-1 h-4" />
            )}
          </div>
        </div>

        {/* Consistent footer position */}
        <div className="mt-5 flex min-h-[3.25rem] items-center justify-between gap-2 border-t border-line/80 pt-3">
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-slate sm:text-[11px] sm:tracking-[0.18em]">
            View diamond details
          </span>

          <Link
            href={href}
            aria-label={`Explore ${title}`}
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              "border border-line-dark/20 bg-white text-ink",
              "transition-all duration-300",
              "hover:border-brand-accent hover:bg-brand-accent hover:text-white",
            ].join(" ")}
          >
            <ArrowUpRight
              className="h-[18px] w-[18px]"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
