"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Mail, Loader2, AlertCircle, LockKeyhole } from "lucide-react";
import { resendVerification } from "@/lib/api/auth";
import { createOrder } from "@/lib/api/orders";
import { createAddress, getAddresses } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { syncGuestCartToServer, useCart, fetchServerCart } from "@/lib/shop/cart";
import { AddressSelector } from "./address-selector";
import { CartView } from "./CartView";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

export function CheckoutFlow() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const cart = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [migrationWarning, setMigrationWarning] = useState<string | null>(null);

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setCheckoutError(null);
    try {
      // The backend cart is account-based. Carry guest cart selections into it after sign-in.
      const migration = await syncGuestCartToServer();
      if (migration.failed > 0) {
        setMigrationWarning(
          `${migration.failed} item${migration.failed === 1 ? "" : "s"} could not be moved into your account cart because they may have sold out or become unavailable.`,
        );
      } else {
        setMigrationWarning(null);
      }

      const savedAddresses = await getAddresses();
      setAddresses(savedAddresses);
      const defaultAddress = savedAddresses.find((address) => address.defaultAddress) ?? savedAddresses[0];
      setAddressId(defaultAddress?.id ?? null);
    } catch (error) {
      setCheckoutError(
        error instanceof ApiError
          ? error.detail || error.message
          : error instanceof Error
            ? error.message
            : "We couldn't load checkout. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session.status === "authenticated") {
      void loadCheckout();
    } else if (session.status === "unauthenticated") {
      setLoading(false);
    }
  }, [session.status, loadCheckout]);

  const handleResendEmail = useCallback(async () => {
    const email = session.user?.email;
    if (!email) return;

    setVerifyingStatus("sending");
    setCheckoutError(null);
    try {
      await resendVerification(email);
      setVerifyingStatus("sent");
    } catch (error) {
      setVerifyingStatus("idle");
      setCheckoutError(error instanceof Error ? error.message : "Could not resend the verification email.");
    }
  }, [session.user?.email]);

  async function handlePlaceOrder() {
    if (!addressId) {
      setCheckoutError("Please select a delivery address.");
      return;
    }
    setPlacingOrder(true);
    setCheckoutError(null);

    try {
      const order = await createOrder(addressId);
      // The backend empties the cart as part of successful order creation.
      await fetchServerCart();
      router.push(`/account/orders/${encodeURIComponent(order.orderNumber)}`);
    } catch (error) {
      setCheckoutError(
        error instanceof ApiError
          ? error.detail || error.message
          : error instanceof Error
            ? error.message
            : "An error occurred placing your order.",
      );
      setPlacingOrder(false);
    }
  }

  async function handleNewAddress(request: DeliveryAddressRequest): Promise<DeliveryAddress> {
    const saved = await createAddress(request);
    setAddresses((current) => [...current, saved]);
    setAddressId(saved.id);
    return saved;
  }

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-3 border border-line bg-surface p-10 text-sm text-slate">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Checking your account…
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <section className="border border-line bg-surface p-6 sm:p-8 lg:col-span-7">
          <LockKeyhole className="mb-4 h-7 w-7 text-ink" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-ink">Sign in to continue</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate">
            Your selected diamonds are kept in this browser. Sign in or create an account to confirm your delivery address and place your order.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login?next=%2Fcheckout"
              className="inline-flex h-12 items-center justify-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
            >
              Sign in
            </Link>
            <Link
              href="/register?next=%2Fcheckout"
              className="inline-flex h-12 items-center justify-center border border-line px-6 text-xs font-medium uppercase tracking-widest text-ink hover:border-ink"
            >
              Create account
            </Link>
          </div>
        </section>
        <div className="lg:col-span-5">
          <CartView compact />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 border border-line bg-surface p-10 text-sm text-slate">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading checkout…
      </div>
    );
  }

  const cartSnapshot = cart as unknown as { items?: Array<{ variantId: string; available: boolean; pricePaise: number | null }>; itemCount?: number; hasUnavailableItems?: boolean } | null;
  const hasCartItems = (cartSnapshot?.items?.length ?? 0) > 0;
  const hasUnavailableItems = cartSnapshot?.hasUnavailableItems ?? false;
  const canPlaceOrder = hasCartItems && !hasUnavailableItems && Boolean(addressId) && session.user?.emailVerified === true;

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7">
        {checkoutError && (
          <p role="alert" className="flex items-start gap-2 border-l-2 border-out bg-out-tint p-3 text-sm text-out">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {checkoutError}
          </p>
        )}
        {migrationWarning && (
          <p role="status" className="border-l-2 border-low bg-low-tint p-3 text-sm text-low">{migrationWarning}</p>
        )}

        <section className="border border-line bg-surface p-6">
          <h2 className="flex items-center gap-2 text-lg font-medium text-ink">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? "bg-ink text-white" : "bg-platinum text-ink"}`}>1</span>
            Contact
          </h2>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-ink">
              {session.user?.fullName} <span className="text-slate">({session.user?.email})</span>
            </p>

            {session.user?.emailVerified !== true && (
              <div className="space-y-3 border-l-2 border-low bg-low-tint p-4">
                <p className="text-sm font-medium text-low">Verify your email address before placing an order.</p>
                <button
                  type="button"
                  onClick={() => void handleResendEmail()}
                  disabled={verifyingStatus !== "idle"}
                  className="inline-flex h-10 items-center gap-2 border border-low px-4 text-xs font-medium uppercase tracking-widest text-low hover:bg-low/10 disabled:opacity-50"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {verifyingStatus === "sending" ? "Sending…" : verifyingStatus === "sent" ? "Verification email sent" : "Resend verification email"}
                </button>
              </div>
            )}

            {session.user?.emailVerified === true && step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
              >
                Continue to address
              </button>
            )}
          </div>
        </section>

        <section className={`border border-line bg-surface p-6 ${step < 2 ? "opacity-60" : ""}`}>
          <h2 className="flex items-center gap-2 text-lg font-medium text-ink">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? "bg-ink text-white" : step > 2 ? "bg-ok text-white" : "bg-platinum text-ink"}`}>
              {step > 2 ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : "2"}
            </span>
            Delivery address
          </h2>

          {step >= 2 && (
            <div className="mt-6 space-y-6">
              {addresses.length === 0 && (
                <p className="text-sm text-slate">Add a delivery address below to continue.</p>
              )}
              <AddressSelector
                selectedId={addressId}
                onSelect={(address) => setAddressId(address.id)}
                savedAddresses={addresses}
                onNewAddress={handleNewAddress}
              />
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!addressId}
                  className="inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep disabled:opacity-50"
                >
                  Continue to review
                </button>
              )}
            </div>
          )}
        </section>

        <section className={`border border-line bg-surface p-6 ${step < 3 ? "opacity-60" : ""}`}>
          <h2 className="flex items-center gap-2 text-lg font-medium text-ink">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 3 ? "bg-ink text-white" : "bg-platinum text-ink"}`}>3</span>
            Review & place order
          </h2>
          {step === 3 && (
            <div className="mt-5 space-y-4">
              {!hasCartItems && (
                <p className="text-sm text-out">Your cart is empty. Add a diamond before placing your order.</p>
              )}
              {hasUnavailableItems && (
                <p className="text-sm text-out">Remove unavailable diamonds from your cart before continuing.</p>
              )}
              <p className="text-xs leading-relaxed text-slate">
                Your selected diamonds will be checked for availability and reserved by the server when you place the order.
              </p>
              <button
                type="button"
                onClick={() => void handlePlaceOrder()}
                disabled={placingOrder || !canPlaceOrder}
                className="flex h-12 w-full items-center justify-center gap-2 bg-ink text-sm font-medium uppercase tracking-widest text-white hover:bg-loupe-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placingOrder ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                {placingOrder ? "Creating order…" : "Place order & reserve diamonds"}
              </button>
              {!session.user?.emailVerified && (
                <p className="text-xs text-low">Email verification is required before placing an order.</p>
              )}
            </div>
          )}
        </section>
      </div>

      <aside className="lg:col-span-5">
        <CartView compact />
      </aside>
    </div>
  );
}

export default CheckoutFlow;
