"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function OrderSummary({ items = [], total = 0, loading = false }: any) {
  const subtotal = useMemo(() => {
    return items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const tax = subtotal * 0.05; // Example 5% tax
  const shipping = subtotal > 5000 ? 0 : 50;
  const finalTotal = total || (subtotal + tax + shipping);

  if (loading) {
    return (
      <div className="p-8 flex justify-center border border-line bg-surface">
        <Loader2 className="animate-spin h-6 w-6 text-slate" />
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface p-6">
      <h2 className="text-base font-medium text-ink mb-6 uppercase tracking-widest">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1 pr-4">
              <Link href={`/diamond/${item.productId}`} className="text-ink hover:underline line-clamp-1">
                {item.quantity}x {item.product?.name || `Diamond #${item.productId}`}
              </Link>
            </div>
            <span className="font-medium text-ink">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-line pt-4 text-sm text-slate">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-line pt-4 mt-4 text-base font-medium text-ink">
        <span>Total</span>
        <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export default OrderSummary;