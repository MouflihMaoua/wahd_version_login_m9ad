// ============================================================
// components/profil/AdresseCard.jsx
// Carte "Adresse & Localisation" : ville, code postal
// React Hook Form + Zod — validation contexte marocain
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Edit2, Save, X } from "lucide-react";
import CardWrapper, { CardHeader, CardBody } from "./CardWrapper";
import FloatingInput from "./FloatingInput";
import { profileService } from "../../services/profileService-demo";

// ── Schéma de validation Zod ──────────────────────────────
const schema = z.object({
  ville: z
    .string()
    .min(2, "Ville requise (minimum 2 caractères)")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nom de ville invalide"),
  codePostal: z
    .string()
    .regex(/^\d{5}$/, "Code postal à 5 chiffres (Maroc)"),
});

/**
 * AdresseCard
 *
 * Props :
 * @param {object}   user       - Données utilisateur
 * @param {function} onSuccess  - Callback succès → toast
 */
const AdresseCard = ({ user, onSuccess, userType }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log(" AdresseCard - user:", user);
  console.log(" AdresseCard - userType:", userType);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ville:      user?.ville || "",
      codePostal: user?.codePostal || "",
    },
    mode: "onChange",
  });

  const watched = watch();

  // ── Soumission ─────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      // Appel réel à Supabase via profileService
      if (userType === 'artisan') {
        await profileService.updateArtisanProfile(user.id, data);
      } else {
        await profileService.updateParticulierProfile(user.id, data);
      }
      
      setIsEditing(false);
      onSuccess?.("Adresse mise à jour !");
    } catch (error) {
      console.error("❌ Erreur mise à jour adresse:", error);
      onSuccess?.("Erreur lors de la mise à jour");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <CardWrapper delay={0.2}>
      <CardHeader
        icon={MapPin}
        title="Adresse & Localisation"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
        action={
          !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              <Edit2 size={13} /> Modifier
            </button>
          )
        }
      />

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Ville */}
            <FloatingInput
              label="Ville"
              value={watched.ville}
              isEditing={isEditing}
              register={register("ville")}
              error={errors.ville?.message}
              isValid={!errors.ville && !!dirtyFields.ville}
              placeholder="Ex: Casablanca"
            />

            {/* Code Postal */}
            <FloatingInput
              label="Code Postal"
              value={watched.codePostal}
              isEditing={isEditing}
              register={register("codePostal")}
              error={errors.codePostal?.message}
              isValid={!errors.codePostal && !!dirtyFields.codePostal}
              placeholder="Ex: 20000"
            />
          </div>

          {/* Indication pays */}
          {!isEditing && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
              <span className="text-lg">🇲🇦</span>
              <span className="text-xs text-slate-400 font-medium">Maroc</span>
            </div>
          )}

          {/* Boutons en mode édition */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-50"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <Save size={14} />
                {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition-colors"
              >
                <X size={14} /> Annuler
              </button>
            </motion.div>
          )}
        </form>
      </CardBody>
    </CardWrapper>
  );
};

export default AdresseCard;