import Link from "next/link";
import { Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { CompareToggle } from "@/components/product/CompareToggle";
import { ProductImage } from "@/components/product/ProductImage";
import { SaveButton } from "@/components/product/SaveButton";
import { cutLabel, originLabel } from "@/lib/catalog/labels";
import { compareAtPaise, isAvailable, mainVariant, productHref, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/**
 * One diamond in the grid: photo (or drawing), size and shape, price, the four main grades,
 * and Save / Compare / Add to cart. The whole card opens the diamond page.
 */
export function ProductCard({ product, priority, compact }: { product: Product; priority?: boolean; compact?: boolean }) {
  const d = product.diamond;
  const variant = mainVariant(product);
  const available = isAvailable(product);
  const was = compareAtPaise(variant);
  const href = productHref(product.slug);
  const title = shortTitle(product);

  return (
    <article className="product-card-hover group relative flex flex-col border border-line bg-white">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 text-xs">
        <span className={cn("inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.08em]", available ? "text-ok" : "text-out")}>
          <span className={cn("size-1.5 rounded-full", available ? "bg-ok" : "bg-out")} aria-hidden />
          {available ? "Available" : "Sold"}
        </span>
        {d && <span className="text-slate">{d.lab} certified</span>}
      </div>

      <Link href={href} className="relative mx-3 mt-2 block aspect-square overflow-hidden bg-stone" aria-label={`${title}, view details`} tabIndex={-1}>
        <ProductImage product={product} sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw" priority={priority} className="transition-transform duration-300 group-hover:scale-[1.03]" />
        {d?.quickShip && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-white/95 px-2 py-1 text-xs font-medium text-ink">
            <Zap className="size-3.5" aria-hidden /> Ships fast
          </span>
        )}
      </Link>
      <SaveButton product={product} className="absolute right-5 top-12 z-10" />

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
              {title}
            </Link>
          </h3>
          {variant && (
            <div className="text-right">
              <p className="font-serif text-xl tabular-nums">{formatINR(variant.pricePaise)}</p>
              {was !== null && <p className="text-sm text-slate line-through tabular-nums">{formatINR(was)}</p>}
            </div>
          )}
        </div>
        {d && <p className="mt-1 text-sm text-slate">{originLabel(d.origin)} diamond</p>}

        {d && !compact && (
          <dl className="mt-4 grid grid-cols-4 border border-line text-center">
            <Grade label="Carat" value={d.carat.toFixed(2)} />
            <Grade label="Colour" value={d.color} />
            <Grade label="Clarity" value={d.clarity} />
            <Grade label="Cut" value={d.cut ? cutLabel(d.cut) : "—"} last />
          </dl>
        )}

        {!compact && (
          <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-4">
            <CompareToggle slug={product.slug} name={title} />
            <AddToCartButton product={product} size="sm" />
          </div>
        )}
      </div>
    </article>
  );
}

function Grade({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn("px-1 py-2", last ? "" : "border-r border-line")}>
      <dt className="text-xs uppercase tracking-[0.08em] text-slate">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
