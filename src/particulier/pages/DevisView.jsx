/**
 * DevisView — Particulier's view of devis sent by artisans
 * Fetch from Supabase `devis` table. Accept ✅ / Refuse ❌ with DB update.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck, CheckCircle, XCircle, Clock, RefreshCw,
  AlertCircle, ChevronDown, User, Briefcase, MapPin,
  Calendar, DollarSign, FileText, X
} from 'lucide-react';
import { supabase } from '../../core/services/supabaseClient';
import { updateStatutDevis } from '../../core/services/devisService';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';

// ── Status config ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  brouillon: { label: 'Brouillon',  color: 'bg-gray-100 text-gray-600'   },
  envoyé:    { label: 'En attente', color: 'bg-amber-100 text-amber-700'  },
  accepté:   { label: 'Accepté',    color: 'bg-emerald-100 text-emerald-700' },
  refusé:    { label: 'Refusé',     color: 'bg-red-100 text-red-600'     },
  expiré:    { label: 'Expiré',     color: 'bg-gray-100 text-gray-500'   },
};

// ── Skeleton ──────────────────────────────────────────────────────
const SkeletonDevis = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 bg-gray-200 rounded-full" />
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="h-3 w-full bg-gray-100 rounded-full" />
    <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
    <div className="grid grid-cols-3 gap-3">
      <div className="h-8 bg-gray-100 rounded-xl" />
      <div className="h-8 bg-gray-100 rounded-xl" />
      <div className="h-8 bg-gray-100 rounded-xl" />
    </div>
    <div className="flex gap-3 pt-2">
      <div className="h-10 flex-1 bg-gray-100 rounded-xl" />
      <div className="h-10 flex-1 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

// ── Devis Card ────────────────────────────────────────────────────
const DevisCard = ({ devis, index, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[devis.statut] ?? STATUS_CONFIG.brouillon;
  const isPending = devis.statut === 'envoyé';
  const montantTTC = devis.montant_ttc ?? ((devis.montant_ht ?? 0) * 1.2);

  const handleAction = async (newStatus) => {
    setLoading(true);
    const result = await updateStatutDevis(devis.id, newStatus);
    if (result.success) {
      toast.success(newStatus === 'accepté' ? '✅ Devis accepté !' : '❌ Devis refusé');
      onStatusChange(devis.id, newStatus);
    } else {
      toast.error(result.error ?? 'Erreur lors de la mise à jour');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
        isPending ? 'border-amber-200' : 'border-gray-100'
      }`}
    >
      {/* Pending accent line */}
      {isPending && <div className="h-1 bg-gradient-to-r from-amber-400 to-[#FF6B35]" />}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1A3A5C] text-base">{devis.service}</h3>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>
            {devis.nom_particulier && (
              <p className="text-xs text-gray-400 mt-0.5">Pour : {devis.nom_particulier}</p>
            )}
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-lg font-bold text-[#1A3A5C]">
              {montantTTC.toLocaleString('fr-MA')} DH
            </p>
            <p className="text-xs text-gray-400">TTC</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
          {devis.delai && (
            <span className="inline-flex items-center gap-1">
              <Clock size={11} className="text-[#FF6B35]" />
              Délai : {devis.delai}
            </span>
          )}
          {devis.date_creation && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={11} className="text-[#1A3A5C]" />
              {new Date(devis.date_creation).toLocaleDateString('fr-FR')}
            </span>
          )}
          {devis.adresse && (
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
              <MapPin size={11} className="text-[#1A3A5C]" />
              {devis.adresse}
            </span>
          )}
        </div>

        {/* Description preview */}
        {devis.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
            {devis.description}
          </p>
        )}

        {/* Expand toggle */}
        {(devis.notes || devis.montant_ht) && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-[#1A3A5C]/60 hover:text-[#1A3A5C] font-medium mb-3 transition-colors"
          >
            <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded ? 'Masquer les détails' : 'Voir les détails'}
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl text-center">
                <div>
                  <p className="text-xs text-gray-400">Montant HT</p>
                  <p className="text-sm font-bold text-[#1A3A5C]">{(devis.montant_ht ?? 0).toLocaleString('fr-MA')} DH</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">TVA</p>
                  <p className="text-sm font-bold text-[#1A3A5C]">{devis.tva ?? 20}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total TTC</p>
                  <p className="text-sm font-bold text-[#FF6B35]">{montantTTC.toLocaleString('fr-MA')} DH</p>
                </div>
              </div>
              {devis.notes && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Notes de l'artisan</p>
                  <p className="text-xs text-amber-900 leading-relaxed">{devis.notes}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions — only for pending devis */}
        {isPending && (
          <div className="flex gap-2.5 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleAction('refusé')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={15} />
              Refuser
            </button>
            <button
              onClick={() => handleAction('accepté')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-semibold hover:bg-[#e55a25] transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle size={15} />
              )}
              Accepter
            </button>
          </div>
        )}

        {/* Already decided */}
        {!isPending && (
          <div className={`flex items-center gap-2 text-xs font-medium mt-2 ${
            devis.statut === 'accepté' ? 'text-emerald-600' :
            devis.statut === 'refusé'  ? 'text-red-500' : 'text-gray-400'
          }`}>
            {devis.statut === 'accepté' && <><CheckCircle size={13} /> Vous avez accepté ce devis</>}
            {devis.statut === 'refusé'  && <><XCircle size={13} /> Vous avez refusé ce devis</>}
            {devis.statut === 'expiré'  && <><Clock size={13} /> Ce devis a expiré</>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const DevisView = () => {
  const { user } = useAuthStore();
  const [devis,     setDevis]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filter,    setFilter]    = useState('tous');

  /* ── Fetch devis for this particulier ────────────────────────── */
  const fetchDevis = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Query devis where id_particulier matches OR email matches
      const { data, error: sbError } = await supabase
        .from('devis')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      setDevis(data ?? []);
    } catch (err) {
      setError(err.message ?? 'Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchDevis(); }, [fetchDevis]);

  /* ── Handle local status update after accept/refuse ──────────── */
  const handleStatusChange = (devisId, newStatus) => {
    setDevis(prev =>
      prev.map(d => d.id === devisId ? { ...d, statut: newStatus } : d)
    );
  };

  /* ── Filter ──────────────────────────────────────────────────── */
  const filtered = filter === 'tous' ? devis : devis.filter(d => d.statut === filter);
  const pendingCount = devis.filter(d => d.statut === 'envoyé').length;

  const FILTERS = [
    { key: 'tous',    label: 'Tous'        },
    { key: 'envoyé',  label: 'En attente'  },
    { key: 'accepté', label: 'Acceptés'    },
    { key: 'refusé',  label: 'Refusés'     },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C]">Mes Devis</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Devis envoyés par les artisans — acceptez ou refusez
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-semibold">
            <Clock size={15} />
            {pendingCount} devis en attente
          </div>
        )}
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',       val: devis.length,                                  color: 'bg-[#1A3A5C]/8 text-[#1A3A5C]' },
            { label: 'En attente',  val: devis.filter(d=>d.statut==='envoyé').length,   color: 'bg-amber-50 text-amber-700' },
            { label: 'Acceptés',    val: devis.filter(d=>d.statut==='accepté').length,  color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Refusés',     val: devis.filter(d=>d.statut==='refusé').length,   color: 'bg-red-50 text-red-600' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
              <p className="text-xl font-bold">{s.val}</p>
              <p className="text-xs font-medium mt-0.5 opacity-75">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1A3A5C]/30 hover:text-[#1A3A5C]'
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={fetchDevis}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-[#1A3A5C] border border-gray-200 rounded-xl hover:border-[#1A3A5C]/30 transition-colors"
        >
          <RefreshCw size={13} />
          Actualiser
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonDevis key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-[#1A3A5C] font-semibold mb-1">Erreur de chargement</p>
          <p className="text-gray-400 text-sm mb-5">{error}</p>
          <button onClick={fetchDevis}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A3A5C] text-white rounded-xl font-semibold text-sm hover:bg-[#0f2236] transition-colors">
            <RefreshCw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((d, i) => (
            <DevisCard
              key={d.id}
              devis={d}
              index={i}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#1A3A5C]/6 rounded-full flex items-center justify-center mb-5">
            <FileCheck size={32} className="text-[#1A3A5C]/30" />
          </div>
          <h3 className="text-lg font-bold text-[#1A3A5C] mb-2">Aucun devis</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            {filter === 'tous'
              ? "Aucun devis n'a encore été envoyé par un artisan."
              : `Aucun devis avec le statut « ${FILTERS.find(f=>f.key===filter)?.label} ».`}
          </p>
          {filter !== 'tous' && (
            <button onClick={() => setFilter('tous')}
              className="mt-5 px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl font-semibold text-sm hover:bg-[#e55a25] transition-colors">
              Voir tous les devis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DevisView;
