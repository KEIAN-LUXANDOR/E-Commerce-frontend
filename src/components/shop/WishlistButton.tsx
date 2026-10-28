"use client";

import { SaveButton } from "@/components/product/SaveButton";

export function WishlistButton({ productId }: { productId: string | number }) {
  return <SaveButton productId={String(productId)} />;
}

export default WishlistButton;