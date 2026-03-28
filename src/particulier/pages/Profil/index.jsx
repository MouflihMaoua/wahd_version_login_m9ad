// ============================================================
// pages/particulier/Profil/index.jsx
// Page principale "Profil Client" — 7rayfi
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/services/supabaseClient";
import { profileService } from "../../../core/services/profileService-demo";
import ProfileHeader from "../../../shared/components/ProfileHeader";
import ProfileStats from "../../../shared/components/ProfileStats";
import ProfileEditModal from "../../../shared/components/ProfileEditModal";
import InfoPersonnellesCard from "../../../shared/components/InfoPersonnellesCard";
import AdresseCard from "../../../shared/components/AdresseCard";
import SecuriteCard from "../../../shared/components/SecuriteCard";
import ResumeCompteCard from "../../../shared/components/ResumeCompteCard";
import ActiviteRecenteCard from "../../../shared/components/ActiviteRecenteCard";
import DangerZoneCard from "../../../shared/components/DangerZoneCard";
import DeleteAccountModal from "../../../shared/components/DeleteAccountModal";
import { useToast } from "../../../core/hooks/useToast";
import toast from "react-hot-toast";

const ProfilClient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cinFile, setCinFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toasts, removeToast, toast } = useToast();

  // Charger le profil au montage du composant
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError("Utilisateur non connecté");
        navigate("/connexion");
        return;
      }

      // Récupérer le profil depuis la base de données
      const profile = await profileService.getUserProfile(user.id);
      
      if (!profile) {
        setError("Profil non trouvé");
        return;
      }

      setUser(profile.data);
      setUserType(profile.type);
      console.log("✅ Profil chargé:", profile);
      console.log("✅ Données utilisateur:", profile.data);
      console.log("✅ Type utilisateur:", profile.type);
      
    } catch (err) {
      console.error("❌ Erreur chargement profil:", err);
      setError(err.message || "Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSave = async (file, preview) => {
    try {
      setIsSubmitting(true);
      
      // Uploader la photo
      const photoUrl = await profileService.uploadProfilePhoto(file, user.id, userType);
      
      // Mettre à jour la base de données
      if (userType === 'artisan') {
        await profileService.updateArtisanProfile(user.id, {
          ...user,
          photo_profil: photoUrl
        });
      } else {
        await profileService.updateParticulierProfile(user.id, {
          ...user,
          photo_profil: photoUrl
        });
      }

      setUser(prev => ({ ...prev, photo_profil: photoUrl }));
      toast.success("Photo de profil mise à jour !");
      
    } catch (error) {
      console.error("❌ Erreur mise à jour photo:", error);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCinUpdate = (file) => {
    setCinFile(file);
    toast.success("CIN uploadé avec succès !");
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setIsSubmitting(true);
      
      // Mettre à jour selon le type d'utilisateur
      if (userType === 'artisan') {
        await profileService.updateArtisanProfile(user.id, updatedData);
      } else {
        await profileService.updateParticulierProfile(user.id, updatedData);
      }

      setUser(prev => ({ ...prev, ...updatedData }));
      setShowEditModal(false);
      toast.success("Profil mis à jour avec succès !");
      
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardSuccess = (message) => toast.success(message || "Modifications enregistrées !");

  const handleDeleteAccount = () => {
    toast.error("Fonctionnalité non implémentée");
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-brand-dark">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <button 
            onClick={loadUserProfile}
            className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Aucune donnée utilisateur trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          user={user}
          onEditClick={() => setShowEditModal(true)}
          onPhotoClick={handleAvatarSave}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Colonne de gauche */}
          <div className="lg:col-span-2 space-y-6">
            <InfoPersonnellesCard 
              user={user} 
              userType={userType}
              onSuccess={handleCardSuccess}
            />
            <AdresseCard 
              user={user} 
              userType={userType}
              onSuccess={handleCardSuccess}
            />
            <SecuriteCard 
              user={user} 
              onSuccess={handleCardSuccess}
            />
            <ResumeCompteCard 
              user={user} 
              userType={userType}
            />
          </div>

          {/* Colonne de droite */}
          <div className="space-y-6">
            <ProfileStats 
              user={user} 
              userType={userType}
            />
            <ActiviteRecenteCard 
              user={user} 
            />
            <DangerZoneCard 
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          </div>
        </div>

        {/* Modals */}
        {showEditModal && (
          <ProfileEditModal
            user={user}
            userType={userType}
            onClose={() => setShowEditModal(false)}
            onSave={handleProfileUpdate}
            isSubmitting={isSubmitting}
          />
        )}

        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilClient;