"use client";

import { useState } from "react";
import { Check, ShoppingBag, Loader2 } from "lucide-react";
import { primaryVariant } from "@/lib/catalog/product";
import { addToCart, useCart } from "@/lib/shop/cart";
import * as storesMod from "@/lib/stores";
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
    ? cart?.items?.some((item: any) => item.variantId === variant.id) 
    : false;

  async function handleClick() {
    if (!variant || !variant.inStock) return;

    // Safely get the mini cart store reference
    const miniCart = (storesMod as any).miniCartOpenStore ?? (storesMod as any).miniCartStore;
    const openMiniCart = () => {
      if (typeof miniCart?.open === "function") miniCart.open();
      else if (typeof miniCart?.set === "function") miniCart.set(true);
      else if (typeof (storesMod as any).setMiniCartOpen === "function") {
        (storesMod as any).setMiniCartOpen(true);
      }
    };

    if (inCart) {
      openMiniCart();
      return;
    }

    setPending(true);
    try {
      await addToCart(product);
      openMiniCart();
    } finally {
      setPending(false);
    }
  }

  if (!variant || !variant.inStock) {
    return null; // Sold-out logic is typically handled at the parent level (e.g., BuyBox/ProductCard)
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