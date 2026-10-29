import { formatINR } from "@/lib/format";
import { gstIncludedPaise } from "@/lib/site";

/**
 * Money lines under a cart or order. Every amount comes from the backend;
 * the only thing worked out here is the "includes ₹X GST" note (from the rate in src/lib/site.ts).
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
  const gst = gstIncludedPaise(totalPaise);
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate">Subtotal</dt>
        <dd className="tabular-nums">{formatINR(subtotalPaise)}</dd>
      </div>
      {discountPaise > 0 && (
        <div className="flex justify-between text-ok">
          <dt>Discount{couponCode ? ` (${couponCode})` : ""}</dt>
          <dd className="tabular-nums">−{formatINR(discountPaise)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-slate">Delivery</dt>
        <dd>{shippingPaise > 0 ? formatINR(shippingPaise) : "Free"}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-medium">{totalLabel}</dt>
        <dd className="font-serif text-3xl tabular-nums">{formatINR(totalPaise)}</dd>
      </div>
      {gst !== null && (
        <p className="text-right text-xs text-slate">Includes GST of {formatINR(gst)}</p>
      )}
    </dl>
  );
}
