"use client";

import { RotateCw } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { DiamondArt } from "@/components/art/DiamondArt";
import type { Media, Shape } from "@/lib/types/catalog";

interface Props {
  media: Media;
  shape: Shape;
  title: string;
}

/**
 * Drag (or use ← →) to turn the diamond.
 * With real 360° photography, `media.frames` holds 24–36 image URLs and we show one frame per angle.
 * Without frames (mock data) the illustration turns instead.
 */
export function Viewer360({ media, shape, title }: Props) {
  const frames = media.frames ?? [];
  const steps = frames.length || 36;
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const wrap = (n: number) => ((n % steps) + steps) % steps;

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={`${title}. Drag or use the arrow keys to turn.`}
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={Math.round((index / steps) * 360)}
      aria-valuetext={`${Math.round((index / steps) * 360)} degrees`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setIndex((i) => wrap(i + 1));
        if (e.key === "ArrowLeft") setIndex((i) => wrap(i - 1));
      }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, start: index };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const delta = Math.round((e.clientX - drag.current.x) / 8);
        setIndex(wrap(drag.current.start + delta));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      className="relative h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      {frames.length ? (
        <Image src={frames[index]} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="pointer-events-none object-contain" />
      ) : (
        <DiamondArt shape={shape} view="top" turn={(index / steps) * 360} title={title} className="pointer-events-none h-full w-full" />
      )}
      <p className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-surface/85 px-3 py-1 text-xs text-slate">
        <RotateCw className="size-3.5" aria-hidden /> Drag to turn
      </p>
    </div>
  );
}
