"use client";

import Link from "next/link";
import { X, Lock, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCart, removeFromCart } from "@/lib/shop/cart";
import { ProductImage } from "@/components/product/ProductImage";
import * as siteMod from "@/lib/site";

// Safely load site config to avoid export mismatches
const siteConfig =
  (siteMod as Record<string, any>).site ??
  (siteMod as Record<string, any>).SITE ??
  siteMod;

// Inline formatting to avoid brittle imports
function formatINR(paise?: number | null): string {
  if (typeof paise !== "number" || Number.isNaN(paise)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

function formatEnumLabel(val?: string | null): string {
  if (!val) return "";
  if (val === "LAB_GROWN") return "Lab-Grown";
  if (val === "NATURAL") return "Natural";
  return val
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CartView({ isCheckout = false }: { isCheckout?: boolean }) {
  const cart = useCart();
  const items = cart?.items || [];
  const subtotal = cart?.subtotalPaise || 0;
  
  const returnDays = siteConfig?.returnDays ?? 30;

  if (!cart || items.length === 0) {
    return (
      <div className="border border-line bg-surface p-8 text-center space-y-4">
        <h2 className="text-xl font-medium text-ink">Your cart is empty</h2>
        <p className="text-sm text-slate">Browse our collection to find your perfect diamond.</p>
        <Link
          href="/diamonds"
          className="inline-flex h-11 items-center justify-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          Shop Diamonds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isCheckout && (
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-medium text-ink">Your Cart</h1>
          <p className="text-sm text-slate">{items.length} diamond{items.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-8 ${isCheckout ? '' : 'lg:grid-cols-12 items-start'}`}>
        {/* Cart Items */}
        <div className={`${isCheckout ? '' : 'lg:col-span-7'} space-y-4`}>
          {items.map((item: any) => {
            const p = item.product;
            if (!p) return null;
            const d = p.diamond;
            const variant = p.variants?.find((v: any) => v.id === item.variantId) || p.variants?.[0];
            
            const grades = d
              ? [
                  d.carat ? `${Number(d.carat).toFixed(2)} ct` : null,
                  d.color,
                  d.clarity,
                  d.cut ? formatEnumLabel(d.cut) : null,
                ].filter(Boolean).join(" · ")
              : "";
              
            const origin = d ? `${formatEnumLabel(d.origin)} · ${d.lab}` : "";
            const itemPrice = item.pricePaise ?? item.unitPricePaise ?? variant?.pricePaise;

            return (
              <div key={item.variantId} className="flex gap-4 border border-line bg-surface p-4">
                <Link href={`/diamond/${p.slug}`} className="block h-24 w-24 shrink-0 bg-platinum relative">
                  <ProductImage product={p} className="object-contain" />
                </Link>
                
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <Link href={`/diamond/${p.slug}`} className="block text-sm font-medium text-ink hover:underline truncate">
                        {p.name}
                      </Link>
                      {grades && <p className="mt-1 text-xs text-slate truncate">{grades}</p>}
                      {origin && <p className="mt-0.5 text-xs text-slate truncate">{origin}</p>}
                      {d?.certificateNumber && (
                        <p className="mt-1 text-[11px] text-slate">Report: {d.certificateNumber}</p>
                      )}
                    </div>
                    
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium tabular-nums text-ink">
                        {itemPrice ? formatINR(itemPrice) : "—"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-xs text-slate hover:text-out transition-colors inline-flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className={`${isCheckout ? '' : 'lg:col-span-5 lg:sticky lg:top-24'} space-y-4`}>
          <div className="border border-line bg-surface p-6">
            <h2 className="text-base font-medium text-ink mb-4">Order Summary</h2>
            
            <dl className="space-y-2.5 text-sm text-slate">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium tabular-nums text-ink">{formatINR(subtotal)}</dd>
              </div>
              
              {cart?.coupon && (
                <div className="flex justify-between text-ok">
                  <dt>Coupon ({cart.coupon.code})</dt>
                  <dd className="font-medium tabular-nums">- {formatINR(cart.discountPaise || 0)}</dd>
                </div>
              )}
              
              <div className="flex justify-between">
                <dt>Shipping (Insured)</dt>
                <dd className="font-medium text-ink">Free</dd>
              </div>
              
              {cart?.taxLines && cart.taxLines.map((tax: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <dt>{tax.label} ({tax.ratePct}%)</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatINR(tax.amountPaise)}</dd>
                </div>
              ))}
              
              {!cart?.taxLines && (
                <div className="flex justify-between">
                  <dt>GST</dt>
                  <dd>Calculated at checkout</dd>
                </div>
              )}
            </dl>
            
            <div className="mt-4 border-t border-line pt-4 flex justify-between items-center">
              <span className="text-base font-medium text-ink">Total</span>
              <span className="text-xl font-medium tabular-nums text-ink">
                {formatINR(cart?.totalPaise || subtotal)}
              </span>
            </div>
            
            {!isCheckout && (
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex h-11 items-center justify-center gap-2 bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  Check Out Securely
                </Link>
              </div>
            )}
          </div>
          
          <ul className="space-y-2 text-xs text-slate px-2">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-ok shrink-0" />
              <span>Graded by GIA or IGI and checked before dispatch</span>
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-ok shrink-0" />
              <span>Insured, tamper-evident delivery across India</span>
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-ok shrink-0" />
              <span>{returnDays}-day returns with the original certificate</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CartView;