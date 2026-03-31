export function MiniBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
        Aucune donnée
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <div className="h-36 flex items-end gap-3 px-2">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full bg-[#1A3A5C]/80 rounded-t"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
            {item.label}
          </span>
          <span className="text-[10px] text-slate-700 font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
