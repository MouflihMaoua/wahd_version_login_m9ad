import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../core/store/useAuthStore';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { AdminBadge } from '../components/ui/AdminBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { PaginationBar } from '../components/ui/PaginationBar';
import { fetchReports, updateReportStatut, insertReport } from '../services/adminApi';
import { formatDate } from '../utils/display';

const PAGE_SIZE = 12;

const STATS = [
  { key: 'tous', label: 'Tous' },
  { key: 'ouvert', label: 'Ouverts' },
  { key: 'examiné', label: 'Examinés' },
  { key: 'fermé', label: 'Fermés' },
];

function statutVariant(s) {
  if (s === 'ouvert') return 'warning';
  if (s === 'examiné') return 'info';
  if (s === 'fermé') return 'default';
  return 'default';
}

export default function ModerationPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [statut, setStatut] = useState('tous');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    target_type: 'other',
    target_id: '',
    reason: '',
    details: '',
  });

  const q = useQuery({
    queryKey: ['admin-reports', page, statut],
    queryFn: () => fetchReports({ page, pageSize: PAGE_SIZE, statut }),
  });

  const changeStatut = async (row, next) => {
    try {
      await updateReportStatut(row.id, next);
      toast.success('Signalement mis à jour');
      qc.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const submitInternalReport = async (e) => {
    e.preventDefault();
    try {
      await insertReport({
        reporter_id: user?.id ?? null,
        target_type: form.target_type,
        target_id: form.target_id.trim() || null,
        reason: form.reason.trim(),
        details: form.details.trim() || null,
        statut: 'ouvert',
      });
      toast.success('Signalement enregistré');
      setShowForm(false);
      setForm({ target_type: 'other', target_id: '', reason: '', details: '' });
      qc.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard hover={false}>
        <AdminCardHeader
          icon={ShieldAlert}
          title="Modération"
          subtitle="Signalements internes · Traçabilité des incidents"
          action={
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Nouveau signalement
            </button>
          }
        />

        {showForm && (
          <form
            onSubmit={submitInternalReport}
            className="mx-6 mb-6 rounded-2xl border border-orange-200/80 bg-orange-50/50 p-4 space-y-3 text-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Type de cible</span>
                <select
                  value={form.target_type}
                  onChange={(e) => setForm((f) => ({ ...f, target_type: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  <option value="user">Utilisateur</option>
                  <option value="avis">Avis</option>
                  <option value="invitation">Invitation</option>
                  <option value="devis">Devis</option>
                  <option value="other">Autre</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">ID cible (UUID)</span>
                <input
                  value={form.target_id}
                  onChange={(e) => setForm((f) => ({ ...f, target_id: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                  placeholder="optionnel"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Motif *</span>
              <input
                required
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Détails</span>
              <textarea
                value={form.details}
                onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 resize-none"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-[#1A3A5C] px-4 py-2 text-sm font-semibold text-white"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {STATS.map((s) => (
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

        {q.isLoading ? (
          <TableSkeleton />
        ) : q.error ? (
          <div className="px-6 py-8 text-sm text-red-600 space-y-2">
            <p>{q.error.message}</p>
            <p className="text-xs text-slate-600">
              Exécutez le script SQL pour créer <code className="font-mono">content_reports</code> et les
              politiques admin.
            </p>
          </div>
        ) : (
          <>
            <DataTable
              getRowKey={(r) => r.id}
              rows={q.data.rows}
              columns={[
                {
                  key: 'type',
                  label: 'Cible',
                  render: (r) => (
                    <div>
                      <AdminBadge variant="navy" className="capitalize">
                        {r.target_type}
                      </AdminBadge>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">{r.target_id ?? '—'}</p>
                    </div>
                  ),
                },
                {
                  key: 'reason',
                  label: 'Motif',
                  render: (r) => (
                    <span className="line-clamp-2 text-slate-700 max-w-[220px]">{r.reason}</span>
                  ),
                },
                {
                  key: 'statut',
                  label: 'Statut',
                  render: (r) => (
                    <AdminBadge variant={statutVariant(r.statut)} className="capitalize">
                      {r.statut}
                    </AdminBadge>
                  ),
                },
                {
                  key: 'created',
                  label: 'Créé',
                  render: (r) => formatDate(r.created_at),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (r) => (
                    <div className="flex flex-wrap gap-1">
                      {r.statut === 'ouvert' && (
                        <button
                          type="button"
                          onClick={() => changeStatut(r, 'examiné')}
                          className="rounded-lg bg-sky-50 border border-sky-200 px-2 py-1 text-[11px] font-bold text-sky-900"
                        >
                          Examiner
                        </button>
                      )}
                      {r.statut !== 'fermé' && (
                        <button
                          type="button"
                          onClick={() => changeStatut(r, 'fermé')}
                          className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-800"
                        >
                          Fermer
                        </button>
                      )}
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
    </div>
  );
}
