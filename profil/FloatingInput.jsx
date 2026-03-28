// ============================================================
// components/profil/FloatingInput.jsx
// Champ de formulaire réutilisable avec label flottant animé
// Deux modes : consultation (lecture seule) et édition (input actif)
// ============================================================

import React, { useState } from "react";
import { Eye, EyeOff, Check, AlertCircle, Lock } from "lucide-react";

/**
 * FloatingInput — champ universel avec label flottant
 *
 * Props :
 * @param {string}   label         - Libellé du champ
 * @param {string}   value         - Valeur courante (mode lecture)
 * @param {string}   type          - Type HTML (text, email, password…)
 * @param {boolean}  isEditing     - Mode édition ou consultation
 * @param {string}   error         - Message d'erreur Zod
 * @param {boolean}  isValid       - Champ valide (bordure verte + checkmark)
 * @param {object}   register      - Ref React Hook Form
 * @param {string}   placeholder   - Placeholder visible uniquement en édition
 * @param {boolean}  disabled      - Désactive le champ
 */
const FloatingInput = ({
  label,
  value = "",
  type = "text",
  isEditing = false,
  error,
  isValid = false,
  register,
  placeholder,
  disabled = false,
  className = "",
}) => {
  // Toggle afficher/masquer pour les champs password
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  // ── Couleur de bordure selon état ──────────────────────────
  const borderColor = () => {
    if (error) return "border-red-400 focus:ring-red-300";
    if (isValid && isEditing) return "border-green-400 focus:ring-green-200";
    if (isFocused) return "border-orange-400 focus:ring-orange-200";
    return "border-slate-200 focus:ring-orange-100";
  };

  // ── MODE CONSULTATION ──────────────────────────────────────
  if (!isEditing) {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
          {label}
        </label>
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <span className="text-sm font-medium text-slate-700">
            {type === "password" ? "••••••••" : value || "—"}
          </span>
          <Lock size={13} className="text-slate-300 flex-shrink-0 ml-2" />
        </div>
      </div>
    );
  }

  // ── MODE ÉDITION ───────────────────────────────────────────
  return (
    <div className={`relative ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          {...(register || {})}
          type={inputType}
          placeholder={placeholder || label}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 pr-10
            bg-white text-sm text-slate-800 font-medium
            border-2 rounded-xl outline-none
            transition-all duration-200
            focus:ring-4
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${borderColor()}
          `}
        />

        {/* Icône droite : toggle password ou état validation */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}

          {type !== "password" && isValid && (
            <span className="text-green-500">
              <Check size={15} strokeWidth={2.5} />
            </span>
          )}

          {type !== "password" && error && (
            <span className="text-red-400">
              <AlertCircle size={15} />
            </span>
          )}
        </div>
      </div>

      {/* Message d'erreur animé */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-shake">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;