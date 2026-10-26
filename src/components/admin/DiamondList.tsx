"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { DiamondArt } from "@/components/art/DiamondArt";
import { listAdminProducts, setAdminProductStatus } from "@/lib/api/admin";
import { cutLabel, originLabel, shapeLabel } from "@/lib/catalog/labels";
import { formatINR } from "@/lib/format";
import { showToast } from "@/lib/stores";
import type { ProductStatus } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<ProductStatus, string> = {
  ACTIVE: "bg-ok-bg text-ok",
  DRAFT: "bg-warn-bg text-warn",
  ARCHIVED: "bg-stone-deep text-slate",
};
const STATUS_LABEL: Record<ProductStatus, string> = { ACTIVE: "On sale", DRAFT: "Draft", ARCHIVED: "Archived" };

/** All diamonds (any status), with search and quick status changes. */
export function DiamondList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const status = (params.get("status") as ProductStatus | null) ?? undefined;
  const origin = (params.get("origin") as "NATURAL" | "LAB_GROWN" | null) ?? undefined;
  const page = Math.max(0, Number(params.get("page") ?? 0) || 0);
  const [search, setSearch] = useState(q);

  const query = useAdminQuery("adminCatalog", () => listAdminProducts({ q: q || undefined, status, origin, page, size: 25 }), [q, status, origin, page]);

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  async function changeStatus(id: string, next: ProductStatus) {
    try {
      await setAdminProductStatus(id, next);
      showToast(`Marked as ${STATUS_LABEL[next].toLowerCase()}.`);
      query.reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn’t change the status.", "error");
    }
  }

  return (
    <div>
      <AdminHeader
        title="Diamonds"
        description="Everything in stock, drafts and archived stones."
        action={
          <div className="flex gap-2">
            <Link href="/admin/diamonds/import" className="btn btn-secondary">
              Import CSV
            </Link>
            <Link href="/admin/diamonds/new" className="btn btn-primary">
              Add a diamond
            </Link>
          </div>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", search.trim() || undefined);
        }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or stock number" className="field min-h-10 max-w-xs" aria-label="Search diamonds" />
        <select value={status ?? ""} onChange={(e) => setParam("status", e.target.value || undefined)} className="field min-h-10 w-auto" aria-label="Status">
          <option value="">Any status</option>
          <option value="ACTIVE">On sale</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select value={origin ?? ""} onChange={(e) => setParam("origin", e.target.value || undefined)} className="field min-h-10 w-auto" aria-label="Type">
          <option value="">Natural and lab-grown</option>
          <option value="NATURAL">Natural</option>
          <option value="LAB_GROWN">Lab-grown</option>
        </select>
        <button type="submit" className="btn btn-secondary min-h-10">
          Search
        </button>
      </form>

      {query.off && (
        <NotConnected
          feature="adminCatalog"
          endpoints={["GET /api/v1/admin/products", "POST /api/v1/admin/products", "PUT /api/v1/admin/products/{id}", "PUT /api/v1/admin/products/{id}/status", "POST /api/v1/admin/products/{id}/images"]}
        >
          <p className="text-sm text-slate">Until then, diamonds are added with the backend’s SQL script (backend/dev/sample-diamonds.sql).</p>
        </NotConnected>
      )}
      {query.error && <ErrorNote message={query.error} />}
      {query.loading && <Loading />}
      {query.data && query.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No diamonds match.</p>}
      {query.data && query.data.items.length > 0 && (
        <>
          <AdminTable minWidth="60rem">
            <thead>
              <tr>
                <th>Diamond</th>
                <th>Grades</th>
                <th>Stock no.</th>
                <th className="text-right">Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {query.data.items.map((p) => {
                const d = p.diamond;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/diamonds/${p.id}`} className="flex items-center gap-3 hover:underline">
                        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden border border-line bg-stone">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0].url} alt="" className="h-full w-full object-contain" />
                          ) : (
                            <DiamondArt shape={d?.shape ?? "ROUND"} className="h-full w-full p-1" />
                          )}
                        </span>
                        <span>
                          <span className="block font-medium">{p.name}</span>
                          {d && <span className="text-xs text-slate">{originLabel(d.origin)}</span>}
                        </span>
                      </Link>
                    </td>
                    <td className="text-slate">{d ? `${shapeLabel(d.shape)} · ${d.carat.toFixed(2)} ct · ${d.color} · ${d.clarity} · ${cutLabel(d.cut)} · ${d.lab}` : "—"}</td>
                    <td>{p.variant.sku}</td>
                    <td className="text-right tabular-nums">{formatINR(p.variant.pricePaise)}</td>
                    <td>{p.variant.stockQuantity > 0 ? p.variant.stockQuantity : <span className="text-out">Sold</span>}</td>
                    <td>
                      <span className={cn("px-2 py-1 text-xs font-medium uppercase tracking-[0.06em]", STATUS_TONE[p.status])}>{STATUS_LABEL[p.status]}</span>
                    </td>
                    <td>
                      <select
                        aria-label={`Change status of ${p.name}`}
                        value=""
                        onChange={(e) => {
                          if (e.target.value) void changeStatus(p.id, e.target.value as ProductStatus);
                        }}
                        className="field min-h-9 w-auto py-1 text-xs"
                      >
                        <option value="">Change…</option>
                        {p.status !== "ACTIVE" && <option value="ACTIVE">Put on sale</option>}
                        {p.status !== "DRAFT" && <option value="DRAFT">Make draft</option>}
                        {p.status !== "ARCHIVED" && <option value="ARCHIVED">Archive</option>}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AdminTable>
          {query.data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button type="button" className="btn btn-secondary" disabled={page === 0} onClick={() => setParam("page", String(page - 1))}>
                Previous
              </button>
              <span className="text-slate">
                Page {page + 1} of {query.data.totalPages} · {query.data.totalItems} diamonds
              </span>
              <button type="button" className="btn btn-secondary" disabled={page >= query.data.totalPages - 1} onClick={() => setParam("page", String(page + 1))}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
