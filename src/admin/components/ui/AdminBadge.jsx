import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  orange: 'bg-orange-50 text-orange-800 border-orange-200/80',
  navy: 'bg-[#1A3A5C]/10 text-[#1A3A5C] border-[#1A3A5C]/20',
};

export function AdminBadge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variants[variant] ?? variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
