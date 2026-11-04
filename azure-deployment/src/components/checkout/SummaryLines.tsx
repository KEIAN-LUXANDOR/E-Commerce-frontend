import { formatPrice } from "@/lib/format";

/**
 * Money lines under a cart or order. Every amount comes from the backend;
 * nothing is calculated here.
 */
export function SummaryLines({
  subtotalPaise,
  discountPaise = 0,
  couponCode,
  shippingPaise = 0,
  totalPaise,
  totalLabel = "Total",
}: {
  subtotalPaise: number;
  discountPaise?: number;
  couponCode?: string | null;
  shippingPaise?: number;
  totalPaise: number;
  totalLabel?: string;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotalPaise)}</dd>
      </div>
      {discountPaise > 0 && (
        <div className="flex justify-between text-ok">
          <dt>Discount{couponCode ? ` (${couponCode})` : ""}</dt>
          <dd className="tabular-nums">−{formatPrice(discountPaise)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-slate">Delivery</dt>
        <dd>{shippingPaise > 0 ? formatPrice(shippingPaise) : "Free"}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-medium">{totalLabel}</dt>
        <dd className="font-serif text-3xl tabular-nums">{formatPrice(totalPaise)}</dd>
      </div>
    </dl>
  );
}
