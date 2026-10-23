import * as React from "react";
import type { Metadata } from "next";
import { PackingDesk } from "@/components/admin/packing-desk";

export const metadata: Metadata = {
  title: "Packing Desk & Fulfilment | Operations | Keian Luxandor",
  description: "Forensic diamond inspection, certificate enclosure, and armoured transport dispatch.",
};

export default function AdminPackingPage() {
  return <PackingDesk />;
}
