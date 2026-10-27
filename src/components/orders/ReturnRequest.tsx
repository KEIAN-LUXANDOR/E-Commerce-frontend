"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function ReturnRequest({ orderId }: { orderId: string }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderId}/return`, {
        method: "POST",
        body: JSON.stringify({ reason, details }) // Stringified body fixes type error
      });
      setSubmitted(true);
      showToast("Return request submitted", { tone: "success" });
    } catch (err) {
      showToast("Failed to submit return request", { tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 border border-line bg-surface text-center">
        <p className="text-sm font-medium text-ink">Request Submitted</p>
        <p className="text-xs text-slate mt-2">We will review your return request shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-line bg-surface space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-widest text-ink">Request Return</h3>
      <div>
        <label className="block text-xs uppercase mb-1 text-ink">Reason</label>
        <select required value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-10 border border-line bg-surface px-3 text-sm text-ink">
          <option value="">Select a reason</option>
          <option value="DEFECTIVE">Defective</option>
          <option value="NOT_AS_DESCRIBED">Not as described</option>
          <option value="CHANGED_MIND">Changed mind</option>
        </select>
      </div>
      <div>
        <label className="block text-xs uppercase mb-1 text-ink">Details</label>
        <textarea required value={details} onChange={(e) => setDetails(e.target.value)} className="w-full h-24 border border-line bg-surface p-3 text-sm resize-none text-ink" />
      </div>
      <button type="submit" disabled={loading || !reason} className="w-full h-11 bg-ink text-white text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Request"}
      </button>
    </form>
  );
}

export default ReturnRequest;