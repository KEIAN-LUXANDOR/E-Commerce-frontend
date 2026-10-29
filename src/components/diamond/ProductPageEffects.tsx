"use client";

import { useEffect } from "react";

import type { Product } from "@/lib/types/product";

export function ProductPageEffects({ product }: { product: Product }) {
  useEffect(() => {
    if (!product || !product.id) return;
    try {
      const recent = JSON.parse(localStorage.getItem("recent_diamonds") || "[]");
      const updated = [product, ...recent.filter((p: Product) => p.id !== product.id)].slice(0, 10);
      localStorage.setItem("recent_diamonds", JSON.stringify(updated));
    } catch {
      // Browser storage unavailable (private mode): skip "recently viewed"
    }
    // Run once per diamond, not on every product object change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return null;
}

export default ProductPageEffects;