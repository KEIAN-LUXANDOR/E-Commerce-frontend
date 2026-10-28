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

type DisplayLine = {
  variantId: string;
  product: Product | null;
  pricePaise: number | null;
  available: boolean;
};

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export function CartView({ compact = false }: { compact?: boolean }) {
  const session = sessionStore.useSession();
  const cartSnapshot = useCart();
  const [guestLines, setGuestLines] = useState<DisplayLine[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);
  const [loadingServerCart, setLoadingServerCart] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

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

        // Guest carts store variant IDs only. Resolve those IDs against the public catalog API.
        while (page < totalPages && productsByVariant.size < wanted.size) {
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
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "We couldn't load your cart items.");
        }
      } finally {
        if (!cancelled) setGuestLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session.status, variantIdsKey]);

  const lines = useMemo<DisplayLine[]>(() => {
    if (session.status !== "authenticated") return guestLines;
    return (serverCart?.items ?? []).map((item) => ({
      variantId: item.variantId,
      product: item.product,
      pricePaise: item.pricePaise,
      available: item.available && item.pricePaise !== null,
    }));
  }, [session.status, serverCart, guestLines]);

  const isLoading =
    session.status === "loading" ||
    (session.status === "authenticated" && (loadingServerCart || (!serverCart && !loadError))) ||
    (session.status === "unauthenticated" && guestLoading);

  const itemCount = lines.length;
  const subtotalPaise =
    session.status === "authenticated"
      ? serverCart?.subtotalPaise ?? 0
      : lines.reduce((sum, line) => sum + (line.available ? line.pricePaise ?? 0 : 0), 0);
  const hasUnavailableItems =
    session.status === "authenticated"
      ? serverCart?.hasUnavailableItems ?? false
      : lines.some((line) => !line.available);

  async function handleRemove(variantId: string) {
    setRemovingId(variantId);
    setLoadError(null);
    try {
      await removeFromCart(variantId);
    } finally {
      setRemovingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 border border-line bg-surface p-10 text-sm text-slate">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading your cart…
      </div>
    );
  }

  if (loadError && lines.length === 0) {
    return (
      <div className="border border-line bg-surface p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-out" aria-hidden="true" />
        <p role="alert" className="mb-4 text-sm text-out">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="border border-line px-4 py-2 text-xs uppercase tracking-widest hover:border-ink"
        >
          Try again
        </button>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <ShoppingBag className="mx-auto mb-4 h-8 w-8 text-slate" aria-hidden="true" />
        <h2 className="font-serif text-xl text-ink">Your cart is empty</h2>
        <p className="mx-auto mb-5 mt-2 max-w-sm text-sm text-slate">
          Your selected diamonds will appear here. Each diamond is unique and can only be purchased once.
        </p>
        <Link
          href="/diamonds"
          className="inline-flex h-11 items-center justify-center gap-2 bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
        >
          Browse diamonds <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {loadError && (
        <p role="alert" className="border-l-2 border-out bg-out-tint p-3 text-sm text-out">{loadError}</p>
      )}

      {lines.map((line) => {
        const product = line.product;
        const diamond = product?.diamond;
        return (
          <article key={line.variantId} className="flex gap-4 border border-line bg-surface p-4 sm:p-5">
            <Link
              href={product ? productHref(product.slug) : "/diamonds"}
              className="relative h-24 w-24 shrink-0 bg-platinum sm:h-28 sm:w-28"
              aria-label={product ? `View ${product.name}` : "Browse diamonds"}
            >
              <ProductImage product={product ?? undefined} sizes="112px" className="object-contain" />
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
                <span className="text-sm font-medium text-ink">
                  {line.available && line.pricePaise !== null ? formatINR(line.pricePaise) : "Unavailable"}
                </span>
                <button
                  type="button"
                  onClick={() => void handleRemove(line.variantId)}
                  disabled={removingId === line.variantId}
                  className="inline-flex items-center gap-2 p-1 text-xs uppercase tracking-wider text-slate hover:text-out disabled:opacity-50"
                  aria-label={`Remove ${product?.name ?? "diamond"} from cart`}
                >
                  {removingId === line.variantId
                    ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {!compact && (
        <div className="border border-line bg-surface p-5 sm:p-6">
          {hasUnavailableItems && (
            <p className="mb-4 border-l-2 border-out bg-out-tint p-3 text-sm text-out">
              Remove unavailable diamonds before continuing to checkout.
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate">Subtotal ({itemCount} {itemCount === 1 ? "diamond" : "diamonds"})</span>
            <span className="text-lg font-medium text-ink">{formatINR(subtotalPaise)}</span>
          </div>
          <p className="mt-2 text-xs text-slate">Shipping and any applicable charges are confirmed when your order is created.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/diamonds"
              className="inline-flex h-12 flex-1 items-center justify-center border border-line px-5 text-xs font-medium uppercase tracking-widest text-ink hover:border-ink"
            >
              Continue shopping
            </Link>
            
             <Link
    href="/checkout"
    className="flex min-h-14 items-center justify-center bg-slate-900 px-6 py-4 text-center text-sm font-semibold tracking-widest text-white transition hover:bg-slate-700"
  >
    PROCEED TO CHECKOUT →
  </Link>

            <Link
              href={session.status === "authenticated" ? "/checkout" : "/login?next=%2Fcheckout"}
              aria-disabled={hasUnavailableItems}
              className={`inline-flex h-12 flex-1 items-center justify-center gap-2 px-5 text-xs font-medium uppercase tracking-widest text-white ${
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
            <span className="font-medium text-ink">{formatINR(subtotalPaise)}</span>
          </div>
          {hasUnavailableItems && (
            <p className="mt-3 text-xs text-out">Remove unavailable diamonds before placing your order.</p>
          )}
          <Link
            href="/cart"
            className="mt-4 inline-flex h-10 w-full items-center justify-center border border-line text-xs font-medium uppercase tracking-widest text-ink hover:border-ink"
          >
            View full cart
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartView;
