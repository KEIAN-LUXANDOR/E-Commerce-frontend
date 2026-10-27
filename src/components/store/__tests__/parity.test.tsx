import { describe, expect, it } from "vitest";
import { parseShopParams, toShopSearch } from "@/lib/catalog/query";

describe("catalogue URL parity", () => {
  it("preserves supported filters and view when building a navigation link", () => {
    const original = parseShopParams({
      shape: "oval,pear",
      color: "D,E",
      minCarat: "1",
      page: "3",
      view: "list",
    });
    const search = toShopSearch(original.query, original.view);
    const restored = parseShopParams(Object.fromEntries(new URLSearchParams(search)));

    expect(restored.query.shape).toEqual(["OVAL", "PEAR"]);
    expect(restored.query.color).toEqual(["D", "E"]);
    expect(restored.query.page).toBe(2);
    expect(restored.view).toBe("list");
  });
});
