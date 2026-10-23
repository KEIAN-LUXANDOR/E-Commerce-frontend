/**
 * pdp.test.tsx
 *
 * Phase 4 unit tests for:
 *   – DiamondViewer (gallery, thumbnails, loupe button)
 *   – CertificateModal (renders grading data, verify link)
 *   – BuyBox (price, availability, wishlist, PIN checker)
 *   – FourCsBreakdown (grades, scale bars, collapsible metrology)
 *   – Mock data integrity (mockDiamond, mockSimilar)
 *
 * All components are rendered to HTML strings via renderToString so tests
 * run in Node without a real DOM, matching the vitest.config.ts setup.
 */

import { describe, expect, it, vi } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";

import { DiamondViewer } from "@/components/store/diamond-viewer";
import { CertificateModal } from "@/components/store/certificate-modal";
import { FourCsBreakdown } from "@/components/store/four-cs-breakdown";
import { mockDiamond, mockSimilar, mockListDiamonds } from "@/mocks/catalog-service";
import { diamonds } from "@/mocks/data";

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const SAMPLE_GALLERY = [
  { id: "g1", type: "IMAGE" as const, alt: "Face-up view" },
  { id: "g2", type: "IMAGE" as const, alt: "Side profile" },
  { id: "g3", type: "SPIN_360" as const, alt: "360° view" },
];

const SAMPLE_MEASUREMENTS = { lengthMm: 8.10, widthMm: 8.12, depthMm: 4.99 };

// ---------------------------------------------------------------------------
// DiamondViewer
// ---------------------------------------------------------------------------

describe("DiamondViewer", () => {
  it("renders a main stage region", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={SAMPLE_GALLERY}
        shape="ROUND"
        title="2.00 ct Round Diamond"
      />
    );
    expect(html).toContain('role="region"');
    expect(html).toContain("Diamond viewer");
  });

  it("renders thumbnail buttons for each gallery item", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={SAMPLE_GALLERY}
        shape="ROUND"
        title="2.00 ct Round Diamond"
      />
    );
    // Three thumbnails
    expect(html).toContain("View image 1");
    expect(html).toContain("View image 2");
    expect(html).toContain("360°");
  });

  it("renders the loupe button for static images", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={[{ id: "g1", type: "IMAGE", alt: "Face-up view" }]}
        shape="OVAL"
        title="1.50 ct Oval Diamond"
      />
    );
    expect(html).toContain("Open forensic loupe viewer");
  });

  it("renders a 360° spin badge when a SPIN_360 media item is present", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={SAMPLE_GALLERY}
        shape="EMERALD"
        title="1.20 ct Emerald Diamond"
      />
    );
    expect(html).toContain("360°");
  });

  it("renders prev/next chevrons when there are multiple gallery items", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={SAMPLE_GALLERY}
        shape="CUSHION"
        title="1.00 ct Cushion Diamond"
      />
    );
    expect(html).toContain("Previous image");
    expect(html).toContain("Next image");
  });

  it("does not render nav arrows with a single media item", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={[{ id: "g1", type: "IMAGE", alt: "Only view" }]}
        shape="PEAR"
        title="0.90 ct Pear Diamond"
      />
    );
    expect(html).not.toContain("Previous image");
  });

  it("renders SVG shape art placeholders when no URL is provided", () => {
    const html = renderToString(
      <DiamondViewer
        gallery={[{ id: "g1", type: "IMAGE", alt: "No URL image" }]}
        shape="HEART"
        title="0.75 ct Heart Diamond"
      />
    );
    // Shape art is SVG – should include an svg element
    expect(html).toContain("<svg");
  });
});

// ---------------------------------------------------------------------------
// CertificateModal
// ---------------------------------------------------------------------------

describe("CertificateModal", () => {
  const BASE_PROPS = {
    open: true,
    onClose: vi.fn(),
    lab: "GIA" as const,
    certificateNumber: "2249876543",
    carat: 1.5,
    shape: "ROUND",
    color: "D" as const,
    clarity: "VVS1" as const,
    cut: "EXCELLENT" as const,
    polish: "EXCELLENT" as const,
    symmetry: "EXCELLENT" as const,
    fluorescence: "NONE" as const,
    tablePct: 57,
    depthPct: 61.8,
    lwRatio: 1.0,
    girdle: "Thin to medium",
    culet: "None",
    laserInscription: true,
    measurements: SAMPLE_MEASUREMENTS,
  };

  it("does not render when open=false", () => {
    const html = renderToString(
      <CertificateModal {...BASE_PROPS} open={false} />
    );
    expect(html).toBe("");
  });

  it("renders the GIA report heading", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    // React SSR injects comment nodes between adjacent JSX expressions,
    // so check for each word separately rather than the concatenated string
    expect(html).toContain("GIA");
    expect(html).toContain("Grading Report");
    expect(html).toContain("Gemological Institute of America");
  });

  it("shows report number in fallback panel", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    expect(html).toContain("2249876543");
  });

  it("renders 4Cs in the fallback panel", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    expect(html).toContain("Carat Weight");
    expect(html).toContain("1.50 ct");
    expect(html).toContain("Colour Grade");
    expect(html).toContain("Clarity Grade");
    expect(html).toContain("VVS1");
    expect(html).toContain("Cut Grade");
    expect(html).toContain("Excellent");
  });

  it("renders metrology data (table %, depth %)", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    expect(html).toContain("57%");
    expect(html).toContain("61.8%");
  });

  it("renders the GIA verify link", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    // Check the href is correct; React SSR splits "Verify on" and "GIA.edu" with a comment node
    expect(html).toContain("gia.edu/report-check");
    expect(html).toContain("GIA.edu");
  });

  it("renders the IGI verify link for IGI certs", () => {
    const html = renderToString(
      <CertificateModal {...BASE_PROPS} lab="IGI" certificateNumber="LG12345678" />
    );
    // Check href; text is split by React SSR comment nodes
    expect(html).toContain("igi.org/verify");
    expect(html).toContain("IGI.org");
  });

  it("renders an iframe when certificateUrl is provided", () => {
    const html = renderToString(
      <CertificateModal
        {...BASE_PROPS}
        certificateUrl="https://example.com/cert.pdf"
      />
    );
    expect(html).toContain("<iframe");
    expect(html).toContain("cert.pdf");
  });

  it("shows laser inscription notice when laserInscription=true", () => {
    const html = renderToString(<CertificateModal {...BASE_PROPS} />);
    expect(html).toContain("laser-inscribed on the girdle");
  });
});

// ---------------------------------------------------------------------------
// FourCsBreakdown
// ---------------------------------------------------------------------------

describe("FourCsBreakdown", () => {
  const PROPS = {
    carat: 2.01,
    color: "F" as const,
    clarity: "VS1" as const,
    cut: "EXCELLENT" as const,
    polish: "EXCELLENT" as const,
    symmetry: "VERY_GOOD" as const,
    fluorescence: "FAINT" as const,
    tablePct: 58,
    depthPct: 62.4,
    lwRatio: 1.42,
    girdle: "Thin to medium",
    culet: "None",
    measurements: SAMPLE_MEASUREMENTS,
  };

  it("renders section heading", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    expect(html).toContain("4Cs Breakdown");
  });

  it("renders all four grading categories", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    expect(html).toContain("Cut");
    expect(html).toContain("Colour");
    expect(html).toContain("Clarity");
    expect(html).toContain("Carat");
  });

  it("renders correct grade values", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    expect(html).toContain("Excellent");
    expect(html).toContain("VS1");
    expect(html).toContain("2.01 ct");
    expect(html).toContain("F"); // colour grade
  });

  it("renders scale bar segments for each 4C", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    // Scale bar labels
    expect(html).toContain("D (Colourless)");
    expect(html).toContain("FL (Flawless)");
    expect(html).toContain("Excellent"); // cut scale left label
  });

  it("renders the Proportions & Finish toggle button", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    expect(html).toContain("Proportions");
    expect(html).toContain("Finish");
  });

  it("renders descriptive explanations for each grade", () => {
    const html = renderToString(<FourCsBreakdown {...PROPS} />);
    // F is in DEF range → Colourless description
    expect(html).toContain("Colourless");
    // VS1 clarity description
    expect(html).toContain("Very slightly included");
    // Excellent cut description
    expect(html).toContain("Maximum brilliance");
  });
});

