// ============================================================
// components/profil/ActiviteRecenteCard.jsx
// Carte "Activité Récente" : timeline des actions utilisateur
// ============================================================

import React from "react";
import {
  Clock, Calendar, Star, User, Wrench,
} from "lucide-react";
import CardWrapper, { CardHeader, CardBody } from "./CardWrapper";

/**
 * Retourne l'icône et la couleur selon le type d'activité
 */
const getActivityMeta = (type) => {
  const map = {
    reservation: {
      icon: Calendar,
      bg: "bg-green-50",
      color: "text-green-500",
      dot: "bg-green-400",
    },
    avis: {
      icon: Star,
      bg: "bg-amber-50",
      color: "text-amber-500",
      dot: "bg-amber-400",
    },
    profil: {
      icon: User,
      bg: "bg-blue-50",
      color: "text-blue-500",
      dot: "bg-blue-400",
    },
    mission: {
      icon: Wrench,
      bg: "bg-purple-50",
      color: "text-purple-500",
      dot: "bg-purple-400",
    },
  };
  return map[type] || { icon: Clock, bg: "bg-slate-50", color: "text-slate-400", dot: "bg-slate-300" };
};

/**
 * Formate une date ISO en texte relatif en français
 */
const formatRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  const w = Math.floor(diff / 604_800_000);

  if (h < 1) return "Il y a moins d'une heure";
  if (h < 24) return `Il y a ${h}h`;
  if (d === 1) return "Hier";
  if (d < 7) return `Il y a ${d} jours`;
  if (w === 1) return "Il y a 1 semaine";
  return `Il y a ${w} semaines`;
};

/**
 * ActiviteRecenteCard
 *
 * Props :
 * @param {Array} activites - Liste d'activités (mockActivite)
 */
const ActiviteRecenteCard = ({ activites = [] }) => {
  return (
    <CardWrapper delay={0.25} hover={false}>
      <CardHeader
        icon={Clock}
        title="Activité Récente"
        iconBg="bg-slate-50"
        iconColor="text-slate-500"
      />

      <CardBody className="px-6 py-4">
        <div className="relative">
          {/* Ligne verticale de timeline */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />

          <div className="space-y-4">
            {activites.map((activite, index) => {
              const meta = getActivityMeta(activite.type);
              const Icon = meta.icon;

              return (
                <div key={activite.id} className="relative flex items-start gap-4 pl-10">
                  {/* Point de timeline avec icône */}
                  <div className={`
                    absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                    border-2 border-white shadow-sm ${meta.bg}
                  `}>
                    <Icon size={13} className={meta.color} strokeWidth={2} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                      {activite.titre}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight truncate">
                      {activite.detail}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {formatRelative(activite.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lien voir tout */}
        <button className="w-full mt-5 pt-4 border-t border-slate-50 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors text-center">
          Voir toute l'activité →
        </button>
      </CardBody>
    </CardWrapper>
  );
};

export default ActiviteRecenteCard;