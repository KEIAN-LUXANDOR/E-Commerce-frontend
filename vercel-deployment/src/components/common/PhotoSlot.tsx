import Image from "next/image";
import { DiamondArt } from "@/components/art/DiamondArt";
import { photos, type PhotoKey } from "@/config/photos";
import type { Shape } from "@/lib/types/product";
import { cn } from "@/lib/utils";

const RATIO_CLASS: Record<string, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
};

/**
 * A photo from the shoot (src/config/photos.ts). Until the photo is added it shows a calm
 * diamond drawing; while developing, a small label names the slot so it's easy to find.
 */
export function PhotoSlot({
  name,
  className,
  sizes = "100vw",
  priority,
  shape = "ROUND",
  tone = "light",
  fill,
}: {
  name: PhotoKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shape drawn in the placeholder */
  shape?: Shape;
  tone?: "light" | "dark";
  /** Fill the parent instead of using the slot's ratio */
  fill?: boolean;
}) {
  const slot = photos[name];
  const ratio = fill ? "absolute inset-0" : RATIO_CLASS[slot.ratio];

  if (slot.src) {
    return (
      <div className={cn("relative overflow-hidden bg-stone", ratio, className)}>
        <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={slot.alt}
      className={cn(
        "relative grid place-items-center overflow-hidden",
        dark ? "bg-[var(--color-loupe-deep)] text-white/70" : "bg-stone text-ink",
        ratio,
        className,
      )}
    >
      <DiamondArt shape={shape} className={cn("h-3/5 max-h-72 w-auto", dark ? "text-white opacity-50" : "opacity-80")} />
      {process.env.NODE_ENV !== "production" && (
        <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs text-slate shadow-sm">Photo: {name}</span>
      )}
    </div>
  );
}
