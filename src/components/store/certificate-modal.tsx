"use client";

/**
 * certificate-modal.tsx
 *
 * Full-page GIA / IGI certificate viewer.
 * Opens as a centre Dialog panel showing:
 *   1. An embedded PDF viewer (when certificateUrl is provided).
 *   2. A fallback info panel showing key grading data when no PDF URL exists
 *      (e.g. during mock/development).
 *
 * Design contract:
 *   - Hairline borders (--color-line), no rounded corners.
 *   - Monospace data labels, serif section headings.
 *   - No nested ternaries.
 */

import * as React from "react";
import { FileText, ExternalLink, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificateLab, CutGrade, DiamondColor, Clarity, Fluorescence } from "@/lib/types/catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  lab: CertificateLab;
  certificateNumber: string;
  certificateUrl?: string;
  // Key grading fields for the fallback panel
  carat: number;
  shape: string;
  color: DiamondColor;
  clarity: Clarity;
  cut: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  tablePct: number;
  depthPct: number;
  lwRatio: number;
  girdle: string;
  culet: string;
  laserInscription: boolean;
  measurements: { lengthMm: number; widthMm: number; depthMm: number };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cutLabel(g: CutGrade): string {
  if (g === "EXCELLENT") return "Excellent";
  if (g === "VERY_GOOD") return "Very Good";
  return "Good";
}

function fluoLabel(f: Fluorescence): string {
  if (f === "NONE") return "None";
  if (f === "FAINT") return "Faint";
  if (f === "MEDIUM") return "Medium";
  return "Strong";
}

// ---------------------------------------------------------------------------
// Sub-component: Grading Row
// ---------------------------------------------------------------------------

function GradeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-[var(--color-line)] last:border-b-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)]">
        {label}
      </span>
      <span className="font-mono text-[13px] font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Fallback Info Panel (no PDF available)
// ---------------------------------------------------------------------------

interface FallbackPanelProps {
  lab: CertificateLab;
  certificateNumber: string;
  carat: number;
  shape: string;
  color: DiamondColor;
  clarity: Clarity;
  cut: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  tablePct: number;
  depthPct: number;
  lwRatio: number;
  girdle: string;
  culet: string;
  laserInscription: boolean;
  measurements: { lengthMm: number; widthMm: number; depthMm: number };
}

function FallbackPanel({
  lab,
  certificateNumber,
  carat,
  shape,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  tablePct,
  depthPct,
  lwRatio,
  girdle,
  culet,
  laserInscription,
  measurements,
}: FallbackPanelProps) {
  const reportUrl =
    lab === "GIA"
      ? `https://www.gia.edu/report-check?reportno=${certificateNumber}`
      : `https://www.igi.org/verify-your-report/?r=${certificateNumber}`;

  const { lengthMm, widthMm, depthMm } = measurements;
  const measurementStr = `${lengthMm} × ${widthMm} × ${depthMm} mm`;

  return (
    <div className="flex flex-col gap-6">
      {/* Certificate Header */}
      <div className="flex items-start gap-4 p-5 bg-[var(--color-stone)] border border-[var(--color-line)]">
        <div className="grid size-12 place-items-center bg-[var(--color-ink)] text-white flex-shrink-0">
          <ShieldCheck className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-slate)] mb-0.5">
            {lab === "GIA" ? "Gemological Institute of America" : "International Gemological Institute"}
          </p>
          <p className="font-serif text-xl text-[var(--color-ink)]">{lab} Grading Report</p>
          <p className="font-mono text-[12px] text-[var(--color-slate)] mt-1">
            Report #{certificateNumber}
          </p>
        </div>
      </div>

      {/* Two-column grading data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
        {/* Left column: 4Cs */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-slate)] mb-3 border-b border-[var(--color-line)] pb-2">
            4Cs Grade
          </p>
          <GradeRow label="Carat Weight" value={`${carat.toFixed(2)} ct`} />
          <GradeRow label="Shape & Cut Style" value={shape} />
          <GradeRow label="Colour Grade" value={color} />
          <GradeRow label="Clarity Grade" value={clarity} />
          <GradeRow label="Cut Grade" value={cutLabel(cut)} />
        </div>

        {/* Right column: Finish & Metrology */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-slate)] mb-3 border-b border-[var(--color-line)] pb-2">
            Finish & Metrology
          </p>
          <GradeRow label="Polish" value={cutLabel(polish)} />
          <GradeRow label="Symmetry" value={cutLabel(symmetry)} />
          <GradeRow label="Fluorescence" value={fluoLabel(fluorescence)} />
          <GradeRow label="Table %" value={`${tablePct}%`} />
          <GradeRow label="Total Depth %" value={`${depthPct}%`} />
        </div>
      </div>

      {/* Proportions strip */}
      <div className="border border-[var(--color-line)] p-4 bg-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-slate)] mb-3">
          Additional Proportions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Measurements", value: measurementStr },
            { label: "L/W Ratio", value: lwRatio.toFixed(2) },
            { label: "Girdle", value: girdle },
            { label: "Culet", value: culet },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {label}
              </span>
              <span className="font-mono text-[11px] text-[var(--color-ink)] break-words">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Laser inscription note */}
      {laserInscription && (
        <div className="flex items-start gap-3 text-[var(--color-slate)]">
          <FileText className="size-3.5 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Report number <span className="font-mono text-[var(--color-ink)]">{certificateNumber}</span> is
            laser-inscribed on the girdle of this stone and can be verified under 10× magnification.
          </p>
        </div>
      )}

      {/* External verify link */}
      <a
        href={reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 self-start border border-[var(--color-ink)] px-4 py-2.5",
          "font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-ink)]",
          "hover:bg-[var(--color-ink)] hover:text-white transition-colors"
        )}
      >
        <ExternalLink className="size-3.5" />
        Verify on {lab === "GIA" ? "GIA.edu" : "IGI.org"}
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component: CertificateModal
// ---------------------------------------------------------------------------

export function CertificateModal({
  open,
  onClose,
  lab,
  certificateNumber,
  certificateUrl,
  carat,
  shape,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  tablePct,
  depthPct,
  lwRatio,
  girdle,
  culet,
  laserInscription,
  measurements,
}: CertificateModalProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Grading Certificate"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-ink)]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex flex-col w-full max-w-3xl max-h-[90vh] bg-white border border-[var(--color-line)] shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="size-4 text-[var(--color-ink)]" />
            <span className="font-serif text-lg text-[var(--color-ink)]">
              {lab} Grading Report
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center text-[var(--color-slate)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="Close certificate viewer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {certificateUrl ? (
            /* Embedded PDF viewer */
            <iframe
              src={`${certificateUrl}#toolbar=1&navpanes=0`}
              title={`${lab} Grading Report ${certificateNumber}`}
              className="w-full border-0"
              style={{ minHeight: "600px" }}
            />
          ) : (
            /* Fallback info panel when no PDF is available */
            <FallbackPanel
              lab={lab}
              certificateNumber={certificateNumber}
              carat={carat}
              shape={shape}
              color={color}
              clarity={clarity}
              cut={cut}
              polish={polish}
              symmetry={symmetry}
              fluorescence={fluorescence}
              tablePct={tablePct}
              depthPct={depthPct}
              lwRatio={lwRatio}
              girdle={girdle}
              culet={culet}
              laserInscription={laserInscription}
              measurements={measurements}
            />
          )}
        </div>
      </div>
    </div>
  );
}
