"use client";

import { Expand } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { DiamondArt } from "@/components/art/DiamondArt";
import { Dialog } from "@/components/ui/dialog";
import type { Shape } from "@/lib/types/catalog";
import type { StoreImage } from "@/lib/types/store";

/**
 * Product photos: thumbnails, hover zoom on desktop, full-screen view.
 * Without photos it shows the facet drawing of the stone's shape (read from its name).
 */
export function ImageGallery({ images, name, shape }: { images: StoreImage[]; name: string; shape: Shape }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        {images.length > 1 && (
          <ul className="scrollbar-none flex gap-2 overflow-x-auto md:w-20 md:flex-col" aria-label="Choose a photo">
            {images.map((img, i) => (
              <li key={`${img.url}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  aria-label={`Photo ${i + 1} of ${images.length}`}
                  className={`relative block size-16 bg-platinum md:size-20 ${i === active ? "outline outline-2 -outline-offset-2 outline-ink" : "hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-line"}`}
                >
                  <Image src={img.url} alt="" fill unoptimized sizes="80px" className="object-contain p-1.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="relative aspect-square flex-1 overflow-hidden bg-platinum">
          {current ? (
            <ZoomPane>
              <Image src={current.url} alt={current.altText ?? name} fill unoptimized priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
            </ZoomPane>
          ) : (
            <div className="absolute inset-[12%]">
              <DiamondArt shape={shape} title={`${name}, drawing (photo coming soon)`} className="h-full w-full" />
            </div>
          )}
          {current && (
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-surface/90 hover:bg-surface"
              aria-label="View full screen"
            >
              <Expand className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <Dialog open={fullscreen} onClose={() => setFullscreen(false)} title={name} side="center" className="w-[min(64rem,calc(100vw-2rem))]">
        {current && (
          <div className="relative mx-auto aspect-square max-h-[70vh] bg-platinum">
            <Image src={current.url} alt={current.altText ?? name} fill unoptimized sizes="90vw" className="object-contain p-[4%]" />
          </div>
        )}
      </Dialog>
    </div>
  );
}

/** Magnifies the photo under the pointer on devices with a mouse. */
function ZoomPane({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  return (
    <div
      ref={ref}
      className="absolute inset-[6%] [@media(hover:hover)]:cursor-zoom-in"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerLeave={() => setOrigin(null)}
    >
      <div className="relative h-full w-full transition-transform duration-150" style={origin ? { transform: "scale(2)", transformOrigin: origin } : undefined}>
        {children}
      </div>
    </div>
  );
}
