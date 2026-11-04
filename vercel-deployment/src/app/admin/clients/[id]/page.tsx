import { Suspense } from "react";
import { AdminClientDetail } from "@/components/admin/AdminClientDetail";

async function AdminClientDetailsContent({ params }: Pick<PageProps<"/admin/clients/[id]">, "params">) {
  const { id } = await params;
  return <AdminClientDetail clientId={id} />;
}

export default function AdminClientDetailsPage({ params }: PageProps<"/admin/clients/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate">Loading customer…</p>}>
      <AdminClientDetailsContent params={params} />
    </Suspense>
  );
}
