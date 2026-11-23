import * as React from "react";
import type { Metadata } from "next";
import { CsvWizard } from "@/components/admin/csv-wizard";

export const metadata: Metadata = {
  title: "CSV Bulk Ingestion | Operations | Keian Luxandor",
  description: "Batch diamond solitaire onboarding and GIA/IGI laboratory certificate parser.",
};

export default function AdminImportPage() {
  return <CsvWizard />;
}
