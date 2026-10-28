"use client";

import { useState } from "react";
import { Check, ShoppingBag, Loader2 } from "lucide-react";
import { mainVariant } from "@/lib/catalog/product";
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
  const variant = mainVariant(product);
  
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
      <button
        type="button"
        disabled
        aria-label="Product currently unavailable"
        className={cn(
          "btn w-full min-h-12 justify-center text-xs uppercase tracking-widest",
          compact ? "h-9 min-h-9 w-9 px-2 text-[10px]" : "w-full",
          "border border-line bg-surface text-slate opacity-70",
        )}
      >
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
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={inCart ? "Open cart" : "Add to cart"}
      className={cn(
        "btn btn-primary min-h-12 w-full justify-center gap-2 px-6 text-xs uppercase tracking-widest shadow-sm",
        inCart && "border-line bg-surface text-ink hover:bg-platinum",
        pending && "cursor-not-allowed opacity-60"
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