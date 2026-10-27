"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  
  const handleContact = () => {
    // Corrected to object format
    showToast("Opening mail client...", { tone: "default" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <User className="h-6 w-6" />
          Client Profile
        </h1>
        <button
          onClick={handleContact}
          className="inline-flex items-center justify-center bg-ink px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          <Mail className="mr-2 h-4 w-4" /> Email Client
        </button>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <p>Client details for ID: {params.id}</p>
      </div>
    </div>
  );
}