"use client";

import { useState } from "react";
import { Check, ShoppingBag, Loader2 } from "lucide-react";
import { primaryVariant } from "@/lib/catalog/product";
import { addToCart, useCart } from "@/lib/shop/cart";
import { miniCartOpenStore } from "@/lib/stores";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  compact?: boolean;
}

export function AddToCartButton({ product, compact = false }: AddToCartButtonProps) {
  const [pending, setPending] = useState(false);
  const cart = useCart();
  const variant = primaryVariant(product);
  
  // Check if the current variant is in the cart
  const inCart = variant
    ? cart?.items?.some((item) => item.variantId === variant.id)
    : false;

  async function handleClick() {
    if (!variant || !variant.inStock) return;

    if (inCart) {
      miniCartOpenStore.open();
      return;
    }

    setPending(true);
    try {
      await addToCart(product);
      miniCartOpenStore.open();
    } finally {
      setPending(false);
    }
  }

  if (!variant || !variant.inStock) {
    return (
      <button type="button" disabled className={cn(
        "flex min-h-11 items-center justify-center rounded-[3px] border border-line px-4 text-xs font-medium uppercase tracking-widest text-slate",
        compact ? "h-9 min-h-9 w-auto px-2 text-[10px]" : "w-full",
      )}>
        Sold out
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
          inCart 
            ? "border-line bg-surface text-ink hover:bg-platinum" 
            : "border-transparent bg-ink text-white hover:bg-loupe-deep",
          pending && "opacity-50 cursor-not-allowed"
        )}
        aria-label={inCart ? "In your cart" : "Add to cart"}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : inCart ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-[3px] border px-6 text-xs font-medium uppercase tracking-widest transition-colors",
        inCart
          ? "border-line bg-surface text-ink hover:bg-platinum"
          : "border-transparent bg-ink text-white hover:bg-loupe-deep",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Adding...</span>
        </>
      ) : inCart ? (
        <>
          <Check className="h-4 w-4" />
          <span>In Your Cart</span>
        </>
      ) : (
        <span>Add to Cart</span>
      )}
    </button>
  );
}

export default AddToCartButton;