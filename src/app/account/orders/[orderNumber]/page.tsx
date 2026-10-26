import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage(props: PageProps<"/account/orders/[orderNumber]">) {
  return (
    <Suspense fallback={<div className="skeleton h-64" />}>
      <OrderContent {...props} />
    </Suspense>
  );
}

async function OrderContent({ params }: PageProps<"/account/orders/[orderNumber]">) {
  const { orderNumber } = await params;
  return <OrderDetail orderNumber={decodeURIComponent(orderNumber)} />;
}
