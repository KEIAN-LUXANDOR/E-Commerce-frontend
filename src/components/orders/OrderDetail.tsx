"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiFetch(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        showToast("Failed to load order details", { tone: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const result = (await apiFetch(`/orders/${id}/cancel`, { method: "POST" })) as any;
      setOrder(result);
      showToast("Order cancelled successfully", { tone: "success" });
    } catch (err) {
      showToast("Failed to cancel order", { tone: "error" });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center border border-line bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-slate" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center border border-line bg-surface">
        <p className="text-slate">Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block text-xs font-medium uppercase tracking-widest text-ink hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <Link href="/account/orders" className="inline-flex items-center text-xs font-medium uppercase tracking-widest text-slate hover:text-ink transition-colors mb-2">
            <ArrowLeft className="mr-2 h-3 w-3" /> Back
          </Link>
          <h1 className="text-2xl font-serif text-ink">Order #{order.orderNumber || order.id}</h1>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-platinum text-xs font-medium uppercase tracking-widest text-ink">
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-line bg-surface p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate">{item.quantity}x Diamond #{item.productId}</span>
                <span className="font-medium text-ink">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border border-line bg-surface p-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-ink mb-4">Summary</h2>
            <div className="flex justify-between font-medium text-ink text-lg pt-4 border-t border-line">
              <span>Total</span>
              <span>${order.total?.toLocaleString()}</span>
            </div>
          </div>
          
          {order.status === "PENDING" && (
            <button 
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full h-11 border border-out text-out text-xs font-medium uppercase tracking-widest hover:bg-out/5 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;