import { describe, expect, it } from "vitest";
import { parseStoreFilters, storeQueryHref } from "@/lib/store-query";

describe("store API query parameters", () => {
  it("maps documented filters and category slugs, turning rupees into paise", () => {
    expect(
      parseStoreFilters(
        { q: "  shirt  ", minPrice: "500", maxPrice: "1000", sort: "newest", page: "2", size: "30" },
        "clothing",
      ),
    ).toEqual({
      q: "shirt",
      category: "clothing",
      minPrice: 50000,
      maxPrice: 100000,
      sort: "newest",
      page: 2,
      size: 30,
    });
  });

  it("defaults invalid values and caps page size at the API maximum", () => {
    expect(parseStoreFilters({ minPrice: "-1", page: "-1", size: "100", sort: "price_asc" })).toEqual({
      sort: "name",
      page: 0,
      size: 50,
    });
  });

  it("preserves active filters when creating pagination links", () => {
    expect(storeQueryHref("/shop/clothing", {
      category: "clothing",
      q: "shirt",
      minPrice: 50000,
      sort: "newest",
      size: 20,
    }, 1)).toBe("/shop/clothing?q=shirt&minPrice=500&sort=newest&page=1&size=20");
  });
});
