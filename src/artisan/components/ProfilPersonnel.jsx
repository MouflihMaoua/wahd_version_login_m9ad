import { useState } from "react";
import { Star, User, MapPin, Phone, Mail, Briefcase, Calendar, Award } from 'lucide-react';

// ─── DATA SIMULÉE (à remplacer par API) ─────────────────────────────────
const MOCK_USERS = {
  artisan: {
    id: 7,
    nom: "El Amrani",
    prenom: "Youssef",
    email: "youssef.elamrani@example.com",
    telephone: "06 12 34 56 78",
    ville: "Casablanca",
    metier_principal: "Plomberie / Électricité",
    bio: "Artisan plombier-électricien avec 8 ans d'expérience. Spécialiste en installation, dépannage et rénovation. Disponible 24/7 pour les urgences.",
    missions_total: 342,
    membre_depuis: "Mars 2022",
    tarif_horaire: 350,
    zone_intervention: ["Casablanca Centre", "Ain Sebaa", "Sidi Maârouf", "Maârif"],
    certifications: ["CAP Plomberie", "Certification Électrique", "Permis d'intervention"],
    disponibilites: {
      lundi: "08:00-18:00",
      mardi: "08:00-18:00", 
      mercredi: "08:00-18:00",
      jeudi: "08:00-18:00",
      vendredi: "08:00-18:00",
      samedi: "09:00-14:00",
      dimanche: "Fermé"
    }
  },
  particulier: {
    id: 1,
    nom: "Benmoussa",
    prenom: "Leila",
    email: "leila.benmoussa@example.com",
    telephone: "06 98 76 54 32",
    ville: "Rabat",
    date_inscription: "Janvier 2023",
    missions_realisees: 12,
    artisans_favoris: [7, 15, 23],
    dernier_connexion: "Il y a 2 heures"
  }
};

const MOCK_AVIS = {
  // Avis reçus par l'artisan (ceux qu'il peut voir dans son espace)
  artisan_recus: [
    { id:1, client:"Sara El Fassi", note:5, service:"Plomberie", date:"20 Fév 2026", commentaire:"Travail absolument impeccable ! Youssef a résolu ma fuite d'eau en 45 minutes chrono.", avatar:"S", color:"#f97316" },
    { id:2, client:"Omar Kettani", note:4, service:"Électricité", date:"12 Fév 2026", commentaire:"Bon travail dans l'ensemble. Petit retard mais il a prévenu.", avatar:"O", color:"#3b82f6" },
    { id:3, client:"Leila Benmoussa", note:5, service:"Plomberie", date:"5 Fév 2026", commentaire:"Deuxième fois que je fais appel à Youssef. Toujours aussi sérieux.", avatar:"L", color:"#22c55e" }
  ],
  // Avis donnés par le particulier (ceux qu'il peut voir dans son espace)
  particulier_donne: [
    { id:4, artisan:"Youssef El Amrani", note:5, service:"Plomberie", date:"5 Fév 2026", commentaire:"Deuxième fois que je fais appel à Youssef. Toujours aussi sérieux et efficace.", avatar:"Y", color:"#f97316" },
    { id:5, artisan:"Karim Bennani", note:4, service:"Peinture", date:"15 Jan 2026", commentaire:"Bon travail mais un peu cher pour la qualité rendue.", avatar:"K", color:"#a855f7" }
  ]
};

// ─── COMPOSANTS UTILITAIRES ───────────────────────────────────────────
function Stars({ note, size=14 }) {
  return (
    <span className="inline-flex gap-1">
      {[1,2,3,4,5].map(i=>(
        <span key={i}
          className="cursor-default transition-all duration-200 inline-block"
          style={{
            fontSize: size,
            color: note>=i ? "#f59e0b" : "#e5e7eb",
          }}
        >★</span>
      ))}
    </span>
  );
}

function Badge({ score, total }) {
  if (score >= 4.8 && total >= 50) return { label:"Élite ⚡", color:"#d4a853" };
  if (score >= 4.5 && total >= 20) return { label:"Expert 🏆", color:"#a855f7" };
  if (score >= 4.0 && total >= 10) return { label:"Fiable ✓", color:"#22c55e" };
  return { label:"Nouveau 🌱", color:"#3b82f6" };
}

