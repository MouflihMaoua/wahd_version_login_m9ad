/** Normalize artisan row (legacy vs new column names) */
export function artisanName(row) {
  if (!row) return '—';
  const p = row.prenom_artisan ?? row.prenom ?? '';
  const n = row.nom_artisan ?? row.nom ?? '';
  const full = `${p} ${n}`.trim();
  return full || row.email || row.email_artisan || '—';
}

export function particulierName(row) {
  if (!row) return '—';
  const p = row.prenom_particulier ?? row.prenom ?? '';
  const n = row.nom_particulier ?? row.nom ?? '';
  const full = `${p} ${n}`.trim();
  return full || (row.email_particulier ?? row.email ?? '—');
}

export function artisanMetier(row) {
  return row?.metier ?? row?.specialite ?? '—';
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return String(iso);
  }
}
