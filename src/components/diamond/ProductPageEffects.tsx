"use client";

import { useEffect } from "react";
import { rememberViewed, setWhatsAppMessage } from "@/lib/stores";
import type { Product } from "@/lib/types/product";

/** On the diamond page: remembers it for "Recently viewed" and pre-fills the WhatsApp message. */
export function ProductPageEffects({ product }: { product: Product }) {
  useEffect(() => {
    rememberViewed(product);
    setWhatsAppMessage(`Hello Keian Luxandor, I'm interested in the ${product.name} (${window.location.href}).`);
    return () => setWhatsAppMessage(undefined);
  }, [product]);
  return null;
}
