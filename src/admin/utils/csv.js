export function exportRowsToCsv(rows, columns, filename = 'export.csv') {
  if (!rows?.length) return;

  const headers = columns.map((c) => c.key);
  const labels = columns.map((c) => c.label ?? c.key);

  const escape = (val) => {
    if (val == null) return '';
    const s = String(val);
    if (s.includes(';') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [
    labels.join(';'),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(';')),
  ];

  const blob = new Blob(['\ufeff' + lines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