// ════════════════════════════════════════════════════════════════
export default function ProfilPersonnel({ userType = 'artisan' }) {
  const [activeTab, setActiveTab] = useState('informations');
  const userData = MOCK_USERS[userType];
  const avisData = MOCK_AVIS[userType === 'artisan' ? 'artisan_recus' : 'particulier_donne'];
  
  const score = avisData.length > 0 ? (avisData.reduce((sum, a) => sum + a.note, 0) / avisData.length).toFixed(1) : "0.0";
  const badge = Badge(score, avisData.length);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil non trouvé</h2>
          <p className="text-gray-600">Les informations de profil ne sont pas disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-lg shadow-lg shadow-brand-orange/20">
              {userType === 'artisan' ? '🔨' : '👤'}
            </div>
            <div>
              <div className="text-sm font-bold">Mon Profil</div>
              <div className="text-xs text-gray-500 font-mono">
                {userType === 'artisan' ? 'Espace artisan' : 'Espace particulier'}
              </div>
            </div>
          </div>
          <div className={`
            text-xs font-semibold px-3 py-1 rounded-full
            ${userType === 'artisan' 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : 'bg-blue-50 text-blue-600 border border-blue-200'
            }
          `}>
            {userType === 'artisan' ? 'Artisan vérifié' : 'Particulier'}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
          <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
            <div className="flex items-start gap-6 flex-wrap">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userData.prenom[0]}{userData.nom[0]}
              </div>

              {/* Infos principales */}
              <div className="flex-1 min-w-64">
                <h1 className="text-2xl font-black text-gray-900 mb-2">
                  {userData.prenom} {userData.nom}
                </h1>
                
                {userType === 'artisan' && (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <Stars note={parseFloat(score)} size={16}/>
                      <span className="text-sm text-gray-600">
                        <strong>{avisData.length}</strong> avis • Score <strong>{score}/5</strong>
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: badge.color, background: badge.color + '20' }}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {userData.ville}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {userData.metier_principal}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Membre depuis {userData.membre_depuis}
                      </span>
                    </div>
                  </>
                )}

                {userType === 'particulier' && (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">
                        <strong>{userData.missions_realisees}</strong> missions réalisées
                      </span>
                      <span className="text-sm text-gray-600">
                        <strong>{userData.artisans_favoris.length}</strong> artisans favoris
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {userData.ville}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Inscrit depuis {userData.date_inscription}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-brand-orange/90 transition-colors">
                  Modifier le profil
                </button>
                {userType === 'artisan' && (
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                    Voir ma réputation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="flex border-b border-gray-200">
            {userType === 'artisan' ? [
              { id: 'informations', label: 'Informations', icon: User },
              { id: 'avis', label: 'Mes avis', icon: Star },
              { id: 'disponibilites', label: 'Disponibilités', icon: Calendar },
              { id: 'certifications', label: 'Certifications', icon: Award }
            ] : [
              { id: 'informations', label: 'Informations', icon: User },
              { id: 'avis', label: 'Mes avis donnés', icon: Star },
              { id: 'favoris', label: 'Artisans favoris', icon: Briefcase }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors
                  ${activeTab === tab.id 
                    ? 'text-brand-orange border-b-2 border-brand-orange bg-brand-orange/5' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Onglet Informations */}
          {activeTab === 'informations' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Informations personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-900">{userData.email}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-900">{userData.telephone}</span>
                  </div>
                </div>

                {userType === 'artisan' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-900">{userData.ville}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Métier principal</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="text-gray-900">{userData.metier_principal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {userType === 'artisan' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">{userData.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Avis */}
          {activeTab === 'avis' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {userType === 'artisan' ? 'Avis reçus' : 'Avis donnés'}
              </h3>
              
              {avisData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">⭐</div>
                  <p className="text-sm">
                    {userType === 'artisan' 
                      ? "Vous n'avez pas encore reçu d'avis" 
                      : "Vous n'avez pas encore donné d'avis"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {avisData.map((avis) => (
                    <div key={avis.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border
                          ${avis.color + "18"} ${avis.color} ${avis.color + "30"}
                        `}>
                          {avis.avatar}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {userType === 'artisan' ? avis.client : avis.artisan}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {avis.service}
                            </span>
                            <span className="text-xs text-gray-400">
                              {avis.date}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Stars note={avis.note} size={14}/>
                            <span className="text-xs font-bold" style={{ 
                              color: avis.note >= 4 ? "#f59e0b" : avis.note === 3 ? "#3b82f6" : "#ef4444"
                            }}>
                              {avis.note}/5
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 italic">"{avis.commentaire}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Disponibilités (artisan uniquement) */}
          {activeTab === 'disponibilites' && userType === 'artisan' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Disponibilités</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userData.disponibilites).map(([jour, heures]) => (
                  <div key={jour} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">{jour}</span>
                    <span className="text-sm text-gray-600">{heures}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Certifications (artisan uniquement) */}
          {activeTab === 'certifications' && userType === 'artisan' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Award size={20} className="text-brand-orange" />
                    <span className="font-medium text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Favoris (particulier uniquement) */}
          {activeTab === 'favoris' && userType === 'particulier' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Artisans favoris</h3>
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm">Fonctionnalité en développement</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
