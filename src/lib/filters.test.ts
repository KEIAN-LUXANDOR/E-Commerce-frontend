import { describe, expect, it } from "vitest";
import { activeChips, buildHref, parseFilters, withFilters } from "@/lib/filters";
import { formatINR } from "@/lib/format";

describe("URL filters", () => {
  it("reads valid values and ignores unknown ones", () => {
    const f = parseFilters({ shape: "round,oval,hexagon", origin: "lab-grown", carat: "0.5-1.5", page: "2" });
    expect(f.shape).toEqual(["ROUND", "OVAL"]);
    expect(f.origin).toEqual(["LAB_GROWN"]);
    expect(f.caratMin).toBe(0.5);
    expect(f.caratMax).toBe(1.5);
    expect(f.page).toBe(2);
  });

  it("writes filters back to the same URL", () => {
    const href = buildHref("/shop/natural", { shape: ["ROUND"], fluorescence: ["NONE"], sort: "price_asc", view: "list" });
    expect(href).toBe("/shop/natural?shape=round&fluorescence=none&sort=price_asc&view=list");
  });

  it("goes back to page 1 when a filter changes", () => {
    expect(withFilters({ page: 3, shape: ["ROUND"] }, { shape: [] })).toEqual({});
  });

  it("builds a removable chip per value", () => {
    const chips = activeChips({ color: ["D", "E"] });
    expect(chips.map((c) => c.label)).toEqual(["D", "E"]);
    expect(chips[0].without.color).toEqual(["E"]);
  });
});

describe("money", () => {
  it("formats paise as Indian rupees", () => {
    expect(formatINR(12500000)).toBe("₹1,25,000");
  });
});
