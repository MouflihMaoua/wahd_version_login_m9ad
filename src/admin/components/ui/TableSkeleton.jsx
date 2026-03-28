import { cn } from '../../utils/cn';

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="animate-pulse px-4 py-4 space-y-3">
      <div className="flex gap-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={cn('h-8 rounded-lg bg-slate-200', i === 0 ? 'flex-[2]' : 'flex-1')} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-10 flex-1 rounded-lg bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-slate-200/80" />
      ))}
    </div>
  );
}
