"use client";

import { Heart } from "lucide-react";
import { showToast, toggleWishlist, useWishlist } from "@/lib/stores";

function getWishlistAriaLabel(withLabel?: boolean, saved?: boolean, name?: string): string | undefined {
  if (withLabel) {
    return undefined;
  }
  if (saved) {
    return `Remove ${name} from wishlist`;
  }
  return `Save ${name} to wishlist`;
}

/**
 * Heart toggle. Saved in the browser for now.
 * Phase F1: guests are sent to /login and the item is added after sign-in (wishlist API).
 */
export function WishlistButton({
  slug,
  name,
  className,
  withLabel,
}: {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const saved = useWishlist().includes(slug);
  const ariaLabel = getWishlistAriaLabel(withLabel, saved, name);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = toggleWishlist(slug);
        showToast(now ? `Saved ${name} to your wishlist` : `Removed ${name} from your wishlist`);
      }}
      className={className}
    >
      <Heart className="size-5" fill={saved ? "currentColor" : "none"} aria-hidden />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
