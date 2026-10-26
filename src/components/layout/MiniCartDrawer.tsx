"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { DiamondArt } from "@/components/art/DiamondArt";
import { Dialog } from "@/components/ui/dialog";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/button";
import { removeFromCart, useCart } from "@/lib/shop/cart";
import { setMiniCartOpen, useMiniCartOpen } from "@/lib/stores";
import { ShieldCheck, ArrowRight, ShoppingBag } from "lucide-react";

/**
 * Slide-in quick cart drawer from the header.
 * Allows customers to inspect their selected diamonds before moving to checkout.
 */
export function MiniCartDrawer() {
  const isOpen = useMiniCartOpen();
  const cart = useCart();
  const cartItems = cart.lines;
  const handleClose = () => setMiniCartOpen(false);

  const itemCount = cart.itemCount;
  const isCartEmpty = itemCount === 0;

  let titleText = "Your Diamond Order";
  if (!isCartEmpty) {
    titleText = `Your Diamond Order (${itemCount})`;
  }

  // Footer action rendered when cart has items
  let drawerFooter: React.ReactNode = undefined;
  if (!isCartEmpty) {
    drawerFooter = (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-slate)]">
          <ShieldCheck className="h-4 w-4 text-[var(--color-ok)] shrink-0" aria-hidden="true" />
          <span>All diamonds reserved with insured delivery coverage.</span>
        </div>
        <Link href="/cart" onClick={handleClose} className="block">
          <Button variant="primary" size="lg" className="w-full flex items-center justify-between">
            <span>Review Order &amp; Checkout</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={titleText}
      side="right"
      footer={drawerFooter}
    >
      {isCartEmpty ? (
        <div className="py-16 text-center space-y-4">
          <div className="mx-auto grid size-12 place-items-center bg-[var(--color-stone)] border border-[var(--color-line)] text-[var(--color-slate)]">
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="font-serif text-xl text-[var(--color-ink)]">Your Vault is Empty</p>
            <p className="mt-1 text-xs text-[var(--color-slate)] max-w-xs mx-auto leading-relaxed">
              Every loose diamond at Keian Luxandor is laser-inscribed and certified. Begin by exploring our curated parcels.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/shop" onClick={handleClose}>
              <Button variant="primary" size="md">
                Browse Loose Diamonds
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-line)]">
          {cartItems.map((item) => {
            let mediaContent = (
              <DiamondArt
                shape={item.product.diamond?.shape ?? "ROUND"}
                title={item.product.name}
                className="h-full w-full"
              />
            );

            const imageUrl = item.product.images[0]?.url;
            if (imageUrl) {
              mediaContent = (
                <Image
                  src={imageUrl}
                  alt={item.product.images[0]?.altText ?? item.product.name}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              );
            }

            return (
              <li key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                <Link
                  href={`/diamond/${item.product.slug}`}
                  onClick={handleClose}
                  className="relative size-20 shrink-0 border border-[var(--color-line)] bg-[var(--color-stone)] p-1.5 hover:border-[var(--color-ink)] transition-colors"
                >
                  {mediaContent}
                </Link>

                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/diamond/${item.product.slug}`}
                    onClick={handleClose}
                    className="font-medium text-xs text-[var(--color-ink)] hover:text-[var(--color-loupe)] block truncate"
                  >
                    {item.product.name}
                  </Link>

                  {item.product.diamond && (
                    <p className="text-[11px] text-[var(--color-slate)]">
                      {item.product.diamond.carat.toFixed(2)} ct · {item.product.diamond.shape} · {item.product.diamond.lab}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    {item.pricePaise !== null ? (
                      <Price paise={item.pricePaise} className="font-mono text-xs font-semibold text-[var(--color-ink)]" />
                    ) : (
                      <span className="text-xs text-[var(--color-out)]">Unavailable</span>
                    )}
                    <button
                      type="button"
                      onClick={() => void removeFromCart(item.variantId)}
                      className="text-[11px] text-[var(--color-slate)] hover:text-[var(--color-out)] hover:underline uppercase tracking-[0.04em]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}
