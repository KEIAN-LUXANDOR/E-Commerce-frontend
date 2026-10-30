"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, removeFromCart } from "@/lib/shop/cart";
import { formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/api/products";
import { productHref, shortTitle, gradeLine } from "@/lib/catalog/product";
import { Button } from "@/components/ui/button";
import { miniCartOpenStore } from "@/lib/stores";
import type { Product } from "@/lib/types/product";

export function MiniCartDrawer() {
  const isOpen = miniCartOpenStore.useValue();

  const cart = useCart();
  const rawItems = cart?.items || [];
  const itemCount = cart?.itemCount || rawItems.length;

  const [catalogMap, setCatalogMap] = useState<Record<string, Product>>({});

  // Use primitive string key to prevent infinite re-render loops
  const rawItemsKey = rawItems.map((item) => item.variantId).sort().join(",");

  // Hydrate product details for guest cart items
  useEffect(() => {
    if (!rawItemsKey) return;
    let active = true;

    async function loadCatalog() {
      try {
        const res = await getProducts("?size=40");
        if (!active || !res?.items) return;
        const map: Record<string, Product> = {};
        for (const prod of res.items) {
          if (prod.variants?.[0]?.id) {
            map[prod.variants[0].id] = prod;
          }
        }
        setCatalogMap(map);
      } catch {
        // Fallback silently if offline or catalog service busy
      }
    }

    void loadCatalog();
    return () => {
      active = false;
    };
  }, [rawItemsKey]);

  const computedSubtotal =
    cart?.subtotalPaise && cart.subtotalPaise > 0
      ? cart.subtotalPaise
      : rawItems.reduce((sum: number, item) => {
          const prod = item.product ?? catalogMap[item.variantId];
          const price = item.pricePaise ?? prod?.variants?.[0]?.pricePaise ?? 0;
          return sum + price;
        }, 0);

  function handleClose() {
    miniCartOpenStore.close();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
        onClick={handleClose} 
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md h-full max-h-[100dvh] transform bg-surface shadow-2xl transition-transform border-l border-line flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 shrink-0">
            <h2 className="text-base font-serif font-medium text-ink flex items-center gap-2">
              <ShoppingBag className="size-4" />
              Your Cart ({itemCount})
            </h2>
            <button
              type="button"
              className="rounded-lg p-2 -mr-1 text-slate hover:bg-stone hover:text-ink transition-colors touch-manipulation"
              onClick={handleClose}
              aria-label="Close cart drawer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 min-h-0">
            {rawItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="size-16 rounded-full bg-stone border border-line flex items-center justify-center text-slate">
                  <ShoppingBag className="size-8 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-ink font-serif text-lg font-medium">Your cart is empty</p>
                  <p className="text-xs text-slate mt-1">Explore our loose diamond catalogue.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                >
                  Explore Diamonds
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {rawItems.map((item) => {
                  const p = item.product ?? catalogMap[item.variantId];
                  const itemPrice = item.pricePaise ?? p?.variants?.[0]?.pricePaise ?? null;
                  const primaryImage = p?.images?.[0]?.url ?? "/images/sample/round.svg";

                  return (
                    <li key={item.variantId} className="flex py-5 gap-4">
                      <div className="size-20 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-stone relative">
                        <Image
                          src={primaryImage}
                          alt={p?.name ?? "Certified Diamond"}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2 text-sm">
                            <h3 className="font-serif font-medium text-ink text-base truncate">
                              <Link
                                href={p ? productHref(p.slug) : "/diamonds"}
                                onClick={handleClose}
                                className="hover:underline"
                              >
                                {p ? shortTitle(p) : `Solitaire Stone`}
                              </Link>
                            </h3>
                            <p className="font-mono font-semibold text-ink text-sm shrink-0">
                              {itemPrice !== null ? formatPrice(itemPrice) : "—"}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs font-mono text-slate truncate">
                            {p?.diamond ? gradeLine(p) : "Certified Solitaire"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] font-mono text-muted uppercase">1 Piece</span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-xs font-semibold text-slate hover:text-out flex items-center gap-1 py-1 px-1.5 rounded transition-colors touch-manipulation"
                          >
                            <Trash2 className="size-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {rawItems.length > 0 && (
            <div className="border-t border-line p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-surface space-y-4 shadow-xs shrink-0">
              <div className="flex justify-between items-baseline text-base font-medium text-ink">
                <span className="text-sm text-slate">Subtotal</span>
                <span className="font-mono font-bold text-xl text-ink">
                  {formatPrice(computedSubtotal)}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted">
                Free delivery
              </p>
              <div className="space-y-2.5 pt-1">
                <Link href="/cart" onClick={handleClose} className="block w-full">
                  <Button variant="secondary" size="lg" className="w-full">
                    View Full Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={handleClose} className="block w-full">
                  <Button variant="primary" size="lg" className="w-full shadow-md">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiniCartDrawer;