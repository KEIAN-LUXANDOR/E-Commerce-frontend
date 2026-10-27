"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = await apiFetch(`/orders/track`, {
        method: "POST",
        body: JSON.stringify({ orderNumber, email }) // Stringified body
      });
      setResult(data);
    } catch (err) {
      showToast("Tracking information not found", { tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleTrack} className="p-8 border border-line bg-surface max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest mb-1 text-ink">Order Number</label>
          <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full h-11 border border-line px-4 text-sm" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest mb-1 text-ink">Email Address</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 border border-line px-4 text-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full h-11 bg-ink text-white text-xs uppercase tracking-widest mt-4">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="p-8 border border-line bg-surface max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-slate mb-1">Status</p>
          <p className="text-xl font-medium text-ink">{result.status}</p>
        </div>
      )}
    </div>
  );
}

export default TrackOrderForm;