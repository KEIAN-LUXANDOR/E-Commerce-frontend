import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { OrderStepper, TRANSIT_MILESTONES } from "../order-stepper";
import { AccountNav, ACCOUNT_NAV_ITEMS } from "../account-nav";
import { OrderHistory, SAMPLE_CUSTOMER_ORDERS } from "../order-history";
import { ProfileEditor } from "../profile-editor";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/account",
}));

describe("OrderStepper", () => {
  it("renders all 6 transit milestones in order", () => {
    const html = renderToString(<OrderStepper currentStage="ARMED_TRANSIT" />);

    expect(html).toContain("Order Confirmed");
    expect(html).toContain("Forensic Inspection");
    expect(html).toContain("Tamper Sealed");
    expect(html).toContain("Armoured Transit");
    expect(html).toContain("Courier Escort");
    expect(html).toContain("Signed &amp; Delivered");
  });

  it("marks current step with aria-current", () => {
    const html = renderToString(<OrderStepper currentStage="ARMED_TRANSIT" />);
    expect(html).toContain('aria-current="step"');
  });

  it("defaults to first step if key not found", () => {
    // @ts-expect-error testing invalid key fallback
    const html = renderToString(<OrderStepper currentStage="UNKNOWN" />);
    expect(html).toContain("Order Confirmed");
  });
});

describe("AccountNav", () => {
  it("renders all customer portal links", () => {
    const html = renderToString(<AccountNav />);

    expect(html).toContain("/account");
    expect(html).toContain("/account/orders");
    expect(html).toContain("/account/addresses");
    expect(html).toContain("/account/vault");
    expect(html).toContain("Profile &amp; Identity");
    expect(html).toContain("Acquisitions &amp; Orders");
  });
});

describe("OrderHistory", () => {
  it("renders sample orders with reference IDs", () => {
    const html = renderToString(<OrderHistory />);

    expect(html).toContain("KL-2026-98214");
    expect(html).toContain("KL-2026-89102");
    expect(html).toContain("Sequel Secure Armoured Escort");
    expect(html).toContain("Malca-Amit Luxury Logistics");
  });

  it("renders formatted INR totals", () => {
    const html = renderToString(<OrderHistory />);
    expect(html).toContain("₹9,27,000");
    expect(html).toContain("₹4,94,400");
  });

  it("includes GIA / IGI dossier links", () => {
    const html = renderToString(<OrderHistory />);
    expect(html).toContain("Verify GIA");
    expect(html).toContain("Verify IGI");
    expect(html).toContain("2287654321");
  });

  it("includes tracking and invoice download triggers", () => {
    const html = renderToString(<OrderHistory />);
    expect(html).toContain("Track Live GPS &amp; Delivery OTP");
    expect(html).toContain("GST Tax Invoice (PDF)");
  });
});

describe("ProfileEditor", () => {
  it("renders personal dossier fields and KYC status", () => {
    const html = renderToString(<ProfileEditor />);

    expect(html).toContain("Personal Dossier");
    expect(html).toContain("KYC Verified");
    expect(html).toContain("Full Legal Name");
    expect(html).toContain("Registered Email");
    expect(html).toContain("Verified Mobile Number");
    expect(html).toContain("Real-Time WhatsApp Armoured Transit Dispatch");
  });
});
