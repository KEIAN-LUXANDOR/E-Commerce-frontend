"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function RazorpayBridge({ orderId, amount, onSuccess, onError }: any) {
  useEffect(() => {
    // Simulated Razorpay invocation
    const timer = setTimeout(() => {
      if (orderId && amount) {
        // Handle mock routing or success callback here
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [orderId, amount]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface border border-line">
      <Loader2 className="h-8 w-8 animate-spin text-ink mb-4" />
      <h3 className="text-sm font-medium uppercase tracking-widest text-ink mb-2">Connecting to Secure Gateway</h3>
      <p className="text-xs text-slate">Please do not refresh this page.</p>
    </div>
  );
}

export default RazorpayBridge;