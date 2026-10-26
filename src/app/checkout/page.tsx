import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Secure Checkout | Keian Luxandor",
  description: "Confirm delivery details and securely place your diamond order.",
};

export default function CheckoutPage() {
  return (
    <div className="page pb-16 pt-8">
      <h1 className="text-4xl sm:text-5xl">Secure checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
