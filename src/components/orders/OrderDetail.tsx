"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Download, ExternalLink, Truck } from "lucide-react";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { Spinner } from "@/components/common/Spinner";
import { SummaryLines } from "@/components/checkout/SummaryLines";
import { AddressBlock, formatDate, formatDateTime, OrderItems, OrderProgress, OrderStatusBadge, PaymentCountdown } from "@/components/orders/OrderBits";
import { PayNow } from "@/components/orders/PayNow";
import { ReturnRequest } from "@/components/orders/ReturnRequest";
import { isEnabled } from "@/config/features";
import { cancelOrder, getOrder, invoiceUrl } from "@/lib/api/orders";
import { site } from "@/lib/site";
import { RETURN_STATUS_LABEL, type Order } from "@/lib/types/order";

/** One order: status, what's in it, where it's going, the money, and what you can do next. */
export function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const enabled = isEnabled("orders");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrder(await getOrder(orderNumber));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t load this order.");
    }
  }, [orderNumber]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getOrder(orderNumber)
      .then((result) => {
        if (active) setOrder(result);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Couldn’t load this order.");
      });
    return () => {
      active = false;
    };
  }, [enabled, orderNumber]);

  if (!enabled) return <NotAvailableYet title="Order details are coming soon">Message or call us with your order number for an update.</NotAvailableYet>;
  if (error) return <p className="text-out">{error}</p>;
  if (order === undefined) return <Spinner label="Loading your order" />;
  if (order === null) {
    return (
      <div>
        <p className="font-serif text-2xl">We couldn’t find order {orderNumber}</p>
        <Link href="/account/orders" className="link mt-3 inline-block">
          Back to your orders
        </Link>
      </div>
    );
  }

  async function cancel() {
    if (!window.confirm("Cancel this order? The diamonds will go back on sale.")) return;
    setBusy(true);
    try {
      setOrder(await cancelOrder(orderNumber));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t cancel this order.");
    } finally {
      setBusy(false);
    }
  }

  const pending = order.status === "PENDING_PAYMENT";
  const delivered = order.status === "DELIVERED";
  const paidish = ["PAID", "SHIPPED", "DELIVERED", "REFUNDED"].includes(order.status);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/account/orders" className="text-sm text-slate hover:text-ink hover:underline">
            ← All orders
          </Link>
          <h2 className="mt-2 text-3xl">Order {order.orderNumber}</h2>
          <p className="mt-1 text-sm text-slate">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderProgress status={order.status} />

      {pending && (
        <div className="border border-warn/30 bg-warn-bg p-5">
          <p className="font-medium text-warn">
            Waiting for payment · held for you for <PaymentCountdown expiresAt={order.expiresAt} onExpire={() => void load()} />
          </p>
          <p className="mt-1 text-sm text-warn">If it isn’t paid in time, the order is cancelled and the diamonds go back on sale.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <PayNow orderNumber={order.orderNumber} totalPaise={order.totalPaise} />
            <button type="button" onClick={cancel} disabled={busy} className="btn btn-secondary">
              Cancel order
            </button>
          </div>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <p className="border border-line bg-stone p-4 text-sm">
          This order was cancelled{order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}. No money was taken, or any payment has been refunded.
        </p>
      )}

      {order.shipment && (
        <section className="border border-line p-5">
          <h3 className="flex items-center gap-2 font-medium">
            <Truck className="size-5" aria-hidden /> Delivery
          </h3>
          <p className="mt-2 text-sm text-ink-secondary">
            Sent with {order.shipment.courier} on {formatDate(order.shipment.shippedAt)}. Tracking number <strong className="font-medium">{order.shipment.trackingNumber}</strong>.
            {order.shipment.deliveredAt && ` Delivered on ${formatDate(order.shipment.deliveredAt)}.`}
          </p>
          {order.shipment.trackingUrl && (
            <a href={order.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-link mt-2">
              Track with the courier <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section>
          <h3 className="section-eyebrow text-ink">Diamonds</h3>
          <OrderItems items={order.items} />
        </section>
        <aside className="space-y-6">
          <div className="border border-line bg-stone p-5">
            <SummaryLines subtotalPaise={order.subtotalPaise} discountPaise={order.discountPaise} shippingPaise={order.shippingPaise} totalPaise={order.totalPaise} totalLabel={paidish ? "Paid" : "Total"} />
          </div>
          <div>
            <h3 className="section-eyebrow mb-2 text-ink">Delivering to</h3>
            <AddressBlock address={order.shippingAddress} />
          </div>
          {paidish && isEnabled("invoices") && (
            <a href={invoiceUrl(order.orderNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">
              <Download className="size-4" aria-hidden /> Download invoice
            </a>
          )}
        </aside>
      </div>

      {order.returnRequest && (
        <p className="border border-line bg-stone p-4 text-sm">
          Return {order.returnRequest.returnNumber}: <strong className="font-medium">{RETURN_STATUS_LABEL[order.returnRequest.status]}</strong> (asked on {formatDate(order.returnRequest.requestedAt)}).
        </p>
      )}
      {delivered && !order.returnRequest && <ReturnRequest order={order} onDone={() => void load()} />}

      <p className="text-sm text-slate">
        Questions about this order? <Link href="/contact" className="link">Contact us</Link> and mention {order.orderNumber}. Returns are accepted within {site.returnDays} days of delivery.
      </p>
    </div>
  );
}
