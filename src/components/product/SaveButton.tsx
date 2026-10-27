"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/shop/wishlist";
import { cn } from "@/lib/utils";

export interface SaveButtonProps {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
  product?: any; // To safely accept extra props passed implicitly
}

export function SaveButton({ productId, variant = "icon", className }: SaveButtonProps) {
  const { has, toggle } = useWishlist();
  const isSaved = has(productId);

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        className={cn(
          "flex h-11 items-center justify-center gap-2 rounded-[3px] border px-6 text-xs font-medium uppercase tracking-widest transition-colors",
          "border-line bg-surface text-ink hover:bg-platinum",
          className
        )}
        aria-pressed={isSaved}
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", isSaved ? "fill-ink text-ink" : "text-ink")}
        />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // Prevents navigating if inside a Link tag
        toggle(productId);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-surface/70 hover:bg-surface transition-colors focus:outline-none focus:ring-1 focus:ring-loupe",
        className
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={isSaved}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", isSaved ? "fill-ink text-ink" : "text-ink")}
      />
    </button>
  );
}

export default SaveButton;