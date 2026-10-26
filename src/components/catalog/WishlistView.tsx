"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { fetchProductsBySlug } from "@/lib/api/products-browser";
import { getWishlist } from "@/lib/api/wishlist";
import { useSession } from "@/lib/session";
import { useGuestWishlist, useWishlist } from "@/lib/shop/wishlist";
import type { Product } from "@/lib/types/product";

/**
 * Logged in: the account's saved diamonds (GET /account/wishlist).
 * Guest: the diamonds saved in this browser, loaded live from the catalogue.
 */
export function WishlistView() {
  const session = useSession();
  const saved = useWishlist();
  const guest = useGuestWishlist();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string>();

  const signedIn = session.status === "user";
  const guestKey = guest.map((g) => g.slug).join(",");
  // Reload when the saved set changes (e.g. guest hearts moved into the account after login)
  const savedKey = saved.ids.join(",");

  useEffect(() => {
    if (session.status === "loading") return;
    const ctrl = new AbortController();
    let load: Promise<Product[]> = Promise.resolve([]);
    if (signedIn) load = getWishlist().then((list) => list.map((e) => e.product));
    else if (guestKey) load = fetchProductsBySlug(guestKey.split(","), ctrl.signal);
    load.then(setProducts).catch((e: unknown) => {
      if ((e as Error).name !== "AbortError") setError("We couldn’t load your saved diamonds. Please try again in a minute.");
    });
    return () => ctrl.abort();
  }, [session.status, signedIn, guestKey, savedKey]);

  if (error) return <p className="mt-10 text-out">{error}</p>;
  if (!products) return <Spinner className="mt-10" label="Loading saved diamonds" />;

  // Hide anything un-saved since the list loaded
  const visible = products.filter((p) => saved.ids.includes(p.id));

  if (visible.length === 0) {
    return (
      <EmptyState className="mt-10" icon={<Heart className="size-8" />} title="No saved diamonds yet" action={{ label: "Browse diamonds", href: "/diamonds" }}>
        Tap the heart on any diamond to keep it here.
      </EmptyState>
    );
  }

  return (
    <div className="mt-8">
      {!signedIn && (
        <p className="mb-6 border border-line bg-stone px-4 py-3 text-sm">
          These are saved on this device only.{" "}
          <Link href="/login?next=/wishlist" className="link">
            Log in
          </Link>{" "}
          to keep them in your account and see them on any device.
        </p>
      )}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
