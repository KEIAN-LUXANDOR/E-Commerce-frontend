import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { ProductImage } from "@/components/product/ProductImage";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}

function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

function formatOrigin(origin?: string | null): string {
  if (origin === "LAB_GROWN") return "Lab-Grown";
  if (origin === "NATURAL") return "Natural";
  return "";
}

export function ProductCard({ product, priority = false, compact = false }: ProductCardProps) {
  const variant = product.variants?.[0] ?? null;
  const d = product.diamond;
  const inStock = variant?.inStock ?? false;

  const subtitle = d
    ? [
        `${d.carat.toFixed(2)} ct`,
        d.color,
        d.clarity,
        d.cut ? d.cut.replace(/_/g, " ").toLowerCase() : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <article className="group relative flex flex-col bg-surface">
      <div className="relative aspect-square w-full overflow-hidden bg-platinum">
        <Link
          href={`/diamond/${product.slug}`}
          className="block h-full w-full focus:outline-none"
          aria-label={product.name}
        >
          <ProductImage
            product={product}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {d?.origin && (
            <span className="bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-ink">
              {formatOrigin(d.origin)}
              {d.lab ? ` · ${d.lab}` : ""}
            </span>
          )}
          {!inStock && (
            <span className="bg-out px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white">
              Sold
            </span>
          )}
        </div>

        <div className="absolute right-2.5 top-2.5">
          <SaveButton product={product} />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
        <div>
          <Link
            href={`/diamond/${product.slug}`}
            className="text-sm font-medium text-ink group-hover:underline"
          >
            {product.name}
          </Link>
          {subtitle && <p className="mt-0.5 text-xs text-slate capitalize">{subtitle}</p>}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 pt-1">
          {variant ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-medium tabular-nums text-ink">
                {formatINR(variant.pricePaise)}
              </span>
              {variant.mrpPaise && variant.mrpPaise > variant.pricePaise && (
                <span className="text-xs tabular-nums text-slate line-through">
                  {formatINR(variant.mrpPaise)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate">Unavailable</span>
          )}

          <AddToCartButton product={product} size={compact ? "sm" : "md"} />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;