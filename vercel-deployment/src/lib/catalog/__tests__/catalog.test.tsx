import { describe, expect, it } from "vitest";
import { parseShopParams, toApiSearch } from "@/lib/catalog/query";

describe("diamond catalogue filters", () => {
  it("normalizes filters and converts rupees and page numbers for the API", () => {
    const state = parseShopParams(
      { shape: "oval,invalid", minPrice: "12500", page: "2", view: "list" },
      "LAB_GROWN",
    );

    expect(state.query).toMatchObject({
      origin: "LAB_GROWN",
      shape: ["OVAL"],
      minPrice: 1_250_000,
      page: 1,
    });
    expect(state.view).toBe("list");
    expect(toApiSearch(state.query)).toContain("minPrice=1250000");
  });
});
