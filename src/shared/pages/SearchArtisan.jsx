// src/shared/pages/SearchArtisan.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Filter, Star, Clock, CheckCircle,
  Award, Send, X, ChevronDown, User, Briefcase, AlertCircle,
  SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { supabase } from '../../core/services/supabaseClient';
import { SERVICES_ARTISAN, VILLES_MAROC } from '../../core/constants/services';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────
const METIERS   = ['Tous', ...SERVICES_ARTISAN];
const VILLES    = ['Toutes', ...VILLES_MAROC];
const TRI_OPT   = ['Pertinence', "Plus d'expérience", 'Disponibles en premier'];

// ─── Skeleton Card ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="p-5 space-y-3">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-full w-3/4" />
          <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
      <div className="flex gap-2 pt-1">
        <div className="h-8 bg-gray-100 rounded-xl flex-1" />
        <div className="h-8 bg-gray-100 rounded-xl flex-1" />
      </div>
    </div>
  </div>
);

// ─── Artisan Card ──────────────────────────────────────────────────
const ArtisanCard = ({ artisan, index, onContact }) => {
  const fullName = `${artisan.prenom_artisan ?? ''} ${artisan.nom_artisan ?? ''}`.trim();
  const isAvailable = artisan.disponibilite === true;
  const initials = `${(artisan.prenom_artisan ?? 'A')[0]}${(artisan.nom_artisan ?? 'A')[0]}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-28 bg-gradient-to-br from-[#1A3A5C] to-[#0f2236] overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#FF6B35]/20" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

        {/* Disponibilité badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isAvailable
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            {isAvailable ? 'Disponible' : 'Occupé'}
          </span>
        </div>

        {/* Validation badge */}
        {artisan.statut_validation && (
          <div className="absolute top-3 left-3">
            <div className="w-7 h-7 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-md">
              <CheckCircle size={14} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Avatar — overlaps banner */}
      <div className="px-5 -mt-8 pb-0">
        <div className="relative w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C]">
          {artisan.photo_profil ? (
            <img
              src={artisan.photo_profil}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
            style={{ display: artisan.photo_profil ? 'none' : 'flex' }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-5">
        {/* Name + trade */}
        <div className="mb-3">
          <h3 className="text-[#1A3A5C] font-bold text-base leading-tight">{fullName}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Briefcase size={12} className="text-[#FF6B35]" />
            <span className="text-xs text-gray-500 font-medium">{artisan.metier ?? '—'}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {artisan.ville && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} className="text-[#1A3A5C]" />
              {artisan.ville}
            </span>
          )}
          {artisan.annee_experience != null && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} className="text-[#1A3A5C]" />
              {artisan.annee_experience} ans d'exp.
            </span>
          )}
        </div>

        {/* Description */}
        {artisan.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {artisan.description}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => onContact(artisan)}
          disabled={!isAvailable}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isAvailable
              ? 'bg-[#FF6B35] hover:bg-[#e55a25] text-white shadow-sm hover:shadow-md active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={14} />
          {isAvailable ? 'Envoyer une demande' : 'Non disponible'}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Empty State ────────────────────────────────────────────────────
const EmptyState = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-24 h-24 rounded-full bg-[#1A3A5C]/6 flex items-center justify-center mb-6">
      <Search size={36} className="text-[#1A3A5C]/40" />
    </div>
    <h3 className="text-xl font-bold text-[#1A3A5C] mb-2">Aucun artisan trouvé</h3>
    <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
      Essayez de modifier vos filtres ou d'élargir votre recherche pour trouver des artisans disponibles dans votre région.
    </p>
    <button
      onClick={onReset}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-semibold hover:bg-[#e55a25] transition-colors shadow-sm"
    >
      <RefreshCw size={16} />
      Réinitialiser la recherche
    </button>
  </motion.div>
);

// ─── Error State ───────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
      <AlertCircle size={32} className="text-red-400" />
    </div>
    <h3 className="text-lg font-bold text-[#1A3A5C] mb-2">Erreur de chargement</h3>
    <p className="text-gray-500 text-sm max-w-sm mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A3A5C] text-white rounded-xl font-semibold hover:bg-[#0f2236] transition-colors"
    >
      <RefreshCw size={15} />
      Réessayer
    </button>
  </div>
);

// ─── Demande Modal ──────────────────────────────────────────────────
const DemandeModal = ({ artisan, onClose, onSubmit }) => {
  const fullName = `${artisan.prenom_artisan ?? ''} ${artisan.nom_artisan ?? ''}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#1A3A5C]">Envoyer une demande</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              À <span className="font-semibold text-[#FF6B35]">{fullName}</span>
              {artisan.metier && ` · ${artisan.metier}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#1A3A5C] mb-2">
              Description du problème <span className="text-[#FF6B35]">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Décrivez précisément le problème à résoudre..."
              rows={4}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A3A5C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] transition-all resize-none"
            />
          </div>

          {/* Ville + Code postal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A3A5C] mb-2">
                Ville <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="ville"
                placeholder="Ex: Casablanca"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A3A5C] mb-2">
                Code postal <span className="text-[#FF6B35]">*</span>
              </label>
              <input
                type="text"
                name="codePostal"
                placeholder="Ex: 20000"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] transition-all"
              />
            </div>
          </div>

          {/* Urgence */}
          <div>
            <label className="block text-sm font-semibold text-[#1A3A5C] mb-2">
              Niveau d'urgence
            </label>
            <div className="relative">
              <select
                name="urgence"
                required
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] transition-all bg-white"
              >
                <option value="basse">🟢 Basse — pas d'urgence</option>
                <option value="moyenne">🟡 Moyenne — dans la semaine</option>
                <option value="haute">🔴 Haute — urgent</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-[#e55a25] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send size={14} />
              Envoyer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────
const SearchArtisan = () => {
  // ── Data state
  const [artisans, setArtisans]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  // ── Filter state
  const [searchTerm, setSearchTerm]           = useState('');
  const [selectedMetier, setSelectedMetier]   = useState('Tous');
  const [selectedVille, setSelectedVille]     = useState('Toutes');
  const [selectedTri, setSelectedTri]         = useState('Pertinence');
  const [showFilters, setShowFilters]         = useState(false);

  // ── Modal state
  const [modalArtisan, setModalArtisan]       = useState(null);

  // ── Fetch from Supabase ─────────────────────────────────────────
  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('artisan')
        .select(`
          id_artisan,
          nom_artisan,
          prenom_artisan,
          photo_profil,
          metier,
          ville,
          description,
          annee_experience,
          disponibilite,
          statut_validation
        `)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      setArtisans(data ?? []);
    } catch (err) {
      console.error('Supabase fetch error:', err);
      setError(err.message ?? 'Erreur lors du chargement des artisans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArtisans(); }, [fetchArtisans]);

  // ── Filter + Sort (client-side) ─────────────────────────────────
  const filtered = React.useMemo(() => {
    let result = [...artisans];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(a =>
        `${a.prenom_artisan} ${a.nom_artisan}`.toLowerCase().includes(q) ||
        (a.metier ?? '').toLowerCase().includes(q) ||
        (a.ville ?? '').toLowerCase().includes(q)
      );
    }

    if (selectedMetier !== 'Tous') {
      result = result.filter(a => a.metier === selectedMetier);
    }

    if (selectedVille !== 'Toutes') {
      result = result.filter(a => a.ville === selectedVille);
    }

    switch (selectedTri) {
      case "Plus d'expérience":
        result.sort((a, b) => (b.annee_experience ?? 0) - (a.annee_experience ?? 0));
        break;
      case 'Disponibles en premier':
        result.sort((a, b) => (b.disponibilite ? 1 : 0) - (a.disponibilite ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [artisans, searchTerm, selectedMetier, selectedVille, selectedTri]);

  // ── Handlers ────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMetier('Tous');
    setSelectedVille('Toutes');
    setSelectedTri('Pertinence');
  };

  const handleContact = (artisan) => setModalArtisan(artisan);
  const handleCloseModal = () => setModalArtisan(null);

  const handleEnvoyerDemande = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = `${modalArtisan.prenom_artisan ?? ''} ${modalArtisan.nom_artisan ?? ''}`.trim();

    const nouvelleDemande = {
      id: Date.now(),
      client: 'Client Actuel',
      service: modalArtisan.metier,
      description: formData.get('description'),
      adresse: `${formData.get('ville')} - ${formData.get('codePostal')}`,
      telephone: 'À définir',
      email: 'À définir',
      date: new Date().toISOString().split('T')[0],
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      urgence: formData.get('urgence'),
      statut: 'nouveau',
      prix: 'À estimer',
      artisanId: modalArtisan.id_artisan,
      artisanName: fullName,
      artisanMetier: modalArtisan.metier,
      artisanVille: modalArtisan.ville,
    };

    const existing = JSON.parse(localStorage.getItem('demandesArtisans') || '[]');
    existing.push(nouvelleDemande);
    localStorage.setItem('demandesArtisans', JSON.stringify(existing));

    toast.success(`Demande envoyée à ${fullName} !`);
    handleCloseModal();
  };

  const activeFiltersCount = [
    searchTerm.trim() !== '',
    selectedMetier !== 'Tous',
    selectedVille !== 'Toutes',
  ].filter(Boolean).length;

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero / Search Header ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1A3A5C] to-[#12293f] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B35]/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FF6B35]/20 text-[#FF9A6C] text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
              Réseau vérifié · Maroc
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Trouvez l'artisan{' '}
              <span className="text-[#FF6B35]">parfait</span>{' '}
              pour votre projet
            </h1>
            <p className="text-[#8BACC8] text-base max-w-xl mx-auto">
              Explorez notre réseau de professionnels qualifiés, disponibles et prêts à intervenir.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, métier, ville…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-white/20 text-[#1A3A5C] placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 shadow-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`relative px-5 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white text-[#1A3A5C] hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A3A5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter Panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Métier */}
                <div>
                  <label className="block text-xs font-bold text-[#1A3A5C] mb-1.5 uppercase tracking-wide">
                    Métier
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMetier}
                      onChange={e => setSelectedMetier(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                    >
                      {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-xs font-bold text-[#1A3A5C] mb-1.5 uppercase tracking-wide">
                    Ville
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVille}
                      onChange={e => setSelectedVille(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                    >
                      {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-xs font-bold text-[#1A3A5C] mb-1.5 uppercase tracking-wide">
                    Trier par
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTri}
                      onChange={e => setSelectedTri(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A3A5C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                    >
                      {TRI_OPT.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FF6B35] font-semibold hover:underline"
                  >
                    <RefreshCw size={12} />
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Result count bar */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-[#1A3A5C]">
                <span className="text-[#FF6B35] font-bold text-lg">{filtered.length}</span>
                {' '}artisan{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </p>
              {(searchTerm || selectedMetier !== 'Tous' || selectedVille !== 'Toutes') && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {[searchTerm && `"${searchTerm}"`, selectedMetier !== 'Tous' && selectedMetier, selectedVille !== 'Toutes' && selectedVille]
                    .filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Award size={13} className="text-[#FF6B35]" />
              Tous vérifiés
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <ErrorState message={error} onRetry={fetchArtisans} />
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((artisan, i) => (
              <ArtisanCard
                key={artisan.id_artisan}
                artisan={artisan}
                index={i}
                onContact={handleContact}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState onReset={resetFilters} />
        )}
      </div>

      {/* ── Contact Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {modalArtisan && (
          <DemandeModal
            artisan={modalArtisan}
            onClose={handleCloseModal}
            onSubmit={handleEnvoyerDemande}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchArtisan;
