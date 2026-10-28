"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { listAdminProducts } from "@/lib/api/admin";
import type { ProductStatus } from "@/lib/types/admin";
import { formatINR } from "@/lib/format";

export function DiamondList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(0);
  const inventory = useAdminQuery("adminCatalog", () => listAdminProducts({ q: query || undefined, status: status || undefined, page, size: 20 }), [query, status, page]);

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Diamond inventory"
        description="Manage product details, pricing, and availability."
        action={<Link href="/admin/diamonds/new" className="btn btn-primary">Add a diamond</Link>}
      />
      {inventory.off && <NotConnected feature="adminCatalog" endpoints={["GET /api/v1/admin/products"]} />}
      {inventory.error && <ErrorNote message={inventory.error} />}
      <div className="flex flex-wrap gap-3">
        <input aria-label="Search diamonds" placeholder="Search name or SKU" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} className="field max-w-sm" />
        <select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value as ProductStatus | ""); setPage(0); }} className="field max-w-xs">
          <option value="">All statuses</option><option value="ACTIVE">On sale</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
        </select>
      </div>
      {inventory.loading && <Loading />}
      {inventory.data && inventory.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No diamonds match these filters.</p>}
      {inventory.data && inventory.data.items.length > 0 && (
        <AdminTable>
          <thead><tr><th>Diamond</th><th>SKU</th><th>Status</th><th>Stock</th><th>Price</th><th /></tr></thead>
          <tbody>
            {inventory.data.items.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.variant.sku}</td>
                <td>{product.status}</td>
                <td>{product.variant.stockQuantity}</td>
                <td>{formatINR(product.variant.pricePaise)}</td>
                <td className="text-right"><Link href={`/admin/diamonds/${product.id}`} className="btn-link">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      {inventory.data && inventory.data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate">Page {inventory.data.page + 1} of {inventory.data.totalPages} · {inventory.data.totalItems} diamonds</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary" disabled={page === 0 || inventory.loading} onClick={() => setPage((current) => current - 1)}>Previous</button>
            <button type="button" className="btn btn-secondary" disabled={page + 1 >= inventory.data.totalPages || inventory.loading} onClick={() => setPage((current) => current + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiamondList;
