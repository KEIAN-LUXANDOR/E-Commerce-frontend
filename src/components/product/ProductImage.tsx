import Image from "next/image";
import { DiamondArt, type ArtView } from "@/components/art/DiamondArt";
import { productShape } from "@/lib/catalog/product";
import type { Product } from "@/lib/types/product";
import type { Media, Shape } from "@/lib/types/catalog";

interface Props {
  product?: Product;
  media?: Media;
  shape?: Shape;
  /** Which drawing to show when there is no photo */
  fallbackView?: ArtView;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Shows the product photo when one exists, otherwise the line drawing. */
export function ProductImage({ product, media, shape, fallbackView = "top", alt, sizes, priority, className }: Props) {
  const imageAlt = alt ?? product?.name ?? media?.alt ?? "Certified diamond";
  if (product) {
    const image = product.images[0];
    if (image?.url) {
      return <Image src={image.url} alt={image.altText ?? imageAlt} fill sizes={sizes} priority={priority} className={`object-contain ${className ?? ""}`} />;
    }
    return <DiamondArt shape={productShape(product)} title={imageAlt} className={`h-full w-full ${className ?? ""}`} />;
  }

  if (media?.url && media.type === "IMAGE") {
    return <Image src={media.url} alt={media.alt || imageAlt} fill sizes={sizes} priority={priority} className={`object-contain ${className ?? ""}`} />;
  }
  return <DiamondArt shape={shape ?? "ROUND"} view={fallbackView} title={imageAlt} className={`h-full w-full ${className ?? ""}`} />;
}
