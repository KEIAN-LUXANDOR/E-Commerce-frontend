import { Metadata } from "next";
import { WishlistView } from "@/components/catalog/WishlistView";

export const metadata: Metadata = {
  title: "Your Diamond Wishlist | Keian Luxandor",
  description:
    "Review your curated loose certified diamonds held in your private appraisal vault.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
