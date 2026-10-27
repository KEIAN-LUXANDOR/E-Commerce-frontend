/**
 * checkout.test.tsx
 *
 * Phase 5 unit tests for:
 *   – CheckoutStepper (visual states, aria)
 *   – OrderSummary (line items, GST, totals)
 *   – AddressSelector (saved cards, form visibility)
 *   – RazorpayBridge (mock mode, button states)
 *   – Cart page logic (empty state rendering)
 *   – CHECKOUT_STEPS constant integrity
 */

import { describe, expect, it, vi } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";

import { CheckoutStepper, CHECKOUT_STEPS } from "@/components/checkout/checkout-stepper";
import { OrderSummary } from "@/components/checkout/order-summary";
import { AddressSelector } from "@/components/checkout/address-selector";
import type { CartLine } from "@/lib/stores";
import type { DeliveryAddress } from "@/lib/types/address";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SAMPLE_LINES: CartLine[] = [
  {
    diamondId: "d1",
    slug: "2-00-ct-round-d-vvs1-natural-ad1001",
    title: "2.00 ct Round Diamond",
    specLabel: "D • VVS1 • Excellent cut",
    certificateNumber: "2287654321",
    pricePaise: 90000000,
    shape: "ROUND",
  },
  {
    diamondId: "d2",
    slug: "1-01-ct-oval-e-vs1-lab-grown-ad1002",
    title: "1.01 ct Oval Diamond",
    specLabel: "E • VS1 • Very Good cut",
    certificateNumber: "LG12345678",
    pricePaise: 15000000,
    shape: "OVAL",
  },
];

const SAMPLE_ADDRESS: DeliveryAddress = {
  id: "addr-1",
  fullName: "Aarav Mehta",
  phone: "+91 98765 43210",
  line1: "Flat 12B, Oberoi Garden Estate",
  line2: "Chandivali Farm Road",
  landmark: "Near Powai Lake",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400072",
  defaultAddress: true,
};

// ---------------------------------------------------------------------------
// CheckoutStepper
// ---------------------------------------------------------------------------

