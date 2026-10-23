import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { Price } from "@/components/ui/Price";
import { diamondTitle, originLabel } from "@/lib/catalog-labels";
import type { DiamondSummary } from "@/lib/types/catalog";

/** One diamond as a card: face-up view, the four grades and the price. */
export function DiamondCard({ diamond, priority }: { diamond: DiamondSummary; priority?: boolean }) {
  const title = diamondTitle(diamond);
  const sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw";

  return (
    <article className="group relative flex flex-col">
      <Link href={`/product/${diamond.slug}`} className="flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-platinum">
          <div className="absolute inset-[12%] transition-opacity duration-300 group-hover:opacity-0">
            <ProductImage media={diamond.media[0]} shape={diamond.shape} alt={`${title} diamond`} sizes={sizes} priority={priority} />
          </div>
          {/* Side profile appears on hover */}
          <div className="absolute inset-[12%] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
            <ProductImage media={diamond.media[1]} shape={diamond.shape} fallbackView="profile" alt="" sizes={sizes} />
          </div>
          <span className="absolute bottom-3 left-3 rounded-full bg-surface px-2.5 py-1 text-xs">
            {originLabel(diamond.origin)}, {diamond.lab}
          </span>
          {(diamond.isNew || !diamond.available) && (
            <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${diamond.available ? "bg-ink text-white" : "bg-surface text-out"}`}>
              {diamond.available ? "New" : "Sold"}
            </span>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-sans text-[0.9375rem] font-medium leading-snug group-hover:underline">{title}</h3>
          {/* The grades a buyer compares first */}
          <dl className="mt-1.5 flex flex-wrap gap-x-3 text-sm text-slate">
            <div className="flex gap-1">
              <dt className="sr-only">Colour</dt>
              <dd>{diamond.color}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Clarity</dt>
              <dd>{diamond.clarity}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Cut</dt>
              <dd>{diamond.cut === "EXCELLENT" ? "Excellent cut" : diamond.cut === "VERY_GOOD" ? "Very good cut" : "Good cut"}</dd>
            </div>
          </dl>
          <p className="mt-2 font-medium">
            <Price paise={diamond.pricePaise} />
          </p>
        </div>
      </Link>

      <WishlistButton
        slug={diamond.slug}
        name={title}
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-surface/70 text-ink hover:bg-surface"
      />
    </article>
  );
}
