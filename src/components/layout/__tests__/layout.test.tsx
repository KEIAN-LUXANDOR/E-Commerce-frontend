import { describe, expect, it } from "vitest";
import { productHref } from "@/lib/catalog/product";

describe("store navigation", () => {
  it("builds a safe product URL from its slug", () => {
    expect(productHref("oval-diamond")).toBe("/diamond/oval-diamond");
    expect(productHref("stone/one")).toBe("/diamond/stone%2Fone");
  });
});
