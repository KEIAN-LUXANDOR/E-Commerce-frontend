"use client";

import { Expand, Play, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import { DiamondArt } from "@/components/art/DiamondArt";
import { ProductImage } from "@/components/product/ProductImage";
import { Viewer360 } from "@/components/product/Viewer360";
import { Dialog } from "@/components/ui/dialog";
import type { Media, Shape } from "@/lib/types/catalog";

interface Props {
  media: Media[];
  shape: Shape;
  name: string;
}

/**
 * Diamond photos with thumbnails, hover zoom on desktop, full-screen view,
 * video and 360° view. Swipe between photos on phones.
 */
export function Gallery({ media, shape, name }: Props) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const current = media[Math.min(active, media.length - 1)];
  const views: ("top" | "profile")[] = ["top", "profile"];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        {/* Thumbnails */}
        <ul className="scrollbar-none flex gap-2 overflow-x-auto md:w-20 md:flex-col" aria-label="Choose a view">
          {media.map((m, i) => (
            <li key={m.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                aria-label={m.alt}
                className={`relative grid size-16 place-items-center bg-platinum p-1 md:size-20 ${i === active ? "outline outline-2 -outline-offset-2 outline-ink" : "hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-line"}`}
              >
                {m.type === "IMAGE" ? (
                  <span className="relative h-full w-full">
                    <ProductImage media={m} shape={shape} fallbackView={views[i % 2]} alt="" sizes="80px" />
                  </span>
                ) : m.type === "SPIN_360" ? (
                  <span className="flex flex-col items-center gap-0.5 text-[0.6875rem] text-slate">
                    <RotateCw className="size-5 text-ink" aria-hidden />
                    360°
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-0.5 text-[0.6875rem] text-slate">
                    <Play className="size-5 text-ink" aria-hidden />
                    Video
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Main view */}
        <div className="relative aspect-square flex-1 overflow-hidden bg-platinum">
          {current?.type === "SPIN_360" ? (
            <div className="absolute inset-[10%]">
              <Viewer360 media={current} shape={shape} title={`${name}, 360° view`} />
            </div>
          ) : current?.type === "VIDEO" && current.url ? (
            <video
              key={current.id}
              src={current.url}
              poster={current.posterUrl}
              controls
              muted
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-contain"
              aria-label={current.alt}
            />
          ) : (
            <ZoomPane>
              <ProductImage media={current} shape={shape} fallbackView={views[active % 2]} alt={current?.alt ?? name} sizes="(min-width: 1024px) 50vw, 100vw" priority />
            </ZoomPane>
          )}

          {current?.type === "IMAGE" && (
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
        <div className="relative mx-auto aspect-square max-h-[70vh] bg-platinum">
          <div className="absolute inset-[5%]">
            {current?.url ? (
              <ProductImage media={current} shape={shape} alt={current.alt} sizes="90vw" />
            ) : (
              <DiamondArt shape={shape} view={views[active % 2]} title={current?.alt ?? name} className="h-full w-full" />
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

/** Magnifies the image under the pointer on devices with a mouse. */
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
      <div
        className="relative h-full w-full transition-transform duration-150"
        style={origin ? { transform: "scale(2)", transformOrigin: origin } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
