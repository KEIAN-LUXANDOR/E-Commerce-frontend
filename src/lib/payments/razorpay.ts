"use client";

import type { PaymentConfirmation, PaymentSession } from "@/lib/types/order";

/**
 * Opens Razorpay Checkout for an order the backend has already created.
 * The amount and Razorpay order id come from the backend (never worked out in the browser).
 * Resolves with Razorpay's result to send to the backend for signature checking,
 * or null when the shopper closes the window.
 */

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (e: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Couldn’t open the payment window. Check your internet connection and try again."));
    };
    document.body.appendChild(s);
  });
  return loading;
}

/** True for the stand-in key from scripts/dev-api.mjs (local testing only). */
export function isMockPayment(session: PaymentSession): boolean {
  return session.keyId.startsWith("rzp_mock") && process.env.NODE_ENV !== "production";
}

export async function openRazorpay(session: PaymentSession, storeName: string): Promise<PaymentConfirmation | null> {
  await loadScript();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error("Couldn’t open the payment window. Please try again.");

  return new Promise((resolve) => {
    const rzp = new Razorpay({
      key: session.keyId,
      amount: session.amountPaise,
      currency: session.currency,
      order_id: session.razorpayOrderId,
      name: storeName,
      description: `Order ${session.orderNumber}`,
      prefill: {
        name: session.customerName ?? session.prefill?.name ?? "",
        email: session.customerEmail ?? session.prefill?.email ?? "",
        contact: session.customerPhone ?? session.prefill?.contact ?? undefined,
      },
      notes: { orderNumber: session.orderNumber },
      theme: { color: "#0A192F" },
      handler: (r: RazorpayResponse) =>
        resolve({ razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, razorpaySignature: r.razorpay_signature }),
      modal: { ondismiss: () => resolve(null), confirm_close: true },
    });
    // A failed attempt keeps the window open so the shopper can try another method
    rzp.on("payment.failed", () => undefined);
    rzp.open();
  });
}
