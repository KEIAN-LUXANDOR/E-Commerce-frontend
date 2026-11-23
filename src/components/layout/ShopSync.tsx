"use client";

import { useEffect } from "react";
import { sessionStore } from "@/lib/session";
import { fetchServerCart } from "@/lib/shop/cart";

export function ShopSync() {
  const session = sessionStore.useSession();

  useEffect(() => {
    if (session?.status === "authenticated") {
      fetchServerCart();
    }
  }, [session?.status]);

  return null;
}

export default ShopSync;