import type { Metadata } from "next";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = {
  title: "Your Cart | Keian Luxandor",
  description: "Review your selected certified diamonds before checkout.",
};

export default function CartPage() {
  return (
    <div className="page pb-16 pt-8">
      <h1 className="text-4xl sm:text-5xl">Your cart</h1>
      <CartView />
    </div>
  );
}
