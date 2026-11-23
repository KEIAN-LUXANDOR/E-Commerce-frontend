"use client";

import type { Product } from "@/lib/types/product";

interface CertificateModalProps {
  product: Product;
  onClose: () => void;
}

export function CertificateModal({ product, onClose }: CertificateModalProps) {
  const diamond = product.diamond;
  if (!diamond) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-line bg-surface p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{diamond.lab} grading report</p>
            <h2 id="certificate-title" className="mt-1 text-xl font-medium text-ink">
              {diamond.certificateNumber || "Certificate details"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn btn-secondary" aria-label="Close certificate">
            Close
          </button>
        </div>

        {diamond.certificateUrl ? (
          <iframe
            title={`${diamond.lab} certificate ${diamond.certificateNumber || ""}`}
            src={diamond.certificateUrl}
            className="mt-6 h-[60vh] w-full border border-line"
          />
        ) : (
          <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-line sm:grid-cols-3">
            <Grade label="Shape" value={diamond.shape} />
            <Grade label="Carat" value={`${diamond.carat.toFixed(2)} ct`} />
            <Grade label="Colour" value={diamond.color} />
            <Grade label="Clarity" value={diamond.clarity} />
            <Grade label="Cut" value={diamond.cut ?? "Not graded"} />
            <Grade label="Polish" value={diamond.polish} />
            <Grade label="Symmetry" value={diamond.symmetry} />
            <Grade label="Fluorescence" value={diamond.fluorescence} />
            {diamond.verifyUrl && (
              <div className="col-span-2 py-4 sm:col-span-3">
                <a href={diamond.verifyUrl} target="_blank" rel="noreferrer" className="text-sm text-accent underline">
                  Verify this report with {diamond.lab}
                </a>
              </div>
            )}
          </dl>
        )}
      </section>
    </div>
  );
}

function Grade({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line py-3">
      <dt className="text-xs uppercase tracking-widest text-slate">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default CertificateModal;