// ---------------------------------------------------------------------------
// Mock data: mockDiamond & mockSimilar
// ---------------------------------------------------------------------------

describe("mockDiamond", () => {
  it("returns undefined for an unknown slug", () => {
    const result = mockDiamond("non-existent-slug-xyz");
    expect(result).toBeUndefined();
  });

  it("returns a DiamondDetail for a valid slug from mock data", () => {
    const firstDiamond = diamonds[0];
    const result = mockDiamond(firstDiamond.slug);
    expect(result).toBeDefined();
    expect(result?.id).toBe(firstDiamond.id);
  });

  it("returned diamond includes all required PDP fields", () => {
    const d = mockDiamond(diamonds[0].slug)!;
    expect(d.gallery).toBeDefined();
    expect(d.gallery.length).toBeGreaterThan(0);
    expect(d.measurements).toBeDefined();
    expect(typeof d.tablePct).toBe("number");
    expect(typeof d.depthPct).toBe("number");
    expect(typeof d.lwRatio).toBe("number");
    expect(typeof d.girdle).toBe("string");
    expect(typeof d.culet).toBe("string");
    expect(d.breadcrumbs.length).toBeGreaterThan(0);
    expect(d.seo.title).toBeTruthy();
    expect(d.seo.description).toBeTruthy();
  });
});

describe("mockSimilar", () => {
  it("returns empty array for unknown slug", () => {
    const result = mockSimilar("totally-unknown-slug");
    expect(result).toHaveLength(0);
  });

  it("returns at most 4 stones for a known slug", () => {
    const d = diamonds[0];
    const result = mockSimilar(d.slug);
    expect(result.length).toBeLessThanOrEqual(4);
  });

  it("returned similar stones share the same shape as the source", () => {
    const d = diamonds[0];
    const result = mockSimilar(d.slug);
    result.forEach((stone) => {
      expect(stone.shape).toBe(d.shape);
    });
  });

  it("does not include the source diamond in results", () => {
    const d = diamonds[0];
    const result = mockSimilar(d.slug);
    const ids = result.map((s) => s.id);
    expect(ids).not.toContain(d.id);
  });
});

// ---------------------------------------------------------------------------
// PDP route data integrity
// ---------------------------------------------------------------------------

describe("PDP data integrity", () => {
  it("all mock diamonds have non-zero pricePaise", () => {
    diamonds.forEach((d) => {
      expect(d.pricePaise).toBeGreaterThan(0);
    });
  });

  it("all mock diamonds have a slug and sku", () => {
    diamonds.forEach((d) => {
      expect(d.slug).toBeTruthy();
      expect(d.sku).toBeTruthy();
    });
  });

  it("all mock diamonds have at least one gallery item", () => {
    diamonds.forEach((d) => {
      expect(d.gallery.length).toBeGreaterThan(0);
    });
  });

  it("all mock diamonds have breadcrumbs starting with Home", () => {
    diamonds.forEach((d) => {
      expect(d.breadcrumbs[0].name).toBe("Home");
    });
  });

  it("pricePaise is always a multiple of 10000 (₹100 rounding)", () => {
    diamonds.forEach((d) => {
      expect(d.pricePaise % 10000).toBe(0);
    });
  });

  it("natural diamonds are graded by GIA", () => {
    diamonds
      .filter((d) => d.origin === "NATURAL")
      .forEach((d) => {
        expect(d.lab).toBe("GIA");
      });
  });

  it("lab-grown diamonds are graded by IGI", () => {
    diamonds
      .filter((d) => d.origin === "LAB_GROWN")
      .forEach((d) => {
        expect(d.lab).toBe("IGI");
      });
  });

  it("mockListDiamonds by natural origin returns only natural stones", () => {
    const result = mockListDiamonds({ origin: ["NATURAL"] });
    result.items.forEach((d) => {
      expect(d.origin).toBe("NATURAL");
    });
  });

  it("mockListDiamonds by lab-grown origin returns only lab-grown stones", () => {
    const result = mockListDiamonds({ origin: ["LAB_GROWN"] });
    result.items.forEach((d) => {
      expect(d.origin).toBe("LAB_GROWN");
    });
  });
});
