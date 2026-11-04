import { Suspense } from "react";
import { AdminReturnDetail } from "@/components/admin/AdminReturnDetail";

async function AdminReturnDetailsContent({ params }: Pick<PageProps<"/admin/returns/[id]">, "params">) {
  const { id } = await params;
  return <AdminReturnDetail returnId={id} />;
}

export default function AdminReturnDetailsPage({ params }: PageProps<"/admin/returns/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate">Loading return…</p>}>
      <AdminReturnDetailsContent params={params} />
    </Suspense>
  );
}
