import { Suspense } from "react";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";

async function AdminOrderDetailsContent({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  const { id } = await params;
  return <AdminOrderDetail orderNumber={id} />;
}

export default function AdminOrderDetailsPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate">Loading order…</p>}>
      <AdminOrderDetailsContent params={params} />
    </Suspense>
  );
}
