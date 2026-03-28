import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { fetchInvitations } from '../services/adminApi';
import { formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';

const PAGE_SIZE = 12;

const STATUTS = [
  { key: 'tous', label: 'Tous' },
  { key: 'en attente', label: 'En attente' },
  { key: 'acceptée', label: 'Acceptée' },
  { key: 'refusée', label: 'Refusée' },
];

function badgeVariant(st) {
  if (st === 'acceptée') return 'success';
  if (st === 'refusée') return 'danger';
  return 'warning';
}

export default function DemandesPage() {
  const [page, setPage] = useState(0);
  const [statut, setStatut] = useState('tous');
  const [search, setSearch] = useState('');
  const [qSearch, setQSearch] = useState('');

  const q = useQuery({
    queryKey: ['admin-invitations', page, statut, qSearch],
    queryFn: () =>
      fetchInvitations({ page, pageSize: PAGE_SIZE, statut, search: qSearch }),
  });

  const applyFilters = (e) => {
    e?.preventDefault?.();
    setPage(0);
    setQSearch(search);
  };

  const exportCsv = async () => {
    try {
      const { rows } = await fetchInvitations({
        page: 0,
        pageSize: 15000,
        statut,
        search: qSearch,
      });
      exportRowsToCsv(
        rows,
        [
          { key: 'id', label: 'id' },
          { key: 'service', label: 'service' },
          { key: 'statut', label: 'statut' },
          { key: 'id_particulier', label: 'id_particulier' },
          { key: 'id_artisan', label: 'id_artisan' },
          { key: 'created_at', label: 'created_at' },
          { key: 'message', label: 'message' },
        ],
        `7rayfi-invitations-${new Date().toISOString().slice(0, 10)}.csv`
      );
      toast.success('Export prêt');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard hover={false}>
        <AdminCardHeader
          title="Demandes (invitations)"
          subtitle="Flux particulier → artisan · Les filtres « urgence » ne sont pas stockés en base ; utilisez le tri par date."
          action={
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          }
        />

        <div className="px-6 pb-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            {STATUTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setStatut(s.key);
                  setPage(0);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statut === s.key
                    ? 'bg-[#1A3A5C] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <form onSubmit={applyFilters} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrer par service…"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Rechercher
            </button>
          </form>
        </div>

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <p className="px-6 py-8 text-sm text-red-600">{q.error.message}</p>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id}
              rows={q.data.rows}
              columns={[
                { key: 'service', label: 'Service', render: (r) => r.service ?? '—' },
                {
                  key: 'statut',
                  label: 'Statut',
                  render: (r) => (
                    <AdminBadge variant={badgeVariant(r.statut)} className="capitalize">
                      {r.statut}
                    </AdminBadge>
                  ),
                },
                {
                  key: 'ids',
                  label: 'Particulier / Artisan',
                  render: (r) => (
                    <div className="text-xs font-mono text-slate-600 space-y-0.5">
                      <p>P: {r.id_particulier?.slice(0, 8)}…</p>
                      <p>A: {r.id_artisan?.slice(0, 8)}…</p>
                    </div>
                  ),
                },
                {
                  key: 'created_at',
                  label: 'Date',
                  render: (r) => formatDate(r.created_at),
                },
                {
                  key: 'msg',
                  label: 'Message',
                  render: (r) => (
                    <span className="line-clamp-2 text-slate-600 max-w-[200px]">{r.message ?? '—'}</span>
                  ),
                },
              ]}
            />
            <PaginationBar
              page={page}
              pageSize={PAGE_SIZE}
              total={q.data.total}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminCard>
    </div>
  );
}
