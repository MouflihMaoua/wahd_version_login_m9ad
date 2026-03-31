export function AdminBadge({ children, variant = 'navy', className = '' }) {
  const styles = {
    navy: 'bg-[#1A3A5C]/10 text-[#1A3A5C]',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-sky-100 text-sky-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ${styles[variant] || styles.navy} ${className}`}
    >
      {children}
    </span>
  );
}
