import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { fetchDevisList } from '../services/adminApi';
import { formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';

const PAGE_SIZE = 12;

const STATUTS = [
  { key: 'tous', label: 'Tous' },
  { key: 'brouillon', label: 'Brouillon' },
  { key: 'envoyé', label: 'Envoyé' },
  { key: 'accepté', label: 'Accepté' },
  { key: 'refusé', label: 'Refusé' },
];

function badgeVariant(st) {
  if (st === 'accepté') return 'success';
  if (st === 'refusé') return 'danger';
  if (st === 'envoyé') return 'warning';
  return 'default';
}

export default function DevisPage() {
  const [page, setPage] = useState(0);
  const [statut, setStatut] = useState('tous');
  const [search, setSearch] = useState('');
  const [qSearch, setQSearch] = useState('');
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: ['admin-devis', page, statut, qSearch],
    queryFn: () => fetchDevisList({ page, pageSize: PAGE_SIZE, statut, search: qSearch }),
  });

  const submit = (e) => {
    e.preventDefault();
    setPage(0);
    setQSearch(search);
  };

  const exportCsv = async () => {
    try {
      const { rows } = await fetchDevisList({
        page: 0,
        pageSize: 12000,
        statut,
        search: qSearch,
      });
      exportRowsToCsv(
        rows.map((r) => ({
          id: r.id,
          statut: r.statut,
          service: r.service,
          montant_ttc: r.montant_ttc,
          id_artisan: r.id_artisan,
          date_creation: r.date_creation ?? r.created_at,
        })),
        [
          { key: 'id', label: 'id' },
          { key: 'statut', label: 'statut' },
          { key: 'service', label: 'service' },
          { key: 'montant_ttc', label: 'montant_ttc' },
          { key: 'id_artisan', label: 'id_artisan' },
          { key: 'date_creation', label: 'date' },
        ],
        `7rayfi-devis-${new Date().toISOString().slice(0, 10)}.csv`
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
          title="Devis"
          subtitle="Suivi des statuts et montants"
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

        <div className="px-6 pb-4 flex flex-wrap gap-2">
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

        <form onSubmit={submit} className="px-6 pb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Service, n° devis, description…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Filtrer
          </button>
        </form>

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <p className="px-6 py-8 text-sm text-red-600">{q.error.message}</p>
        ) : q.data.rows.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500 text-sm mb-2">Aucun devis trouvé</p>
            <p className="text-slate-400 text-xs mb-4">
              {q.data.total === 0 
                ? "La table devis est vide. Créez des devis depuis le dashboard artisan." 
                : "Aucun résultat pour les filtres sélectionnés."}
            </p>
            <button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['admin-devis'] });
                toast.success('Données rafraîchies');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <RefreshCw className="h-4 w-4" /> Rafraîchir
            </button>
          </div>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id}
              rows={q.data.rows}
              columns={[
                {
                  key: 'ref',
                  label: 'ID / service',
                  render: (r) => (
                    <div>
                      <p className="font-semibold text-slate-800">{r.id?.slice(0, 8)}</p>
                      <p className="text-xs text-slate-500">{r.service}</p>
                    </div>
                  ),
                },
                {
                  key: 'statut',
                  label: 'Statut',
                  render: (r) => (
                    <AdminBadge variant={badgeVariant(r.statut)}>{r.statut}</AdminBadge>
                  ),
                },
                {
                  key: 'montant',
                  label: 'TTC',
                  render: (r) => (
                    <span className="tabular-nums font-semibold text-slate-800">
                      {r.montant_ttc != null ? `${Number(r.montant_ttc).toLocaleString('fr-FR')} DH` : '—'}
                    </span>
                  ),
                },
                {
                  key: 'artisan',
                  label: 'Artisan',
                  render: (r) => (
                    <span className="text-xs font-mono text-slate-600">{r.id_artisan?.slice(0, 10)}…</span>
                  ),
                },
                {
                  key: 'date',
                  label: 'Date',
                  render: (r) => formatDate(r.date_creation ?? r.created_at),
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
