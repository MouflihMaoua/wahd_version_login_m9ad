import { supabase } from './supabaseClient';

export const profileService = {
  // Récupérer le profil de l'utilisateur connecté
  async getUserProfile(userId) {
    try {
      // Vérifier d'abord si c'est un artisan
      const { data: artisan, error: artisanError } = await supabase
        .from('artisan')
        .select('*')
        .eq('id_artisan', userId)
        .maybeSingle();

      if (artisan && !artisanError) {
        return {
          type: 'artisan',
          data: {
            id: artisan.id_artisan,
            nom: artisan.nom_artisan,
            prenom: artisan.prenom_artisan,
            email: artisan.email_artisan,
            telephone: artisan.telephone_artisan,
            photo_profil: artisan.photo_profil,
            description: artisan.description,
            localisation: artisan.localisation,
            disponibilite: artisan.disponibilite,
            ville: artisan.ville,
            codePostal: artisan.code_postale_artisan,
            annee_experience: artisan.annee_experience,
            cin: artisan.cin,
            metier: artisan.metier,
            sexe: artisan.sexe,
            statut_validation: artisan.statut_validation
          }
        };
      }

      // Sinon vérifier si c'est un particulier
      const { data: particulier, error: particulierError } = await supabase
        .from('particulier')
        .select('*')
        .eq('id_particulier', userId)
        .maybeSingle();

      if (particulier && !particulierError) {
        return {
          type: 'particulier',
          data: {
            id: particulier.id_particulier,
            nom: particulier.nom_particulier,
            prenom: particulier.prenom_particulier,
            email: particulier.email_particulier,
            telephone: particulier.telephone_particulier,
            ville: particulier.ville,
            codePostal: particulier.code_postale_particulier,
            cin: particulier.cin,
            sexe: particulier.sexe
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Erreur getUserProfile:', error);
      throw error;
    }
  },

  // Mettre à jour le profil artisan
  async updateArtisanProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('artisan')
        .update({
          nom_artisan: profileData.nom,
          prenom_artisan: profileData.prenom,
          email_artisan: profileData.email,
          telephone_artisan: profileData.telephone,
          photo_profil: profileData.photo_profil,
          description: profileData.description,
          localisation: profileData.localisation,
          disponibilite: profileData.disponibilite,
          ville: profileData.ville,
          code_postale_artisan: profileData.codePostal,
          annee_experience: profileData.annee_experience,
          cin: profileData.cin,
          metier: profileData.metier,
          sexe: profileData.sexe
        })
        .eq('id_artisan', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur updateArtisanProfile:', error);
      throw error;
    }
  },

  // Mettre à jour le profil particulier
  async updateParticulierProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('particulier')
        .update({
          nom_particulier: profileData.nom,
          prenom_particulier: profileData.prenom,
          email_particulier: profileData.email,
          telephone_particulier: profileData.telephone,
          ville: profileData.ville,
          code_postale_particulier: profileData.codePostal,
          cin: profileData.cin,
          sexe: profileData.sexe
        })
        .eq('id_particulier', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur updateParticulierProfile:', error);
      throw error;
    }
  },

  // Uploader une photo de profil
  async uploadProfilePhoto(file, userId, userType) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erreur uploadProfilePhoto:', error);
      throw error;
    }
  }
};
