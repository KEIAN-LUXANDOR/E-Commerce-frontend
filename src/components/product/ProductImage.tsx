import Image from "next/image";
import { DiamondArt, type ArtView } from "@/components/art/DiamondArt";
import type { Media, Shape } from "@/lib/types/catalog";

interface Props {
  media?: Media;
  shape: Shape;
  /** Which drawing to show when there is no photo */
  fallbackView?: ArtView;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Shows the diamond photo when one exists, otherwise the line drawing. */
export function ProductImage({ media, shape, fallbackView = "top", alt, sizes, priority, className }: Props) {
  if (media?.url && media.type === "IMAGE") {
    return <Image src={media.url} alt={media.alt || alt} fill sizes={sizes} priority={priority} className={`object-contain ${className ?? ""}`} />;
  }
  return <DiamondArt shape={shape} view={fallbackView} title={alt} className={`h-full w-full ${className ?? ""}`} />;
}
