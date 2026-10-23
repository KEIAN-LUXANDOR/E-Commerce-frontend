"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart, ShoppingBag, Check } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { StoreProduct } from "@/lib/types/store";
import { shapeFromName } from "@/lib/product-display";
import { DiamondArt } from "@/components/art/DiamondArt";
import { addToCart, useWishlist, toggleWishlist, showToast } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: StoreProduct;
  priority?: boolean;
  className?: string;
}) {
  const [added, setAdded] = React.useState(false);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.includes(product.slug);

  const sortedVariants = [...product.variants].sort((a, b) => a.pricePaise - b.pricePaise);
  const variant = sortedVariants[0];
  const image = product.images[0];
  const shape = shapeFromName(product.name) ?? "ROUND";

  const isLabGrown =
    product.name.toLowerCase().includes("lab") ||
    (product.description?.toLowerCase().includes("lab") ?? false);

  const originLabel = isLabGrown ? "Lab-Grown" : "Natural";

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!variant) return;

    addToCart({
      diamondId: variant.id,
      title: product.name,
      slug: product.slug,
      pricePaise: variant.pricePaise,
      shape,
      specLabel: variant.name ? `${variant.name} • SKU ${variant.sku}` : `SKU ${variant.sku}`,
      certificateNumber: variant.sku,
      imageUrl: image?.url,
    });

    setAdded(true);
    showToast("Diamond reserved in your cart.", "info");
    setTimeout(() => setAdded(false), 2000);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col border border-[var(--color-line)] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-accent)] hover:shadow-[0_16px_32px_rgba(212,175,55,0.10)]",
        className
      )}
    >
      <Link href={`/product/${encodeURIComponent(product.slug)}`} className="flex flex-col flex-1">
        {/* Media Container: Archival Deep Stone Well */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#F6F4EF] border-b border-[var(--color-line)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-6 mix-blend-multiply opacity-90 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-[var(--color-ink)]">
              <DiamondArt shape={shape} title={product.name} className="w-24 h-24 max-w-full max-h-full" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.08)]" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span
              className={cn(
                "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border",
                isLabGrown
                  ? "bg-gradient-to-r from-[#EAF3ED] to-white text-[#2F6B4F] border-[#9FC6AA]"
                  : "bg-gradient-to-r from-[#FCF8E9] to-white text-[var(--color-ink)] border-[var(--brand-accent)]/60"
              )}
            >
              {originLabel}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-white/95 text-[var(--color-slate)] border border-[var(--color-line)] flex items-center gap-1">
              <ShieldCheck className="size-3 text-[#2F6B4F]" /> Certified
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 grid size-8 place-items-center border border-[var(--color-line)] bg-white/75 text-[var(--color-ink)] backdrop-blur-md transition-colors hover:border-[var(--brand-accent)] hover:bg-white"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isWishlisted && "fill-red-600 text-red-600"
              )}
            />
          </button>

          {/* Bottom Reticle Badge */}
          <div className="absolute bottom-2.5 left-3 text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted)] bg-white/90 px-1.5 py-0.5 border border-[var(--color-line)] pointer-events-none">
            {shape} · 40× Loupe Ready
          </div>
        </div>

        {/* Specimen Content Ledger */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          <div>
            {variant && (
              <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)] font-mono">
                SKU: {variant.sku}
              </p>
            )}

            <h3 className="mt-1 font-serif text-[17px] leading-snug font-normal text-[var(--color-ink)] group-hover:text-black transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Spec subline */}
            <p className="mt-1.5 text-xs font-mono text-[var(--color-slate)] line-clamp-1">
              {variant?.name ?? "Surat Atelier Certified Specimen"}
            </p>
          </div>

          {/* Pricing & Acquisition Action */}
          <div className="pt-2.5 border-t border-[var(--color-line)] flex items-center justify-between gap-2">
            <div>
              <span className="mb-1 block h-px w-8 bg-[var(--brand-accent)]" />
              <span className="text-[9.5px] uppercase tracking-[0.06em] text-[var(--color-muted)] font-mono block">
                Price
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                {variant ? formatINR(variant.pricePaise) : "Price on inquiry"}
              </span>
            </div>

            {variant && (
              <button
                type="button"
                onClick={handleQuickAdd}
                className={cn(
                  "h-8 px-3 text-[11px] font-mono uppercase tracking-wider border transition-colors flex items-center gap-1.5 shrink-0 rounded-none",
                  added
                    ? "bg-[#2F6B4F] text-white border-[#2F6B4F]"
                    : "bg-white text-[var(--color-ink)] border-[var(--color-ink)] hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[var(--canvas-dark)]"
                )}
              >
                {added ? (
                  <>
                    <Check className="size-3" />
                    <span>Reserved</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-3" />
                    <span>Reserve</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
