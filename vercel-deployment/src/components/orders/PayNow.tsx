"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { isEnabled } from "@/config/features";
import { confirmPayment, startPayment } from "@/lib/api/orders";
import { formatPrice } from "@/lib/format";
import { isMockPayment, openRazorpay } from "@/lib/payments/razorpay";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import type { PaymentConfirmation, PaymentSession } from "@/lib/types/order";

export function usePayment() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [mock, setMock] = useState<{ orderNumber: string; session: PaymentSession } | null>(null);

  async function finish(orderNumber: string, result: PaymentConfirmation) {
    setBusy(true);
    try {
      const outcome = await confirmPayment(orderNumber, result);
      if (outcome.paymentStatus === "PAID") {
        router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
        return;
      }
      // Late payment for an expired order, or not complete yet: show the backend's explanation
      setError(outcome.message || "Payment is not complete yet.");
      setBusy(false);
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
        setError("Payment window closed. Your order is still reserved; you can try again.");
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
    <Dialog open={mock !== null} onClose={() => setMock(null)} title="Test Payment (Development Only)">
      <p className="text-sm text-slate">Choose a test response for {formatPrice(mock?.session.amountPaise ?? 0)}.</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button type="button" size="sm" onClick={() => finishMock("pay_mock_ok", "mock_signature_ok")}>
          Payment Succeeds
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => finishMock("pay_mock_bad", "tampered")}>
          Invalid Signature
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => { setMock(null); setError("Payment window closed."); }}>
          Close Window
        </Button>
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
      <Button
        type="button"
        size="lg"
        onClick={() => void pay(orderNumber)}
        disabled={!enabled || busy}
        isLoading={busy}
        leftIcon={!busy ? <Lock className="size-4" /> : undefined}
        className="w-full shadow-md"
      >
        {busy ? "Opening Razorpay…" : `Pay ${formatPrice(totalPaise)} Securely`}
      </Button>
      <p className="mt-2 text-center text-xs text-slate">
        {enabled ? "Instant verification via Razorpay (UPI, Cards, Net Banking)." : "Online payment is currently unavailable."}
      </p>
      {error && <p role="alert" className="mt-3 text-sm text-out text-center font-medium">{error}</p>}
      {mockDialog}
    </div>
  );
}

export default PayNow;
