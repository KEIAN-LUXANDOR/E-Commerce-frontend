"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export interface RazorpayBridgeProps {
  orderId?: string;
  amount?: number;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export function RazorpayBridge({ orderId, amount }: RazorpayBridgeProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId && amount) {
        // Handled via usePayment and openRazorpay in PayNow.tsx
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [orderId, amount]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface border border-line rounded-2xl shadow-xs">
      <Loader2 className="h-8 w-8 animate-spin text-ink mb-4" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">Connecting to Secure Gateway</h3>
      <p className="text-xs text-slate">Please do not refresh this page.</p>
    </div>
  );
}

export default RazorpayBridge;