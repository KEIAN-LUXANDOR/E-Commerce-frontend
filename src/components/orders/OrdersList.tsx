"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { listOrders } from "@/lib/api/orders";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { OrderSummary } from "@/lib/types/order";

export function OrdersList() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadOrders() {
      try {
        const page = await listOrders(0, 20);
        if (active) setOrders(page.items || []);
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadOrders();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-line bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-slate" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-12 text-center shadow-xs space-y-4">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-stone border border-line">
          <Package className="size-6 text-slate" />
        </div>
        <p className="text-slate text-sm">You haven&apos;t placed any orders yet.</p>
        <Link href="/diamonds">
          <Button size="md" className="shadow-xs">
            Explore Diamonds
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.orderNumber}
          className="rounded-xl border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-loupe/40 transition-colors shadow-xs"
        >
          <div>
            <Link
              href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
              className="text-base font-serif font-medium text-ink hover:underline block mb-1"
            >
              Order #{order.orderNumber}
            </Link>
            <p className="text-xs text-slate font-mono">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata",
              })}{" "}
              • {order.itemCount} {order.itemCount === 1 ? "diamond" : "diamonds"}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-base font-bold font-mono text-ink">
              {formatINR(order.totalPaise)}
            </span>
            <span className="inline-block px-2.5 py-1 rounded bg-stone border border-line text-[11px] font-mono uppercase tracking-wider text-ink">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersList;