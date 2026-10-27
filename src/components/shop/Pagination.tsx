"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 border border-line bg-surface disabled:opacity-50 hover:border-ink transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4 text-ink" />
      </button>
      
      <span className="text-xs font-medium text-ink uppercase tracking-widest px-4">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 border border-line bg-surface disabled:opacity-50 hover:border-ink transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4 text-ink" />
      </button>
    </div>
  );
}

export default Pagination;