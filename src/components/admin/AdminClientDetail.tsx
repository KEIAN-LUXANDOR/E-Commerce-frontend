"use client";

import Link from "next/link";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { getAdminCustomer } from "@/lib/api/admin";
import { formatINR } from "@/lib/format";
import { formatDateTime, OrderStatusBadge } from "@/components/orders/OrderBits";

export function AdminClientDetail({ clientId }: { clientId: string }) {
  const client = useAdminQuery("adminCustomers", () => getAdminCustomer(clientId), [clientId]);
  if (client.loading) return <Loading />;
  if (client.off) return <NotConnected feature="adminCustomers" endpoints={["GET /api/v1/admin/customers/{id}"]} />;
  if (client.error) return <ErrorNote message={client.error} />;
  if (!client.data) return <ErrorNote message="Customer not found." />;

  const customer = client.data;
  return (
    <div className="space-y-6">
      <AdminHeader title={customer.fullName} description={customer.email} back={{ href: "/admin/clients", label: "Customers" }} action={<a href={`mailto:${encodeURIComponent(customer.email)}`} className="btn btn-secondary">Email customer</a>} />
      <section className="grid gap-4 border border-line bg-white p-5 sm:grid-cols-3">
        <p><span className="block text-xs uppercase text-slate">Phone</span>{customer.phone ? <a href={`tel:${customer.phone}`} className="btn-link">{customer.phone}</a> : "Not provided"}</p>
        <p><span className="block text-xs uppercase text-slate">Email verification</span>{customer.emailVerified ? "Verified" : "Not verified"}</p>
        <p><span className="block text-xs uppercase text-slate">Lifetime orders</span>{customer.orderCount} · {formatINR(customer.totalSpentPaise)}</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl">Addresses</h2>
        {customer.addresses.length === 0 ? <p className="border border-line bg-white p-5 text-sm text-slate">No saved addresses.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">{customer.addresses.map((address, index) => <address key={`${address.line1}-${index}`} className="border border-line bg-white p-4 not-italic text-sm">{address.fullName}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</address>)}</div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl">Orders</h2>
        {customer.orders.length === 0 ? <p className="border border-line bg-white p-5 text-sm text-slate">No orders yet.</p> : (
          <AdminTable>
            <thead><tr><th>Order</th><th>Status</th><th>Items</th><th>Placed</th><th>Total</th></tr></thead>
            <tbody>{customer.orders.map((order) => <tr key={order.orderNumber}><td><Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="btn-link">{order.orderNumber}</Link></td><td><OrderStatusBadge status={order.status} /></td><td>{order.itemCount}</td><td>{formatDateTime(order.createdAt)}</td><td>{formatINR(order.totalPaise)}</td></tr>)}</tbody>
          </AdminTable>
        )}
      </section>
    </div>
  );
}
