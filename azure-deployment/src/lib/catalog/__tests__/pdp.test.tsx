import { describe, expect, it } from "vitest";
import { compareAtPaise, gradeLine, shortTitle } from "@/lib/catalog/product";
import type { Product } from "@/lib/types/product";

const product: Product = {
  id: "diamond-1",
  slug: "oval-diamond",
  name: "Certified Oval Diamond",
  description: null,
  diamond: {
    origin: "NATURAL",
    shape: "OVAL",
    carat: 1.02,
    color: "F",
    clarity: "VS1",
    cut: "EXCELLENT",
    polish: "EXCELLENT",
    symmetry: "VERY_GOOD",
    fluorescence: "NONE",
    lab: "GIA",
    quickShip: true,
  },
  images: [],
  variants: [{
    id: "variant-1",
    sku: "OVAL-102",
    name: "One diamond",
    pricePaise: 480_000,
    mrpPaise: 500_000,
    inStock: true,
  }],
};

describe("diamond product details", () => {
  it("uses the certified grades and valid crossed-out price", () => {
    expect(shortTitle(product)).toBe("1.02 ct Oval");
    expect(gradeLine(product)).toContain("F colour");
    expect(compareAtPaise(product.variants[0])).toBe(500_000);
    expect(compareAtPaise({ ...product.variants[0], mrpPaise: 470_000 })).toBeNull();
  });
});
