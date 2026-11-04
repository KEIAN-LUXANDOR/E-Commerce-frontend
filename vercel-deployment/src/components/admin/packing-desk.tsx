"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AdminHeader, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { getPackingList } from "@/lib/api/admin";

export function PackingDesk() {
  const packing = useAdminQuery("adminOrders", getPackingList, []);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [sku, setSku] = useState("");
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string>();
  const order = packing.data?.find((item) => item.orderNumber === selectedOrder) ?? packing.data?.[0];
  const pickedSkus = order ? picked[order.orderNumber] ?? [] : [];
  const allPicked = Boolean(order && order.items.length > 0 && order.items.every((item) => pickedSkus.includes(item.sku)));

  function scanSku(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    const entered = sku.trim();
    const matched = order.items.find((item) => item.sku.toLowerCase() === entered.toLowerCase());
    if (!matched) {
      setMessage(`SKU ${entered || "(empty)"} is not on order ${order.orderNumber}.`);
      return;
    }
    if (pickedSkus.includes(matched.sku)) {
      setMessage(`${matched.sku} is already marked as picked.`);
      return;
    }
    setPicked((current) => ({ ...current, [order.orderNumber]: [...pickedSkus, matched.sku] }));
    setSku("");
    setMessage(`${matched.sku} verified and marked as picked.`);
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Packing list" description="Verify each SKU against paid orders before dispatch." />
      {packing.off && <NotConnected feature="adminOrders" endpoints={["GET /api/v1/admin/packing"]} />}
      {packing.error && <ErrorNote message={packing.error} />}
      {packing.loading && <Loading />}
      {packing.data && packing.data.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No paid orders are waiting to be packed.</p>}
      {order && (
        <section className="space-y-5 border border-line bg-white p-5">
          <label className="block max-w-lg space-y-1 text-sm font-medium">
            Order
            <select value={order.orderNumber} onChange={(e) => { setSelectedOrder(e.target.value); setMessage(undefined); }} className="field">
              {packing.data?.map((item) => <option key={item.orderNumber} value={item.orderNumber}>{item.orderNumber} — {item.shipTo.fullName}</option>)}
            </select>
          </label>
          <div className="text-sm">
            <p className="font-medium">{order.shipTo.fullName}</p>
            <p className="text-slate">{order.shipTo.city}, {order.shipTo.state} {order.shipTo.pincode}</p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {order.items.map((item) => {
              const isPicked = pickedSkus.includes(item.sku);
              return (
                <li key={item.sku} className="flex items-start gap-3 py-4">
                  <input aria-label={`Picked ${item.sku}`} type="checkbox" checked={isPicked} onChange={(e) => setPicked((current) => ({
                    ...current,
                    [order.orderNumber]: e.target.checked ? [...pickedSkus, item.sku] : pickedSkus.filter((value) => value !== item.sku),
                  }))} />
                  <div className="min-w-0">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-slate">SKU {item.sku}{item.certificateNumber ? ` · Certificate ${item.certificateNumber}` : ""}</p>
                    {item.description && <p className="mt-1 text-sm text-slate">{item.description}</p>}
                  </div>
                  <span className="ml-auto text-sm">{isPicked ? "Picked" : "To pick"}</span>
                </li>
              );
            })}
          </ul>
          <form onSubmit={scanSku} className="flex flex-wrap gap-2">
            <label htmlFor="packing-sku" className="sr-only">Scan or enter SKU</label>
            <input id="packing-sku" autoComplete="off" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Scan or enter SKU" className="field min-w-48 flex-1" />
            <button type="submit" className="btn btn-secondary" disabled={!sku.trim()}>Verify SKU</button>
          </form>
          {message && <p aria-live="polite" className="text-sm text-slate">{message}</p>}
          {allPicked ? (
            <Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="btn btn-primary">Continue to shipping</Link>
          ) : (
            <p className="text-sm text-slate">{pickedSkus.length} of {order.items.length} items verified. Verify all items to continue.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default PackingDesk;
