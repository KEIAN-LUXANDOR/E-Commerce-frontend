import type { Metadata } from "next";
import { CompareView } from "@/components/catalog/CompareView";

export const metadata: Metadata = {
  title: "Compare Diamonds | Keian Luxandor",
  description: "Compare certified diamonds side by side.",
};

export default function ComparePage() {
  return (
    <div className="page pb-16 pt-8">
      <h1 className="text-4xl sm:text-5xl">Compare diamonds</h1>
      <CompareView />
    </div>
  );
}
