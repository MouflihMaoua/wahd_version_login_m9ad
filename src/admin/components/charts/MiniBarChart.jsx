import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const BAR_COLORS = ['#1A3A5C', '#F97316', '#0EA5E9', '#10B981', '#A855F7', '#64748B'];

export function MiniBarChart({ data, className }) {
  if (!data?.length) {
    return (
      <div className={cn('rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400', className)}>
        Pas encore assez de données
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('flex items-end justify-between gap-2 h-36 px-1', className)}>
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * 100);
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return (
          <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end min-w-0">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(h, 6)}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[40px] rounded-t-lg min-h-[4px]"
              style={{ background: `linear-gradient(180deg, ${color}, ${color}99)` }}
            />
            <span className="text-[10px] font-medium text-slate-500 truncate max-w-full text-center leading-tight" title={d.label}>
              {d.label}
            </span>
            <span className="text-xs font-bold tabular-nums text-[#1A3A5C]">{d.value}</span>
          </div>
        );
      })}
    </div>
  );
}
