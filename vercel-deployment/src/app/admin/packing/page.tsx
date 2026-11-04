import * as React from "react";
import type { Metadata } from "next";
import { PackingDesk } from "@/components/admin/packing-desk";

export const metadata: Metadata = {
  title: "Packing Desk & Fulfilment | Operations | Keian Luxandor",
  description: "Check each diamond against its report, pack it and send it.",
};

export default function AdminPackingPage() {
  return <PackingDesk />;
}
