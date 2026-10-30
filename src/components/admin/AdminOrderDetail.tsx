"use client";

import { useState, type FormEvent } from "react";
import { AdminHeader, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { isEnabled } from "@/config/features";
import { cancelAdminOrder, getAdminOrder, markAdminOrderDelivered, shipAdminOrder } from "@/lib/api/admin";
import { invoiceUrl } from "@/lib/api/orders";
import { OrderStatusBadge, formatDateTime } from "@/components/orders/OrderBits";
import { formatPrice } from "@/lib/format";
import type { AdminOrder } from "@/lib/types/admin";

export function AdminOrderDetail({ orderNumber }: { orderNumber: string }) {
  const query = useAdminQuery("adminOrders", () => getAdminOrder(orderNumber), [orderNumber]);
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function act(action: () => Promise<unknown>) {
    setBusy(true);
    setError(undefined);
    try {
      await action();
      query.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The order could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  async function ship(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await act(() => shipAdminOrder(orderNumber, { courier, trackingNumber, trackingUrl: trackingUrl || undefined }));
  }

  async function cancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cancelReason.trim() || !window.confirm(`Cancel order ${orderNumber}?`)) return;
    await act(() => cancelAdminOrder(orderNumber, cancelReason.trim()));
  }

  if (query.loading) return <Loading />;
  if (query.off) {
    return (
      <div className="space-y-5">
        <AdminHeader title={`Order ${orderNumber}`} back={{ href: "/admin/orders", label: "Orders" }} />
        <NotConnected feature="adminOrders" endpoints={["GET /api/v1/admin/orders/{orderNumber}"]} />
      </div>
    );
  }
  if (query.error) return <ErrorNote message={query.error} />;
  if (!query.data) return <ErrorNote message="Order not found." />;

  const order: AdminOrder = query.data;
  const canCancel = order.status === "PENDING_PAYMENT" || order.status === "PAID";
  return (
    <div className="space-y-6">
      <AdminHeader title={`Order ${order.orderNumber}`} description={`${order.customer.fullName} · ${order.customer.email}`} back={{ href: "/admin/orders", label: "Orders" }} />
      {!isEnabled("invoices") && <NotConnected feature="invoices" endpoints={["GET /api/v1/account/orders/{orderNumber}/invoice"]} />}
      {error && <ErrorNote message={error} />}

      <section className="grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
        <div><p className="text-xs uppercase text-slate">Status</p><div className="mt-2"><OrderStatusBadge status={order.status} /></div></div>
        <div><p className="text-xs uppercase text-slate">Placed</p><p className="mt-2">{formatDateTime(order.createdAt)}</p></div>
        <div><p className="text-xs uppercase text-slate">Shipping address</p><p className="mt-2">{order.shippingAddress.fullName}<br />{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p></div>
        <div><p className="text-xs uppercase text-slate">Total</p><p className="mt-2 font-medium">{formatPrice(order.totalPaise)}</p></div>
      </section>

      <section className="border border-line bg-white p-5">
        <h2 className="text-xl">Items</h2>
        <ul className="mt-3 divide-y divide-line">
          {order.items.map((item) => <li key={item.lineNumber} className="flex justify-between gap-4 py-3"><span>{item.productName}<span className="block text-sm text-slate">SKU {item.sku}</span></span><span>{formatPrice(item.pricePaise)}</span></li>)}
        </ul>
      </section>

      <section className="flex flex-wrap gap-3">
        {isEnabled("invoices") && <a className="btn btn-secondary" href={invoiceUrl(order.orderNumber)}>Download invoice</a>}
        {order.status === "PAID" && (
          <form onSubmit={ship} className="grid w-full gap-3 border border-line bg-white p-5 sm:grid-cols-2">
            <h2 className="text-xl sm:col-span-2">Ship order</h2>
            <label className="space-y-1 text-sm">Courier<input required value={courier} onChange={(e) => setCourier(e.target.value)} className="field" /></label>
            <label className="space-y-1 text-sm">Tracking number<input required value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="field" /></label>
            <label className="space-y-1 text-sm sm:col-span-2">Tracking URL (optional)<input type="url" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} className="field" /></label>
            <button type="submit" className="btn btn-primary sm:col-span-2" disabled={busy}>{busy ? "Saving..." : "Mark shipped"}</button>
          </form>
        )}
        {order.status === "SHIPPED" && <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void act(() => markAdminOrderDelivered(order.orderNumber))}>Mark delivered</button>}
        {canCancel && (
          <form onSubmit={cancel} className="grid w-full gap-3 border border-line bg-white p-5 sm:grid-cols-[1fr_auto]">
            <label className="space-y-1 text-sm">Cancellation reason<textarea required value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="field min-h-20 py-2" /></label>
            <button type="submit" className="btn btn-secondary self-end" disabled={busy}>{busy ? "Saving..." : "Cancel order"}</button>
          </form>
        )}
      </section>
    </div>
  );
}
