// ============================================================
// components/profil/DangerZoneCard.jsx
// Carte "Zone Critique" : suppression du compte
// Ouvre la modal DeleteAccountModal
// ============================================================

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import CardWrapper, { CardBody } from "./CardWrapper";

/**
 * DangerZoneCard
 *
 * Props :
 * @param {function} onDeleteClick - Ouvre la modal de confirmation
 */
const DangerZoneCard = ({ onDeleteClick }) => {
  return (
    <CardWrapper delay={0.35} hover={false} className="border-red-100">
      {/* Header rouge personnalisé */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-red-50">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={17} className="text-red-500" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-red-600 tracking-tight">Zone Critique</h3>
          <p className="text-xs text-red-400 font-medium mt-0.5">Actions irréversibles</p>
        </div>
      </div>

      <CardBody>
        {/* Avertissement */}
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 mb-4">
          <p className="text-xs text-red-600 leading-relaxed font-medium">
            La suppression de votre compte est <strong>définitive et irréversible</strong>.
            Toutes vos données, réservations et historique seront définitivement perdus.
          </p>
        </div>

        {/* Bouton suppression */}
        <button
          onClick={onDeleteClick}
          className="
            w-full flex items-center justify-center gap-2
            px-5 py-3 rounded-xl
            border-2 border-red-200 text-red-500
            hover:bg-red-500 hover:text-white hover:border-red-500
            text-sm font-semibold
            transition-all duration-200
            group
          "
        >
          <Trash2
            size={15}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          Supprimer mon compte
        </button>
      </CardBody>
    </CardWrapper>
  );
};

export default DangerZoneCard;