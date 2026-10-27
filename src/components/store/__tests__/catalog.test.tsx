import { describe, expect, it } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { vi } from "vitest";
import { ShapeSelector } from "@/components/store/shape-selector";
import { ColorScaleSelector, ClarityScaleSelector } from "@/components/store/grade-scale-slider";
import { ProductCard } from "@/components/catalog/ProductCard";
import { DiamondTable } from "@/components/store/diamond-table";
import type { DiamondSummary } from "@/lib/types/catalog";
import type { Product } from "@/lib/types/product";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const sampleDiamond: DiamondSummary = {
  id: "d-test-1",
  slug: "2-04-round-d-vvs1-gia",
  sku: "KL-D-001",
  shape: "ROUND",
  carat: 2.04,
  color: "D",
  clarity: "VVS1",
  cut: "EXCELLENT",
  origin: "NATURAL",
  lab: "GIA",
  certificateNumber: "2487612345",
  pricePaise: 45000000,
  available: true,
  polish: "EXCELLENT",
  symmetry: "EXCELLENT",
  fluorescence: "NONE",
  isNew: false,
  media: [],
};

const sampleProduct: Product = {
  id: "p-test-1",
  slug: "2-04-round-d-vvs1-gia",
  name: "2.04 ct Round Brilliant",
  description: null,
  diamond: {
    origin: "NATURAL",
    shape: "ROUND",
    carat: 2.04,
    color: "D",
    clarity: "VVS1",
    cut: "EXCELLENT",
    polish: "EXCELLENT",
    symmetry: "EXCELLENT",
    fluorescence: "NONE",
    lab: "GIA",
    quickShip: false,
  },
  images: [],
  variants: [{
    id: "v-test-1",
    sku: "KL-D-001",
    name: "2.04 ct",
    pricePaise: 45000000,
    mrpPaise: null,
    inStock: true,
  }],
};

describe("Catalog Components - Phase 3", () => {
  describe("ShapeSelector", () => {
    it("renders all diamond shapes", () => {
      const html = renderToString(
        <ShapeSelector selectedShapes={["ROUND"]} onToggleShape={() => {}} />
      );
      expect(html).toContain("Round");
      expect(html).toContain("Oval");
      expect(html).toContain("Emerald");
      expect(html).toContain('aria-pressed="true"');
      expect(html).toContain("1 selected");
    });
  });

  describe("GradeScaleSlider", () => {
    it("renders color grade buttons from D to K", () => {
      const html = renderToString(
        <ColorScaleSelector selectedColors={["D", "E"]} onToggleColor={() => {}} />
      );
      expect(html).toContain("Color Grade");
      expect(html).toContain("D");
      expect(html).toContain("K");
    });

    it("renders clarity grade buttons from FL to SI2", () => {
      const html = renderToString(
        <ClarityScaleSelector selectedClarities={["FL", "VVS1"]} onToggleClarity={() => {}} />
      );
      expect(html).toContain("Clarity Grade");
      expect(html).toContain("FL");
      expect(html).toContain("VVS1");
      expect(html).toContain("SI2");
    });
  });

  describe("ProductCard", () => {
    it("renders diamond grades, price and cart action", () => {
      const html = renderToString(<ProductCard product={sampleProduct} />);
      expect(html).toContain("2.04 ct");
      expect(html).toContain("Round Brilliant");
      expect(html).toContain("VVS1");
      expect(html).toContain("GIA");
      expect(html).toContain("Add to cart");
      expect(html).toContain("₹4,50,000");
    });
  });

  describe("DiamondTable", () => {
    it("renders high density table rows with diamond specifications", () => {
      const html = renderToString(<DiamondTable diamonds={[sampleDiamond]} />);
      expect(html).toContain("<table");
      expect(html).toContain("2.04 ct");
      expect(html).toContain("VVS1");
      expect(html).toContain("GIA");
      expect(html).toContain("₹4,50,000");
    });

    it("renders empty state message when no diamonds match", () => {
      const html = renderToString(<DiamondTable diamonds={[]} />);
      expect(html).toContain("No diamonds match your specifications.");
    });
  });
});
