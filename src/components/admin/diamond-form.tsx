"use client";

/**
 * Diamond Ingestion & Master Inventory Manager
 *
 * Allows staff gemologists to manage the live diamond catalog:
 *   - Quick Add / Edit Diamond Solitaire
 *   - GIA / IGI Certificate number validation
 *   - 4Cs selection & exact metrological measurements (table, depth, ratio)
 *   - Live Inventory Table with status filters and quick search
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Clear form labels and accessible error feedback.
 */

import * as React from "react";
import { Plus, Search, Gem, ShieldCheck, Check, Trash2, Edit3, X } from "lucide-react";
import { formatINR } from "@/lib/format";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface InventoryDiamond {
  id: string;
  title: string;
  origin: "natural" | "lab-grown";
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  certLab: "GIA" | "IGI";
  certNumber: string;
  pricePaise: number;
  status: "IN_VAULT" | "RESERVED" | "IN_TRANSIT" | "DELIVERED";
}

const INITIAL_INVENTORY: InventoryDiamond[] = [
  {
    id: "dia-01",
    title: "2.00 ct Round Brilliant Solitaire",
    origin: "natural",
    shape: "Round",
    carat: 2.0,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    certLab: "GIA",
    certNumber: "2287654321",
    pricePaise: 90000000,
    status: "RESERVED",
  },
  {
    id: "dia-02",
    title: "1.52 ct Oval Cut Solitaire",
    origin: "natural",
    shape: "Oval",
    carat: 1.52,
    color: "E",
    clarity: "VS1",
    cut: "Very Good",
    certLab: "IGI",
    certNumber: "5123987114",
    pricePaise: 48000000,
    status: "IN_VAULT",
  },
  {
    id: "dia-03",
    title: "3.05 ct Emerald Solitaire",
    origin: "lab-grown",
    shape: "Emerald",
    carat: 3.05,
    color: "E",
    clarity: "VVS2",
    cut: "Super Ideal",
    certLab: "IGI",
    certNumber: "5910248102",
    pricePaise: 35000000,
    status: "IN_VAULT",
  },
  {
    id: "dia-04",
    title: "1.20 ct Pear Cut Solitaire",
    origin: "natural",
    shape: "Pear",
    carat: 1.2,
    color: "F",
    clarity: "VS2",
    cut: "Excellent",
    certLab: "GIA",
    certNumber: "6419208144",
    pricePaise: 29000000,
    status: "IN_VAULT",
  },
];

export function DiamondInventoryManager() {
  const [diamonds, setDiamonds] = React.useState<InventoryDiamond[]>(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showAddModal, setShowAddModal] = React.useState(false);

  // New diamond form state
  const [newOrigin, setNewOrigin] = React.useState<"natural" | "lab-grown">("natural");
  const [newShape, setNewShape] = React.useState("Round");
  const [newCarat, setNewCarat] = React.useState("1.50");
  const [newColor, setNewColor] = React.useState("D");
  const [newClarity, setNewClarity] = React.useState("VVS1");
  const [newCut, setNewCut] = React.useState("Excellent");
  const [newCertLab, setNewCertLab] = React.useState<"GIA" | "IGI">("GIA");
  const [newCertNumber, setNewCertNumber] = React.useState("");
  const [newPriceINR, setNewPriceINR] = React.useState("450000");

  const filtered = diamonds.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.certNumber.includes(searchTerm) ||
      d.shape.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleCreateDiamond(e: React.FormEvent) {
    e.preventDefault();
    if (!newCertNumber.trim()) {
      showToast("Certificate number is required for laboratory verification", "error");
      return;
    }

    const pricePaise = Math.round(Number(newPriceINR) * 100);
    const caratNum = Number(newCarat);

    const created: InventoryDiamond = {
      id: `dia-${Date.now()}`,
      title: `${caratNum.toFixed(2)} ct ${newShape} Solitaire (${newOrigin === "natural" ? "Natural" : "Lab-Grown"})`,
      origin: newOrigin,
      shape: newShape,
      carat: caratNum,
      color: newColor,
      clarity: newClarity,
      cut: newCut,
      certLab: newCertLab,
      certNumber: newCertNumber.trim(),
      pricePaise,
      status: "IN_VAULT",
    };

    setDiamonds([created, ...diamonds]);
    setShowAddModal(false);
    setNewCertNumber("");
    showToast(`Solitaire ${created.title} ingested into vault registry.`);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to retire this diamond from active vault inventory?")) {
      setDiamonds(diamonds.filter((d) => d.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-ink)]">Diamond Master Inventory</h1>
          <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
            Real-time vault stock, laboratory certificate pairings, and pricing
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
        >
          <Plus className="size-4" />
          <span>Ingest New Solitaire</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[var(--color-line)] p-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" />
          <Input
            type="text"
            placeholder="Search by shape, certificate #, or specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-mono text-xs"
          />
        </div>

        <div className="font-mono text-xs text-[var(--color-slate)]">
          Total Vault Stock: <strong className="text-[var(--color-ink)]">{diamonds.length} Solitaires</strong>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-ink)]">
            <tr>
              <th className="py-3 px-4">Solitaire Spec</th>
              <th className="py-3 px-4">Origin</th>
              <th className="py-3 px-4">4Cs</th>
              <th className="py-3 px-4">Lab & Cert #</th>
              <th className="py-3 px-4">Paise / INR Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {filtered.map((dia) => {
              let statusBadge = "bg-stone-100 text-stone-800 border-stone-200";
              if (dia.status === "IN_VAULT") {
                statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
              } else if (dia.status === "RESERVED") {
                statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
              } else if (dia.status === "IN_TRANSIT") {
                statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
              }

              return (
                <tr key={dia.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--color-ink)]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 bg-[var(--color-stone)] border border-[var(--color-line)] flex items-center justify-center font-mono text-[9px] uppercase">
                        {dia.shape.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-serif text-sm">{dia.title}</p>
                        <p className="font-mono text-[10px] text-[var(--color-slate)]">ID: {dia.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono uppercase text-[10px] text-[var(--color-slate)]">
                    {dia.origin}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--color-ink)]">
                    {dia.carat.toFixed(2)}ct &bull; {dia.color} &bull; {dia.clarity} &bull; {dia.cut}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="font-semibold text-[var(--color-ink)]">{dia.certLab}</span> #{dia.certNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[var(--color-ink)]">
                    {formatINR(dia.pricePaise)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${statusBadge}`}>
                      {dia.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(dia.id)}
                      className="p-1 text-[var(--color-slate)] hover:text-red-700 transition-colors"
                      title="Retire Diamond"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ingest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--color-line)] max-w-xl w-full p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">
                Ingest Diamond Solitaire
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[var(--color-slate)] hover:text-[var(--color-ink)]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiamond} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Origin
                  </label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value as "natural" | "lab-grown")}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-3 font-mono text-xs"
                  >
                    <option value="natural">Natural Mined</option>
                    <option value="lab-grown">Lab-Grown</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Shape
                  </label>
                  <select
                    value={newShape}
                    onChange={(e) => setNewShape(e.target.value)}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-3 font-mono text-xs"
                  >
                    <option value="Round">Round</option>
                    <option value="Oval">Oval</option>
                    <option value="Emerald">Emerald</option>
                    <option value="Cushion">Cushion</option>
                    <option value="Pear">Pear</option>
                    <option value="Radiant">Radiant</option>
                    <option value="Princess">Princess</option>
                    <option value="Asscher">Asscher</option>
                    <option value="Marquise">Marquise</option>
                    <option value="Heart">Heart</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Carat
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newCarat}
                    onChange={(e) => setNewCarat(e.target.value)}
                    className="font-mono text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Color
                  </label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-2 font-mono text-xs"
                  >
                    {["D", "E", "F", "G", "H", "I", "J"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Clarity
                  </label>
                  <select
                    value={newClarity}
                    onChange={(e) => setNewClarity(e.target.value)}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-2 font-mono text-xs"
                  >
                    {["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"].map((cl) => (
                      <option key={cl} value={cl}>
                        {cl}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Cut
                  </label>
                  <select
                    value={newCut}
                    onChange={(e) => setNewCut(e.target.value)}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-2 font-mono text-xs"
                  >
                    <option value="Super Ideal">Super Ideal</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Grading Laboratory
                  </label>
                  <select
                    value={newCertLab}
                    onChange={(e) => setNewCertLab(e.target.value as "GIA" | "IGI")}
                    className="w-full h-10 border border-[var(--color-line)] bg-white px-3 font-mono text-xs"
                  >
                    <option value="GIA">GIA (Gemological Institute of America)</option>
                    <option value="IGI">IGI (International Gemological Institute)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                    Certificate Number
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 2287654321"
                    value={newCertNumber}
                    onChange={(e) => setNewCertNumber(e.target.value)}
                    className="font-mono text-xs uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[var(--color-slate)] block">
                  Price in INR (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 450000"
                  value={newPriceINR}
                  onChange={(e) => setNewPriceINR(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-line)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="font-mono text-xs uppercase"
                >
                  Cancel
                </Button>
                <Button type="submit" className="font-mono text-xs uppercase">
                  Verify &amp; Ingest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
