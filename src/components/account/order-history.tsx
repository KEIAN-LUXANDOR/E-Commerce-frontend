"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listOrders } from "@/lib/api/orders";
import type { OrderListPage } from "@/lib/types/order";
import { formatINR } from "@/lib/format";
import { formatDateTime, OrderStatusBadge } from "@/components/orders/OrderBits";

const PAGE_SIZE = 10;

export function OrderHistory() {
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState<OrderListPage>();
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [error, setError] = useState<{ page: number; message: string }>();

  useEffect(() => {
    let active = true;
    listOrders(page, PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setOrders(result);
        setLoadedPage(page);
        setError(undefined);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError({
            page,
            message: cause instanceof Error ? cause.message : "Could not load your orders.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [page]);

  if (loadedPage !== page && error?.page !== page) return <p role="status" className="py-8 text-sm text-slate">Loading your orders…</p>;
  if (error?.page === page) return <p role="alert" className="border border-out/30 bg-out-bg p-4 text-sm text-out">{error.message}</p>;
  if (!orders?.items.length) {
    return (
      <section className="border-y border-line py-10 text-center">
        <h3 className="font-serif text-2xl">No orders yet</h3>
        <p className="mt-2 text-sm text-slate">Your orders will appear here after checkout.</p>
        <Link href="/diamonds" className="btn btn-primary mt-5">Browse diamonds</Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <ul className="divide-y divide-line border-y border-line">
        {orders.items.map((order) => (
          <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="space-y-1">
              <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`} className="font-medium hover:underline">
                Order {order.orderNumber}
              </Link>
              <p className="text-sm text-slate">{order.firstItemName}{order.itemCount > 1 ? ` · +${order.itemCount - 1} more` : ""}</p>
              <p className="text-xs text-slate">Placed {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.status} />
              <span className="font-medium tabular-nums">{formatINR(order.totalPaise)}</span>
            </div>
          </li>
        ))}
      </ul>
      {orders.totalPages > 1 && (
        <nav aria-label="Order pages" className="flex items-center justify-between">
          <button type="button" className="btn btn-secondary" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span className="text-sm text-slate">Page {page + 1} of {orders.totalPages}</span>
          <button type="button" className="btn btn-secondary" disabled={page + 1 >= orders.totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
        </nav>
      )}
    </section>
  );
}
