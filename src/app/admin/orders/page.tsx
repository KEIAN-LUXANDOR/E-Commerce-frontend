"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { OrderStatusBadge, formatDateTime } from "@/components/orders/OrderBits";
import { listAdminOrders } from "@/lib/api/admin";
import type { OrderStatus } from "@/lib/types/order";
import { formatINR } from "@/lib/format";

const STATUSES: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "PENDING_PAYMENT", label: "Waiting for payment" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(0);
  const orders = useAdminQuery("adminOrders", () => listAdminOrders({ q: appliedSearch || undefined, status: status || undefined, page, size: 20 }), [appliedSearch, status, page]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(0);
    setAppliedSearch(search.trim());
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Orders" description="Review customer orders and fulfillment status." />
      {orders.off && <NotConnected feature="adminOrders" endpoints={["GET /api/v1/admin/orders"]} />}
      {orders.error && <ErrorNote message={orders.error} />}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={submitSearch} className="flex flex-1 gap-2">
          <label htmlFor="admin-order-search" className="sr-only">Search orders</label>
          <input id="admin-order-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number or customer" className="field min-w-48" />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
        <select aria-label="Filter orders by status" value={status} onChange={(e) => { setStatus(e.target.value as OrderStatus | ""); setPage(0); }} className="field max-w-xs">
          {STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
      {orders.loading && <Loading />}
      {orders.data && orders.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No orders found.</p>}
      {orders.data && orders.data.items.length > 0 && (
        <AdminTable>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Placed</th><th>Total</th><th /></tr></thead>
          <tbody>
            {orders.data.items.map((order) => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}<span className="block text-xs text-slate">{order.customerEmail}</span></td>
                <td>{order.itemCount}</td>
                <td><OrderStatusBadge status={order.status} /></td>
                <td>{formatDateTime(order.createdAt)}</td>
                <td>{formatINR(order.totalPaise)}</td>
                <td className="text-right"><Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="btn-link">View</Link></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      {orders.data && orders.data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span>Page {orders.data.page + 1} of {orders.data.totalPages}</span>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary" disabled={page === 0 || orders.loading} onClick={() => setPage((value) => value - 1)}>Previous</button>
            <button type="button" className="btn btn-secondary" disabled={page + 1 >= orders.data.totalPages || orders.loading} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
