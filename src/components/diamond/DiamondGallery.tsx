"use client";

import Image from "next/image";
import { useState } from "react";
import { DiamondArt } from "@/components/art/DiamondArt";
import { productShape } from "@/lib/catalog/product";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

type View = { kind: "photo"; index: number } | { kind: "top" } | { kind: "profile" };

/**
 * Photos of the diamond, with thumbnails. When there are no photos yet, shows clean
 * face-up and side drawings of the shape so the page still looks complete.
 */
export function DiamondGallery({ product }: { product: Product }) {
  const shape = productShape(product);
  const views: View[] = product.images.length > 0 ? product.images.map((_, index) => ({ kind: "photo", index }) as View) : [{ kind: "top" }, { kind: "profile" }];
  const [active, setActive] = useState(0);
  const current = views[active] ?? views[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {views.length > 1 && (
        <ul className="flex gap-2 sm:flex-col" aria-label="Views">
          {views.map((v, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={labelFor(v, i)}
                className={cn("relative block size-16 overflow-hidden border bg-white sm:size-20", i === active ? "border-ink" : "border-line hover:border-line-dark")}
              >
                <Thumb product={product} view={v} shape={shape} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden border border-line bg-white">
        <Main product={product} view={current} shape={shape} />
        {product.images.length === 0 && (
          <p className="absolute inset-x-0 bottom-0 bg-white/90 px-4 py-2 text-center text-sm text-slate">
            Photos and video of this exact stone are available on request.
          </p>
        )}
      </div>
    </div>
  );
}

function labelFor(v: View, i: number): string {
  if (v.kind === "photo") return `Photo ${i + 1}`;
  if (v.kind === "top") return "Drawing, face up";
  return "Drawing, side view";
}

function Main({ product, view, shape }: { product: Product; view: View; shape: ReturnType<typeof productShape> }) {
  if (view.kind === "photo") {
    const img = product.images[view.index];
    return <Image src={img.url} alt={img.altText || product.name} fill unoptimized priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />;
  }
  return <DiamondArt shape={shape} view={view.kind} title={`${product.name}, ${view.kind === "top" ? "face-up" : "side"} drawing`} className="h-full w-full p-[14%]" />;
}

function Thumb({ product, view, shape }: { product: Product; view: View; shape: ReturnType<typeof productShape> }) {
  if (view.kind === "photo") {
    const img = product.images[view.index];
    return <Image src={img.url} alt="" fill unoptimized sizes="80px" className="object-contain" />;
  }
  return <DiamondArt shape={shape} view={view.kind} className="h-full w-full p-2" />;
}
