import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function AdminCard({ children, className, delay = 0, hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50',
        'transition-shadow duration-200 hover:shadow-md hover:shadow-slate-200/70',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AdminCardHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1A3A5C]/10 text-[#1A3A5C]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-[#1A3A5C] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
