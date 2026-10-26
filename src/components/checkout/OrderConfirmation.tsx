"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/common/Spinner";
import { SummaryLines } from "@/components/checkout/SummaryLines";
import { AddressBlock, OrderItems } from "@/components/orders/OrderBits";
import { isEnabled } from "@/config/features";
import { getOrder } from "@/lib/api/orders";
import { site } from "@/lib/site";
import type { Order } from "@/lib/types/order";

/** Thank-you page. Loads the order from the backend and only says "paid" when it really is. */
export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string>();
  const enabled = isEnabled("orders");

  useEffect(() => {
    if (!orderNumber || !enabled) return;
    let active = true;
    getOrder(orderNumber)
      .then((o) => {
        if (active) setOrder(o);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Couldn’t load your order.");
      });
    return () => {
      active = false;
    };
  }, [orderNumber, enabled]);

  if (!orderNumber || !enabled) return <NotFound />;
  if (error) return <p className="text-out">{error}</p>;
  if (order === undefined) return <Spinner label="Loading your order" />;
  if (order === null) return <NotFound />;

  if (order.status === "PENDING_PAYMENT") {
    return (
      <div className="max-w-xl">
        <h1 className="text-4xl">Your payment isn’t confirmed yet</h1>
        <p className="mt-3 text-slate">Order {order.orderNumber} is still waiting for payment. If you’ve just paid, give it a minute and refresh this page.</p>
        <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`} className="btn btn-primary mt-6">
          Go to the order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-ok" aria-hidden />
        <h1 className="mt-4 text-4xl sm:text-5xl">Thank you, your order is confirmed</h1>
        <p className="mt-3 text-lg text-slate">
          Order <strong className="font-medium text-ink">{order.orderNumber}</strong>. We’ve emailed you a confirmation.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 border border-line bg-stone p-6 sm:grid-cols-3">
        <li>
          <p className="font-medium">1. We check your diamond</p>
          <p className="mt-1 text-sm text-slate">We match it to its grading report and seal it with the report.</p>
        </li>
        <li>
          <p className="font-medium">2. We send it insured</p>
          <p className="mt-1 text-sm text-slate">You’ll get the courier’s tracking number by email.</p>
        </li>
        <li>
          <p className="font-medium">3. You sign for it</p>
          <p className="mt-1 text-sm text-slate">Then you have {site.returnDays} days to be sure.</p>
        </li>
      </ol>

      <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_16rem]">
        <section>
          <h2 className="section-eyebrow text-ink">Diamonds</h2>
          <OrderItems items={order.items} />
        </section>
        <aside className="space-y-6">
          <SummaryLines subtotalPaise={order.subtotalPaise} discountPaise={order.discountPaise} shippingPaise={order.shippingPaise} totalPaise={order.totalPaise} totalLabel="Paid" />
          <div>
            <h2 className="section-eyebrow mb-2 text-ink">Delivering to</h2>
            <AddressBlock address={order.shippingAddress} />
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`} className="btn btn-primary">
          View your order
        </Link>
        <Link href="/diamonds" className="btn btn-secondary">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl">We couldn’t find that order</h1>
      <p className="mt-3 text-slate">Your orders are always in your account.</p>
      <Link href="/account/orders" className="btn btn-primary mt-6">
        Your orders
      </Link>
    </div>
  );
}
