"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";

export function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiFetch("/orders") as any;
        setOrders(data?.content || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center border border-line bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-slate" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center border border-line bg-surface">
        <p className="text-slate mb-4">You haven't placed any orders yet.</p>
        <Link href="/diamonds" className="text-xs font-medium uppercase tracking-widest text-ink hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-line bg-surface p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-ink transition-colors">
          <div>
            <Link href={`/account/orders/${order.id}`} className="text-base font-medium text-ink hover:underline block mb-1">
              Order #{order.orderNumber || order.id}
            </Link>
            <p className="text-xs text-slate">
              {new Date(order.createdAt || order.placedAt).toLocaleDateString()} • {order.items?.length || 0} items
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-ink">${order.total?.toLocaleString()}</span>
            <span className="inline-block px-2 py-1 bg-platinum text-[10px] font-medium uppercase tracking-widest text-ink">
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersList;