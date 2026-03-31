import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { fetchAvisList, deleteAvis } from '../services/adminApi';
import { formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';

const PAGE_SIZE = 12;

export default function AvisPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [qSearch, setQSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const q = useQuery({
    queryKey: ['admin-avis', page, qSearch],
    queryFn: () => fetchAvisList({ page, pageSize: PAGE_SIZE, search: qSearch }),
  });

  const submit = (e) => {
    e.preventDefault();
    setPage(0);
    setQSearch(search);
  };

  const onConfirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteAvis(toDelete.id);
      toast.success('Avis supprimé');
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ['admin-avis'] });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const exportCsv = async () => {
    try {
      const { rows } = await fetchAvisList({ page: 0, pageSize: 20000, search: qSearch });
      exportRowsToCsv(
        rows,
        [
          { key: 'id', label: 'id' },
          { key: 'id_artisan', label: 'id_artisan' },
          { key: 'nom_client', label: 'client' },
          { key: 'note', label: 'note' },
          { key: 'service_type', label: 'service' },
          { key: 'commentaire', label: 'commentaire' },
          { key: 'date_avis', label: 'date' },
        ],
        `7rayfi-avis-${new Date().toISOString().slice(0, 10)}.csv`
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
          title="Avis & évaluations"
          subtitle="Modération des commentaires publics"
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

        <form onSubmit={submit} className="px-6 pb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Client, commentaire, service…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#1A3A5C] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Rechercher
          </button>
        </form>

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <div className="px-6 py-8 text-sm text-red-600 space-y-2">
            <p>{q.error.message}</p>
            <p className="text-xs text-slate-600">
              Assurez-vous que la table <code className="font-mono">evaluation</code> existe avec les colonnes requises.
            </p>
          </div>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id}
              rows={q.data.rows}
              columns={[
                {
                  key: 'client',
                  label: 'Client',
                  render: (r) => (
                    <div>
                      <p className="font-semibold text-slate-800">{r.nom_client ?? 'Anonyme'}</p>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="font-bold">{r.note ?? '—'}/5</span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'service',
                  label: 'Service',
                  render: (r) => <AdminBadge variant="navy">{r.service_type ?? '—'}</AdminBadge>,
                },
                {
                  key: 'comment',
                  label: 'Commentaire',
                  render: (r) => (
                    <span className="line-clamp-2 text-slate-600 max-w-[260px]">
                      {r.commentaire ?? '—'}
                    </span>
                  ),
                },
                {
                  key: 'artisan',
                  label: 'Artisan',
                  render: (r) => (
                    <span className="text-xs font-mono text-slate-600">
                      {r.id_artisan?.slice(0, 10)}…
                    </span>
                  ),
                },
                {
                  key: 'date',
                  label: 'Date',
                  render: (r) => formatDate(r.date_avis ?? r.created_at),
                },
                {
                  key: 'actions',
                  label: '',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={() => setToDelete(r)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

      <ConfirmModal
        open={!!toDelete}
        title="Supprimer cet avis ?"
        message="Le commentaire sera retiré définitivement de la plateforme."
        confirmLabel="Supprimer"
        onClose={() => !deleting && setToDelete(null)}
        onConfirm={onConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
