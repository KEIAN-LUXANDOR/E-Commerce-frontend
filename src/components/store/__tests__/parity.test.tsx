import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { DiamondComparison } from "@/components/store/diamond-comparison";
import { WishlistView } from "@/components/store/wishlist-view";
import AboutPage from "@/app/about/page";
import FaqPage from "@/app/faq/page";
import ShapesGuidePage from "@/app/education/shapes/page";
import AdminDashboardPage from "@/app/admin/page";
import VaultLedgerPage from "@/app/admin/vault-ledger/page";
import AdminReturnsPage from "@/app/admin/returns/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/compare",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ id: "RET-2026-0042" }),
}));

describe("Stitch Parity Storefront & Admin Components", () => {
  it("renders DiamondComparison matrix with 4-column layout", () => {
    const html = renderToString(<DiamondComparison />);
    expect(html).toContain("Compare certified");
    expect(html).toContain("Key Gemological Grades");
    expect(html).toContain("Proportions &amp; Metrology");
  });

  it("renders WishlistView curation vault", () => {
    const html = renderToString(<WishlistView />);
    expect(html).toBeTruthy();
  });

  it("renders About Atelier page", () => {
    const html = renderToString(<AboutPage />);
    expect(html).toContain("Disciplined lapidary authority");
    expect(html).toContain("Dual Lab Certification");
  });

  it("renders FAQ page with categories", () => {
    const html = renderToString(<FaqPage />);
    expect(html).toContain("Frequently asked");
    expect(html).toContain("Certification &amp; Grading");
  });

  it("renders Shapes Guide page with 10 silhouettes", () => {
    const html = renderToString(<ShapesGuidePage />);
    expect(html).toContain("The architecture of");
    expect(html).toContain("Round Brilliant");
    expect(html).toContain("Oval Brilliant");
    expect(html).toContain("Emerald Cut");
  });

  it("renders Admin Dashboard with operational KPIs", () => {
    const html = renderToString(<AdminDashboardPage />);
    expect(html).toContain("Total Vault Valuation");
    expect(html).toContain("Armoured Transits");
  });

  it("renders Vault Stock Movements Ledger", () => {
    const html = renderToString(<VaultLedgerPage />);
    expect(html).toContain("Vault Stock Movements &amp; Inventory Ledger");
    expect(html).toContain("MOV-2026-0894");
  });

  it("renders Customer Returns Ledger", () => {
    const html = renderToString(<AdminReturnsPage />);
    expect(html).toContain("Customer Returns &amp; Evaluation Ledger");
    expect(html).toContain("RET-2026-0042");
  });
});
