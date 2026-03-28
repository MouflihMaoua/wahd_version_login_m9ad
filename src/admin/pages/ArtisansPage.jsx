import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, Check, X, ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { fetchArtisans, updateArtisanValidation } from '../services/adminApi';
import { artisanName, artisanMetier, formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';

const PAGE_SIZE = 10;

function DetailModal({ row, open, onClose, onValidated }) {
  if (!row) return null;
  const id = row.id_artisan;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Fermer"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur px-4 py-3">
              <h3 className="font-bold text-[#1A3A5C]">Profil artisan</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Fermer
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              {row.photo_profil && (
                <img
                  src={row.photo_profil}
                  alt=""
                  className="w-full max-h-48 object-cover rounded-xl border border-slate-100"
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Nom</p>
                  <p className="font-medium text-slate-800">{artisanName(row)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Métier</p>
                  <p className="font-medium text-slate-800">{artisanMetier(row)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-semibold">Email</p>
                  <p className="font-medium text-slate-800 break-all">{row.email ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Téléphone</p>
                  <p className="font-medium text-slate-800">{row.telephone ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Ville</p>
                  <p className="font-medium text-slate-800">{row.ville ?? row.localisation ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">CIN</p>
                  <p className="font-mono text-slate-800">{row.cin ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Statut</p>
                  <AdminBadge variant={row.statut_validation ? 'success' : 'warning'}>
                    {row.statut_validation ? 'Validé' : 'En attente'}
                  </AdminBadge>
                </div>
                {row.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 font-semibold">Description</p>
                    <p className="text-slate-700 leading-relaxed">{row.description}</p>
                  </div>
                )}
              </div>
              {(row.carte_cin_recto || row.carte_cin_verso) && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Pièces CIN</p>
                  <div className="grid grid-cols-2 gap-2">
                    {row.carte_cin_recto && (
                      <a
                        href={row.carte_cin_recto}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 text-xs font-semibold hover:underline"
                      >
                        Voir recto ↗
                      </a>
                    )}
                    {row.carte_cin_verso && (
                      <a
                        href={row.carte_cin_verso}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 text-xs font-semibold hover:underline"
                      >
                        Voir verso ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to={`/artisan/${id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#1A3A5C] hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Page publique
                </Link>
                {!row.statut_validation && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateArtisanValidation(id, true);
                        toast.success('Artisan validé');
                        onValidated();
                        onClose();
                      } catch (e) {
                        toast.error(e.message);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5" /> Valider
                  </button>
                )}
                {row.statut_validation && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateArtisanValidation(id, false);
                        toast.success('Compte repassé en attente');
                        onValidated();
                        onClose();
                      } catch (e) {
                        toast.error(e.message);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    <X className="h-3.5 w-3.5" /> Révoquer validation
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">ID : {id}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ArtisansPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [detail, setDetail] = useState(null);

  const q = useQuery({
    queryKey: ['admin-artisans', page, searchDebounced],
    queryFn: () => fetchArtisans({ page, pageSize: PAGE_SIZE, search: searchDebounced }),
  });

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchDebounced(search);
  };

  const exportAll = async () => {
    try {
      const { rows } = await fetchArtisans({ page: 0, pageSize: 5000, search: searchDebounced });
      exportRowsToCsv(
        rows,
        [
          { key: 'id_artisan', label: 'id_artisan' },
          { key: 'email', label: 'email' },
          { key: 'nom', label: 'nom' },
          { key: 'prenom', label: 'prenom' },
          { key: 'metier', label: 'metier' },
          { key: 'ville', label: 'ville' },
          { key: 'cin', label: 'cin' },
          { key: 'statut_validation', label: 'statut_validation' },
          { key: 'created_at', label: 'created_at' },
        ],
        `7rayfi-artisans-${new Date().toISOString().slice(0, 10)}.csv`
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
          title="Gestion des artisans"
          subtitle="Validation, profils et CIN"
          action={
            <button
              type="button"
              onClick={exportAll}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          }
        />
        <form onSubmit={onSearchSubmit} className="px-6 pb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (email, nom, métier, CIN…)"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C]/40"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#1A3A5C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#152d46]"
          >
            Filtrer
          </button>
        </form>

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <p className="px-6 py-8 text-sm text-red-600">{q.error.message}</p>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id_artisan}
              rows={q.data.rows}
              columns={[
                {
                  key: 'name',
                  label: 'Artisan',
                  render: (r) => (
                    <div>
                      <p className="font-semibold text-slate-800">{artisanName(r)}</p>
                      <p className="text-xs text-slate-500">{r.email}</p>
                    </div>
                  ),
                },
                {
                  key: 'metier',
                  label: 'Métier',
                  render: (r) => <span className="text-slate-700">{artisanMetier(r)}</span>,
                },
                {
                  key: 'validation',
                  label: 'Validation',
                  render: (r) => (
                    <AdminBadge variant={r.statut_validation ? 'success' : 'warning'}>
                      {r.statut_validation ? 'Validé' : 'En attente'}
                    </AdminBadge>
                  ),
                },
                {
                  key: 'created_at',
                  label: 'Créé',
                  render: (r) => formatDate(r.created_at),
                },
                {
                  key: 'actions',
                  label: '',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={() => setDetail(r)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-[#1A3A5C] hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" /> Détail
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

      <DetailModal
        row={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onValidated={() => qc.invalidateQueries({ queryKey: ['admin-artisans'] })}
      />
    </div>
  );
}
