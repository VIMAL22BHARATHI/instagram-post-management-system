import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pageResponse, onPageChange }) => {
  if (!pageResponse || pageResponse.totalPages <= 1) return null;

  const { page, totalPages, totalElements, size } = pageResponse;
  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-slate-900/50 border-t border-slate-800">
      <div className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-200">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-200">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-200">{totalElements}</span> results
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs text-gray-300 px-2 font-medium">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
