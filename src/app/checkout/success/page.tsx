import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderDetail } from "@/components/orders/OrderDetail";
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | Keian Luxandor",
  description: "Your loose diamond acquisition has been placed and reserved.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: Pick<PageProps<"/checkout/success">, "searchParams">) {
  return (
    <Suspense fallback={<main className="page py-12"><p role="status" className="text-sm text-slate">Loading order confirmation...</p></main>}>
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
      <main className="page py-12 text-center max-w-xl mx-auto space-y-4">
        <h1 className="font-serif text-3xl font-medium text-ink">No Order Found</h1>
        <p className="text-sm text-slate">Please complete checkout or log in to view active order dossiers.</p>
        <Link href="/diamonds" className="btn btn-primary inline-flex mt-4 text-xs uppercase tracking-widest px-6 py-3">
          Browse Diamonds
        </Link>
      </main>
    );
  }

  return (
    <main className="page space-y-8 py-12 sm:py-16">
      {/* Confirmation Header */}
      <div className="border border-line bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-ok shrink-0" />
          <div>
            <p className="eyebrow">Insured Acquisition Reserved</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
              Order #{orderNumber} Confirmed
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate leading-relaxed max-w-2xl">
          Your certified loose diamond has been removed from public sale and placed in immediate vault custody. Our gemologists are preparing your certificate dossier and tamper-evident packaging.
        </p>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href={`/order-tracking?order=${encodeURIComponent(orderNumber)}`}
            className="btn btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Truck className="size-4" />
            Track Consignment
          </Link>
          <Link
            href={`/account/orders/${encodeURIComponent(orderNumber)}`}
            className="btn btn-secondary text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Package className="size-4" />
            View Account Dossier
          </Link>
        </div>
      </div>

      {/* Live Order Detail View */}
      <OrderDetail id={orderNumber} />
    </main>
  );
}
