"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Mail, Loader2, AlertCircle, LockKeyhole, CreditCard, ArrowRight } from "lucide-react";
import { resendVerification } from "@/lib/api/auth";
import { createOrder } from "@/lib/api/orders";
import { createAddress, getAddresses } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { syncGuestCartToServer, useCart, fetchServerCart } from "@/lib/shop/cart";
import { AddressSelector } from "./address-selector";
import { CartView } from "./CartView";
import { usePayment } from "@/components/orders/PayNow";
import { Button } from "@/components/ui/button";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";
import { isDevVerifiedAccount } from "@/lib/auth/devVerifiedAccounts";

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
  const { pay, busy: paying, error: paymentError, mockDialog } = usePayment();

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setCheckoutError(null);
    try {
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
      // Start after this render; loadCheckout updates state as it goes
      void Promise.resolve().then(loadCheckout);
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
      await fetchServerCart();
      const paid = await pay(order.orderNumber);
      if (!paid) {
        router.push(`/account/orders/${encodeURIComponent(order.orderNumber)}`);
        return;
      }
      // Payment window opened (or finished with a message): free the button so any error stays readable
      setPlacingOrder(false);
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
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-surface p-12 text-sm text-slate shadow-xs">
        <Loader2 className="h-5 w-5 animate-spin text-ink" aria-hidden="true" />
        Checking account status…
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <section className="rounded-2xl border border-line bg-surface p-8 sm:p-10 shadow-sm lg:col-span-7 space-y-6">
          <div className="grid size-12 place-items-center rounded-xl bg-stone border border-line">
            <LockKeyhole className="h-6 w-6 text-ink" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Sign in to continue</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate max-w-lg">
              Your selected certified diamonds are preserved in this session. Sign in or register to choose a delivery address and complete checkout.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Link href="/login?next=%2Fcheckout" className="flex-1">
              <Button size="lg" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register?next=%2Fcheckout" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </section>
        <div className="lg:col-span-5">
          <CartView compact />
        </div>
      </div>
    );
  }

  if (loading && session.status === "authenticated") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-surface p-12 text-sm text-slate shadow-xs">
        <Loader2 className="h-5 w-5 animate-spin text-ink" aria-hidden="true" />
        Loading checkout dossier…
      </div>
    );
  }

  const cartSnapshot = cart as unknown as { items?: Array<{ variantId: string; available: boolean; pricePaise: number | null }>; itemCount?: number; hasUnavailableItems?: boolean } | null;
  const hasCartItems = (cartSnapshot?.items?.length ?? 0) > 0;
  const hasUnavailableItems = cartSnapshot?.hasUnavailableItems ?? false;
  const isCheckoutEmailVerified =
    session.user?.emailVerified === true ||
    isDevVerifiedAccount(session.user?.email);

  const canPlaceOrder =
    hasCartItems &&
    !hasUnavailableItems &&
    Boolean(addressId) &&
    isCheckoutEmailVerified;

  const displayError = checkoutError || paymentError;

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7">
        {displayError && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-out/30 bg-out-tint p-4 text-sm text-out">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="font-medium">{displayError}</p>
          </div>
        )}
        {migrationWarning && (
          <p role="status" className="rounded-xl border border-low/30 bg-low-tint p-4 text-sm text-low font-medium">
            {migrationWarning}
          </p>
        )}

        {/* Step 1: Client Verification */}
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-lg font-medium text-ink">
              <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${step === 1 ? "bg-slate-900 text-white" : "bg-ok text-white"}`}>
                {step > 1 ? <CheckCircle2 className="size-4" /> : "1"}
              </span>
              Client Account
            </h2>
            {isCheckoutEmailVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ok bg-ok-bg/50 px-2.5 py-0.5 rounded-full border border-ok/20">
                <ShieldCheck className="size-3" /> Verified Client
              </span>
            )}
          </div>

          <div className="pt-1 space-y-3">
            <p className="text-sm text-ink font-medium">
              {session.user?.fullName} <span className="text-slate font-normal font-mono">({session.user?.email})</span>
            </p>

            {!isCheckoutEmailVerified && (
              <div className="rounded-xl border border-low/30 bg-low-tint p-4 space-y-3">
                <p className="text-sm font-medium text-low">Email verification is required before reserving high-value diamond solitaires.</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void handleResendEmail()}
                  disabled={verifyingStatus !== "idle"}
                  leftIcon={<Mail className="size-3.5" />}
                >
                  {verifyingStatus === "sending" ? "Sending…" : verifyingStatus === "sent" ? "Verification Email Sent" : "Resend Verification Email"}
                </Button>
              </div>
            )}

            {isCheckoutEmailVerified && step === 1 && (
              <div className="pt-3">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep(2)}
                  rightIcon={<ArrowRight className="size-4" />}
                >
                  Continue to Delivery Address
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Insured Delivery Address */}
        <section className={`rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs transition-opacity ${step < 2 ? "opacity-60" : ""}`}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-lg font-medium text-ink">
              <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${step === 2 ? "bg-slate-900 text-white" : step > 2 ? "bg-ok text-white" : "bg-stone text-slate border border-line"}`}>
                {step > 2 ? <CheckCircle2 className="size-4" /> : "2"}
              </span>
              Delivery Address
            </h2>
            {step > 2 && addressId && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-medium text-slate hover:text-ink hover:underline"
              >
                Change
              </button>
            )}
          </div>

          {step >= 2 && (
            <div className="mt-6 space-y-6">
              {addresses.length === 0 && (
                <p className="text-sm text-slate">Add the Indian address where someone can sign for the parcel.</p>
              )}
              <AddressSelector
                selectedId={addressId}
                onSelect={(address) => setAddressId(address.id)}
                savedAddresses={addresses}
                onNewAddress={handleNewAddress}
              />
              {step === 2 && (
                <div className="pt-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!addressId}
                    rightIcon={<ArrowRight className="size-4" />}
                  >
                    Continue to Review &amp; Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Step 3: Review & Payment */}
        <section className={`rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs transition-opacity ${step < 3 ? "opacity-60" : ""}`}>
          <h2 className="flex items-center gap-3 text-lg font-medium text-ink">
            <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${step === 3 ? "bg-slate-900 text-white" : "bg-stone text-slate border border-line"}`}>
              3
            </span>
            Review &amp; Secure Payment
          </h2>

          {step === 3 && (
            <div className="mt-6 space-y-5">
              {!hasCartItems && (
                <p className="text-sm text-out">Your cart is empty. Add a diamond before placing your order.</p>
              )}
              {hasUnavailableItems && (
                <p className="text-sm text-out">Remove unavailable diamonds from your cart before continuing.</p>
              )}

              <div className="rounded-xl border border-line bg-stone p-4 space-y-2 text-xs leading-relaxed text-slate">
                <p className="font-medium text-ink flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-ok" />
                  Diamonds held while you pay
                </p>
                <p>
                  Clicking below immediately locks your loose diamond selection for 15 minutes and opens Razorpay Checkout. UPI, credit/debit cards, and net banking are verified in real time.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  size="xl"
                  onClick={() => void handlePlaceOrder()}
                  disabled={placingOrder || paying || !canPlaceOrder}
                  isLoading={placingOrder || paying}
                  leftIcon={!placingOrder && !paying ? <CreditCard className="size-5" /> : undefined}
                  className="w-full shadow-lg"
                >
                  {placingOrder ? "Reserving Diamond…" : paying ? "Opening Razorpay…" : "Pay Now with Razorpay"}
                </Button>
              </div>

              {!isCheckoutEmailVerified && (
                <p className="text-xs text-low text-center font-medium">Email verification is required before placing an order.</p>
              )}
            </div>
          )}
        </section>
      </div>

      <aside className="lg:col-span-5">
        <CartView compact />
      </aside>

      {mockDialog}
    </div>
  );
}

export default CheckoutFlow;
