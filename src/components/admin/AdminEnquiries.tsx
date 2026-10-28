"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { listEnquiries, setEnquiryStatus } from "@/lib/api/admin";
import type { EnquiryStatus } from "@/lib/types/admin";

const STATUSES: EnquiryStatus[] = ["NEW", "IN_PROGRESS", "DONE"];

export function AdminEnquiries() {
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [busyId, setBusyId] = useState<string>();
  const [error, setError] = useState<string>();
  const enquiries = useAdminQuery("adminEnquiries", () => listEnquiries({ status: status || undefined }), [status]);

  async function updateStatus(id: string, value: EnquiryStatus) {
    setBusyId(id);
    setError(undefined);
    try {
      await setEnquiryStatus(id, value);
      enquiries.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update enquiry status.");
    } finally {
      setBusyId(undefined);
    }
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Enquiries" description="Customer messages, diamond questions, and viewing requests." />
      {enquiries.off && <NotConnected feature="adminEnquiries" endpoints={["GET /api/v1/admin/enquiries", "PUT /api/v1/admin/enquiries/{id}/status"]} />}
      {error && <ErrorNote message={error} />}
      {enquiries.error && <ErrorNote message={enquiries.error} />}
      <label className="block max-w-xs space-y-1 text-sm">Filter by status
        <select value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus | "")} className="field">
          <option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}
        </select>
      </label>
      {enquiries.loading && <Loading />}
      {enquiries.data && enquiries.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No enquiries found.</p>}
      <div className="grid gap-4">
        {enquiries.data?.items.map((item) => (
          <article key={item.id} className="space-y-3 border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-medium">{item.fullName} · {item.type.replaceAll("_", " ")}</h2><p className="text-sm text-slate">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p></div>
              <select aria-label={`Status for ${item.fullName}`} value={item.status} disabled={busyId === item.id || enquiries.off} onChange={(e) => void updateStatus(item.id, e.target.value as EnquiryStatus)} className="field w-auto">
                {STATUSES.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
              </select>
            </div>
            <p className="whitespace-pre-wrap text-sm">{item.message}</p>
            {item.productSlug && <Link href={`/diamond/${encodeURIComponent(item.productSlug)}`} className="btn-link">View diamond</Link>}
            {item.preferredDate && <p className="text-sm text-slate">Requested viewing: {item.preferredDate}{item.preferredTime ? ` · ${item.preferredTime.toLowerCase()}` : ""}</p>}
            <div className="flex gap-4 text-sm"><a className="btn-link" href={`mailto:${encodeURIComponent(item.email)}`}>Email</a>{item.phone && <a className="btn-link" href={`tel:${item.phone}`}>Call</a>}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
