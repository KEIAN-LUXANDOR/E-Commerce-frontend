import { Suspense } from "react";
import { DiamondForm } from "@/components/admin/diamond-form";

async function EditDiamondContent({ params }: Pick<PageProps<"/admin/diamonds/[id]">, "params">) {
  const { id } = await params;
  return <DiamondForm productId={id} />;
}

export default function EditDiamondPage({ params }: PageProps<"/admin/diamonds/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate">Loading diamond…</p>}>
      <EditDiamondContent params={params} />
    </Suspense>
  );
}
