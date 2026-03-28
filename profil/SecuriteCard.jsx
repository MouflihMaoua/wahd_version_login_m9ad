// ============================================================
// components/profil/SecuriteCard.jsx
// Carte "Sécurité & Mot de passe"
// Toggle afficher/masquer, indicateur de force, validation Zod
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, Shield, Save, Eye, EyeOff } from "lucide-react";
import CardWrapper, { CardHeader, CardBody } from "./CardWrapper";
import PasswordStrengthBar from "./PasswordStrengthBar";

// ── Schéma de validation Zod ──────────────────────────────
const schema = z
  .object({
    motDePasseActuel: z
      .string()
      .min(1, "Mot de passe actuel requis"),
    nouveauMdp: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Une majuscule requise")
      .regex(/[0-9]/, "Un chiffre requis")
      .regex(/[^A-Za-z0-9]/, "Un caractère spécial requis"),
    confirmerMdp: z
      .string()
      .min(1, "Confirmation requise"),
  })
  .refine((d) => d.nouveauMdp === d.confirmerMdp, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmerMdp"],
  });

/**
 * Champ password avec toggle afficher/masquer
 */
const PasswordField = ({ label, register, error, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          {...register}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-10 bg-white text-sm text-slate-800 font-medium
            border-2 rounded-xl outline-none transition-all duration-200
            focus:ring-4 focus:ring-orange-100
            ${error ? "border-red-400" : "border-slate-200 focus:border-orange-400"}
          `}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

/**
 * SecuriteCard
 *
 * Props :
 * @param {function} onSuccess - Callback succès → toast
 */
const SecuriteCard = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      motDePasseActuel: "",
      nouveauMdp: "",
      confirmerMdp: "",
    },
    mode: "onChange",
  });

  const nouveauMdp = watch("nouveauMdp");

  // ── Soumission ─────────────────────────────────────────────
  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Changement mot de passe:", data);
    reset();
    onSuccess?.("Mot de passe mis à jour avec succès !");
  };

  return (
    <CardWrapper delay={0.3}>
      <CardHeader
        icon={Shield}
        title="Sécurité & Mot de passe"
        iconBg="bg-slate-50"
        iconColor="text-slate-600"
      />

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Mot de passe actuel */}
          <PasswordField
            label="Mot de passe actuel"
            register={register("motDePasseActuel")}
            error={errors.motDePasseActuel?.message}
            placeholder="••••••••"
          />

          {/* Nouveau mot de passe */}
          <div>
            <PasswordField
              label="Nouveau mot de passe"
              register={register("nouveauMdp")}
              error={errors.nouveauMdp?.message}
              placeholder="Min. 8 caractères"
            />
            {/* Barre de force */}
            <PasswordStrengthBar password={nouveauMdp} />
          </div>

          {/* Confirmation */}
          <PasswordField
            label="Confirmer le mot de passe"
            register={register("confirmerMdp")}
            error={errors.confirmerMdp?.message}
            placeholder="Répétez le mot de passe"
          />

          {/* Bouton submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <Lock size={14} />
            {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </motion.button>
        </form>
      </CardBody>
    </CardWrapper>
  );
};

export default SecuriteCard;