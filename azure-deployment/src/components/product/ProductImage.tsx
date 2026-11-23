import Image from "next/image";
import { DiamondArt, type ArtView } from "@/components/art/DiamondArt";
import type { Media, Shape } from "@/lib/types/catalog";

interface ProductImageProps {
  media: Media;
  shape: Shape;
  fallbackView?: ArtView;
  alt?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Shared diamond image renderer for gallery thumbnails, the main gallery and
 * fullscreen view. Uses the supplied photo when available and the existing
 * faceted illustration when the product has no image URL yet.
 */
export function ProductImage({
  media,
  shape,
  fallbackView = "top",
  alt,
  sizes = "100vw",
  priority = false,
}: ProductImageProps) {
  const accessibleAlt = alt ?? media.alt;

  if (media.url && media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt={accessibleAlt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <DiamondArt
      shape={shape}
      view={fallbackView}
      title={accessibleAlt || `${shape.toLowerCase()} diamond illustration`}
      className="h-full w-full"
    />
  );
}

export default ProductImage;
