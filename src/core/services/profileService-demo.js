// Service de profil temporaire avec données mockées pour démo
// Utiliser ce fichier en remplacement de profileService.js quand Supabase n'est pas accessible

export const profileService = {
  // Récupérer le profil de l'utilisateur connecté (données mockées)
  async getUserProfile(userId) {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Données mockées selon le userId pour simuler différents types
    const isArtisan = userId.includes('artisan') || Math.random() > 0.5;
    
    if (isArtisan) {
      return {
        type: 'artisan',
        data: {
          id: userId,
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.com',
          telephone: '+212 6 12 34 56 78',
          photo_profil: null,
          description: 'Artisan qualifié avec 10 ans d\'expérience',
          localisation: 'Casablanca',
          disponibilite: 'Disponible',
          ville: 'Casablanca',
          codePostal: '20000',
          annee_experience: 10,
          cin: 'AB123456',
          metier: 'Électricien',
          sexe: 'Homme',
          statut_validation: true,
          missions_completees: 25,
          note_moyenne: '4.8',
          created_at: '2024-01-15T10:30:00Z',
          last_sign_in_at: new Date().toISOString()
        }
      };
    } else {
      return {
        type: 'particulier',
        data: {
          id: userId,
          nom: 'Martin',
          prenom: 'Sophie',
          email: 'sophie.martin@email.com',
          telephone: '+212 6 98 76 54 32',
          ville: 'Rabat',
          codePostal: '10000',
          cin: 'CD789012',
          sexe: 'Femme',
          artisans_favoris: 8,
          missions_postees: 3,
          avis_donnés: 12,
          reservations_actives: 2,
          created_at: '2024-02-20T14:15:00Z',
          last_sign_in_at: new Date().toISOString()
        }
      };
    }
  },

  // Mettre à jour le profil artisan (mock)
  async updateArtisanProfile(userId, profileData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('📝 Mise à jour profil artisan (mock):', profileData);
    return { ...profileData, id_artisan: userId };
  },

  // Mettre à jour le profil particulier (mock)
  async updateParticulierProfile(userId, profileData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('📝 Mise à jour profil particulier (mock):', profileData);
    return { ...profileData, id_particulier: userId };
  },

  // Uploader une photo de profil (mock)
  async uploadProfilePhoto(file, userId, userType) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('📷 Upload photo (mock):', file.name, userId, userType);
    // Retourner une URL fake
    return `https://picsum.photos/seed/${userId}/200/200.jpg`;
  }
};
