// ============================================================
// components/profil/CardWrapper.jsx
// Conteneur carte réutilisable avec Framer Motion
// Utilisé par toutes les cartes de la page profil
// ============================================================

import React from "react";
import { motion } from "framer-motion";

/**
 * CardWrapper — enveloppe animée pour les cartes de profil
 *
 * Props :
 * @param {React.ReactNode} children   - Contenu de la carte
 * @param {string}          className  - Classes Tailwind additionnelles
 * @param {number}          delay      - Délai d'animation staggeré (ex: 0.1)
 * @param {boolean}         hover      - Activer l'effet hover élévation
 */
const CardWrapper = ({
  children,
  className = "",
  delay = 0,
  hover = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" } : {}}
      className={`
        bg-white rounded-2xl border border-slate-100
        shadow-sm transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// ── En-tête de carte standard ──────────────────────────────
export const CardHeader = ({ icon: Icon, title, iconBg = "bg-orange-50", iconColor = "text-orange-500", action }) => (
  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={17} className={iconColor} strokeWidth={2} />
        </div>
      )}
      <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ── Corps de carte standard ────────────────────────────────
export const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

export default CardWrapper;