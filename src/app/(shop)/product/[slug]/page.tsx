import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Diamond | Keian Luxandor",
};

type Props = PageProps<"/product/[slug]">;

export default function LegacyProductPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <LegacyProductRedirect {...props} />
    </Suspense>
  );
}

async function LegacyProductRedirect({ params }: Props): Promise<never> {
  const { slug } = await params;

  redirect(`/diamond/${encodeURIComponent(slug)}`);
}