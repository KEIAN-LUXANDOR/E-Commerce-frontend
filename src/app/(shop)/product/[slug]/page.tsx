import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Diamond | Keian Luxandor",
};

type Props = PageProps<"/product/[slug]">;

export default async function LegacyProductPage({ params }: Props) {
  const { slug } = await params;

  redirect(`/diamond/${encodeURIComponent(slug)}`);
}