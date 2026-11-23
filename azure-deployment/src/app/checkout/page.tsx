import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Secure Checkout | Keian Luxandor",
  description: "Confirm delivery details and securely place your diamond order.",
};

export default function CheckoutPage() {
  return (
     <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-semibold text-slate-900">
        Checkout
      </h1>

      <CheckoutFlow />
    </main>
  );
}
