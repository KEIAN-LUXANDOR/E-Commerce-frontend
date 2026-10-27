"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import { getCheckoutEligibility } from "@/lib/api/account";
import { resendVerification } from "@/lib/api/auth";
import { createOrder } from "@/lib/api/orders";
import { createAddress, getAddresses } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { AddressSelector } from "./address-selector";
import { CartView } from "./CartView";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

export function CheckoutFlow() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);
  const [verifyingStatus, setVerifyingStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    async function initCheckout() {
      try {
        const eligibility = await getCheckoutEligibility();
        setEmailVerified(eligibility.canCheckout);
      } catch (err) {
        if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
          setEmailVerified(false);
          setCheckoutError(err.message);
        } else {
          setEmailVerified(false);
          setCheckoutError(err instanceof Error ? err.message : "Could not verify checkout eligibility.");
        }
      }

      try {
        const addrs = await getAddresses();
        setAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((address) => address.defaultAddress) || addrs[0];
          setAddressId(defaultAddr.id);
        }
      } catch (err) {
        setCheckoutError(err instanceof Error ? err.message : "Could not load delivery addresses.");
      } finally {
        setLoading(false);
      }
    }
    initCheckout();
  }, []);

  async function handleResendEmail() {
    if (!session.user?.email) return;
    setVerifyingStatus("sending");
    try {
      await resendVerification(session.user.email);
      setVerifyingStatus("sent");
      setTimeout(() => setVerifyingStatus("idle"), 60000);
    } catch (err) {
      setVerifyingStatus("idle");
      setCheckoutError(err instanceof Error ? err.message : "Could not resend the verification email.");
    }
  }

  async function handlePlaceOrder() {
    if (!addressId) {
      setCheckoutError("Please select a delivery address.");
      return;
    }
    setPlacingOrder(true);
    setCheckoutError(null);
    try {
      const order = await createOrder(addressId);
      // Pushing to success page to see the 15m timer (Razorpay step handled elsewhere)
      router.push(`/checkout/success?order=${order.orderNumber}`);
    } catch (err) {
      setCheckoutError(
        err instanceof ApiError
          ? err.detail || err.message
          : err instanceof Error
            ? err.message
            : "An error occurred placing your order.",
      );
      setPlacingOrder(false);
    }
  }

  async function handleNewAddress(req: DeliveryAddressRequest): Promise<DeliveryAddress> {
    const newAddr = await createAddress(req);
    setAddresses((prev) => [...prev, newAddr]);
    setAddressId(newAddr.id);
    return newAddr;
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate">Loading checkout...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {checkoutError && (
        <p role="alert" className="border-l-2 border-out bg-out-tint p-3 text-sm text-out lg:col-span-12">
          {checkoutError}
        </p>
      )}
      <div className="lg:col-span-7 space-y-6">
        
        {/* STEP 1: CONTACT */}
        <div className="border border-line bg-surface p-6">
          <h2 className="text-lg font-medium text-ink flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-ink text-white' : 'bg-platinum text-ink'}`}>1</span>
            Contact
          </h2>
          
          <div className="mt-4 space-y-4">
            <p className="text-sm text-ink">{session.user?.fullName} ({session.user?.email})</p>
            
            {!emailVerified && (
              <div className="border-l-2 border-low bg-low-tint p-4 space-y-3">
                <p className="text-sm font-medium text-low">
                  Please verify your email address before placing an order.
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={verifyingStatus !== "idle"}
                  className="inline-flex h-9 items-center gap-2 border border-low px-4 text-xs font-medium uppercase tracking-widest text-low hover:bg-low/10 disabled:opacity-50"
                >
                  <Mail className="h-4 w-4" />
                  {verifyingStatus === "sending" ? "Sending..." : verifyingStatus === "sent" ? "Email Sent" : "Resend Verification Email"}
                </button>
              </div>
            )}

            {emailVerified && step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
              >
                Continue to Address
              </button>
            )}
          </div>
        </div>

        {/* STEP 2: ADDRESS */}
        <div className={`border border-line bg-surface p-6 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-medium text-ink flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? 'bg-ink text-white' : step > 2 ? 'bg-ok text-white' : 'bg-platinum text-ink'}`}>
              {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : "2"}
            </span>
            Delivery Address
          </h2>
          
          {step >= 2 && (
            <div className="mt-6 space-y-6">
              <AddressSelector 
                selectedId={addressId} 
                onSelect={(address) => setAddressId(address.id)}
                savedAddresses={addresses}
                onNewAddress={handleNewAddress}
              />
              
              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  disabled={!addressId}
                  className="inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep disabled:opacity-50"
                >
                  Continue to Review
                </button>
              )}
            </div>
          )}
        </div>

        {/* STEP 3: REVIEW & PAY */}
        <div className={`border border-line bg-surface p-6 ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-medium text-ink flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 3 ? 'bg-ink text-white' : 'bg-platinum text-ink'}`}>3</span>
            Review & Pay
          </h2>
          
          {step === 3 && (
            <div className="mt-6 space-y-6">
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full h-12 flex items-center justify-center gap-2 bg-ink text-sm font-medium uppercase tracking-widest text-white hover:bg-loupe-deep disabled:opacity-50"
              >
                <ShieldCheck className="h-5 w-5" />
                {placingOrder ? "Processing..." : "Place Order & Reserve Diamonds"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5">
        <CartView />
      </div>
    </div>
  );
}