"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart, fetchServerCart, removeFromCart } from "@/lib/shop/cart";
import { getProducts } from "@/lib/api/products";
import { productHref, shortTitle, gradeLine } from "@/lib/catalog/product";
import { sessionStore } from "@/lib/session";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types/product";

interface CartLineItem {
  variantId: string;
  pricePaise: number | null;
  available: boolean;
  product?: Product;
}

export function CartView({ compact = false }: { compact?: boolean }) {
  const cart = useCart();
  const session = sessionStore.useSession();
  const [removingId, setRemovingId] = useState<string | null>(null);
  // true in the browser, false during server rendering (avoids a hydration mismatch with the saved cart)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [catalogMap, setCatalogMap] = useState<Record<string, Product>>({});

  const rawItems = cart?.items || [];
  const rawItemsKey = rawItems.map((item) => item.variantId).sort().join(",");

  // Hydrate product details for items that only have variantId
  useEffect(() => {
    if (!mounted || !rawItemsKey) return;
    let active = true;

    async function loadProducts() {
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

    void loadProducts();
    return () => {
      active = false;
    };
  }, [mounted, rawItemsKey]);

  async function handleRemove(variantId: string) {
    setRemovingId(variantId);
    try {
      await removeFromCart(variantId);
      if (session.status === "authenticated") {
        await fetchServerCart();
      }
    } catch {
      // Quiet fallback
    } finally {
      setRemovingId(null);
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 text-slate">
        <Loader2 className="h-6 w-6 animate-spin text-ink" aria-label="Loading cart" />
      </div>
    );
  }

  const items = rawItems as CartLineItem[];
  const itemCount = cart?.itemCount ?? items.length;
  const subtotalPaise =
    cart?.subtotalPaise && cart.subtotalPaise > 0
      ? cart.subtotalPaise
      : items.reduce((acc, i) => {
          const prod = i.product ?? catalogMap[i.variantId];
          const price = i.pricePaise ?? prod?.variants?.[0]?.pricePaise ?? 0;
          return acc + price;
        }, 0);

  const hasUnavailableItems = cart?.hasUnavailableItems ?? items.some((i) => !i.available);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-12 sm:p-16 text-center shadow-sm space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-stone border border-line">
          <ShoppingBag className="h-7 w-7 text-slate stroke-[1.5]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-ink">Your cart is empty</h2>
          <p className="mt-1 text-sm text-slate">You haven&apos;t added any diamonds to your cart yet.</p>
        </div>
        <div className="pt-2">
          <Link href="/diamonds">
            <Button size="lg">Explore Certified Diamonds</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${compact ? "" : "max-w-4xl mx-auto"}`}>
      {/* Items List */}
      <div className="space-y-4">
        {items.map((line) => {
          const product = line.product ?? catalogMap[line.variantId];
          const primaryImage = product?.images?.[0]?.url ?? "/images/sample/round.svg";
          const linePrice = line.pricePaise ?? product?.variants?.[0]?.pricePaise ?? null;

          return (
            <article
              key={line.variantId}
              className={`rounded-xl border bg-surface p-4 sm:p-5 transition-all shadow-xs hover:shadow-sm ${
                line.available ? "border-line" : "border-out/40 bg-out-tint/10"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-stone">
                    <Image
                      src={primaryImage}
                      alt={product?.name ?? "Certified Diamond"}
                      fill
                      unoptimized
                      sizes="80px"
                      priority
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <Link
                      href={product ? productHref(product.slug) : "/diamonds"}
                      className="font-medium text-ink hover:underline text-base block font-serif tracking-tight"
                    >
                      {product ? shortTitle(product) : `Diamond Variant`}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-slate">
                      {product?.diamond ? gradeLine(product) : "Certified Solitaire"}
                    </p>
                    {!line.available && (
                      <p className="mt-1 text-xs font-semibold text-out">Currently Unavailable</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-ink">
                      {linePrice !== null ? formatPrice(linePrice) : "—"}
                    </p>
                    <p className="font-mono text-[11px] text-muted uppercase">1 Piece</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(line.variantId)}
                    disabled={removingId === line.variantId}
                    aria-label="Remove item from cart"
                    className="p-2 text-slate hover:text-out transition-colors disabled:opacity-40 rounded-lg hover:bg-stone"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-serif text-xl text-ink">Order Summary</h3>

        <div className="space-y-2.5 text-sm text-slate border-b border-line pb-4">
          <div className="flex justify-between">
            <span>Items ({itemCount})</span>
            <span className="font-mono text-ink">{formatPrice(subtotalPaise)}</span>
          </div>
          <div className="flex justify-between">
            <span>Free delivery across India</span>
            <span className="text-ok font-semibold">Complimentary</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-1">
          <span className="font-medium text-ink text-base">Total Amount</span>
          <span className="font-mono text-2xl font-bold text-ink">{formatPrice(subtotalPaise)}</span>
        </div>
        <p className="text-xs text-muted">All prices include applicable 3% Goods & Services Tax.</p>

        {hasUnavailableItems && (
          <div className="rounded-lg bg-out/10 border border-out/30 p-3 text-xs text-out">
            Some items in your cart are currently unavailable. Please remove them to proceed with checkout.
          </div>
        )}

        {!compact && (
          <div className="pt-2">
            <Link href="/checkout" className="block w-full">
              <Button
                size="lg"
                disabled={hasUnavailableItems || items.length === 0}
                className="w-full shadow-md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartView;
