"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, RotateCcw, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { SummaryLines } from "@/components/checkout/SummaryLines";
import { ProductImage } from "@/components/product/ProductImage";
import { isEnabled } from "@/config/features";
import { applyCoupon, removeCoupon } from "@/lib/api/cart";
import { gradeLine, originLine, productHref, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import { refreshCart, removeFromCart, useCart } from "@/lib/shop/cart";
import { site } from "@/lib/site";
import { showToast } from "@/lib/stores";

/** The cart page. Guests can build a cart; checking out needs an account. */
export function CartView() {
  const cart = useCart();

  // Fresh prices and availability every time the page opens
  useEffect(() => {
    void refreshCart();
  }, []);

  if (cart.status === "loading") return <Spinner className="mt-10" label="Loading your cart" />;

  if (cart.itemCount === 0) {
    return (
      <EmptyState className="mt-10" icon={<ShoppingBag className="size-8" />} title="Your cart is empty" action={{ label: "Browse diamonds", href: "/diamonds" }}>
        Every diamond comes with its IGI or GIA report, free insured delivery and {site.returnDays}-day returns.
      </EmptyState>
    );
  }

  const isGuest = cart.mode === "guest";
  const canCheckout = !cart.hasUnavailableItems;

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem]">
      <section aria-label="Diamonds in your cart">
        {cart.error && <p className="mb-4 text-sm text-out">{cart.error}</p>}
        {cart.hasUnavailableItems && (
          <p role="alert" className="mb-4 border border-out/30 bg-out-bg px-4 py-3 text-sm text-out">
            A diamond in your cart has just been sold. Remove it to continue — every stone is one of a kind.
          </p>
        )}
        <ul className="divide-y divide-line border-y border-line">
          {cart.lines.map((line) => (
            <li key={line.variantId} className="flex gap-4 py-5 sm:gap-6">
              <Link href={productHref(line.product.slug)} className="relative size-24 shrink-0 border border-line bg-stone sm:size-32">
                <ProductImage product={line.product} sizes="128px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={productHref(line.product.slug)} className="font-serif text-2xl leading-tight hover:underline">
                      {shortTitle(line.product)}
                    </Link>
                    <p className="mt-1 text-sm text-slate">{gradeLine(line.product)}</p>
                    <p className="text-sm text-slate">{originLine(line.product)}</p>
                  </div>
                  <div className="text-right">
                    {line.available && line.pricePaise !== null && <p className="font-serif text-2xl tabular-nums">{formatINR(line.pricePaise)}</p>}
                    {!line.available && <p className="text-sm font-medium uppercase tracking-[0.08em] text-out">Sold</p>}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                  <span className="text-slate">One of a kind · quantity 1</span>
                  <button type="button" onClick={() => void removeFromCart(line.variantId)} className="inline-flex min-h-10 items-center gap-1.5 text-slate hover:text-ink">
                    <X className="size-4" aria-hidden /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/diamonds" className="btn-link mt-6">
          Continue shopping
        </Link>
      </section>

      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line bg-stone p-6">
          <h2 className="text-2xl">Summary</h2>
          <div className="mt-5">
            <SummaryLines subtotalPaise={cart.subtotalPaise} discountPaise={cart.discountPaise} couponCode={cart.coupon?.code} totalPaise={cart.totalPaise} />
          </div>
          {isGuest && <p className="mt-3 text-xs text-slate">Prices are checked again when you log in.</p>}

          {!isGuest && isEnabled("coupons") && <CouponBox code={cart.coupon?.code ?? null} />}

          <div className="mt-6">
            {isGuest && (
              <>
                <Link href="/login?next=/checkout" className="btn btn-primary w-full">
                  Log in to check out
                </Link>
                <p className="mt-3 text-center text-sm text-slate">
                  New here?{" "}
                  <Link href="/register?next=/checkout" className="link">
                    Create an account
                  </Link>{" "}
                  — it takes a minute and your cart comes with you.
                </p>
              </>
            )}
            {!isGuest && canCheckout && (
              <Link href="/checkout" className="btn btn-primary w-full">
                <Lock className="size-4" aria-hidden /> Check out securely
              </Link>
            )}
            {!isGuest && !canCheckout && (
              <button type="button" disabled className="btn btn-primary w-full">
                Remove sold diamonds to continue
              </button>
            )}
          </div>
        </div>
        <ul className="mt-4 space-y-3 border border-line p-5 text-sm">
          <li className="flex gap-3">
            <ShieldCheck className="size-5 shrink-0 text-accent-deep" aria-hidden /> Checked against its grading report before dispatch
          </li>
          <li className="flex gap-3">
            <Truck className="size-5 shrink-0 text-accent-deep" aria-hidden /> Free, fully insured delivery across India
          </li>
          <li className="flex gap-3">
            <RotateCcw className="size-5 shrink-0 text-accent-deep" aria-hidden /> {site.returnDays}-day returns for a full refund
          </li>
        </ul>
      </aside>
    </div>
  );
}

/** Coupon code box (planned: POST/DELETE /account/cart/coupon). */
function CouponBox({ code }: { code: string | null }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    setError(undefined);
    try {
      await applyCoupon(value.trim().toUpperCase());
      await refreshCart();
      setValue("");
      showToast("Coupon applied.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "This code didn’t work.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await removeCoupon();
      await refreshCart();
    } finally {
      setBusy(false);
    }
  }

  if (code) {
    return (
      <p className="mt-4 flex items-center justify-between border border-line bg-white px-3 py-2 text-sm">
        <span>
          Code <strong className="font-medium">{code}</strong> applied
        </span>
        <button type="button" onClick={remove} disabled={busy} className="underline">
          Remove
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={apply} className="mt-4">
      <label htmlFor="coupon" className="text-sm font-medium">
        Have a code?
      </label>
      <div className="mt-1.5 flex gap-2">
        <input id="coupon" value={value} onChange={(e) => setValue(e.target.value)} className="field min-h-10 uppercase" autoComplete="off" />
        <button type="submit" className="btn btn-secondary min-h-10" disabled={busy}>
          Apply
        </button>
      </div>
      {error && <p className="mt-1.5 text-sm text-out">{error}</p>}
    </form>
  );
}
