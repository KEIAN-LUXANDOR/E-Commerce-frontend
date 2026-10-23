"use client";

/**
 * Privilege Code & Promo Manager
 * Route: /admin/coupons
 *
 * Manage high-value client privilege discounts:
 *   - Code string, discount rate percentage, minimum order threshold
 *   - Usage quota and expiration date
 *   - Active / Revoked status
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 */

import * as React from "react";
import { Tag, Plus, CheckCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/stores";

interface Coupon {
  code: string;
  ratePercent: number;
  minOrderINR: number;
  timesUsed: number;
  maxUses: number;
  expiresOn: string;
  isActive: boolean;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    code: "KEIAN10",
    ratePercent: 10,
    minOrderINR: 500000,
    timesUsed: 14,
    maxUses: 50,
    expiresOn: "2026-12-31",
    isActive: true,
  },
  {
    code: "VIP15",
    ratePercent: 15,
    minOrderINR: 1000000,
    timesUsed: 6,
    maxUses: 20,
    expiresOn: "2026-11-30",
    isActive: true,
  },
  {
    code: "WELCOME5",
    ratePercent: 5,
    minOrderINR: 200000,
    timesUsed: 42,
    maxUses: 100,
    expiresOn: "2027-01-31",
    isActive: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>(INITIAL_COUPONS);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const [code, setCode] = React.useState("");
  const [percent, setPercent] = React.useState("10");
  const [minOrder, setMinOrder] = React.useState("500000");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      ratePercent: Number(percent),
      minOrderINR: Number(minOrder),
      timesUsed: 0,
      maxUses: 50,
      expiresOn: "2026-12-31",
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setShowAddModal(false);
    setCode("");
    showToast(`Privilege code ${newCoupon.code} created.`);
  }

  function handleToggle(codeToToggle: string) {
    setCoupons(
      coupons.map((c) =>
        c.code === codeToToggle ? { ...c, isActive: !c.isActive } : c
      )
    );
    showToast(`Privilege code ${codeToToggle} updated.`);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-ink)]">
            Privilege Codes &amp; Concessions
          </h1>
          <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
            Private client promotional tokens applied during Step 3 of checkout
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
        >
          <Plus className="size-4" />
          <span>New Privilege Code</span>
        </Button>
      </div>

      <div className="border border-[var(--color-line)] bg-white overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-ink)]">
            <tr>
              <th className="py-3 px-4">Privilege Code</th>
              <th className="py-3 px-4">Discount Rate</th>
              <th className="py-3 px-4">Min. Acquisition</th>
              <th className="py-3 px-4">Redemption Quota</th>
              <th className="py-3 px-4">Expiration</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)] font-mono text-xs">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[var(--color-ink)] flex items-center gap-2">
                  <Tag className="size-3.5 text-[var(--color-muted)]" />
                  <span>{c.code}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[var(--color-ink)]">
                  {c.ratePercent}% OFF
                </td>
                <td className="py-3.5 px-4 text-[var(--color-slate)]">
                  ₹{c.minOrderINR.toLocaleString("en-IN")}
                </td>
                <td className="py-3.5 px-4 text-[var(--color-slate)]">
                  {c.timesUsed} / {c.maxUses} used
                </td>
                <td className="py-3.5 px-4 text-[var(--color-slate)]">
                  {c.expiresOn}
                </td>
                <td className="py-3.5 px-4">
                  {c.isActive ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 text-[10px] uppercase">
                      Disabled
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggle(c.code)}
                    className="text-xs uppercase underline text-[var(--color-ink)] hover:text-[var(--color-slate)]"
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--color-line)] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <h3 className="font-serif text-xl text-[var(--color-ink)]">
                Create Privilege Code
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[var(--color-slate)] hover:text-[var(--color-ink)]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                  Code
                </label>
                <Input
                  type="text"
                  placeholder="e.g. VIP20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-xs uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                  Discount Percentage (%)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                  Minimum Order (₹)
                </label>
                <Input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-line)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="font-mono text-xs uppercase"
                >
                  Cancel
                </Button>
                <Button type="submit" className="font-mono text-xs uppercase">
                  Issue Privilege Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
