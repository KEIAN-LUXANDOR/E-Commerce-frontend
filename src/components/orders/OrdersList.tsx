"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Package } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { Spinner } from "@/components/common/Spinner";
import { formatDate, OrderStatusBadge } from "@/components/orders/OrderBits";
import { isEnabled } from "@/config/features";
import { listOrders } from "@/lib/api/orders";
import { formatINR } from "@/lib/format";
import type { OrderListPage } from "@/lib/types/order";

/** My orders (GET /account/orders, planned). */
export function OrdersList() {
  const enabled = isEnabled("orders");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<OrderListPage | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    listOrders(page, 10)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Couldn’t load your orders.");
      });
    return () => {
      active = false;
    };
  }, [enabled, page]);

  if (!enabled) {
    return (
      <NotAvailableYet title="Online order history is coming soon" whatsappText="Hello Keian Luxandor, I'd like an update on my order.">
        If you’ve placed an order with us, message or call us with your name and we’ll give you an update straight away.
      </NotAvailableYet>
    );
  }
  if (error) return <p className="text-out">{error}</p>;
  if (!data) return <Spinner label="Loading your orders" />;
  if (data.items.length === 0) {
    return (
      <EmptyState icon={<Package className="size-8" />} title="No orders yet" action={{ label: "Browse diamonds", href: "/diamonds" }}>
        When you buy a diamond, its order and delivery updates will appear here.
      </EmptyState>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {data.items.map((o) => (
          <li key={o.orderNumber}>
            <Link href={`/account/orders/${encodeURIComponent(o.orderNumber)}`} className="flex items-center gap-4 py-4 hover:bg-stone sm:px-3">
              <span className="relative size-14 shrink-0 border border-line bg-stone">
                {o.firstItemImageUrl && <Image src={o.firstItemImageUrl} alt="" fill unoptimized sizes="56px" className="object-contain" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Order {o.orderNumber}</span>
                  <OrderStatusBadge status={o.status} />
                </span>
                <span className="mt-1 block truncate text-sm text-slate">
                  {o.firstItemName}
                  {o.itemCount > 1 && ` and ${o.itemCount - 1} more`} · {formatDate(o.createdAt)}
                </span>
              </span>
              <span className="text-right tabular-nums">{formatINR(o.totalPaise)}</span>
              <ChevronRight className="size-4 text-slate" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <button type="button" className="btn btn-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Newer
          </button>
          <span className="text-slate">
            Page {page + 1} of {data.totalPages}
          </span>
          <button type="button" className="btn btn-secondary" disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Older
          </button>
        </div>
      )}
    </div>
  );
}
