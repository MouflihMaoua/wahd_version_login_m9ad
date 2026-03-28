// src/pages/particulier/ProfilView.jsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Camera, Edit2, Save, X, Star,
  Briefcase, Clock, Award, Shield, Upload, CheckCircle, AlertCircle
} from 'lucide-react';
import UploadPhotoModal from '../shared/components/UploadPhotoModal';

export default function ProfilView() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  
  const [profile, setProfile] = useState({
    nom: "Sophie Martin",
    email: "sophie.martin@email.com",
    telephone: "06 12 34 56 78",
    adresse: "15 Rue Hassan II, Casablanca",
    bio: "Passionnée par la décoration d'intérieur et le design. Je cherche toujours les meilleurs artisans pour mes projets.",
    photoProfil: null,
    numeroCIN: "",
    carteCINRecto: null,
    carteCINVerso: null,
    preferences: {
      notifications: true,
      newsletter: false,
      langue: "français"
    },
    statistiques: {
      missionsCompletees: 12,
      artisansFavoris: 8,
      avisDonnes: 15
    }
  });

  const handlePhotoUpload = () => {
    setShowPhotoModal(true);
  };

  const handlePhotoSuccess = (file) => {
    setProfile({
      ...profile,
      photoProfil: file
    });
    setShowPhotoModal(false);
  };

  const tabs = [
    { id: 'informations', label: 'Informations', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Briefcase },
    { id: 'statistiques', label: 'Statistiques', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'informations' && (
                <motion.div
                  key="informations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Photo de profil */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Photo de profil</h3>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                          {profile.photoProfil ? (
                            <img src={profile.photoProfil} alt="Photo" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={handlePhotoUpload}
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Une photo professionnelle aide les artisans à vous identifier facilement.</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">Format JPG, PNG ou WebP</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">Taille maximale 2MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profile.nom}
                              onChange={(e) => setProfile({...profile, nom: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-gray-900">{profile.nom}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{profile.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={profile.telephone}
                              onChange={(e) => setProfile({...profile, telephone: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{profile.telephone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profile.adresse}
                              onChange={(e) => setProfile({...profile, adresse: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{profile.adresse}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Biographie</h3>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                    )}
                  </div>

                  {/* Carte d'identité */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Carte d'identité</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro CIN</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.numeroCIN}
                            onChange={(e) => setProfile({...profile, numeroCIN: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="AB123456"
                          />
                        ) : (
                          <p className="text-gray-900">{profile.numeroCIN || 'Non renseigné'}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Recto</label>
                          {isEditing ? (
                            <UploadPhotoModal
                              onUploadSuccess={(file) => setProfile({...profile, carteCINRecto: file})}
                              acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                              maxFileSize={5 * 1024 * 1024}
                            />
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              {profile.carteCINRecto ? (
                                <p className="text-sm text-green-600">✓ Fichier uploadé</p>
                              ) : (
                                <p className="text-sm text-gray-500">Aucun fichier</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Verso</label>
                          {isEditing ? (
                            <UploadPhotoModal
                              onUploadSuccess={(file) => setProfile({...profile, carteCINVerso: file})}
                              acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                              maxFileSize={5 * 1024 * 1024}
                            />
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              {profile.carteCINVerso ? (
                                <p className="text-sm text-green-600">✓ Fichier uploadé</p>
                              ) : (
                                <p className="text-sm text-gray-500">Aucun fichier</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'securite' && (
                <motion.div
                  key="securite"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Sécurité du compte</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Mot de passe</p>
                          <p className="text-sm text-gray-600">Dernière modification: il y a 30 jours</p>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                          Modifier
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                          <p className="text-sm text-gray-600">Ajoutez une couche de sécurité</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                          Activer
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Notifications par email</p>
                          <p className="text-sm text-gray-600">Recevoir des alertes sur les missions</p>
                        </div>
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            preferences: {...profile.preferences, notifications: !profile.preferences.notifications}
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profile.preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profile.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Newsletter</p>
                          <p className="text-sm text-gray-600">Actualités et conseils</p>
                        </div>
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            preferences: {...profile.preferences, newsletter: !profile.preferences.newsletter}
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profile.preferences.newsletter ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profile.preferences.newsletter ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'statistiques' && (
                <motion.div
                  key="statistiques"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{profile.statistiques.missionsCompletees}</p>
                      <p className="text-sm text-gray-600">Missions complétées</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{profile.statistiques.artisansFavoris}</p>
                      <p className="text-sm text-gray-600">Artisans favoris</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{profile.statistiques.avisDonnes}</p>
                      <p className="text-sm text-gray-600">Avis donnés</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Upload Photo */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Uploader une photo de profil</h3>
            <UploadPhotoModal
              onUploadSuccess={handlePhotoSuccess}
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFileSize={2 * 1024 * 1024}
            />
            <button
              onClick={() => setShowPhotoModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
