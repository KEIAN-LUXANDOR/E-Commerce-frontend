"use client";

import { useState } from "react";
import { AdminHeader, ErrorNote, NotConnected } from "@/components/admin/AdminBits";
import { isEnabled } from "@/config/features";
import { importProductsCsv } from "@/lib/api/admin";
import type { ImportResult } from "@/lib/types/admin";

export function CsvWizard() {
  const enabled = isEnabled("adminCatalog");
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<ImportResult>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const checkedOk = Boolean(result?.dryRun && result.errors.length === 0);

  async function runImport(dryRun: boolean) {
    if (!file || !enabled) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Choose a .csv file. Save spreadsheets as CSV before importing.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const response = await importProductsCsv(file, dryRun);
      setResult(response);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "CSV import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Import diamonds from CSV" description="Validate the file before importing rows." back={{ href: "/admin/inventory", label: "Inventory" }} />
      {!enabled && <NotConnected feature="adminCatalog" endpoints={["POST /api/v1/admin/products/import"]} />}
      {error && <ErrorNote message={error} />}
      <section className="space-y-4 border border-line bg-white p-5">
        <label className="block space-y-2 text-sm font-medium">
          CSV file
          <input type="file" accept=".csv,text/csv" disabled={!enabled || busy} onChange={(e) => { setFile(e.target.files?.[0]); setResult(undefined); setError(undefined); }} className="block w-full text-sm" />
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-secondary" disabled={!enabled || !file || busy} onClick={() => void runImport(true)}>
            {busy ? "Checking..." : "Check file"}
          </button>
          <button type="button" className="btn btn-primary" disabled={!enabled || !file || !checkedOk || busy} onClick={() => void runImport(false)}>
            {busy ? "Importing..." : "Import valid rows"}
          </button>
        </div>
        {result && (
          <div aria-live="polite" className="space-y-3 border-t border-line pt-4 text-sm">
            <p>{result.dryRun ? "Validation complete" : "Import complete"}: {result.rows} rows, {result.created} created, {result.updated} updated.</p>
            {result.errors.length > 0 && (
              <div role="alert">
                <p className="font-medium text-out">{result.errors.length} row errors:</p>
                <ul className="mt-2 list-inside list-disc text-out">
                  {result.errors.map((item, index) => <li key={`${item.row}-${item.field}-${index}`}>Row {item.row}, {item.field}: {item.message}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default CsvWizard;
