import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PaginationBar({ page, pageSize, total, onPageChange, className }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className={cn('flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100', className)}>
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-700">{page + 1}</span> / {totalPages}
        <span className="mx-1.5">·</span>
        {total} élément{total !== 1 ? 's' : ''}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Précédent
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Suivant <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
