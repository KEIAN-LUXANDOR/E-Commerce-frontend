"use client";

import { useState, type FormEvent } from "react";
import { isEnabled } from "@/config/features";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { requestReturn } from "@/lib/api/orders";

export function ReturnRequest({ orderId, onDone }: { orderId: string; onDone?: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();
  const enabled = isEnabled("returns");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return;
    setBusy(true);
    setError(undefined);
    try {
      await requestReturn(orderId, { reason, details: details.trim() });
      setSubmitted(true);
      onDone?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit the return request.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return <p role="status" className="border border-line bg-surface p-5 text-sm">Return request submitted. We will review it shortly.</p>;
  }

  return (
    <div className="space-y-4">
      {!enabled && <NotAvailableYet title="Online returns are not available yet">Please contact us to arrange a return.</NotAvailableYet>}
      <form onSubmit={submit} className="space-y-4 border border-line bg-surface p-6">
        <h3 className="text-sm font-medium uppercase tracking-widest text-ink">Request return</h3>
        <label className="block space-y-1 text-sm">
          Reason
          <select required disabled={!enabled || busy} value={reason} onChange={(e) => setReason(e.target.value)} className="field">
            <option value="">Select a reason</option>
            <option value="DEFECTIVE">Defective</option>
            <option value="NOT_AS_DESCRIBED">Not as described</option>
            <option value="CHANGED_MIND">Changed my mind</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          Details
          <textarea required disabled={!enabled || busy} value={details} onChange={(e) => setDetails(e.target.value)} className="field min-h-24 py-3" />
        </label>
        {error && <p role="alert" className="text-sm text-out">{error}</p>}
        <button type="submit" disabled={!enabled || busy || !reason} className="btn btn-primary w-full disabled:opacity-50">
          {busy ? "Submitting..." : "Submit return request"}
        </button>
      </form>
    </div>
  );
}

export default ReturnRequest;
