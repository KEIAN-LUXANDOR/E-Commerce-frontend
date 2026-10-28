"use client";

import { useState, type FormEvent } from "react";
import { AdminHeader, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { actOnAdminReturn, getAdminReturn } from "@/lib/api/admin";
import { isEnabled } from "@/config/features";
import { RETURN_STATUS_LABEL } from "@/lib/types/order";
import { formatINR } from "@/lib/format";

export function AdminReturnDetail({ returnId }: { returnId: string }) {
  const query = useAdminQuery("adminReturns", () => getAdminReturn(returnId), [returnId]);
  const [note, setNote] = useState("");
  const [refundRupees, setRefundRupees] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function act(action: "approve" | "reject" | "receive" | "refund", body: { note?: string; refundPaise?: number } = {}) {
    setBusy(true);
    setError(undefined);
    try {
      await actOnAdminReturn(returnId, action, body);
      query.reload();
      setNote("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the return.");
    } finally {
      setBusy(false);
    }
  }

  function reject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (note.trim()) void act("reject", { note: note.trim() });
  }

  function refund(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rupees = Number(refundRupees);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      setError("Enter a refund amount greater than zero.");
      return;
    }
    void act("refund", { refundPaise: Math.round(rupees * 100) });
  }

  if (query.loading) return <Loading />;
  if (query.off) return <NotConnected feature="adminReturns" endpoints={["GET /api/v1/admin/returns/{id}", "POST /api/v1/admin/returns/{id}/{action}"]} />;
  if (query.error) return <ErrorNote message={query.error} />;
  if (!query.data) return <ErrorNote message="Return request not found." />;

  const item = query.data;
  const enabled = isEnabled("adminReturns");
  return (
    <div className="space-y-5">
      <AdminHeader title={`Return ${item.returnNumber}`} description={`Order ${item.orderNumber} · ${item.customerName}`} back={{ href: "/admin/returns", label: "Returns" }} />
      {error && <ErrorNote message={error} />}
      <section className="grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
        <p><span className="block text-xs uppercase text-slate">Status</span>{RETURN_STATUS_LABEL[item.status]}</p>
        <p><span className="block text-xs uppercase text-slate">Customer</span>{item.customerName} · {item.customerEmail}</p>
        <p><span className="block text-xs uppercase text-slate">Reason</span>{item.reason}</p>
        <p><span className="block text-xs uppercase text-slate">Details</span>{item.details || "—"}</p>
        <p><span className="block text-xs uppercase text-slate">Requested</span>{new Date(item.requestedAt).toLocaleString()}</p>
        <p><span className="block text-xs uppercase text-slate">Refund</span>{item.refundPaise === null ? "—" : formatINR(item.refundPaise)}</p>
      </section>
      <section className="flex flex-wrap gap-3">
        {item.status === "REQUESTED" && (
          <>
            <button type="button" className="btn btn-primary" disabled={busy || !enabled} onClick={() => void act("approve")}>Approve</button>
            <form onSubmit={reject} className="flex flex-wrap gap-2">
              <label htmlFor="reject-note" className="sr-only">Rejection note</label>
              <input id="reject-note" required value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for rejection" className="field" />
              <button type="submit" className="btn btn-secondary" disabled={busy || !enabled}>{busy ? "Saving..." : "Reject"}</button>
            </form>
          </>
        )}
        {item.status === "APPROVED" && <button type="button" className="btn btn-primary" disabled={busy || !enabled} onClick={() => void act("receive")}>Mark received</button>}
        {item.status === "RECEIVED" && (
          <form onSubmit={refund} className="flex flex-wrap gap-2">
            <label htmlFor="refund-amount" className="sr-only">Refund amount in rupees</label>
            <input id="refund-amount" required type="number" min="0.01" step="0.01" value={refundRupees} onChange={(e) => setRefundRupees(e.target.value)} placeholder="Refund ₹" className="field" />
            <button type="submit" className="btn btn-primary" disabled={busy || !enabled}>{busy ? "Saving..." : "Record refund"}</button>
          </form>
        )}
      </section>
    </div>
  );
}
