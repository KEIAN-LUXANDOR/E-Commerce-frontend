"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ShoppingBag, Trash2, AlertCircle } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { getProducts } from "@/lib/api/products";
import type { Cart } from "@/lib/api/cart";
import type { Product } from "@/lib/types/product";
import { fetchServerCart, removeFromCart, useCart } from "@/lib/shop/cart";
import { sessionStore } from "@/lib/session";
import { productHref, shortTitle, gradeLine } from "@/lib/catalog/product";
import { gstIncludedPaise } from "@/lib/site";
import { formatINR } from "@/lib/format";

type DisplayLine = {
  variantId: string;
  product: Product | null;
  pricePaise: number | null;
  available: boolean;
};

export function CartView({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const session = sessionStore.useSession();
  const cartSnapshot = useCart();
  const [guestLines, setGuestLines] = useState<DisplayLine[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);
  const [loadingServerCart, setLoadingServerCart] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const serverCart = cartSnapshot as unknown as Cart | null;
  const variantIds = (cartSnapshot?.items ?? []).map((item) => item.variantId);
  const variantIdsKey = variantIds.join("|");

  useEffect(() => {
    let cancelled = false;

    if (session.status === "authenticated") {
      setLoadingServerCart(true);
      setLoadError(null);
      void fetchServerCart().then((result) => {
        if (cancelled) return;
        if (!result) setLoadError("We couldn't load your cart. Please refresh and try again.");
        setLoadingServerCart(false);
      });
      return () => {
        cancelled = true;
      };
    }

    if (session.status !== "unauthenticated") return;

    const ids = variantIdsKey ? variantIdsKey.split("|") : [];
    if (ids.length === 0) {
      setGuestLines([]);
      setGuestLoading(false);
      setLoadError(null);
      return;
    }

    setGuestLoading(true);
    setLoadError(null);

    void (async () => {
      try {
        const wanted = new Set(ids);
        const productsByVariant = new Map<string, Product>();
        let page = 0;
        let totalPages = 1;
        const maxPages = 2; // Cap guest cart sweep to 2 pages (100 products) to prevent deep traversals

        while (page < Math.min(totalPages, maxPages) && productsByVariant.size < wanted.size) {
          const result = await getProducts(`?size=50&page=${page}`);
          for (const product of result.items ?? []) {
            for (const variant of product.variants ?? []) {
              if (wanted.has(variant.id)) productsByVariant.set(variant.id, product);
            }
          }
          totalPages = Math.max(1, result.totalPages ?? 1);
          page += 1;
        }

        if (cancelled) return;
        setGuestLines(
          ids.map((variantId) => {
            const product = productsByVariant.get(variantId) ?? null;
            const variant = product?.variants.find((item) => item.id === variantId);
            return {
              variantId,
              product,
              pricePaise: variant?.pricePaise ?? null,
              available: Boolean(variant?.inStock),
            };
          }),
        );
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load prices for items in your cart.",
        );
      } finally {
        if (!cancelled) setGuestLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session.status, variantIdsKey]);

  const lines = useMemo<DisplayLine[]>(() => {
    if (session.status === "authenticated" && serverCart?.items) {
      return serverCart.items.map((item) => ({
        variantId: item.variantId,
        product: item.product,
        pricePaise: item.pricePaise,
        available: item.available,
      }));
    }
    return guestLines;
  }, [guestLines, serverCart, session.status]);

  const subtotalPaise = useMemo(() => {
    if (session.status === "authenticated" && typeof serverCart?.subtotalPaise === "number") {
      return serverCart.subtotalPaise;
    }
    return lines
      .filter((line) => line.available && line.pricePaise !== null)
      .reduce((sum, line) => sum + (line.pricePaise ?? 0), 0);
  }, [lines, serverCart, session.status]);

  const gstPaise = gstIncludedPaise(subtotalPaise);
  const itemCount = lines.filter((line) => line.available).length;
  const hasUnavailableItems = lines.some((line) => !line.available);
  const isLoading = session.status === "loading" || guestLoading || loadingServerCart;

  async function handleRemove(variantId: string) {
    setRemovingId(variantId);
    try {
      await removeFromCart(variantId);
      if (session.status === "unauthenticated") {
        setGuestLines((current) => current.filter((item) => item.variantId !== variantId));
      }
    } finally {
      setRemovingId(null);
    }
  }

  // Prevent hydration mismatch by ensuring server and first client render match exactly
  if (!mounted || (isLoading && lines.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-ink" aria-hidden="true" />
        <p className="mt-4 text-xs uppercase tracking-widest text-slate">Loading your diamond selection...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border border-out/20 bg-out-bg p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-out" aria-hidden="true" />
        <h2 className="mt-2 text-sm font-medium text-ink">We couldn&apos;t load your cart</h2>
        <p className="mt-1 text-xs text-slate">{loadError}</p>
        <button
          type="button"
          onClick={() => {
            setLoadError(null);
            if (session.status === "authenticated") void fetchServerCart();
          }}
          className="mt-4 inline-flex h-9 items-center border border-line bg-surface px-4 text-xs uppercase tracking-wider text-ink hover:border-ink"
        >
          Try again
        </button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-line bg-surface p-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate stroke-1" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-medium text-ink">Your selection is empty</h2>
        <p className="mt-1 text-xs text-slate">You haven&apos;t reserved any loose certified diamonds yet.</p>
        <Link
          href="/diamonds"
          className="mt-6 inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          Explore Diamonds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lines.map((line) => {
        const product = line.product;
        const diamond = product?.diamond;

        return (
          <article
            key={line.variantId}
            className={`flex gap-4 border border-line bg-surface p-4 transition-opacity sm:gap-6 ${
              !line.available ? "opacity-60" : ""
            }`}
          >
            <Link
              href={product ? productHref(product.slug) : "/diamonds"}
              className="relative h-24 w-24 shrink-0 overflow-hidden bg-platinum sm:h-28 sm:w-28"
            >
              <ProductImage product={product ?? undefined} sizes="112px" priority className="object-contain" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
              <div>
                {product ? (
                  <Link href={productHref(product.slug)} className="text-sm font-medium text-ink hover:underline">
                    {shortTitle(product)}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-ink">Diamond no longer listed</p>
                )}
                {product && <p className="mt-1 text-xs leading-relaxed text-slate">{gradeLine(product)}</p>}
                {diamond && (
                  <p className="mt-1 text-xs text-slate">
                    {diamond.carat.toFixed(2)} ct · {diamond.origin === "LAB_GROWN" ? "Lab-grown" : "Natural"} · {diamond.lab}
                  </p>
                )}
                {!line.available && (
                  <p className="mt-2 text-xs font-medium text-out">
                    {product ? "This diamond is no longer available." : "This item is no longer in the catalog."}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink font-mono">
                  {line.available && line.pricePaise !== null ? formatINR(line.pricePaise) : "Unavailable"}
                </span>
                <button
                  type="button"
                  onClick={() => void handleRemove(line.variantId)}
                  disabled={removingId === line.variantId}
                  className="inline-flex items-center gap-1.5 p-1 text-xs uppercase tracking-wider text-slate hover:text-out disabled:opacity-50"
                  aria-label={`Remove ${product?.name ?? "diamond"} from cart`}
                >
                  {removingId === line.variantId ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {!compact && (
        <div className="border border-line bg-surface p-5 sm:p-6 space-y-4">
          {hasUnavailableItems && (
            <p className="border-l-2 border-out bg-out-tint p-3 text-sm text-out">
              Please remove unavailable diamonds before continuing to checkout.
            </p>
          )}

          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="text-sm text-slate">Subtotal ({itemCount} {itemCount === 1 ? "diamond" : "diamonds"})</p>
              <p className="text-xs text-muted font-mono mt-0.5">Includes {formatINR(gstPaise)} GST (3%) · Insured Transit Free</p>
            </div>
            <span className="text-xl font-medium font-mono text-ink">{formatINR(subtotalPaise)}</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/diamonds"
              className="inline-flex h-12 flex-1 items-center justify-center border border-line px-5 text-xs font-medium uppercase tracking-widest text-ink hover:border-ink transition-colors"
            >
              Continue shopping
            </Link>

            <Link
              href={session.status === "authenticated" ? "/checkout" : "/login?next=%2Fcheckout"}
              aria-disabled={hasUnavailableItems}
              className={`inline-flex h-12 flex-1 items-center justify-center gap-2 px-6 text-xs font-medium uppercase tracking-widest text-white transition-colors ${
                hasUnavailableItems ? "pointer-events-none bg-slate opacity-50" : "bg-ink hover:bg-loupe-deep"
              }`}
            >
              {session.status === "authenticated" ? "Proceed to checkout" : "Sign in to checkout"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      {compact && (
        <div className="border border-line bg-surface p-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate">Subtotal</span>
            <span className="font-medium font-mono text-ink">{formatINR(subtotalPaise)}</span>
          </div>
          <p className="text-[11px] text-muted font-mono mt-0.5">Includes {formatINR(gstPaise)} GST (3%)</p>
          {hasUnavailableItems && (
            <p className="mt-3 text-xs text-out">Remove unavailable diamonds before placing your order.</p>
          )}
          <Link
            href="/cart"
            className="mt-4 inline-flex h-10 w-full items-center justify-center border border-line text-xs font-medium uppercase tracking-widest text-ink hover:border-ink transition-colors"
          >
            View full cart
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartView;