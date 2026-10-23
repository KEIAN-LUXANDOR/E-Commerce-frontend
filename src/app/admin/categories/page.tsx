"use client";

import * as React from "react";
import { useState } from "react";
import { SHAPES } from "@/lib/catalog-labels";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { showToast } from "@/lib/stores";
import { Layers, ArrowUpDown, Eye, Check } from "lucide-react";
import type { Shape } from "@/lib/types/catalog";

interface SilhouetteRow {
  shape: Shape;
  name: string;
  slug: string;
  facets: number;
  sortOrder: number;
  inventoryCount: number;
  visible: boolean;
}

const INITIAL_TAXONOMY: SilhouetteRow[] = [
  { shape: "ROUND", name: "Round Brilliant", slug: "round", facets: 57, sortOrder: 1, inventoryCount: 24, visible: true },
  { shape: "OVAL", name: "Oval Brilliant", slug: "oval", facets: 58, sortOrder: 2, inventoryCount: 16, visible: true },
  { shape: "EMERALD", name: "Emerald Cut", slug: "emerald", facets: 57, sortOrder: 3, inventoryCount: 9, visible: true },
  { shape: "CUSHION", name: "Cushion Modified", slug: "cushion", facets: 58, sortOrder: 4, inventoryCount: 5, visible: true },
  { shape: "RADIANT", name: "Radiant Cut", slug: "radiant", facets: 70, sortOrder: 5, inventoryCount: 4, visible: true },
  { shape: "PEAR", name: "Pear Shape", slug: "pear", facets: 58, sortOrder: 6, inventoryCount: 3, visible: true },
  { shape: "PRINCESS", name: "Princess Cut", slug: "princess", facets: 76, sortOrder: 7, inventoryCount: 2, visible: true },
  { shape: "MARQUISE", name: "Marquise Cut", slug: "marquise", facets: 58, sortOrder: 8, inventoryCount: 1, visible: true },
  { shape: "ASSCHER", name: "Asscher Cut", slug: "asscher", facets: 58, sortOrder: 9, inventoryCount: 1, visible: true },
  { shape: "HEART", name: "Heart Shape", slug: "heart", facets: 59, sortOrder: 10, inventoryCount: 0, visible: true },
];

export default function AdminCategoriesPage() {
  const [taxonomy, setTaxonomy] = useState(INITIAL_TAXONOMY);

  const toggleVisibility = (shape: Shape) => {
    setTaxonomy((prev) =>
      prev.map((row) => (row.shape === shape ? { ...row, visible: !row.visible } : row))
    );
    showToast("Silhouette hierarchy visibility updated.", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
          Taxonomy Architecture
        </span>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
          Categories &amp; Silhouette Hierarchy
        </h1>
        <p className="text-xs text-[var(--color-slate)] mt-1">
          Configure loose diamond shape ordering, facet metadata, and storefront category filter prioritization.
        </p>
      </div>

      {/* Silhouette Matrix */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto shadow-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] text-[var(--color-slate)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Silhouette Icon</th>
              <th className="py-3 px-4">Shape Nomenclature</th>
              <th className="py-3 px-4">Category URL Slug</th>
              <th className="py-3 px-4">Facet Count</th>
              <th className="py-3 px-4">Vault Count</th>
              <th className="py-3 px-4">Storefront Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {taxonomy.map((row) => (
              <tr key={row.shape} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--color-ink)]">
                  #{row.sortOrder}
                </td>
                <td className="py-3 px-4">
                  <div className="size-8 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-ink)]">
                    <ShapeIcon shape={row.shape} className="size-5" />
                  </div>
                </td>
                <td className="py-3 px-4 font-serif font-medium text-sm text-[var(--color-ink)]">
                  {row.name}
                </td>
                <td className="py-3 px-4 text-[var(--color-slate)]">
                  /diamonds?shape={row.slug}
                </td>
                <td className="py-3 px-4">
                  {row.facets} facets
                </td>
                <td className="py-3 px-4 font-semibold text-[var(--color-ink)]">
                  {row.inventoryCount} stones
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                      row.visible ? "bg-[#e7f0eb] text-[#2f6b4f]" : "bg-[var(--color-stone)] text-[var(--color-muted)]"
                    }`}
                  >
                    {row.visible ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(row.shape)}
                    className="border border-[var(--color-line)] bg-white px-3 py-1 text-[11px] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
                  >
                    {row.visible ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
