"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function PayNow({ orderId, amount }: { orderId: string; amount: number }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderId}/pay`, { method: "POST" });
      showToast("Payment successful", { tone: "success" });
      window.location.reload();
    } catch (err) {
      showToast("Payment failed to process", { tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="h-11 px-8 bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50 flex items-center justify-center"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay $${amount.toLocaleString()}`}
    </button>
  );
}

export default PayNow;