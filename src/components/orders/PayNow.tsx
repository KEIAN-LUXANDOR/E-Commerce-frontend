"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { confirmPayment, startPayment } from "@/lib/api/orders";
import { formatINR } from "@/lib/format";
import { isMockPayment, openRazorpay } from "@/lib/payments/razorpay";
import { site } from "@/lib/site";
import type { PaymentConfirmation, PaymentSession } from "@/lib/types/order";

/**
 * Paying for an order:
 * 1. POST …/payment        → the backend creates the Razorpay order (amount from the database)
 * 2. Razorpay Checkout     → UPI, cards, net banking
 * 3. POST …/payment/verify → the backend checks the signature → /checkout/success
 */
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn’t confirm the payment. If money was taken, contact us and we’ll sort it out.");
      setBusy(false);
    }
  }

  /** Returns false when the shopper closed the payment window or it failed to open. */
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
        setError("Payment window closed. Your diamonds are still held for you — pay when you’re ready.");
        setBusy(false);
        return false;
      }
      await finish(orderNumber, result);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t start the payment. Please try again.");
      setBusy(false);
      return false;
    }
  }

  // Local testing with scripts/dev-api.mjs only: stands in for the Razorpay window
  const mockDialog = (
    <Dialog open={mock !== null} onClose={() => setMock(null)} title="Test payment (dev only)">
      <p className="text-sm text-slate">
        You’re using the stand-in backend, so no real payment window opens. Choose what Razorpay would send back for {formatINR(mock?.session.amountPaise ?? 0)}.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            const m = mock;
            setMock(null);
            if (m) void finish(m.orderNumber, { razorpayOrderId: m.session.razorpayOrderId, razorpayPaymentId: "pay_mock_ok", razorpaySignature: "mock_signature_ok" });
          }}
        >
          Payment succeeds
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            const m = mock;
            setMock(null);
            if (m) void finish(m.orderNumber, { razorpayOrderId: m.session.razorpayOrderId, razorpayPaymentId: "pay_mock_bad", razorpaySignature: "tampered" });
          }}
        >
          Signature is wrong
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setMock(null);
            setError("Payment window closed. Your diamonds are still held for you — pay when you’re ready.");
          }}
        >
          Close the window
        </button>
      </div>
    </Dialog>
  );

  return { pay, busy, error, mockDialog };
}

/** "Pay ₹X securely" button for an order waiting for payment. */
export function PayNow({ orderNumber, totalPaise, className }: { orderNumber: string; totalPaise: number; className?: string }) {
  const { pay, busy, error, mockDialog } = usePayment();
  return (
    <div className={className}>
      <button type="button" onClick={() => void pay(orderNumber)} disabled={busy} className="btn btn-primary w-full">
        <Lock className="size-4" aria-hidden />
        {busy ? "Please wait…" : `Pay ${formatINR(totalPaise)} securely`}
      </button>
      <p className="mt-2 text-center text-xs text-slate">UPI, cards and net banking through Razorpay.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-out">
          {error}
        </p>
      )}
      {mockDialog}
    </div>
  );
}
