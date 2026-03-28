import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Download, Ban, CheckCircle, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { fetchParticuliers, setParticulierSuspended, deleteParticulier } from '../services/adminApi';
import { particulierName, formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';

const PAGE_SIZE = 10;

export default function ParticuliersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [qSearch, setQSearch] = useState('');
  const [suspendedOnly, setSuspendedOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detail, setDetail] = useState(null);

  const q = useQuery({
    queryKey: ['admin-particuliers', page, qSearch, suspendedOnly],
    queryFn: () =>
      fetchParticuliers({ page, pageSize: PAGE_SIZE, search: qSearch, suspendedOnly }),
  });

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQSearch(search);
  };

  const toggleSuspend = async (row) => {
    try {
      const next = !row.compte_suspendu;
      await setParticulierSuspended(row.id_particulier, next);
      toast.success(next ? 'Compte suspendu' : 'Suspension levée');
      qc.invalidateQueries({ queryKey: ['admin-particuliers'] });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteParticulier(deleteTarget.id_particulier);
      toast.success('Particulier supprimé');
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: ['admin-particuliers'] });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const exportCsv = async () => {
    try {
      const { rows } = await fetchParticuliers({
        page: 0,
        pageSize: 8000,
        search: qSearch,
        suspendedOnly,
      });
      exportRowsToCsv(
        rows,
        [
          { key: 'id_particulier', label: 'id' },
          { key: 'email_particulier', label: 'email' },
          { key: 'nom_particulier', label: 'nom' },
          { key: 'prenom_particulier', label: 'prenom' },
          { key: 'ville', label: 'ville' },
          { key: 'compte_suspendu', label: 'suspendu' },
        ],
        `7rayfi-particuliers-${new Date().toISOString().slice(0, 10)}.csv`
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
          title="Particuliers"
          subtitle="Gestion des comptes clients"
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

        <div className="px-6 pb-4 flex flex-col lg:flex-row gap-3">
          <form onSubmit={submitSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Email, nom, ville…"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#1A3A5C] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Filtrer
            </button>
          </form>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={suspendedOnly}
              onChange={(e) => {
                setSuspendedOnly(e.target.checked);
                setPage(0);
              }}
              className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            Suspendus seulement
          </label>
        </div>

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <p className="px-6 py-8 text-sm text-red-600">{q.error.message}</p>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id_particulier}
              rows={q.data.rows}
              columns={[
                {
                  key: 'nom',
                  label: 'Client',
                  render: (r) => (
                    <div>
                      <p className="font-semibold text-slate-800">{particulierName(r)}</p>
                      <p className="text-xs text-slate-500">{r.email_particulier ?? r.email}</p>
                    </div>
                  ),
                },
                { key: 'ville', label: 'Ville', render: (r) => r.ville ?? '—' },
                {
                  key: 'statut',
                  label: 'Statut',
                  render: (r) => (
                    <AdminBadge variant={r.compte_suspendu ? 'danger' : 'success'}>
                      {r.compte_suspendu ? 'Suspendu' : 'Actif'}
                    </AdminBadge>
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (r) => (
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setDetail(r)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSuspend(r)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold ${
                          r.compte_suspendu
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-amber-200 bg-amber-50 text-amber-900'
                        }`}
                      >
                        {r.compte_suspendu ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <Ban className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

      <AnimatePresence>
        {detail && (
          <motion.div
            className="fixed inset-0 z-[170] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Fermer"
              onClick={() => setDetail(null)}
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-[#1A3A5C] mb-4">Fiche particulier</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Nom</dt>
                  <dd className="font-medium">{particulierName(detail)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Email</dt>
                  <dd className="break-all">{detail.email_particulier ?? detail.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Téléphone</dt>
                  <dd>{detail.telephone_particulier ?? detail.telephone ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Ville / CP</dt>
                  <dd>
                    {detail.ville ?? '—'}{' '}
                    {detail.code_postale_particulier ?? detail.code_postale ?? ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">CIN</dt>
                  <dd className="font-mono">{detail.cin ?? '—'}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce particulier ?"
        message="Cette action est irréversible si aucune dépendance base de données ne bloque la suppression."
        confirmLabel="Supprimer"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
