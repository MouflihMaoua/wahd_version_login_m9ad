export function AdminCard({ children, hover = true, delay = 0, className = '' }) {
  return (
    <div
      className={[
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        hover && 'transition-shadow hover:shadow-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function AdminCardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3A5C]/10 text-[#1A3A5C]">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}
