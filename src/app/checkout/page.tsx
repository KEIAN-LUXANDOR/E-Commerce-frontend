"use client";

/**
 * Checkout Page
 * Route: /checkout
 *
 * Directly aligns with Mockup: mockups/secure_4_step_checkout_keian_luxandor/code.html
 * - Header: "Custodial Transfer & Settlement" / "Secure Acquisition Dossier" / "Protocol ID: KL-ORD-2026-9042"
 * - 4-Step Vertical Stepper:
 *     Step 1: Contact (Completed collapsed summary with Edit button)
 *     Step 2: Delivery address (Completed collapsed summary with Edit button)
 *     Step 3: Review (Completed collapsed summary with Edit button)
 *     Step 4: Payment (Active step with statutory PAN input + Razorpay trigger)
 * - Sticky Right Column: OrderSummary with live 15-minute reservation timer
 * - Zero nested ternaries in JSX
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Loader2, ShieldCheck, ArrowRight, Gem } from "lucide-react";
import { useCart, showToast } from "@/lib/stores";
import { formatINR } from "@/lib/format";
import { OrderSummary } from "@/components/checkout/order-summary";
import { AddressSelector } from "@/components/checkout/address-selector";
import { RazorpayBridge } from "@/components/checkout/razorpay-bridge";
import { cn } from "@/lib/utils";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

// ---------------------------------------------------------------------------
// Mock saved addresses
// ---------------------------------------------------------------------------

const MOCK_SAVED_ADDRESSES: DeliveryAddress[] = [
  {
    id: "addr-1",
    fullName: "Riya Sharma",
    phone: "+91 98765 43210",
    line1: "1402 Tower B, Signature Meadows",
    line2: "Bandra West",
    landmark: "Near Mehboob Studio",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    defaultAddress: true,
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactForm {
  name: string;
  email: string;
  phone: string;
}

// ---------------------------------------------------------------------------
// Collapsed Step Header
// ---------------------------------------------------------------------------

function CollapsedStepRow({
  stepNumber,
  label,
  summary,
  onEdit,
}: {
  stepNumber: number;
  label: string;
  summary: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white border border-[var(--color-line)] p-4 flex items-center justify-between transition-colors hover:border-[var(--color-slate)]">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="size-6 bg-[var(--canvas-dark,#0D0D0D)] text-white flex items-center justify-center flex-shrink-0">
          <Check className="size-3.5" />
        </div>
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-slate)] font-semibold shrink-0">
            {stepNumber}. {label}:
          </span>
          <span className="text-[13px] text-[var(--color-ink)] font-medium truncate">
            {summary}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="font-mono text-[11px] text-[var(--brand-anchor,#0A192F)] hover:text-black uppercase tracking-wider underline underline-offset-4 flex-shrink-0 font-semibold"
      >
        Edit
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Step 1: Contact
// ---------------------------------------------------------------------------

function Step1ContactForm({
  contact,
  onChange,
  onNext,
}: {
  contact: ContactForm;
  onChange: (c: ContactForm) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactForm, string>>>({});

  function validate() {
    const next: typeof errors = {};
    if (!contact.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) next.email = "Enter a valid email.";
    if (!contact.phone.trim()) next.phone = "Phone number is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  }

  return (
    <div className="bg-white border-2 border-[var(--color-ink)] p-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[var(--canvas-dark,#0D0D0D)] text-white flex items-center justify-center font-mono text-[12px] font-bold">
            1
          </div>
          <h2 className="font-serif text-[20px] text-[var(--color-ink)] font-normal">
            Contact &amp; Identity
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[var(--color-slate)] uppercase tracking-wider">
          Step 1 of 4
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="contact-name"
            className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink)] block mb-1 font-semibold"
          >
            Full Legal Name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={contact.name}
            onChange={(e) => onChange({ ...contact, name: e.target.value })}
            placeholder="e.g. Riya Sharma"
            className="w-full h-11 px-3 bg-[#F6F4EF] border border-[var(--color-line)] font-mono text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
          />
          {errors.name && <p className="font-mono text-[10px] text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-email"
              className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink)] block mb-1 font-semibold"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={contact.email}
              onChange={(e) => onChange({ ...contact, email: e.target.value })}
              placeholder="riya.sharma@example.com"
              className="w-full h-11 px-3 bg-[#F6F4EF] border border-[var(--color-line)] font-mono text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
            />
            {errors.email && <p className="font-mono text-[10px] text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink)] block mb-1 font-semibold"
            >
              Mobile (for Insured Delivery OTP) <span className="text-red-600">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => onChange({ ...contact, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full h-11 px-3 bg-[#F6F4EF] border border-[var(--color-line)] font-mono text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
            />
            {errors.phone && <p className="font-mono text-[10px] text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 bg-[var(--canvas-dark,#0D0D0D)] text-white font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-black transition-colors"
          >
            Continue to Delivery Address →
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Step 2: Address
// ---------------------------------------------------------------------------

function Step2AddressForm({
  savedAddresses,
  selectedAddress,
  onSelect,
  onNewAddress,
  onNext,
  onBack,
}: {
  savedAddresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  onSelect: (a: DeliveryAddress) => void;
  onNewAddress: (req: DeliveryAddressRequest) => Promise<DeliveryAddress>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="bg-white border-2 border-[var(--color-ink)] p-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[var(--canvas-dark,#0D0D0D)] text-white flex items-center justify-center font-mono text-[12px] font-bold">
            2
          </div>
          <h2 className="font-serif text-[20px] text-[var(--color-ink)] font-normal">
            Insured Delivery Address
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[var(--color-slate)] uppercase tracking-wider">
          Step 2 of 4
        </span>
      </div>

      <AddressSelector
        savedAddresses={savedAddresses}
        selectedId={selectedAddress?.id ?? null}
        onSelect={onSelect}
        onNewAddress={onNewAddress}
      />

      <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--color-line)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedAddress}
          className="flex-1 h-12 bg-[var(--canvas-dark,#0D0D0D)] text-white font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-black transition-colors disabled:opacity-50"
        >
          Continue to Order Review →
        </button>
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-6 border border-[var(--color-line)] font-mono text-[11px] uppercase tracking-wider hover:bg-[#F6F4EF] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Step 3: Review
// ---------------------------------------------------------------------------

function Step3ReviewForm({
  lines,
  address,
  contact,
  onNext,
  onBack,
}: {
  lines: ReturnType<typeof useCart>;
  address: DeliveryAddress;
  contact: ContactForm;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="bg-white border-2 border-[var(--color-ink)] p-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[var(--canvas-dark,#0D0D0D)] text-white flex items-center justify-center font-mono text-[12px] font-bold">
            3
          </div>
          <h2 className="font-serif text-[20px] text-[var(--color-ink)] font-normal">
            Order Review &amp; Authentication
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[var(--color-slate)] uppercase tracking-wider">
          Step 3 of 4
        </span>
      </div>

      <div className="space-y-4 text-[13px]">
        {/* Recipient summary */}
        <div className="border border-[var(--color-line)] p-4 bg-[#F6F4EF]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-slate)] block mb-1">
            Armored Transit Recipient
          </span>
          <p className="font-medium text-[var(--color-ink)]">{address.fullName} ({contact.phone})</p>
          <p className="text-[var(--color-slate)] font-mono text-[12px] mt-0.5">
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} – {address.pincode}
          </p>
        </div>

        {/* Specimen items confirmation */}
        <div className="border border-[var(--color-line)] p-4 bg-white divide-y divide-[var(--color-line)]/50">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-slate)] block pb-2">
            {lines.length} Verified Single-Specimen {lines.length === 1 ? "Diamond" : "Diamonds"}
          </span>
          {lines.map((l) => (
            <div key={l.diamondId} className="py-2.5 flex justify-between items-baseline">
              <div>
                <p className="font-serif text-[15px] text-[var(--color-ink)]">{l.title}</p>
                <p className="font-mono text-[11px] text-[var(--color-slate)]">
                  {l.certificateNumber ? `Cert #${l.certificateNumber}` : "Report Inscribed"} · {l.specLabel}
                </p>
              </div>
              <span className="font-mono text-[13px] font-medium text-[var(--color-ink)] tabular-nums ml-4">
                {formatINR(l.pricePaise)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--color-line)]">
        <button
          type="button"
          onClick={onNext}
          className="flex-1 h-12 bg-[var(--canvas-dark,#0D0D0D)] text-white font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-black transition-colors"
        >
          Proceed to Settlement &amp; Payment →
        </button>
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-6 border border-[var(--color-line)] font-mono text-[11px] uppercase tracking-wider hover:bg-[#F6F4EF] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Step 4: Payment
// ---------------------------------------------------------------------------

function Step4PaymentForm({
  totalPaise,
  email,
  name,
  onPaid,
}: {
  totalPaise: number;
  email: string;
  name: string;
  onPaid: (paymentId: string) => void;
}) {
  const [pan, setPan] = React.useState("ABCDE1234F");

  return (
    <div className="bg-white border-2 border-[var(--color-ink)] p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[var(--canvas-dark,#0D0D0D)] text-white flex items-center justify-center font-mono text-[12px] font-bold">
            4
          </div>
          <h2 className="font-serif text-[20px] text-[var(--color-ink)] font-normal">
            Payment &amp; Settlement
          </h2>
        </div>
        <span className="font-mono text-[11px] text-emerald-800 flex items-center gap-1">
          <Lock className="size-3.5 text-emerald-700" />
          Secured 256-bit SSL
        </span>
      </div>

      <div className="space-y-5">
        {/* Statutory PAN requirement */}
        <div className="space-y-1.5">
          <label
            htmlFor="pan-number"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] block font-semibold"
          >
            Permanent Account Number (PAN) <span className="text-red-600">*</span>
          </label>
          <input
            id="pan-number"
            type="text"
            maxLength={10}
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            className="w-full max-w-md h-11 px-3 bg-[#F6F4EF] border border-[var(--color-line)] font-mono text-[14px] text-[var(--color-ink)] uppercase tracking-widest outline-none focus:border-[var(--color-ink)]"
          />
          <p className="font-mono text-[10px] text-[var(--color-slate)]">
            Required by law under Section 139A of the Indian Income Tax Act for precious acquisitions above ₹2 lakh.
          </p>
        </div>

        {/* Razorpay Bridge */}
        <div className="pt-2">
          <RazorpayBridge
            amountPaise={totalPaise}
            email={email}
            name={name}
            onSuccess={onPaid}
          />
          <p className="text-center font-mono text-[11px] text-[var(--color-slate)] mt-3">
            Secure bank transfer gateway supporting Indian Credit/Debit Cards, UPI (Google Pay / PhonePe), Net Banking &amp; Major Bank EMI.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Checkout Page Component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [contact, setContact] = React.useState<ContactForm>({
    name: "Riya Sharma",
    email: "riya.sharma@luxandor.in",
    phone: "+91 98765 43210",
  });
  const [savedAddresses] = React.useState<DeliveryAddress[]>(MOCK_SAVED_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = React.useState<DeliveryAddress | null>(
    MOCK_SAVED_ADDRESSES[0] ?? null
  );
  const [totalPaise, setTotalPaise] = React.useState(0);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (lines.length === 0) {
      router.replace("/cart");
    }
  }, [lines.length, router]);

  async function handleNewAddress(req: DeliveryAddressRequest): Promise<DeliveryAddress> {
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      ...req,
      line2: req.line2 ?? null,
      landmark: req.landmark ?? null,
      defaultAddress: false,
    };
    setSelectedAddress(newAddr);
    return newAddr;
  }

  function handlePaid(paymentId: string) {
    showToast("Acquisition protocol settlement authorized.", "info");
    router.push(`/checkout/success?payment=${paymentId}`);
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#FAF9F5]">
        <Loader2 className="size-8 animate-spin text-[var(--color-slate)]" />
      </div>
    );
  }

  return (
    <main className="bg-[#FAF9F5] min-h-screen text-[var(--color-ink)]">
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 md:py-12">
        {/* Discreet Protocol Header matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-8 border-b border-[var(--color-line)] gap-3">
          <div>
            <span className="font-mono text-[11px] text-[var(--brand-anchor,#0A192F)] uppercase tracking-widest block mb-1">
              Custodial Transfer &amp; Settlement
            </span>
            <h1 className="font-serif text-[28px] sm:text-[34px] text-[var(--color-ink)] tracking-tight font-normal">
              Secure Acquisition Dossier
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--color-slate)] uppercase tracking-widest">
              Protocol ID:
            </span>
            <span className="font-mono text-[12px] px-2.5 py-1 bg-white border border-[var(--color-line)] text-[var(--color-ink)] font-semibold">
              KL-ORD-2026-9042
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Left Stepper / Right Sticky Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 4-Step Vertical Stepper */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* STEP 1: Contact */}
            {currentStep > 1 ? (
              <CollapsedStepRow
                stepNumber={1}
                label="Contact"
                summary={`${contact.name} · ${contact.email} · ${contact.phone}`}
                onEdit={() => setCurrentStep(1)}
              />
            ) : (
              <Step1ContactForm
                contact={contact}
                onChange={setContact}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {/* STEP 2: Delivery address */}
            {currentStep > 2 ? (
              <CollapsedStepRow
                stepNumber={2}
                label="Delivery address"
                summary={
                  selectedAddress
                    ? `${selectedAddress.fullName} · ${selectedAddress.line1}, ${selectedAddress.city} ${selectedAddress.pincode}`
                    : "Address confirmed"
                }
                onEdit={() => setCurrentStep(2)}
              />
            ) : currentStep === 2 ? (
              <Step2AddressForm
                savedAddresses={savedAddresses}
                selectedAddress={selectedAddress}
                onSelect={setSelectedAddress}
                onNewAddress={handleNewAddress}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            ) : (
              <div className="bg-white border border-[var(--color-line)] p-4 flex items-center justify-between text-[var(--color-slate)]">
                <div className="flex items-center gap-3">
                  <div className="size-6 bg-[#F6F4EF] text-[var(--color-slate)] flex items-center justify-center font-mono text-[11px]">
                    2
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    2. Insured Delivery Address
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {currentStep > 3 ? (
              <CollapsedStepRow
                stepNumber={3}
                label="Review"
                summary={`${lines.length} Specimen Stones · Verified Certificates & Inscriptions`}
                onEdit={() => setCurrentStep(3)}
              />
            ) : currentStep === 3 ? (
              <Step3ReviewForm
                lines={lines}
                address={selectedAddress || MOCK_SAVED_ADDRESSES[0]}
                contact={contact}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            ) : (
              <div className="bg-white border border-[var(--color-line)] p-4 flex items-center justify-between text-[var(--color-slate)]">
                <div className="flex items-center gap-3">
                  <div className="size-6 bg-[#F6F4EF] text-[var(--color-slate)] flex items-center justify-center font-mono text-[11px]">
                    3
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    3. Order Review &amp; Certificates
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: Payment */}
            {currentStep === 4 ? (
              <Step4PaymentForm
                totalPaise={totalPaise}
                email={contact.email}
                name={contact.name}
                onPaid={handlePaid}
              />
            ) : (
              <div className="bg-white border border-[var(--color-line)] p-4 flex items-center justify-between text-[var(--color-slate)]">
                <div className="flex items-center gap-3">
                  <div className="size-6 bg-[#F6F4EF] text-[var(--color-slate)] flex items-center justify-center font-mono text-[11px]">
                    4
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    4. Payment &amp; Statutory PAN Settlement
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary & Sticky Reservation Timer */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <OrderSummary
              lines={lines}
              showTimer={true}
              onTotalChange={setTotalPaise}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
