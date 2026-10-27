import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = {
  title: "Order status | Keian Luxandor",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: Pick<PageProps<"/checkout/success">, "searchParams">) {
  return (
    <Suspense fallback={<main className="page py-12"><p role="status">Loading order status…</p></main>}>
      <CheckoutStatus searchParams={searchParams} />
    </Suspense>
  );
}

async function CheckoutStatus({
  searchParams,
}: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const params = await searchParams;
  const orderNumber = Array.isArray(params.order) ? params.order[0] : params.order;

  if (!orderNumber) {
    return (
      <main className="page py-12">
        <h1 className="text-3xl">No order to show</h1>
        <p className="mt-3 text-sm text-slate">Place an order to see its current status.</p>
        <Link href="/diamonds" className="btn btn-primary mt-5">Browse diamonds</Link>
      </main>
    );
  }

  return (
    <main className="page space-y-5 py-12">
      <h1 className="text-3xl">Order reserved</h1>
      <p className="text-sm text-slate">
        Your order is awaiting payment. Payment is not confirmed until the backend payment service is available.
      </p>
      <OrderDetail id={orderNumber} />
    </main>
  );
}
