"use client";

import { useEffect } from "react";

export function ProductPageEffects({ product }: { product: any }) {
  useEffect(() => {
    if (!product || !product.id) return;
    try {
      const recent = JSON.parse(localStorage.getItem("recent_diamonds") || "[]");
      const updated = [product, ...recent.filter((p: any) => p.id !== product.id)].slice(0, 10);
      localStorage.setItem("recent_diamonds", JSON.stringify(updated));
    } catch (e) {}
  }, [product]);

  return null;
}

export default ProductPageEffects;