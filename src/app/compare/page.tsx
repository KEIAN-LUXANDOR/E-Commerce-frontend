import { Metadata } from "next";
import { DiamondComparison } from "@/components/store/diamond-comparison";

export const metadata: Metadata = {
  title: "Compare Certified Loose Diamonds | Keian Luxandor",
  description:
    "Evaluate certified loose natural and lab-grown diamonds side by side on proportions, cut metrology, and official GIA/IGI laboratory records.",
};

export default function ComparePage() {
  return <DiamondComparison />;
}
