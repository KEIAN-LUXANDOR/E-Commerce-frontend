"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/shop/wishlist";
import { getWishlist } from "@/lib/api/wishlist";
import { fetchProducts } from "@/lib/api/products-browser";
import { productHref } from "@/lib/catalog/product";
import { sessionStore } from "@/lib/session";
import type { Product } from "@/lib/types/product";

export function WishlistView() {
  const { ids, toggle } = useWishlist();
  const session = sessionStore.useSession();
  const [loaded, setLoaded] = useState<{ key: string; products: Product[]; error?: string }>();
  const key = `${session.status}:${ids.join(",")}`;

  useEffect(() => {
    if (session.status === "loading" || !ids.length) return;
    let active = true;

    const load = async () => {
      try {
        if (session.status === "authenticated") {
          const entries = await getWishlist();
          if (active) setLoaded({ key, products: entries.map(({ product }) => product) });
          return;
        }

        const firstPage = await fetchProducts({ page: 0, size: 50 });
        const pages = await Promise.all(
          Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
            fetchProducts({ page: index + 1, size: 50 }),
          ),
        );
        if (active) setLoaded({ key, products: [firstPage, ...pages].flatMap((page) => page.items) });
      } catch (cause) {
        if (active) setLoaded({
          key,
          products: [],
          error: cause instanceof Error ? cause.message : "Could not load saved diamonds.",
        });
      }
    };

    void load();
    return () => { active = false; };
    // `key` already encodes the saved ids and who is logged in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!ids || ids.length === 0) {
    return (
      <div className="border border-line bg-surface p-12 text-center">
        <p className="font-serif text-xl">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-slate">Save diamonds with the heart icon to view them later.</p>
        <Link href="/diamonds" className="btn btn-primary mt-6 inline-block">
          Explore Diamonds
        </Link>
      </div>
    );
  }

  if (session.status === "loading" || loaded?.key !== key) {
    return <p role="status" className="text-sm text-slate">Loading saved diamonds…</p>;
  }
  if (loaded.error) return <p role="alert" className="text-sm text-out">{loaded.error}</p>;

  return (
    <div className="space-y-4">
      {ids.map((id) => {
        const product = loaded.products.find((item) => item.id === id);
        return (
          <div key={id} className="flex items-center justify-between border border-line p-4 bg-surface">
            {product ? (
              <Link href={productHref(product.slug)} className="text-sm font-medium text-ink hover:underline">
                {product.name}
              </Link>
            ) : (
              <span className="text-sm text-slate">Diamond no longer available</span>
            )}
            <button 
              onClick={() => toggle(id, "remove")} 
              className="text-out hover:opacity-80 p-2 transition-opacity"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}