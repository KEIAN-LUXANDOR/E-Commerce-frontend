"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { listAdminCustomers } from "@/lib/api/admin";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/components/orders/OrderBits";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const clients = useAdminQuery("adminCustomers", () => listAdminCustomers({ q: search || undefined, page, size: 20 }), [search, page]);

  return (
    <div className="space-y-5">
      <AdminHeader title="Customers" description="Customer accounts, verification, and order history." />
      {clients.off && <NotConnected feature="adminCustomers" endpoints={["GET /api/v1/admin/customers"]} />}
      {clients.error && <ErrorNote message={clients.error} />}
      <label className="block max-w-sm space-y-1 text-sm">Search customers
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Name, email, or phone" className="field" />
      </label>
      {clients.loading && <Loading />}
      {clients.data && clients.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No customers found.</p>}
      {clients.data && clients.data.items.length > 0 && (
        <AdminTable>
          <thead><tr><th>Customer</th><th>Email verified</th><th>Orders</th><th>Total spent</th><th>Joined</th><th /></tr></thead>
          <tbody>{clients.data.items.map((client) => (
            <tr key={client.id}>
              <td>{client.fullName}<span className="block text-xs text-slate">{client.email}{client.phone ? ` · ${client.phone}` : ""}</span></td>
              <td>{client.emailVerified ? "Verified" : "Not verified"}</td>
              <td>{client.orderCount}</td>
              <td>{formatPrice(client.totalSpentPaise)}</td>
              <td>{formatDateTime(client.createdAt)}</td>
              <td className="text-right"><Link href={`/admin/clients/${encodeURIComponent(client.id)}`} className="btn-link">View</Link></td>
            </tr>
          ))}</tbody>
        </AdminTable>
      )}
      {clients.data && clients.data.totalPages > 1 && <div className="flex items-center justify-between text-sm"><span>Page {clients.data.page + 1} of {clients.data.totalPages}</span><div className="flex gap-2"><button type="button" className="btn btn-secondary" disabled={page === 0 || clients.loading} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" className="btn btn-secondary" disabled={page + 1 >= clients.data.totalPages || clients.loading} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>}
    </div>
  );
}