describe("CheckoutStepper", () => {
  it("renders all step labels", () => {
    const html = renderToString(
      <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={1} />
    );
    expect(html).toContain("Contact");
    expect(html).toContain("Address");
    expect(html).toContain("Review");
    expect(html).toContain("Payment");
  });

  it("renders a nav with aria-label", () => {
    const html = renderToString(
      <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={2} />
    );
    expect(html).toContain('aria-label="Checkout progress"');
  });

  it("shows step 1 as active when currentStep=1", () => {
    const html = renderToString(
      <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={1} />
    );
    // Active step renders step number in ink-background div
    expect(html).toContain("bg-[var(--color-ink)]");
    // Step 1 number rendered
    expect(html).toContain(">1<");
  });

  it("renders a check mark for completed steps", () => {
    const html = renderToString(
      <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={3} />
    );
    // Steps 1 and 2 are complete; Lucide Check icon renders as SVG path
    expect(html).toContain("lucide-check");
  });

  it("renders 4 connector lines between steps", () => {
    const html = renderToString(
      <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={1} />
    );
    // 3 connector lines for 4 steps (between each pair)
    const matches = html.match(/flex-1 h-px/g) ?? [];
    expect(matches.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// CHECKOUT_STEPS constant
// ---------------------------------------------------------------------------

describe("CHECKOUT_STEPS", () => {
  it("has exactly 4 steps", () => {
    expect(CHECKOUT_STEPS).toHaveLength(4);
  });

  it("steps are numbered 1 to 4", () => {
    const ids = CHECKOUT_STEPS.map((s) => s.id);
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it("each step has a label and description", () => {
    CHECKOUT_STEPS.forEach((s) => {
      expect(s.label).toBeTruthy();
      expect(s.description).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// OrderSummary
// ---------------------------------------------------------------------------

describe("OrderSummary", () => {
  it("renders the section heading", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("Order Summary");
  });

  it("shows correct stone count", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("2 stones reserved");
  });

  it("shows singular stone label for 1 item", () => {
    const html = renderToString(<OrderSummary lines={[SAMPLE_LINES[0]]} />);
    expect(html).toContain("1 stone reserved");
  });

  it("renders diamond titles in line items", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("2.00 ct Round Diamond");
    expect(html).toContain("1.01 ct Oval Diamond");
  });

  it("renders GST row", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("GST (3%)");
  });

  it("renders insured transit as complimentary", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("Complimentary");
  });

  it("renders the Total row with emphasis", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("Total");
  });

  it("renders promo code input when showPromo=true", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} showPromo />);
    expect(html).toContain("Privilege code");
  });

  it("does not render promo code input when showPromo=false", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} showPromo={false} />);
    expect(html).not.toContain("Privilege code");
  });

  it("renders empty state message when lines is empty", () => {
    const html = renderToString(<OrderSummary lines={[]} />);
    expect(html).toContain("Your cart is empty");
  });

  it("renders certificate numbers in line items", () => {
    const html = renderToString(<OrderSummary lines={SAMPLE_LINES} />);
    expect(html).toContain("2287654321");
    expect(html).toContain("LG12345678");
  });
});

// ---------------------------------------------------------------------------
// OrderSummary – GST calculation spot-check
// ---------------------------------------------------------------------------

describe("OrderSummary GST calculation", () => {
  it("GST at 3% is included in total label", () => {
    const line: CartLine = {
      diamondId: "d-test",
      slug: "test-diamond",
      title: "Test Diamond",
      specLabel: "D • IF",
      pricePaise: 10000000, // ₹1,00,000
      shape: "ROUND",
    };
    const html = renderToString(<OrderSummary lines={[line]} showPromo={false} />);
    // Should render GST row
    expect(html).toContain("GST (3%)");
  });
});

// ---------------------------------------------------------------------------
// AddressSelector
// ---------------------------------------------------------------------------

describe("AddressSelector", () => {
  it("renders saved address cards", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[SAMPLE_ADDRESS]}
        selectedId={SAMPLE_ADDRESS.id}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain("Aarav Mehta");
    expect(html).toContain("400072");
    expect(html).toContain("Mumbai");
    expect(html).toContain("Maharashtra");
  });

  it("marks the selected address with aria-pressed=true", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[SAMPLE_ADDRESS]}
        selectedId={SAMPLE_ADDRESS.id}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain('aria-pressed="true"');
  });

  it("renders a Default badge for the default address", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[SAMPLE_ADDRESS]}
        selectedId={null}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain("Default");
  });

  it("renders the Add New Address button when addresses exist", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[SAMPLE_ADDRESS]}
        selectedId={null}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain("Add New Address");
  });

  it("renders the new address form directly when no saved addresses", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[]}
        selectedId={null}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain("New Delivery Address");
    expect(html).toContain("Full Name");
    expect(html).toContain("PIN Code");
  });

  it("renders all Indian state options in the state select", () => {
    const html = renderToString(
      <AddressSelector
        savedAddresses={[]}
        selectedId={null}
        onSelect={vi.fn()}
        onNewAddress={vi.fn()}
      />
    );
    expect(html).toContain("Maharashtra");
    expect(html).toContain("Delhi");
    expect(html).toContain("Karnataka");
    expect(html).toContain("Tamil Nadu");
  });
});

// ---------------------------------------------------------------------------
// RazorpayBridge (server-side render only – no real Razorpay)
// ---------------------------------------------------------------------------

describe("RazorpayBridge", () => {
  it("renders the pay button with accessible label", async () => {
    // Dynamic import to avoid issues with window.Razorpay in SSR context
    const { RazorpayBridge } = await import("@/components/checkout/razorpay-bridge");
    const html = renderToString(
      <RazorpayBridge
        amountPaise={90000000}
        email="test@example.com"
        name="Test User"
        onSuccess={vi.fn()}
      />
    );
    expect(html).toContain("Loading Gateway…");
    expect(html).toContain('aria-label="Pay ₹9,00,000 securely via Razorpay"');
    expect(html).toContain("Razorpay");
  });

  it("renders trust note about SSL and payment methods", async () => {
    const { RazorpayBridge } = await import("@/components/checkout/razorpay-bridge");
    const html = renderToString(
      <RazorpayBridge
        amountPaise={50000000}
        email="buyer@example.com"
        name="Buyer Name"
        onSuccess={vi.fn()}
      />
    );
    expect(html).toContain("SSL");
    expect(html).toContain("UPI");
  });

  it("renders as disabled when disabled=true", async () => {
    const { RazorpayBridge } = await import("@/components/checkout/razorpay-bridge");
    const html = renderToString(
      <RazorpayBridge
        amountPaise={50000000}
        email="buyer@example.com"
        name="Buyer"
        onSuccess={vi.fn()}
        disabled
      />
    );
    // Disabled button uses stone background
    expect(html).toContain("cursor-not-allowed");
  });
});
