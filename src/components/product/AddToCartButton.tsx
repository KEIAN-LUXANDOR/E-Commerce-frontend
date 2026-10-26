"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mainVariant } from "@/lib/catalog/product";
import { addToCart, isInCart, useCart } from "@/lib/shop/cart";
import { setMiniCartOpen, showToast } from "@/lib/stores";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/**
 * "Add to cart" (and "Buy now", which adds then goes straight to the cart).
 * Each diamond is one of a kind, so once it's in the cart the button says so.
 */
export function AddToCartButton({ product, mode = "add", className, size = "md" }: { product: Product; mode?: "add" | "buy"; className?: string; size?: "sm" | "md" }) {
  const router = useRouter();
  const cart = useCart();
  const variant = mainVariant(product);
  const inCart = isInCart(variant?.id, cart);
  const soldOut = !variant || !variant.inStock;
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      if (mode === "buy") router.push("/cart");
      else setMiniCartOpen(true);
      return;
    }
    setBusy(true);
    const result = await addToCart(product);
    setBusy(false);
    if (!result.ok) {
      showToast(result.message, "error");
      return;
    }
    if (mode === "buy") {
      router.push("/cart");
      return;
    }
    setMiniCartOpen(true);
  }

  const base = mode === "buy" ? "btn btn-secondary" : "btn btn-primary";
  const sizing = size === "sm" ? "min-h-10 px-3 text-xs" : "";

  if (soldOut) {
    return (
      <button type="button" disabled className={cn("btn btn-secondary", sizing, className)}>
        Sold
      </button>
    );
  }

  let label = "Add to cart";
  if (mode === "buy") label = "Buy now";
  if (inCart && mode === "add") label = "In your cart";
  if (busy) label = "Adding…";

  return (
    <button type="button" onClick={onClick} disabled={busy} className={cn(base, sizing, className)}>
      {mode === "add" && inCart && <Check className="size-4" aria-hidden />}
      {mode === "add" && !inCart && <ShoppingBag className="size-4" aria-hidden />}
      {label}
    </button>
  );
}
