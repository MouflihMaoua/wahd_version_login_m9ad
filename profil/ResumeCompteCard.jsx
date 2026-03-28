// ============================================================
// components/profil/ResumeCompteCard.jsx
// Carte "Résumé du Compte" : stats, statut, dates méta
// ============================================================

import React from "react";
import { CheckCircle, Heart, Clock, Star, Award } from "lucide-react";
import CardWrapper, { CardHeader, CardBody } from "./CardWrapper";

/**
 * Stat individuelle dans la grille
 */
const StatItem = ({ icon: Icon, value, label, iconBg, iconColor }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 gap-2">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon size={18} className={iconColor} strokeWidth={2} />
    </div>
    <span className="text-2xl font-bold text-slate-800 leading-none">{value}</span>
    <span className="text-xs text-slate-400 font-medium text-center leading-tight">{label}</span>
  </div>
);

/**
 * ResumeCompteCard
 *
 * Props :
 * @param {object} user  - Données utilisateur
 * @param {object} stats - Statistiques { missionsTerminees, artisansFavoris, ... }
 */
const ResumeCompteCard = ({ user, stats }) => {
  // ── Formater date ───────────────────────────────────────────
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" });
  };

  const isAujourdhui = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const statsConfig = [
    {
      icon: CheckCircle,
      value: stats.missionsTerminees,
      label: "Missions terminées",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Heart,
      value: stats.artisansFavoris,
      label: "Artisans favoris",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      icon: Clock,
      value: stats.reservationsActives,
      label: "Réservations actives",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: Star,
      value: stats.avisLaisses,
      label: "Avis laissés",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <CardWrapper delay={0.15} hover={false}>
      {/* Header avec badge statut */}
      <div className="px-6 py-5 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Award size={17} className="text-orange-500" strokeWidth={2} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Résumé du Compte</h3>
          </div>

          {/* Badge statut CLIENT OR */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-200">
            <Star size={10} className="text-white" fill="white" />
            <span className="text-xs font-bold text-white tracking-wider uppercase">Client Or</span>
          </div>
        </div>
      </div>

      <CardBody>
        {/* Grille 2x2 des stats */}
        <div className="grid grid-cols-2 gap-3">
          {statsConfig.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>

        {/* Métadonnées */}
        <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Membre depuis</span>
            <span className="text-slate-700 font-semibold">{formatDate(user.membreDepuis)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Dernière connexion</span>
            <span className="text-green-600 font-semibold">
              {isAujourdhui(user.derniereConnexion) ? "Aujourd'hui" : formatDate(user.derniereConnexion)}
            </span>
          </div>
        </div>
      </CardBody>
    </CardWrapper>
  );
};

export default ResumeCompteCard;