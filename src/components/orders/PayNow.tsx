"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { isEnabled } from "@/config/features";
import { confirmPayment, startPayment } from "@/lib/api/orders";
import { formatINR } from "@/lib/format";
import { isMockPayment, openRazorpay } from "@/lib/payments/razorpay";
import { site } from "@/lib/site";
import type { PaymentConfirmation, PaymentSession } from "@/lib/types/order";

export function usePayment() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [mock, setMock] = useState<{ orderNumber: string; session: PaymentSession } | null>(null);

  async function finish(orderNumber: string, result: PaymentConfirmation) {
    setBusy(true);
    try {
      await confirmPayment(orderNumber, result);
      router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not confirm payment.");
      setBusy(false);
    }
  }

  async function pay(orderNumber: string): Promise<boolean> {
    setBusy(true);
    setError(undefined);
    try {
      const session = await startPayment(orderNumber);
      if (isMockPayment(session)) {
        setMock({ orderNumber, session });
        setBusy(false);
        return true;
      }
      const result = await openRazorpay(session, site.name);
      if (!result) {
        setError("Payment window closed. Your order is still held; you can try again.");
        setBusy(false);
        return false;
      }
      await finish(orderNumber, result);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start payment. Please try again.");
      setBusy(false);
      return false;
    }
  }

  function finishMock(paymentId: string, signature: string) {
    const pending = mock;
    setMock(null);
    if (pending) {
      void finish(pending.orderNumber, {
        razorpayOrderId: pending.session.razorpayOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });
    }
  }

  const mockDialog = (
    <Dialog open={mock !== null} onClose={() => setMock(null)} title="Test payment (development only)">
      <p className="text-sm text-slate">Stand-in backend only. Choose a test response for {formatINR(mock?.session.amountPaise ?? 0)}.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => finishMock("pay_mock_ok", "mock_signature_ok")}>Payment succeeds</button>
        <button type="button" className="btn btn-secondary" onClick={() => finishMock("pay_mock_bad", "tampered")}>Invalid signature</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setMock(null); setError("Payment window closed. You can try again."); }}>Close window</button>
      </div>
    </Dialog>
  );

  return { pay, busy, error, mockDialog };
}

export function PayNow({ orderNumber, totalPaise, className }: { orderNumber: string; totalPaise: number; className?: string }) {
  const enabled = isEnabled("payments");
  const { pay, busy, error, mockDialog } = usePayment();
  return (
    <div className={className}>
      <button type="button" onClick={() => void pay(orderNumber)} disabled={!enabled || busy} className="btn btn-primary w-full disabled:opacity-50">
        <Lock className="size-4" aria-hidden />
        {busy ? "Please wait..." : `Pay ${formatINR(totalPaise)} securely`}
      </button>
      <p className="mt-2 text-center text-xs text-slate">{enabled ? "UPI, cards and net banking through Razorpay." : "Online payment is not available yet."}</p>
      {error && <p role="alert" className="mt-3 text-sm text-out">{error}</p>}
      {mockDialog}
    </div>
  );
}

export default PayNow;
