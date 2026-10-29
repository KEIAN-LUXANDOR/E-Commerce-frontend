"use client";

import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { compareAtPaise, gradeLine, mainVariant, productHref, productShape, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const variant = mainVariant(product);
  const image = product.images[0];
  const title = shortTitle(product);
  const subtitle = gradeLine(product) || product.description;
  const href = productHref(product.slug);
  const crossedOutPrice = compareAtPaise(variant);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-surface shadow-xs transition-all duration-300 hover:shadow-md hover:border-loupe/40 overflow-hidden">
      <div className="absolute top-3 right-3 z-10">
        <SaveButton productId={product.id} />
      </div>

      <Link href={href} className="relative block aspect-square overflow-hidden bg-stone" aria-label={`View ${title}`}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate text-xs uppercase tracking-widest font-mono">
            {productShape(product).replace(/_/g, " ")}
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <Link href={href} className="mb-1 truncate text-base font-serif font-medium text-ink group-hover:text-loupe transition-colors">
          {title}
        </Link>
        <p className="mb-4 flex-1 text-xs text-slate font-mono line-clamp-2">
          {subtitle}
        </p>
        <div className="mt-auto space-y-3 pt-2 border-t border-line/60">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold font-mono text-ink">
              {variant ? formatINR(variant.pricePaise) : "Price on request"}
              {crossedOutPrice !== null && (
                <span className="ml-2 text-xs font-normal text-slate line-through">
                  {formatINR(crossedOutPrice)}
                </span>
              )}
            </span>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;