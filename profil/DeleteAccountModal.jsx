// ============================================================
// components/profil/DeleteAccountModal.jsx
// Modal de confirmation suppression de compte
// Requiert la saisie de "SUPPRIMER" pour activer le bouton
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2 } from "lucide-react";

/**
 * DeleteAccountModal
 *
 * Props :
 * @param {boolean}  isOpen    - Visibilité de la modal
 * @param {function} onClose   - Ferme la modal
 * @param {function} onConfirm - Callback suppression confirmée
 */
const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [input, setInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = input === "SUPPRIMER";

  // ── Confirmer la suppression ───────────────────────────────
  const handleConfirm = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    // Simule l'appel API de suppression (remplacer par Axios)
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm?.();
    handleClose();
  };

  // ── Fermer + reset ─────────────────────────────────────────
  const handleClose = () => {
    setInput("");
    setIsDeleting(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(239,68,68,0.08)",
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={17} className="text-red-500" strokeWidth={2} />
                </div>
                <h2 className="text-sm font-bold text-red-700">Supprimer mon compte</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Corps */}
            <div className="p-6 space-y-5">
              {/* Avertissement */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-800">
                  Cette action est <span className="text-red-500">irréversible</span>.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  En supprimant votre compte, vous perdrez définitivement :
                </p>
                <ul className="text-sm text-slate-500 space-y-1 ml-4">
                  {[
                    "Toutes vos réservations et missions",
                    "Votre historique d'activité",
                    "Vos artisans favoris",
                    "Vos avis et évaluations",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Champ de confirmation */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Tapez <strong className="text-red-500">SUPPRIMER</strong> pour confirmer
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="SUPPRIMER"
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 text-sm font-mono font-bold
                    outline-none transition-all duration-200
                    focus:ring-4
                    ${isConfirmed
                      ? "border-red-400 text-red-600 bg-red-50 focus:ring-red-100"
                      : "border-slate-200 text-slate-800 focus:border-slate-400 focus:ring-slate-100"
                    }
                  `}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isConfirmed || isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-red-200"
              >
                <Trash2 size={14} />
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;