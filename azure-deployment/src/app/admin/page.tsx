"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getAdminSummary } from "@/lib/api/admin";
import {
  AdminHeader,
  
  ErrorNote,
  Loading,
  NotConnected,
  Panel,
  StatCard,
  useAdminQuery,
} from "@/components/admin/AdminBits";









import { PackageCheck, Gem,     } from "lucide-react";

export default function AdminDashboardPage() {
  const q = useAdminQuery("adminDashboard", getAdminSummary, []);

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Operations &amp; Vault Dashboard"
        description="Live stock status, fulfillment queues, and realization metrics."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/packing"
              className="btn btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <PackageCheck className="size-4" />
              Packing Desk
            </Link>
            <Link
              href="/admin/inventory"
              className="btn btn-secondary text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Gem className="size-4" />
              Manage Inventory
            </Link>
          </div>
        }
      />

      {q.off && (
        <NotConnected feature="adminDashboard" endpoints={["GET /api/v1/admin/summary"]}>
          <p className="text-xs text-slate mt-2">
            While the backend dashboard endpoint is being finalized, you can access the operational desks below directly.
          </p>
        </NotConnected>
      )}

      {q.loading && <Loading />}
      {q.error && <ErrorNote message={q.error} />}

      {q.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Orders to Pack &amp; Ship"
            value={String(q.data.ordersToShip)}
            note="Paid — ready for loupe verification"
            href="/admin/packing"
          />
          <StatCard
            label="Active Loose Diamonds"
            value={String(q.data.activeDiamonds)}
            note={`${q.data.soldLast30Days} sold in last 30 days`}
            href="/admin/inventory"
          />
          <StatCard
            label="Paid Realization (Today)"
            value={formatPrice(q.data.paidToday.totalPaise)}
            note={`${q.data.paidToday.count} settled orders`}
            href="/admin/orders?status=PAID"
          />
          <StatCard
            label="Revenue (Last 30 Days)"
            value={formatPrice(q.data.last30Days.totalPaise)}
            note={`${q.data.last30Days.count} confirmed orders`}
          />
        </div>
      )}

      {/* Quick Navigation Panel */}
      <Panel title="Operations Quick Links">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <Link
            href="/admin/orders"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Orders Ledger</span>
            <span className="text-[11px] text-slate mt-1">Status &amp; Shipping</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Diamond Stock</span>
            <span className="text-[11px] text-slate mt-1">Grades &amp; Pricing</span>
          </Link>
          <Link
            href="/admin/packing"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Packing Desk</span>
            <span className="text-[11px] text-slate mt-1">Barcode Loupe QC</span>
          </Link>
          <Link
            href="/admin/clients"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Client Accounts</span>
            <span className="text-[11px] text-slate mt-1">Directory &amp; KYC</span>
          </Link>
          <Link
            href="/admin/coupons"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Privilege Codes</span>
            <span className="text-[11px] text-slate mt-1">Discounts &amp; VIP</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="border border-line p-3 hover:border-ink transition-colors flex flex-col justify-between"
          >
            <span className="font-medium text-ink">Client Inquiries</span>
            <span className="text-[11px] text-slate mt-1">Advisory &amp; Viewing</span>
          </Link>
        </div>
      </Panel>
    </div>
  );
}
