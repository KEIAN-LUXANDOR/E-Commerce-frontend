"use client";

import * as React from "react";
import { useState } from "react";
import { showToast } from "@/lib/stores";
import { Settings, ShieldCheck, Truck, Save, Key, FileCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [gstin, setGstin] = useState("24AAACK1234F1Z8");
  const [hsnCode, setHsnCode] = useState("7102");
  const [gstRate, setGstRate] = useState("0.25%");
  const [sequelKey, setSequelKey] = useState("seql_live_sec_9918237410928");
  const [malcaKey, setMalcaKey] = useState("malca_vault_gateway_88129304");
  const [maxEscortLimit, setMaxEscortLimit] = useState("₹50,00,000");
  const [autoAwb, setAutoAwb] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Store settings and tax HSN configurations saved successfully.", "info");
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
          System Administration
        </span>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
          Store Settings &amp; Tax HSN Configuration
        </h1>
        <p className="text-xs text-[var(--color-slate)] mt-1">
          Central tax compliance parameters, courier API credentials, and institutional security thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: GST & Tax Codes */}
        <div className="border border-[var(--color-line)] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
            <div className="size-8 bg-[var(--color-stone)] border border-[var(--color-line)] grid place-items-center text-[var(--color-ink)]">
              <FileCheck className="size-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Statutory GST &amp; HSN Nomenclature
              </h2>
              <p className="text-xs text-[var(--color-slate)]">
                Applies to all loose diamond invoices and transit e-way bills
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                HSN Code (Loose Diamonds)
              </label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--color-muted)] font-mono mt-1 block">
                7102: Diamonds, worked, but unmounted
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                Registered GSTIN
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--color-muted)] font-mono mt-1 block">
                Gujarat / Maharashtra Principal Hub
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                Statutory GST Rate
              </label>
              <input
                type="text"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--color-muted)] font-mono mt-1 block">
                0.25% loose diamonds / 3% jewelry
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Armoured Courier Gateways */}
        <div className="border border-[var(--color-line)] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
            <div className="size-8 bg-[var(--color-stone)] border border-[var(--color-line)] grid place-items-center text-[var(--color-ink)]">
              <Truck className="size-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Carrier API Credentials &amp; Logistics Keys
              </h2>
              <p className="text-xs text-[var(--color-slate)]">
                Secured encrypted bridges for automated manifest creation and AWB assignment
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                Sequel Logistics Production API Token
              </label>
              <input
                type="password"
                value={sequelKey}
                onChange={(e) => setSequelKey(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                Malca-Amit Vault Gateway Secret
              </label>
              <input
                type="password"
                value={malcaKey}
                onChange={(e) => setMalcaKey(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="autoAwb"
              checked={autoAwb}
              onChange={(e) => setAutoAwb(e.target.checked)}
              className="size-4 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)]"
            />
            <label htmlFor="autoAwb" className="text-xs font-mono text-[var(--color-ink)] cursor-pointer">
              Automatically generate carrier AWB upon completion of 4-point packing checklist.
            </label>
          </div>
        </div>

        {/* Section 3: Risk Thresholds */}
        <div className="border border-[var(--color-line)] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
            <div className="size-8 bg-[var(--color-stone)] border border-[var(--color-line)] grid place-items-center text-[var(--color-ink)]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Security &amp; Armoured Escort Limits
              </h2>
              <p className="text-xs text-[var(--color-slate)]">
                Automatic dispatch escalation parameters
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
                Maximum Single Parcel Courier Liability Limit
              </label>
              <input
                type="text"
                value={maxEscortLimit}
                onChange={(e) => setMaxEscortLimit(e.target.value)}
                className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--color-muted)] font-mono mt-1 block">
                Orders above this limit mandate dedicated dual-guard armoured vehicle escort.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[var(--color-ink)] text-white px-8 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[var(--color-loupe)] transition-colors disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
