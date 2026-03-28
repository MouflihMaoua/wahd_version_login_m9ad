import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Hammer,
  Inbox,
  FileSpreadsheet,
  Clock,
  Activity,
  Download,
} from 'lucide-react';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { StatCardsSkeleton, TableSkeleton } from '../components/ui/TableSkeleton';
import { AdminBadge } from '../components/ui/AdminBadge';
import { MiniBarChart } from '../components/charts/MiniBarChart';
import {
  fetchCounts,
  fetchRecentActivity,
  fetchDevisStatutDistribution,
  fetchInvitationStatutDistribution,
} from '../services/adminApi';
import { formatDate } from '../utils/display';
import { exportRowsToCsv } from '../utils/csv';
import toast from 'react-hot-toast';

export default function OverviewPage() {
  const countsQ = useQuery({ queryKey: ['admin-counts'], queryFn: fetchCounts });
  const activityQ = useQuery({ queryKey: ['admin-activity'], queryFn: fetchRecentActivity });
  const devisDistQ = useQuery({
    queryKey: ['admin-devis-dist'],
    queryFn: fetchDevisStatutDistribution,
  });
  const invDistQ = useQuery({
    queryKey: ['admin-inv-dist'],
    queryFn: fetchInvitationStatutDistribution,
  });

  const handleExportSnapshot = () => {
    if (!countsQ.data) return;
    const rows = [
      {
        artisans: countsQ.data.artisans,
        particuliers: countsQ.data.particuliers,
        demandes: countsQ.data.demandes,
        devis: countsQ.data.devis,
        validations_en_attente: countsQ.data.pendingArtisans,
        invitations_en_attente: countsQ.data.pendingDemandes,
        export_date: new Date().toISOString(),
      },
    ];
    exportRowsToCsv(
      rows,
      [
        { key: 'artisans', label: 'Artisans' },
        { key: 'particuliers', label: 'Particuliers' },
        { key: 'demandes', label: 'Demandes' },
        { key: 'devis', label: 'Devis' },
        { key: 'validations_en_attente', label: 'Validations en attente' },
        { key: 'invitations_en_attente', label: 'Invitations en attente' },
        { key: 'export_date', label: 'Date export' },
      ],
      `7rayfi-admin-stats-${new Date().toISOString().slice(0, 10)}.csv`
    );
    toast.success('Export téléchargé');
  };

  if (countsQ.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 text-sm">
        <p className="font-bold">Impossible de charger les statistiques</p>
        <p className="mt-1 opacity-90">{countsQ.error.message}</p>
        <p className="mt-3 text-xs">
          Vérifiez que votre compte figure dans <code className="font-mono">platform_admins</code> et
          que le script <code className="font-mono">setup-admin-dashboard.sql</code> a été exécuté.
        </p>
      </div>
    );
  }

  const c = countsQ.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Tableau de bord opérationnel</p>
          <h2 className="text-2xl font-bold text-[#1A3A5C] tracking-tight">Vue d’ensemble</h2>
        </div>
        <button
          type="button"
          onClick={handleExportSnapshot}
          disabled={!c}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#1A3A5C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#152d46] disabled:opacity-50 transition-colors"
        >
          <Download className="h-4 w-4" /> Exporter l’instantané
        </button>
      </div>

      {countsQ.isLoading || !c ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            {
              label: 'Artisans',
              value: c.artisans,
              icon: Hammer,
              accent: 'from-[#1A3A5C]/15 to-white',
              chip: `${c.pendingArtisans} en attente de validation`,
            },
            {
              label: 'Particuliers',
              value: c.particuliers,
              icon: Users,
              accent: 'from-orange-500/10 to-white',
              chip: 'Utilisateurs clients',
            },
            {
              label: 'Demandes & invitations',
              value: c.demandes,
              icon: Inbox,
              accent: 'from-sky-500/10 to-white',
              chip: `${c.pendingDemandes} encore « en attente »`,
            },
            {
              label: 'Devis',
              value: c.devis,
              icon: FileSpreadsheet,
              accent: 'from-emerald-500/10 to-white',
              chip: 'Tous statuts',
            },
            {
              label: 'Validations',
              value: c.pendingArtisans,
              icon: Clock,
              accent: 'from-amber-500/15 to-white',
              chip: 'Artisans à traiter',
            },
            {
              label: 'Activité invitations',
              value: c.pendingDemandes,
              icon: Activity,
              accent: 'from-violet-500/10 to-white',
              chip: 'Demandes ouvertes',
            },
          ].map((card, i) => (
            <AdminCard key={card.label} delay={i * 0.04} className="overflow-hidden">
              <div
                className={`h-full p-5 bg-gradient-to-br ${card.accent} border-b border-slate-100/80`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-[#1A3A5C]">{card.value}</p>
                    <p className="mt-2 text-xs text-slate-600 font-medium">{card.chip}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-2.5 shadow-sm border border-slate-100">
                    <card.icon className="h-6 w-6 text-[#1A3A5C]" />
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="overflow-hidden" hover={false}>
          <AdminCardHeader title="Répartition des devis" subtitle="Par statut" />
          <div className="px-6 pb-6">
            {devisDistQ.isLoading ? (
              <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
                Chargement…
              </div>
            ) : devisDistQ.error ? (
              <p className="text-sm text-red-600 py-6">{devisDistQ.error.message}</p>
            ) : (
              <MiniBarChart data={devisDistQ.data} />
            )}
          </div>
        </AdminCard>
        <AdminCard className="overflow-hidden" hover={false}>
          <AdminCardHeader title="Invitations" subtitle="Par statut" />
          <div className="px-6 pb-6">
            {invDistQ.isLoading ? (
              <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
                Chargement…
              </div>
            ) : invDistQ.error ? (
              <p className="text-sm text-red-600 py-6">{invDistQ.error.message}</p>
            ) : (
              <MiniBarChart data={invDistQ.data} />
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard hover={false}>
        <AdminCardHeader
          icon={Activity}
          title="Activité récente"
          subtitle="Dernières invitations et devis"
        />
        {activityQ.isLoading ? (
          <TableSkeleton rows={4} cols={3} />
        ) : activityQ.error ? (
          <p className="px-6 py-8 text-sm text-red-600">{activityQ.error.message}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(activityQ.data ?? []).map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 px-6 py-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.at)}</p>
                </div>
                <AdminBadge
                  variant={item.kind === 'devis' ? 'info' : 'navy'}
                  className="shrink-0 capitalize"
                >
                  {item.meta ?? '—'}
                </AdminBadge>
              </li>
            ))}
            {!activityQ.data?.length && (
              <li className="px-6 py-12 text-center text-slate-500 text-sm">Aucune activité récente</li>
            )}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
