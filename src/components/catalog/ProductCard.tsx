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
    <article className="group relative flex flex-col border border-line bg-surface transition-colors hover:border-ink">
      <div className="absolute top-2 right-2 z-10">
        <SaveButton productId={product.id} />
      </div>
      <Link href={href} className="relative block aspect-square overflow-hidden bg-platinum" aria-label={`View ${title}`}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate text-xs uppercase tracking-widest">
            {productShape(product).replace(/_/g, " ")}
          </div>
        )}
      </Link>
      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <Link href={href} className="mb-1 truncate text-sm font-medium text-ink hover:underline">
          {title}
        </Link>
        <p className="mb-4 flex-1 text-xs text-slate">
          {subtitle}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink">
            {variant ? formatINR(variant.pricePaise) : "Price on request"}
            {crossedOutPrice !== null && (
              <span className="ml-2 text-xs font-normal text-slate line-through">
                {formatINR(crossedOutPrice)}
              </span>
            )}
          </span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;