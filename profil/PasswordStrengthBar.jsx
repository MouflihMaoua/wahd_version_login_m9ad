// ============================================================
// components/profil/PasswordStrengthBar.jsx
// Indicateur visuel de force du mot de passe — 5 niveaux
// Largeur et couleur animées avec CSS transitions
// ============================================================

import React, { useMemo } from "react";

/**
 * Calcule la force du mot de passe
 * @param {string} password
 * @returns {{ score: number, label: string, color: string, width: string }}
 */
const analyzePassword = (password) => {
  if (!password) return { score: 0, label: "", color: "", width: "0%" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Très faible", color: "bg-red-500",    width: "20%"  },
    { label: "Faible",      color: "bg-orange-500",  width: "40%"  },
    { label: "Moyen",       color: "bg-amber-400",   width: "60%"  },
    { label: "Fort",        color: "bg-lime-500",    width: "80%"  },
    { label: "Très fort",   color: "bg-green-500",   width: "100%" },
  ];

  return { score, ...levels[Math.max(0, Math.min(score - 1, 4))] };
};

/**
 * Props :
 * @param {string} password - Valeur du mot de passe à analyser
 */
const PasswordStrengthBar = ({ password }) => {
  const strength = useMemo(() => analyzePassword(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Barre de progression */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      {/* Critères détaillés */}
      <div className="grid grid-cols-2 gap-1">
        {[
          { test: password.length >= 8,         label: "8 caractères minimum" },
          { test: /[A-Z]/.test(password),        label: "Une majuscule" },
          { test: /[0-9]/.test(password),        label: "Un chiffre" },
          { test: /[^A-Za-z0-9]/.test(password), label: "Un caractère spécial" },
        ].map((criterion) => (
          <div
            key={criterion.label}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              criterion.test ? "text-green-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                criterion.test ? "bg-green-500" : "bg-slate-300"
              }`}
            />
            {criterion.label}
          </div>
        ))}
      </div>

      {/* Label de force */}
      <p className={`text-xs font-semibold ${
        strength.score <= 2 ? "text-red-500" :
        strength.score === 3 ? "text-amber-500" :
        "text-green-600"
      }`}>
        {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrengthBar;