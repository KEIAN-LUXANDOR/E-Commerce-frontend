"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { addToCart, useWishlist, toggleWishlist } from "@/lib/stores";
import type { DiamondSummary } from "@/lib/types/catalog";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { originSlug } from "@/lib/catalog-labels";

interface DiamondCardProps {
  diamond: DiamondSummary;
  priority?: boolean;
  className?: string;
}

export function DiamondCard({ diamond, priority = false, className }: DiamondCardProps) {
  const [added, setAdded] = React.useState(false);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.includes(diamond.slug);

  const formattedPrice = formatINR(diamond.pricePaise);

  let cutLabel = "Good Cut";
  if (diamond.cut === "EXCELLENT") {
    cutLabel = "Excellent Cut";
  } else if (diamond.cut === "VERY_GOOD") {
    cutLabel = "Very Good Cut";
  }

  let originBadgeVariant: "default" | "stone" = "default";
  let originLabel = "Natural";
  if (diamond.origin === "LAB_GROWN") {
    originBadgeVariant = "stone";
    originLabel = "Lab-Grown";
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      diamondId: diamond.id,
      title: `${diamond.carat.toFixed(2)} ct ${diamond.shape} Diamond`,
      slug: diamond.slug,
      pricePaise: diamond.pricePaise,
      shape: diamond.shape,
      specLabel: `${diamond.color} • ${diamond.clarity} • ${cutLabel}`,
      certificateNumber: diamond.certificateNumber,
      imageUrl: diamond.media[0]?.url,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(diamond.slug);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col border border-[var(--color-line)] bg-white transition-all hover:border-[var(--color-ink)] hover:shadow-[0_12px_28px_rgba(22,24,29,0.06)]",
        className
      )}
    >
      <Link href={`/diamonds/${originSlug(diamond.origin)}/${diamond.slug}`} className="flex flex-col flex-1">
        {/* Media Container: Deep Stone Well */}
        <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-stone)] border-b border-[var(--color-line)]">
          {/* Primary View */}
          <div className="absolute inset-[10%] transition-opacity duration-300 group-hover:opacity-0">
            <ProductImage
              media={diamond.media[0]}
              shape={diamond.shape}
              alt={`${diamond.carat} carat ${diamond.shape} diamond`}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priority}
            />
          </div>

          {/* Secondary Profile View on Hover */}
          <div
            className="absolute inset-[10%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          >
            <ProductImage
              media={diamond.media[1] || diamond.media[0]}
              shape={diamond.shape}
              fallbackView="profile"
              alt=""
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </div>

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant={originBadgeVariant}>
              {originLabel}
            </Badge>
            <Badge variant="cert">
              {diamond.lab}
            </Badge>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 grid size-9 place-items-center bg-white/90 border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-white transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-[var(--color-out)] text-[var(--color-out)]")}
            />
          </button>
        </div>

        {/* Diamond Metadata Content */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-lg font-medium text-[var(--color-ink)]">
                {`${diamond.carat.toFixed(2)} Carat`}
              </h3>
              <span className="text-xs font-mono uppercase text-[var(--color-slate)]">
                {diamond.shape}
              </span>
            </div>

            {/* 4Cs Metric Badges */}
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[var(--color-slate)]">
              <span>Color {diamond.color}</span>
              <span>&bull;</span>
              <span>{diamond.clarity}</span>
              <span>&bull;</span>
              <span className="truncate">{cutLabel}</span>
            </div>

            {diamond.certificateNumber && (
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.06em] text-[var(--color-muted)] font-mono">
                Report #{diamond.certificateNumber}
              </p>
            )}
          </div>

          {/* Pricing & Acquisition Action */}
          <div className="pt-2 border-t border-[var(--color-line)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.06em] text-[var(--color-muted)] block">
                Acquisition Price
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                {formattedPrice}
              </span>
            </div>

            <Button
              type="button"
              variant={added ? "accent" : "secondary"}
              size="sm"
              onClick={handleQuickAdd}
              className="text-[0.625rem]"
            >
              {added ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3" />
                  <span>Reserve</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </article>
  );
}
