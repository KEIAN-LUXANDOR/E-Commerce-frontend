"use client";

import Link from "next/link";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, Panel, StatCard, useAdminQuery } from "@/components/admin/AdminBits";
import { formatDateTime, OrderStatusBadge } from "@/components/orders/OrderBits";
import { getAdminSummary, listAdminOrders } from "@/lib/api/admin";
import { formatINR } from "@/lib/format";

/** What needs doing today, at a glance. */
export function Dashboard() {
  const summary = useAdminQuery("adminDashboard", getAdminSummary, []);
  const recent = useAdminQuery("adminOrders", () => listAdminOrders({ page: 0, size: 8 }), []);

  return (
    <div className="space-y-8">
      <AdminHeader title="Dashboard" description="What needs doing today." />

      {summary.off && <NotConnected feature="adminDashboard" endpoints={["GET /api/v1/admin/summary"]} />}
      {summary.error && <ErrorNote message={summary.error} />}
      {summary.loading && <Loading />}
      {summary.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="To pack and ship" value={String(summary.data.ordersToShip)} note="Paid orders" href="/admin/packing" />
          <StatCard label="Waiting for payment" value={String(summary.data.awaitingPayment)} note="Held for 15 minutes" href="/admin/orders?status=PENDING_PAYMENT" />
          <StatCard label="Paid today" value={formatINR(summary.data.paidToday.totalPaise)} note={`${summary.data.paidToday.count} orders`} />
          <StatCard label="Last 30 days" value={formatINR(summary.data.last30Days.totalPaise)} note={`${summary.data.last30Days.count} orders · ${summary.data.soldLast30Days} diamonds`} />
          <StatCard label="Diamonds on sale" value={String(summary.data.activeDiamonds)} href="/admin/diamonds?status=ACTIVE" />
          <StatCard label="Open returns" value={String(summary.data.openReturns)} href="/admin/returns" />
          <StatCard label="New enquiries" value={String(summary.data.newEnquiries)} note="Messages and viewings" href="/admin/enquiries" />
        </div>
      )}

      <Panel
        title="Latest orders"
        action={
          <Link href="/admin/orders" className="btn-link">
            All orders
          </Link>
        }
      >
        {recent.off && <NotConnected feature="adminOrders" endpoints={["GET /api/v1/admin/orders"]} />}
        {recent.error && <ErrorNote message={recent.error} />}
        {recent.loading && <Loading />}
        {recent.data && recent.data.items.length === 0 && <p className="text-sm text-slate">No orders yet.</p>}
        {recent.data && recent.data.items.length > 0 && (
          <AdminTable minWidth="40rem">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Placed</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.data.items.map((o) => (
                <tr key={o.orderNumber}>
                  <td>
                    <Link href={`/admin/orders/${o.orderNumber}`} className="font-medium hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td>{o.customerName}</td>
                  <td>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="text-slate">{formatDateTime(o.createdAt)}</td>
                  <td className="text-right tabular-nums">{formatINR(o.totalPaise)}</td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/diamonds/new" className="btn btn-primary">
          Add a diamond
        </Link>
        <Link href="/admin/diamonds/import" className="btn btn-secondary">
          Import diamonds from CSV
        </Link>
        <Link href="/admin/packing" className="btn btn-secondary">
          Open the packing list
        </Link>
      </div>
    </div>
  );
}
