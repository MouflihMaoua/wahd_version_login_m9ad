import { cn } from '../../utils/cn';

export function DataTable({ columns, rows, emptyText = 'Aucune donnée', getRowKey }) {
  if (!rows?.length) {
    return (
      <div className="px-6 py-16 text-center text-slate-500 text-sm">{emptyText}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 font-semibold text-slate-600 whitespace-nowrap',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr
              key={getRowKey ? getRowKey(row) : i}
              className="bg-white hover:bg-slate-50/80 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-slate-800', col.tdClassName)}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
