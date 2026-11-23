import { Suspense } from "react";
import { redirect } from "next/navigation";
import { originFromSlug } from "@/lib/catalog/labels";

type Props = PageProps<"/shop/[[...category]]">;

export default function LegacyShopPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <LegacyShopRedirect params={params} />
    </Suspense>
  );
}

async function LegacyShopRedirect({ params }: Pick<Props, "params">): Promise<never> {
  const { category } = await params;
  const origin = originFromSlug(category?.[0]);
  if (origin === "NATURAL") return redirect("/diamonds/natural");
  if (origin === "LAB_GROWN") return redirect("/diamonds/lab-grown");
  return redirect("/diamonds");
}
