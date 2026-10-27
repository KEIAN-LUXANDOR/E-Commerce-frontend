"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart, removeFromCart } from "@/lib/shop/cart";
import { formatINR } from "@/lib/format";
import { ProductImage } from "@/components/product/ProductImage";

import * as storesMod from "@/lib/stores";

export function MiniCartDrawer() {
  const miniCartStoreObj = (storesMod as any).miniCartOpenStore ?? (storesMod as any).miniCartStore;
  const isOpenHook = miniCartStoreObj?.useValue ?? (() => false);
  const isOpen = typeof isOpenHook === "function" ? isOpenHook() : false;

  const cart = useCart();
  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;
  const subtotal = cart?.subtotalPaise || 0;

  function handleClose() {
    if (typeof miniCartStoreObj?.close === "function") {
      miniCartStoreObj.close();
    } else if (typeof miniCartStoreObj?.set === "function") {
      miniCartStoreObj.set(false);
    } else if (typeof (storesMod as any).setMiniCartOpen === "function") {
      (storesMod as any).setMiniCartOpen(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-ink/40 transition-opacity" 
        onClick={handleClose} 
      />
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md transform bg-surface shadow-2xl transition-transform">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
              <h2 className="text-lg font-medium text-ink flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Cart ({itemCount})
              </h2>
              <button
                type="button"
                className="text-slate hover:text-ink transition-colors"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-platinum flex items-center justify-center text-slate">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-ink font-medium">Your cart is empty</p>
                  <button
                    onClick={handleClose}
                    className="text-xs font-medium uppercase tracking-widest text-loupe hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item: any) => {
                    const p = item.product;
                    if (!p) return null;
                    const itemPrice = item.pricePaise ?? item.unitPricePaise ?? p.variants?.[0]?.pricePaise;

                    return (
                      <li key={item.variantId} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-line bg-platinum relative">
                          {/* FIX: sizes prop added here */}
                          <ProductImage product={p} sizes="96px" className="object-contain" />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-sm font-medium text-ink">
                              <h3>
                                <Link href={`/diamond/${p.slug}`} onClick={handleClose} className="hover:underline">
                                  {p.name}
                                </Link>
                              </h3>
                              <p className="ml-4 tabular-nums">{itemPrice ? formatINR(itemPrice) : "—"}</p>
                            </div>
                            {p.diamond && (
                              <p className="mt-1 text-xs text-slate">
                                {p.diamond.color} · {p.diamond.clarity} · {p.diamond.lab}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.variantId)}
                              className="text-xs font-medium text-slate hover:text-out"
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
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-4 py-6 sm:px-6 bg-surface">
                <div className="flex justify-between text-base font-medium text-ink mb-4">
                  <p>Subtotal</p>
                  <p className="tabular-nums">{formatINR(subtotal)}</p>
                </div>
                <p className="mt-0.5 text-xs text-slate mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="flex h-11 items-center justify-center border border-ink px-6 text-xs font-medium uppercase tracking-widest text-ink hover:bg-platinum transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={handleClose}
                    className="flex h-11 items-center justify-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
                  >
                    Checkout Securely
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}