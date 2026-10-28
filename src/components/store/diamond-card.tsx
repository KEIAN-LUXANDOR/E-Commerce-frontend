import Image from "next/image";
import Link from "next/link";
import { SaveButton } from "@/components/product/SaveButton";
import { formatINR } from "@/lib/format";
import type { DiamondSummary } from "@/lib/types/catalog";

export function DiamondCard({ diamond }: { diamond: DiamondSummary }) {
  const image = diamond.media.find((item) => item.type === "IMAGE" && item.url);
  const title = `${diamond.carat.toFixed(2)} ct ${diamond.shape.toLowerCase().replace(/_/g, " ")}`;

  return (
    <article className="group relative border border-line bg-surface transition-colors hover:border-ink">
      <div className="absolute right-2 top-2 z-10">
        <SaveButton productId={diamond.id} />
      </div>
      <Link href={`/diamond/${encodeURIComponent(diamond.slug)}`} aria-label={`View ${title}`}>
        <div className="relative aspect-square overflow-hidden bg-platinum">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-slate">
              {diamond.shape.replace(/_/g, " ")}
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="truncate text-sm font-medium text-ink">{title}</h3>
          <p className="text-xs text-slate">
            {diamond.color} colour · {diamond.clarity} clarity · {diamond.lab}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-ink">{formatINR(diamond.pricePaise)}</span>
            <span className="text-xs text-slate">{diamond.available ? "Available" : "Sold"}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default DiamondCard;
