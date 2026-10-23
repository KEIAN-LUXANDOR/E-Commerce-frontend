import * as React from "react";
import type { Metadata } from "next";
import { DiamondInventoryManager } from "@/components/admin/diamond-form";

export const metadata: Metadata = {
  title: "Inventory Master | Operations | Keian Luxandor",
  description: "Live vault diamond inventory, certificate pairings, and pricing controls.",
};

export default function AdminInventoryPage() {
  return <DiamondInventoryManager />;
}
