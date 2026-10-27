"use client";

import { useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function CategoriesPage() {
  const handleAdd = () => {
    // Corrected to object format
    showToast("Category creation coming soon.", { tone: "default" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <FolderTree className="h-6 w-6" />
          Categories
        </h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center bg-ink px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <p>No categories configured yet.</p>
      </div>
    </div>
  );
}