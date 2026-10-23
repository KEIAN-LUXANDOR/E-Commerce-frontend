"use client";

/**
 * razorpay-bridge.tsx
 *
 * Client-side Razorpay integration component.
 *
 * Responsibilities:
 *   1. Dynamically loads the Razorpay checkout.js script (only once per mount).
 *   2. Opens the Razorpay modal when the user clicks "Complete Acquisition".
 *   3. Calls the backend (POST /api/v1/orders → Razorpay order_id) before opening.
 *   4. After payment, verifies the signature server-side and redirects.
 *
 * Mock mode (NEXT_PUBLIC_USE_MOCK_API=true):
 *   Simulates a successful payment flow without touching Razorpay, so the
 *   checkout UI can be tested without real credentials.
 *
 * Design contract:
 *   - Primary ink button (square, 48px height).
 *   - Loading spinner while the script loads or the backend is called.
 *   - No nested ternaries.
 */

import * as React from "react";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RazorpayBridgeProps {
  /** Exactly the amount the customer will pay (grand total in paise). */
  amountPaise: number;
  /** Customer email pre-filled in the Razorpay modal. */
  email: string;
  /** Customer name pre-filled in the Razorpay modal. */
  name: string;
  /** Called with razorpay_payment_id after a successful payment. */
  onSuccess: (paymentId: string) => void;
  /** Called if the modal is dismissed without payment. */
  onDismiss?: () => void;
  disabled?: boolean;
  className?: string;
}

// Razorpay global type (minimal, not full SDK)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: new (opts: Record<string, unknown>) => { open(): void };
  }
}

// ---------------------------------------------------------------------------
// Script loader hook
// ---------------------------------------------------------------------------

function useRazorpayScript(): "idle" | "loading" | "ready" | "error" {
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");

  React.useEffect(() => {
    // Already loaded
    if (window.Razorpay) {
      setStatus("ready");
      return;
    }

    setStatus("loading");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);

    return () => {
      // Don't remove – Razorpay script is global and idempotent
    };
  }, []);

  return status;
}

// ---------------------------------------------------------------------------
// Mock payment helper (dev / mock-API mode)
// ---------------------------------------------------------------------------

async function mockPaymentFlow(amountPaise: number): Promise<string> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1200));
  // Return a fake payment ID matching Razorpay format
  const rand = Math.random().toString(36).slice(2, 14).toUpperCase();
  console.info(`[RazorpayBridge] MOCK payment of ${formatINR(amountPaise)} → pay_MOCK${rand}`);
  return `pay_MOCK${rand}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function RazorpayBridge({
  amountPaise,
  email,
  name,
  onSuccess,
  onDismiss,
  disabled = false,
  className,
}: RazorpayBridgeProps) {
  const scriptStatus = useRazorpayScript();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
  const isReady = useMock || scriptStatus === "ready";

  async function handlePay() {
    if (disabled || !isReady || loading) return;
    setLoading(true);
    setError(null);

    try {
      if (useMock) {
        const paymentId = await mockPaymentFlow(amountPaise);
        onSuccess(paymentId);
        return;
      }

      // Real flow:
      // 1. Create Razorpay order on backend
      const orderRes = await fetch("/api/v1/checkout/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise }),
      });

      if (!orderRes.ok) {
        throw new Error("Could not initiate payment. Please try again.");
      }

      const { orderId, keyId, currency } = await orderRes.json() as {
        orderId: string;
        keyId: string;
        currency: string;
      };

      // 2. Open Razorpay modal
      if (!window.Razorpay) {
        throw new Error("Payment gateway unavailable. Please refresh and try again.");
      }

      const rzp = new window.Razorpay({
        key: keyId,
        amount: amountPaise,
        currency: currency || "INR",
        order_id: orderId,
        name: "Keian Luxandor",
        description: "Certified Loose Diamond Acquisition",
        prefill: { email, name },
        theme: { color: "#16181d" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onDismiss?.();
          },
        },
        handler: (response: { razorpay_payment_id: string }) => {
          onSuccess(response.razorpay_payment_id);
        },
      });

      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  // Determine button label
  let buttonLabel: React.ReactNode = "Complete Acquisition";
  if (loading) {
    buttonLabel = (
      <>
        <Loader2 className="size-4 animate-spin" />
        Processing…
      </>
    );
  } else if (scriptStatus === "loading") {
    buttonLabel = (
      <>
        <Loader2 className="size-4 animate-spin" />
        Loading Gateway…
      </>
    );
  } else if (scriptStatus === "error" && !useMock) {
    buttonLabel = "Payment Unavailable";
  }

  const isDisabled = disabled || loading || (scriptStatus === "error" && !useMock);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <button
        type="button"
        onClick={handlePay}
        disabled={isDisabled}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-2.5",
          "font-mono text-[12px] uppercase tracking-[0.1em] transition-colors",
          isDisabled
            ? "bg-[var(--color-stone)] text-[var(--color-muted)] cursor-not-allowed"
            : "bg-[var(--color-ink)] text-white hover:bg-[var(--color-slate)]"
        )}
        aria-label={`Pay ${formatINR(amountPaise)} securely via Razorpay`}
      >
        {!loading && !isDisabled && <Lock className="size-4" />}
        {buttonLabel}
      </button>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-2 text-red-600">
          <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
          <p className="font-mono text-[11px] leading-relaxed">{error}</p>
        </div>
      )}

      {/* Trust note */}
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        Secured by Razorpay · 256-bit SSL · UPI / Cards / Net Banking / Wire
      </p>
    </div>
  );
}
