import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { OrderStepper } from "../order-stepper";
import { AccountNav } from "../account-nav";
import { OrderHistory } from "../order-history";
import { ProfileEditor } from "../profile-editor";

vi.mock("@/lib/session", () => ({
  useSession: () => ({
    status: "user",
    user: {
      id: "customer-1",
      email: "riya@example.com",
      fullName: "Riya Shah",
      phone: "9876543210",
      role: "CUSTOMER",
      emailVerified: true,
      createdAt: "2026-01-10T00:00:00Z",
    },
  }),
  setSessionUser: vi.fn(),
}));

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
    expect(html).toContain(">Profile</span>");
    expect(html).toContain(">Orders</span>");
    expect(html).toContain(">Addresses</span>");
    expect(html).toContain(">Certificates</span>");
  });
});

describe("OrderHistory", () => {
  it("does not invent order data and explains how to get help", () => {
    const html = renderToString(<OrderHistory />);
    expect(html).toContain("Order history is on its way");
    expect(html).toContain("Contact us");
    expect(html).toContain("/shop");
    expect(html).not.toContain("KL-2026-98214");
  });
});

describe("ProfileEditor", () => {
  it("renders actual account details without invented profile fields", () => {
    const html = renderToString(<ProfileEditor />);

    expect(html).toContain("Personal details");
    expect(html).toContain("Full name");
    expect(html).toContain("riya@example.com");
    expect(html).toContain("9876543210");
    expect(html).not.toContain("KYC Verified");
    expect(html).not.toContain("aarav.mehta@example.com");
  });
});
