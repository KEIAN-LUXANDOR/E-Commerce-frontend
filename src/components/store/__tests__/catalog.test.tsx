import { describe, expect, it } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ShapeSelector } from "@/components/store/shape-selector";
import { ColorScaleSelector, ClarityScaleSelector } from "@/components/store/grade-scale-slider";
import { DiamondCard } from "@/components/store/diamond-card";
import { DiamondTable } from "@/components/store/diamond-table";
import type { DiamondSummary } from "@/lib/types/catalog";

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

  describe("DiamondCard", () => {
    it("renders carat weight, grades, price and Reserve button", () => {
      const html = renderToString(<DiamondCard diamond={sampleDiamond} />);
      expect(html).toContain("2.04 Carat");
      expect(html).toContain("ROUND");
      expect(html).toContain("VVS1");
      expect(html).toContain("GIA");
      expect(html).toContain("Reserve");
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
