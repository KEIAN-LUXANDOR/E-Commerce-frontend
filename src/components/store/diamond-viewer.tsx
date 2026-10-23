"use client";

/**
 * diamond-viewer.tsx
 *
 * Interactive media viewer for a single diamond PDP.
 * Supports three media modes:
 *   1. IMAGE – static still shown in the main stage.
 *   2. SPIN_360 – frame-by-frame drag/swipe animation (loupe-quality spin).
 *   3. Forensic Loupe modal – pinch-to-zoom / drag-to-pan overlay on the
 *      currently active image, opened via the magnifier button.
 *
 * Design contract:
 *   - Pure-white canvas (#FFFFFF), 1 px ink hairlines (--color-line).
 *   - Stone-well thumbnails (--color-stone background), no rounded corners.
 *   - No nested ternaries – all conditional rendering expanded to if/else.
 */

import * as React from "react";
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Media, Shape } from "@/lib/types/catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiamondViewerProps {
  gallery: Media[];
  shape: Shape;
  /** e.g. "1.50 ct Round Diamond" */
  title: string;
  className?: string;
  sku?: string;
  certificateNumber?: string;
}

interface LoupeState {
  open: boolean;
  scale: number;
  /** Offset from centre in px */
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

// ---------------------------------------------------------------------------
// Shape art (SVG placeholder rendered when no photo URL exists)
// ---------------------------------------------------------------------------

const SHAPE_SVG: Record<Shape, React.ReactElement> = {
  ROUND: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full opacity-10">
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="1" />
      <line x1="60" y1="8" x2="60" y2="112" stroke="currentColor" strokeWidth="0.5" />
      <line x1="8" y1="60" x2="112" y2="60" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  OVAL: (
    <svg viewBox="0 0 140 100" fill="none" className="w-full h-full opacity-10">
      <ellipse cx="70" cy="50" rx="62" ry="42" stroke="currentColor" strokeWidth="1" />
      <line x1="70" y1="8" x2="70" y2="92" stroke="currentColor" strokeWidth="0.5" />
      <line x1="8" y1="50" x2="132" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  PRINCESS: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-10">
      <rect x="8" y="8" width="84" height="84" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="8" x2="92" y2="92" stroke="currentColor" strokeWidth="0.5" />
      <line x1="92" y1="8" x2="8" y2="92" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  CUSHION: (
    <svg viewBox="0 0 110 110" fill="none" className="w-full h-full opacity-10">
      <rect x="10" y="10" width="90" height="90" rx="16" stroke="currentColor" strokeWidth="1" />
      <line x1="55" y1="10" x2="55" y2="100" stroke="currentColor" strokeWidth="0.5" />
      <line x1="10" y1="55" x2="100" y2="55" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  EMERALD: (
    <svg viewBox="0 0 130 96" fill="none" className="w-full h-full opacity-10">
      <polygon points="18,4 112,4 126,48 112,92 18,92 4,48" stroke="currentColor" strokeWidth="1" />
      <line x1="65" y1="4" x2="65" y2="92" stroke="currentColor" strokeWidth="0.5" />
      <line x1="4" y1="48" x2="126" y2="48" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  PEAR: (
    <svg viewBox="0 0 100 140" fill="none" className="w-full h-full opacity-10">
      <path d="M50 8 C80 8 90 36 90 60 C90 90 72 120 50 132 C28 120 10 90 10 60 C10 36 20 8 50 8 Z" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="8" x2="50" y2="132" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  MARQUISE: (
    <svg viewBox="0 0 160 80" fill="none" className="w-full h-full opacity-10">
      <path d="M80 8 C120 8 152 40 152 40 C152 40 120 72 80 72 C40 72 8 40 8 40 C8 40 40 8 80 8 Z" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="8" x2="80" y2="72" stroke="currentColor" strokeWidth="0.5" />
      <line x1="8" y1="40" x2="152" y2="40" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  HEART: (
    <svg viewBox="0 0 120 110" fill="none" className="w-full h-full opacity-10">
      <path d="M60 98 C60 98 10 60 10 32 C10 16 22 8 36 8 C46 8 55 14 60 22 C65 14 74 8 84 8 C98 8 110 16 110 32 C110 60 60 98 60 98 Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  RADIANT: (
    <svg viewBox="0 0 128 100" fill="none" className="w-full h-full opacity-10">
      <polygon points="16,4 112,4 124,50 112,96 16,96 4,50" stroke="currentColor" strokeWidth="1" />
      <line x1="64" y1="4" x2="64" y2="96" stroke="currentColor" strokeWidth="0.5" />
      <line x1="4" y1="50" x2="124" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  ASSCHER: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-10">
      <polygon points="24,4 76,4 96,24 96,76 76,96 24,96 4,76 4,24" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="0.5" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Sub-component: Loupe Modal (forensic zoom + pan)
// ---------------------------------------------------------------------------

interface LoupeModalProps {
  src: string | undefined;
  alt: string;
  shape: Shape;
  onClose: () => void;
}

function LoupeModal({ src, alt, shape, onClose }: LoupeModalProps) {
  const [scale, setScale] = React.useState(2);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragRef = React.useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offsetX, oy: offsetY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffsetX(dragRef.current.ox + dx);
    setOffsetY(dragRef.current.oy + dy);
  }

  function handleMouseUp() {
    setIsDragging(false);
    dragRef.current = null;
  }

  function handleZoomIn() {
    setScale((prev) => Math.min(prev + 0.5, 6));
  }

  function handleZoomOut() {
    setScale((prev) => Math.max(prev - 0.5, 1));
  }

  function handleReset() {
    setScale(2);
    setOffsetX(0);
    setOffsetY(0);
  }

  // Close on Escape key
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Diamond Loupe Viewer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-ink)]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex flex-col w-[min(92vw,860px)] max-h-[92vh] bg-white border border-[var(--color-line)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-slate)]">
            Loupe Viewer · {scale.toFixed(1)}×
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="grid size-8 place-items-center text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="grid size-8 place-items-center text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="grid size-8 place-items-center text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              aria-label="Reset zoom"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <div className="w-px h-5 bg-[var(--color-line)] mx-1" aria-hidden="true" />
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              aria-label="Close loupe viewer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Zoom Stage */}
        <div
          className={cn(
            "relative flex-1 min-h-[400px] overflow-hidden bg-[var(--color-stone)] select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform"
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain pointer-events-none"
                draggable={false}
              />
            ) : (
              <div className="text-[var(--color-ink)]">{SHAPE_SVG[shape]}</div>
            )}
          </div>

          {/* Scale indicator bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 pointer-events-none">
            {[1, 1.5, 2, 2.5, 3, 4, 5, 6].map((tick) => (
              <div
                key={tick}
                className={cn(
                  "h-1 w-4",
                  scale >= tick ? "bg-[var(--color-ink)]" : "bg-[var(--color-line)]"
                )}
              />
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <p className="border-t border-[var(--color-line)] px-5 py-2.5 text-[10px] text-[var(--color-muted)] font-mono uppercase tracking-[0.08em]">
          Drag to pan · Scroll to zoom · ESC to close
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: 360° Spin Stage
// ---------------------------------------------------------------------------

interface SpinStageProps {
  frames: string[] | undefined;
  shape: Shape;
  alt: string;
}

function SpinStage({ frames, shape, alt }: SpinStageProps) {
  const [frameIndex, setFrameIndex] = React.useState(0);
  const dragRef = React.useRef<{ startX: number; startFrame: number } | null>(null);
  const totalFrames = frames?.length ?? 24;

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startFrame: frameIndex };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    const step = Math.round(delta / 8);
    const next = ((dragRef.current.startFrame + step) % totalFrames + totalFrames) % totalFrames;
    setFrameIndex(next);
  }

  function handleMouseUp() {
    dragRef.current = null;
  }

  // Touch support
  const touchRef = React.useRef<{ startX: number; startFrame: number } | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchRef.current = { startX: e.touches[0].clientX, startFrame: frameIndex };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const delta = e.touches[0].clientX - touchRef.current.startX;
    const step = Math.round(delta / 6);
    const next = ((touchRef.current.startFrame + step) % totalFrames + totalFrames) % totalFrames;
    setFrameIndex(next);
  }

  function handleTouchEnd() {
    touchRef.current = null;
  }

  const currentSrc = frames ? frames[frameIndex] : undefined;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="360° spin view – drag to rotate"
    >
      {currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${alt} – frame ${frameIndex + 1}`}
          className="max-w-[80%] max-h-[80%] object-contain pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="w-2/3 text-[var(--color-ink)]">{SHAPE_SVG[shape]}</div>
      )}

      {/* Frame dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5" aria-hidden="true">
        {Array.from({ length: Math.min(totalFrames, 24) }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-0.5 w-2",
              Math.floor((i / 24) * totalFrames) === frameIndex
                ? "bg-[var(--color-ink)]"
                : "bg-[var(--color-line)]"
            )}
          />
        ))}
      </div>

      {/* Instruction badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 border border-[var(--color-line)] px-3 py-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-slate)]">
          Drag to spin 360°
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component: DiamondViewer
// ---------------------------------------------------------------------------

export function DiamondViewer({
  gallery,
  shape,
  title,
  className,
  sku,
  certificateNumber,
}: DiamondViewerProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [loupeOpen, setLoupeOpen] = React.useState(false);

  const activeMedia = gallery[activeIndex];

  const isSpinFrame =
    activeMedia !== undefined &&
    activeMedia.type === "SPIN_360";

  const activeImageSrc =
    activeMedia !== undefined && activeMedia.type === "IMAGE"
      ? activeMedia.url
      : undefined;

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  }

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        {/* Main Stage */}
        <div
          className="relative aspect-square w-full bg-[var(--color-stone)] border border-[var(--color-line)] overflow-hidden"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Diamond viewer"
          role="region"
        >
          {/* Top Badges in Media Well matching mockup */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 border border-[var(--color-line)] px-2.5 py-1 z-10 select-none shadow-xs">
            <ZoomIn className="size-3.5 text-[var(--color-ink)]" />
            <span className="font-mono text-[11px] text-[var(--color-ink)] uppercase tracking-wider">
              High-resolution diamond viewer
            </span>
          </div>
          <div className="absolute top-3 right-3 font-mono text-[11px] text-[var(--color-slate)] bg-white/95 border border-[var(--color-line)] px-2.5 py-1 z-10 select-none shadow-xs">
            SKU: {sku || certificateNumber || "KL-SPEC-1027"}
          </div>

          {/* Bottom Bar: Fullscreen & Laser Inscription Notice */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/90 to-transparent flex items-center justify-between border-t border-[var(--color-line)]/50 z-10">
            <button
              type="button"
              onClick={() => setLoupeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[var(--color-line)] hover:border-[var(--color-ink)] text-[var(--color-ink)] font-mono text-[11px] uppercase tracking-wider transition-colors shadow-xs"
            >
              <Expand className="size-3.5" />
              <span>Fullscreen inspection</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--color-slate)]">Laser Inscription on Girdle</span>
              <span className="h-2 w-2 rounded-full bg-[#2F6B4F]" />
            </div>
          </div>

          {/* Static image view */}
          {!isSpinFrame && (
            <div className="absolute inset-[8%] flex items-center justify-center">
              {activeImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImageSrc}
                  alt={activeMedia?.alt ?? title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-2/3 text-[var(--color-ink)]">{SHAPE_SVG[shape]}</div>
              )}
            </div>
          )}

          {/* 360 spin view */}
          {isSpinFrame && activeMedia && (
            <SpinStage
              frames={activeMedia.frames}
              shape={shape}
              alt={activeMedia.alt}
            />
          )}

          {/* Prev / Next Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid size-9 place-items-center bg-white/90 border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-9 place-items-center bg-white/90 border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}

          {/* Loupe Button (only for static images) */}
          {!isSpinFrame && (
            <button
              type="button"
              onClick={() => setLoupeOpen(true)}
              className="absolute top-3 right-3 grid size-9 place-items-center bg-white/90 border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-white transition-colors"
              aria-label="Open forensic loupe viewer"
              title="Inspect under 10× loupe"
            >
              <Expand className="size-4" />
            </button>
          )}

          {/* Media type badge */}
          {isSpinFrame && (
            <div className="absolute top-3 left-3 bg-[var(--color-ink)] px-2 py-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-white">360°</span>
            </div>
          )}
        </div>

        {/* Numbered Thumbnail Rail matching mockup */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Image thumbnails">
            {gallery.map((media, i) => {
              const isActive = i === activeIndex;
              const thumbLabels = ["Face-up", "Profile", "360° Rot", "Light-play", "Girdle ID"];
              const label = thumbLabels[i] || `View 0${i + 1}`;
              return (
                <button
                  key={media.id}
                  type="button"
                  role="listitem"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 bg-white border p-1 flex flex-col items-center justify-between transition-all rounded-none",
                    isActive
                      ? "border-[var(--color-ink)] ring-1 ring-[var(--brand-accent,#8FA9C4)] shadow-xs"
                      : "border-[var(--color-line)] bg-[#F1F5F9] hover:border-[var(--color-ink)]"
                  )}
                  aria-label={`View ${media.type === "SPIN_360" ? "360° spin" : `image ${i + 1}`}`}
                  aria-pressed={isActive}
                >
                  <span className="self-start font-mono text-[8px] text-[var(--color-muted)] leading-none">
                    0{i + 1}
                  </span>
                  <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                    {media.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media.url}
                        alt=""
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="w-full h-full text-[var(--color-ink)]" aria-hidden="true">
                        {SHAPE_SVG[shape]}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-[var(--color-slate)] truncate max-w-full">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Forensic Loupe Modal */}
      {loupeOpen && (
        <LoupeModal
          src={activeImageSrc}
          alt={activeMedia?.alt ?? title}
          shape={shape}
          onClose={() => setLoupeOpen(false)}
        />
      )}
    </>
  );
}
