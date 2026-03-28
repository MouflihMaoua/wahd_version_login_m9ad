/**
 * ProfilView — Particulier Profile Page
 * Fetches real data from Supabase `particulier` table.
 * Falls back to auth.users metadata if no profile row exists.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Edit2, Save, X,
  Shield, Briefcase, Star, Award, Camera,
  CheckCircle, AlertCircle, RefreshCw, Loader2
} from 'lucide-react';
import { supabase } from '../../core/services/supabaseClient';
import { profileService } from '../../core/services/profileService';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';

// ── Skeleton ──────────────────────────────────────────────────────
const SkeletonField = () => (
  <div className="h-5 bg-gray-200 rounded-full animate-pulse w-3/4" />
);

// ── Field component ───────────────────────────────────────────────
const Field = ({ label, value, icon: Icon, editing, name, type = 'text', onChange, loading }) => (
  <div>
    <label className="block text-xs font-bold text-[#1A3A5C]/60 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {loading ? (
      <SkeletonField />
    ) : editing ? (
      <input
        type={type}
        name={name}
        defaultValue={value ?? ''}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#1A3A5C] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all bg-white"
      />
    ) : (
      <div className="flex items-center gap-2 text-sm text-[#1A3A5C]">
        {Icon && <Icon size={14} className="text-[#FF6B35] shrink-0" />}
        <span className={value ? 'font-medium' : 'text-gray-400 italic'}>
          {value || 'Non renseigné'}
        </span>
      </div>
    )}
  </div>
);

// ── Tab config ────────────────────────────────────────────────────
const TABS = [
  { id: 'informations', label: 'Informations', icon: User },
  { id: 'securite',     label: 'Sécurité',     icon: Shield },
  { id: 'statistiques', label: 'Statistiques', icon: Star },
];

// ── Main Component ────────────────────────────────────────────────
export default function ProfilView() {
  const { user: authUser } = useAuthStore();
  const [activeTab,  setActiveTab]  = useState('informations');
  const [isEditing,  setIsEditing]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState(null);
  const [profile,    setProfile]    = useState(null);
  const [editData,   setEditData]   = useState({});

  /* ── Fetch profile from Supabase ──────────────────────────────── */
  const fetchProfile = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.getUserProfile(authUser.id);

      if (result) {
        setProfile(result.data);
        setEditData(result.data);
      } else {
        // Fall back to auth user metadata
        const fallback = {
          nom:       authUser.name ?? '',
          prenom:    '',
          email:     authUser.email ?? '',
          telephone: '',
          ville:     '',
          codePostal:'',
          cin:       '',
          sexe:      '',
        };
        setProfile(fallback);
        setEditData(fallback);
      }
    } catch (err) {
      setError(err.message ?? 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  /* ── Handle field changes during edit ─────────────────────────── */
  const handleChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── Save to Supabase ─────────────────────────────────────────── */
  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true);
    try {
      await profileService.updateParticulierProfile(authUser.id, editData);
      setProfile(editData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès !');
    } catch (err) {
      toast.error(err.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile ?? {});
    setIsEditing(false);
  };

  const fullName = profile
    ? `${profile.prenom ?? ''} ${profile.nom ?? ''}`.trim() || profile.email
    : authUser?.email ?? '';

  const initials = fullName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C]">Mon Profil</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez vos informations personnelles</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1A3A5C] text-white rounded-xl text-sm font-semibold hover:bg-[#0f2236] transition-colors disabled:opacity-50"
            >
              <Edit2 size={15} />
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <X size={14} />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-semibold hover:bg-[#e55a25] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Enregistrer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={fetchProfile} className="ml-auto flex items-center gap-1 font-semibold hover:underline">
            <RefreshCw size={12} /> Réessayer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Left: Avatar + Tab nav ──────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C] flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {loading ? <Loader2 size={24} className="animate-spin opacity-60" /> : initials}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1A3A5C] rounded-lg flex items-center justify-center text-white shadow hover:bg-[#0f2236] transition-colors">
                  <Camera size={12} />
                </button>
              )}
            </div>

            {loading ? (
              <>
                <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <p className="font-bold text-[#1A3A5C] text-base">{fullName || '—'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
                <span className="mt-3 inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold rounded-full">
                  Particulier
                </span>
              </>
            )}
          </div>

          {/* Tab nav */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                  activeTab === tab.id
                    ? 'bg-[#FF6B35]/8 text-[#FF6B35] border-l-2 border-l-[#FF6B35]'
                    : 'text-gray-500 hover:text-[#1A3A5C] hover:bg-gray-50'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Tab content ───────────────────────────────── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">

            {/* ── Informations ──────────────────────────────────── */}
            {activeTab === 'informations' && (
              <motion.div
                key="informations"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Personal info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-[#1A3A5C] mb-5 flex items-center gap-2">
                    <User size={16} className="text-[#FF6B35]" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Prénom" name="prenom" value={isEditing ? editData.prenom : profile?.prenom}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="Nom" name="nom" value={isEditing ? editData.nom : profile?.nom}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="Email" icon={Mail} name="email" type="email"
                      value={isEditing ? editData.email : profile?.email}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="Téléphone" icon={Phone} name="telephone" type="tel"
                      value={isEditing ? editData.telephone : profile?.telephone}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="Sexe" name="sexe"
                      value={isEditing ? editData.sexe : profile?.sexe}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="CIN" name="cin"
                      value={isEditing ? editData.cin : profile?.cin}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                  </div>
                </div>

                {/* Location info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-[#1A3A5C] mb-5 flex items-center gap-2">
                    <MapPin size={16} className="text-[#FF6B35]" />
                    Localisation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Ville" icon={MapPin} name="ville"
                      value={isEditing ? editData.ville : profile?.ville}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                    <Field label="Code postal" name="codePostal"
                      value={isEditing ? editData.codePostal : profile?.codePostal}
                      editing={isEditing} onChange={handleChange} loading={loading} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Sécurité ────────────────────────────────────────── */}
            {activeTab === 'securite' && (
              <motion.div
                key="securite"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-[#1A3A5C] mb-5 flex items-center gap-2">
                    <Shield size={16} className="text-[#FF6B35]" />
                    Sécurité du compte
                  </h3>

                  {[
                    {
                      title: 'Mot de passe',
                      sub: 'Modifier votre mot de passe',
                      action: 'Modifier',
                      onClick: async () => {
                        const { error } = await supabase.auth.resetPasswordForEmail(
                          authUser?.email ?? '', { redirectTo: window.location.origin }
                        );
                        if (!error) toast.success('Email de réinitialisation envoyé !');
                        else toast.error('Erreur: ' + error.message);
                      },
                      style: 'border border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white',
                    },
                    {
                      title: 'Authentification à deux facteurs',
                      sub: 'Ajoutez une couche de sécurité supplémentaire',
                      action: 'Activer',
                      onClick: () => toast('Bientôt disponible', { icon: '🔒' }),
                      style: 'bg-[#FF6B35] text-white hover:bg-[#e55a25]',
                    },
                  ].map(item => (
                    <div key={item.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-[#1A3A5C] text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                      </div>
                      <button
                        onClick={item.onClick}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${item.style}`}
                      >
                        {item.action}
                      </button>
                    </div>
                  ))}

                  {/* Account info */}
                  <div className="p-4 bg-[#1A3A5C]/4 rounded-xl">
                    <p className="text-xs font-bold text-[#1A3A5C] mb-2">Compte connecté</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs text-gray-600">{authUser?.email}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Statistiques ─────────────────────────────────────── */}
            {activeTab === 'statistiques' && (
              <motion.div
                key="statistiques"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Briefcase, label: 'Demandes envoyées', value: '—', color: 'bg-[#FF6B35]/10 text-[#FF6B35]' },
                    { icon: Star,      label: 'Artisans contactés', value: '—', color: 'bg-amber-100 text-amber-600'    },
                    { icon: Award,     label: 'Missions terminées',  value: '—', color: 'bg-emerald-100 text-emerald-600'},
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                      <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon size={20} />
                      </div>
                      <p className="text-2xl font-bold text-[#1A3A5C]">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <AlertCircle size={14} />
                    Les statistiques seront disponibles prochainement.
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
