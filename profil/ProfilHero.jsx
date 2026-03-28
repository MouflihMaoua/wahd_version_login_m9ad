// ============================================================
// components/profil/ProfilHero.jsx
// Bannière hero de la page profil
// Avatar cliquable, badge statut, boutons modifier/sauvegarder
// ============================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Edit2, Save, X, MapPin, Calendar, CheckCircle,
} from "lucide-react";

/**
 * ProfilHero
 *
 * Props :
 * @param {object}   user         - Données utilisateur (mockUser)
 * @param {boolean}  isEditing    - Mode édition global (hero)
 * @param {function} onEdit       - Déclenche le mode édition
 * @param {function} onSave       - Sauvegarde globale
 * @param {function} onCancel     - Annule l'édition
 * @param {function} onAvatarClick- Ouvre la modal upload photo
 */
const ProfilHero = ({
  user,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onAvatarClick,
}) => {
  // ── Initiales de l'avatar si pas de photo ─────────────────
  const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  // ── Formater date membre depuis ───────────────────────────
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-MA", { month: "long", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{ background: "linear-gradient(135deg, #1E2D40 0%, #1C2333 100%)" }}
    >
      {/* ── Formes décoratives en arrière-plan ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white opacity-5" />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white opacity-5" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-white opacity-5" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-white opacity-5" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-white opacity-3" />
        {/* Points lumineux */}
        <div className="absolute top-6 right-1/4 w-1 h-1 rounded-full bg-orange-400 opacity-60" />
        <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 rounded-full bg-orange-300 opacity-40" />
      </div>

      {/* ── Contenu principal ──────────────────────────────────── */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 px-8 py-8">

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <button
            onClick={onAvatarClick}
            className="relative w-28 h-28 rounded-full overflow-hidden group ring-4 ring-white/10 hover:ring-orange-400/50 transition-all duration-300 cursor-pointer"
          >
            {/* Photo ou initiales */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.prenom} ${user.nom}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white tracking-wider">{initiales}</span>
              </div>
            )}
            {/* Overlay hover caméra */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera size={22} className="text-white" />
            </div>
          </button>

          {/* Pastille statut connecté */}
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#1E2D40]" />
        </div>

        {/* Infos utilisateur */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {user.prenom} {user.nom}
          </h1>

          {/* Badge statut */}
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-xs font-bold text-orange-300 tracking-widest uppercase">
              Client Or
            </span>
          </div>

          {/* Métadonnées */}
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Calendar size={12} />
              <span>Membre depuis {formatDate(user.membreDepuis)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <MapPin size={12} />
              <span>{user.ville}, Maroc</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 text-xs">
              <CheckCircle size={12} />
              <span>Connecté</span>
            </div>
          </div>
        </div>

        {/* Boutons action mode édition */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              // ── Bouton Modifier ────────────────────────────
              <motion.button
                key="edit"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={onAvatarClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-orange-500/30"
              >
                <Edit2 size={14} />
                Modifier le profil
              </motion.button>
            ) : (
              // ── Boutons Sauvegarder + Annuler ──────────────
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-green-500/30"
                >
                  <Save size={14} />
                  Sauvegarder
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors duration-200 border border-white/20"
                >
                  <X size={14} />
                  Annuler
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilHero;