import * as React from "react";
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { AdminShell, ADMIN_NAV_ITEMS } from "../admin-shell";
import { PackingDesk } from "../packing-desk";
import { DiamondInventoryManager } from "../diamond-form";
import { CsvWizard } from "../csv-wizard";

describe("AdminShell", () => {
  it("renders staff clearance credential and level badge", () => {
    const html = renderToString(
      <AdminShell>
        <div>Content</div>
      </AdminShell>
    );

    expect(html).toContain("Elena Vance, GG (GIA)");
    expect(html).toContain("Level 4 Clearance");
    expect(html).toContain("L4");
  });

  it("renders all navigation items", () => {
    const html = renderToString(
      <AdminShell>
        <div>Content</div>
      </AdminShell>
    );

    expect(html).toContain("Packing Desk");
    expect(html).toContain("Diamond Inventory");
    expect(html).toContain("CSV Ingestion");
    expect(html).toContain("Order Dossiers");
    expect(html).toContain("Staff &amp; Clearance");
    expect(html).toContain("Privilege Codes");
  });
});

describe("PackingDesk", () => {
  it("renders queue and active diamond card", () => {
    const html = renderToString(<PackingDesk />);

    expect(html).toContain("Forensic Packing &amp; Fulfilment Desk");
    expect(html).toContain("2 in Vault");
    expect(html).toContain("2.51 ct Oval Solitaire (Natural)");
    expect(html).toContain("1.80 ct Emerald Solitaire (Lab-Grown)");
  });

  it("renders 4-point gemological checklist items", () => {
    const html = renderToString(<PackingDesk />);

    expect(html).toContain("1. Forensic 10x Loupe Inspection");
    expect(html).toContain("2. Official Laboratory Dossier");
    expect(html).toContain("3. Presentation Cassette");
    expect(html).toContain("4. Serialized Tamper Pouch");
  });

  it("renders barcode laser inscription matcher", () => {
    const html = renderToString(<PackingDesk />);
    expect(html).toContain("Laser Inscription Barcode Matcher");
    expect(html).toContain("Expected: #6298144210");
  });
});

describe("DiamondInventoryManager", () => {
  it("renders inventory table with initial diamonds", () => {
    const html = renderToString(<DiamondInventoryManager />);

    expect(html).toContain("Diamond Master Inventory");
    expect(html).toContain("2.00 ct Round Brilliant Solitaire");
    expect(html).toContain("1.52 ct Oval Cut Solitaire");
    expect(html).toContain("3.05 ct Emerald Solitaire");
  });

  it("renders rupee pricing and certificate numbers", () => {
    const html = renderToString(<DiamondInventoryManager />);

    expect(html).toContain("₹9,00,000");
    expect(html).toContain("₹4,80,000");
    expect(html).toContain("2287654321");
  });
});

describe("CsvWizard", () => {
  it("renders raw CSV source box and column guidelines", () => {
    const html = renderToString(<CsvWizard />);

    expect(html).toContain("Batch CSV Diamond Ingestion");
    expect(html).toContain("Required columns: shape, carat, color, clarity, cut, lab, cert_number, price_inr");
    expect(html).toContain("Parse &amp; Validate Records");
  });
});
