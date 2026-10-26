"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { isSaved, toggleSaved, useWishlist } from "@/lib/shop/wishlist";
import { showToast } from "@/lib/stores";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/** Heart button. Works for guests too (saved in this browser, moved to the account after login). */
export function SaveButton({ product, className, withLabel }: { product: Product; className?: string; withLabel?: boolean }) {
  const view = useWishlist();
  const saved = isSaved(product.id, view);
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    const result = await toggleSaved(product);
    setBusy(false);
    if ("error" in result) {
      showToast(result.error, "error");
      return;
    }
    if (result.saved) showToast("Saved to your wishlist.", "info", { label: "View saved", href: "/wishlist" });
  }

  let label = "Save";
  if (saved) label = "Saved";
  const aria = saved ? `Remove ${product.name} from saved diamonds` : `Save ${product.name}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={aria}
      title={aria}
      className={cn("inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-accent-deep", withLabel ? "min-h-11 px-1" : "grid size-10 place-items-center bg-white/90 hover:bg-white", className)}
    >
      <Heart className={cn("size-5", saved ? "fill-ink" : "")} aria-hidden />
      {withLabel && <span>{label}</span>}
    </button>
  );
}
