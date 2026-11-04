"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { listAdminReturns } from "@/lib/api/admin";
import type { ReturnStatus } from "@/lib/types/order";
import { RETURN_STATUS_LABEL } from "@/lib/types/order";
import { formatPrice } from "@/lib/format";

const STATUSES: (ReturnStatus | "")[] = ["", "REQUESTED", "APPROVED", "RECEIVED", "REFUNDED", "REJECTED"];

export default function AdminReturnsPage() {
  const [status, setStatus] = useState<ReturnStatus | "">("");
  const returns = useAdminQuery("adminReturns", () => listAdminReturns({ status: status || undefined }), [status]);

  return (
    <div className="space-y-5">
      <AdminHeader title="Returns" description="Review and process customer return requests." />
      {returns.off && <NotConnected feature="adminReturns" endpoints={["GET /api/v1/admin/returns"]} />}
      {returns.error && <ErrorNote message={returns.error} />}
      <label className="block max-w-xs space-y-1 text-sm">
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value as ReturnStatus | "")} className="field">
          {STATUSES.map((value) => <option key={value} value={value}>{value ? RETURN_STATUS_LABEL[value] : "All statuses"}</option>)}
        </select>
      </label>
      {returns.loading && <Loading />}
      {returns.data && returns.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No return requests found.</p>}
      {returns.data && returns.data.items.length > 0 && (
        <AdminTable>
          <thead><tr><th>Return</th><th>Order</th><th>Customer</th><th>Reason</th><th>Refund</th><th>Status</th><th /></tr></thead>
          <tbody>
            {returns.data.items.map((item) => (
              <tr key={item.id}>
                <td>{item.returnNumber}</td><td>{item.orderNumber}</td>
                <td>{item.customerName}<span className="block text-xs text-slate">{item.customerEmail}</span></td>
                <td>{item.reason}</td><td>{item.refundPaise === null ? "—" : formatPrice(item.refundPaise)}</td>
                <td>{RETURN_STATUS_LABEL[item.status]}</td>
                <td className="text-right"><Link href={`/admin/returns/${encodeURIComponent(item.id)}`} className="btn-link">Review</Link></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
