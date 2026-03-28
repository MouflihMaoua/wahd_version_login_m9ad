// ============================================================
// components/profil/InfoPersonnellesCard.jsx
// Carte "Informations Personnelles" : prénom, nom, email, tél, CIN
// React Hook Form + Zod — mode lecture / édition par carte
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Edit2, Save, X } from "lucide-react";
import CardWrapper, { CardHeader, CardBody } from "./CardWrapper";
import FloatingInput from "./FloatingInput";
import { profileService } from "../../services/profileService-demo";

// ── Schéma de validation Zod ──────────────────────────────
const schema = z.object({
  prenom: z
    .string()
    .min(2, "Minimum 2 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Lettres uniquement"),
  nom: z
    .string()
    .min(2, "Minimum 2 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Lettres uniquement"),
  email: z
    .string()
    .email("Adresse email invalide"),
  telephone: z
    .string()
    .regex(
      /^(\+212\s?[67]\d{2}\s?\d{3}\s?\d{3}|0[67]\d{8})$/,
      "Format invalide (ex: 06 12 34 56 78)"
    ),
  cin: z
    .string()
    .regex(/^[A-Za-z]{1,2}\d{5,6}$/, "Format CIN invalide (ex: AB123456)"),
});

/**
 * InfoPersonnellesCard
 *
 * Props :
 * @param {object}   user       - Données utilisateur
 * @param {function} onSuccess  - Callback succès sauvegarde → déclenche toast
 */
const InfoPersonnellesCard = ({ user, onSuccess, userType }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log(" InfoPersonnellesCard - user:", user);
  console.log(" InfoPersonnellesCard - userType:", userType);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      prenom: user?.prenom || "",
      nom: user?.nom || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
      cin: user?.cin || "",
    },
    mode: "onChange", // Validation en temps réel
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
      onSuccess?.("Informations personnelles mises à jour !");
    } catch (error) {
      console.error("❌ Erreur mise à jour infos personnelles:", error);
      onSuccess?.("Erreur lors de la mise à jour");
    }
  };

  // ── Annuler → réinitialiser le form ───────────────────────
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // ── Bouton d'action carte ──────────────────────────────────
  const EditButton = () =>
    !isEditing ? (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
      >
        <Edit2 size={13} /> Modifier
      </button>
    ) : null;

  return (
    <CardWrapper delay={0.1}>
      <CardHeader
        icon={User}
        title="Informations Personnelles"
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
        action={<EditButton />}
      />

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Prénom */}
            <FloatingInput
              label="Prénom"
              value={watched.prenom}
              isEditing={isEditing}
              register={register("prenom")}
              error={errors.prenom?.message}
              isValid={!errors.prenom && !!dirtyFields.prenom}
              placeholder="Votre prénom"
            />

            {/* Nom */}
            <FloatingInput
              label="Nom"
              value={watched.nom}
              isEditing={isEditing}
              register={register("nom")}
              error={errors.nom?.message}
              isValid={!errors.nom && !!dirtyFields.nom}
              placeholder="Votre nom"
            />

            {/* Email — pleine largeur */}
            <FloatingInput
              label="Email"
              value={watched.email}
              type="email"
              isEditing={isEditing}
              register={register("email")}
              error={errors.email?.message}
              isValid={!errors.email && !!dirtyFields.email}
              placeholder="votre@email.com"
              className="sm:col-span-2"
            />

            {/* Téléphone */}
            <FloatingInput
              label="Téléphone"
              value={watched.telephone}
              isEditing={isEditing}
              register={register("telephone")}
              error={errors.telephone?.message}
              isValid={!errors.telephone && !!dirtyFields.telephone}
              placeholder="+212 6XX XXX XXX"
            />

            {/* CIN */}
            <FloatingInput
              label="CIN"
              value={watched.cin}
              isEditing={isEditing}
              register={register("cin")}
              error={errors.cin?.message}
              isValid={!errors.cin && !!dirtyFields.cin}
              placeholder="AB123456"
            />
          </div>

          {/* Boutons sauvegarde / annulation — mode édition */}
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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

export default InfoPersonnellesCard;