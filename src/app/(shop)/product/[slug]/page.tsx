import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Diamond | Keian Luxandor",
};

type Props = PageProps<"/product/[slug]">;

export default function LegacyProductPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <LegacyProductRedirect params={params} />
    </Suspense>
  );
}

async function LegacyProductRedirect({ params }: Pick<Props, "params">): Promise<never> {
  const { slug } = await params;
  return redirect(`/diamond/${encodeURIComponent(slug)}`);
}
