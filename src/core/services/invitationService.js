import { supabase } from '../services/supabaseClient';

/**
 * Crée une nouvelle invitation d'un particulier vers un artisan
 * @param {Object} invitationData - Données de l'invitation
 * @param {string} invitationData.id_artisan - ID de l'artisan destinataire
 * @param {string} invitationData.service - Service demandé
 * @param {string} invitationData.message - Message personnalisé
 * @param {string} invitationData.description - Description détaillée
 * @returns {Promise<Object>} - Résultat de la création
 */
export const createInvitation = async (invitationData) => {
  try {
    console.log('🔧 Création de l\'invitation:', invitationData);
    
    // Validation des données requises
    const requiredFields = ['id_artisan', 'service', 'message'];
    const missingFields = requiredFields.filter(field => !invitationData[field] || invitationData[field].trim() === '');
    
    if (missingFields.length > 0) {
      throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
    }
    
    // Récupérer l'utilisateur connecté (particulier)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'utilisateur est un particulier
    const { data: profile } = await supabase
      .from('particulier')
      .select('id_particulier')
      .eq('id_particulier', user.id)
      .single();
    
    if (!profile) {
      throw new Error('Seul un particulier peut envoyer une invitation');
    }
    
    // Vérifier que l'artisan existe
    const { data: artisan } = await supabase
      .from('artisan')
      .select('id_artisan, nom, prenom')
      .eq('id_artisan', invitationData.id_artisan)
      .single();
    
    if (!artisan) {
      throw new Error('Artisan non trouvé');
    }
    
    // Vérifier si une invitation en attente existe déjà
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('id')
      .eq('id_particulier', user.id)
      .eq('id_artisan', invitationData.id_artisan)
      .eq('statut', 'en attente')
      .is('deleted_at', null)
      .single();
    
    if (existingInvitation) {
      throw new Error('Une invitation est déjà en attente pour cet artisan');
    }
    
    // Préparation des données pour l'insertion
    const invitationToInsert = {
      id_particulier: user.id,
      id_artisan: invitationData.id_artisan,
      service: invitationData.service.trim(),
      message: invitationData.message.trim(),
      description: invitationData.description?.trim() || null,
      statut: 'en attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('invitations')
      .insert([invitationToInsert])
      .select(`
        *,
        artisan:artisan!invitations_id_artisan_fkey(
          nom,
          prenom,
          specialite
        ),
        particulier:particulier!invitations_id_particulier_fkey(
          nom,
          prenom
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la création de l\'invitation:', error);
      
      // Gestion des erreurs spécifiques
      if (error.code === '23505') {
        throw new Error('Une invitation similaire existe déjà');
      } else if (error.code === '23503') {
        throw new Error('Référence invalide dans les données');
      } else {
        throw new Error('Erreur lors de la création de l\'invitation: ' + error.message);
      }
    }
    
    console.log('✅ Invitation créée avec succès:', data);
    
    return {
      success: true,
      data: data,
      message: 'Invitation envoyée avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la création de l\'invitation:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la création de l\'invitation'
    };
  }
};

/**
 * Récupère les invitations reçues par un artisan
 * @param {string} artisanId - ID de l'artisan
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Object>} - Liste des invitations
 */
export const getInvitationsForArtisan = async (artisanId, options = {}) => {
  try {
    let query = supabase
      .from('invitations')
      .select(`
        *,
        particulier:particulier!invitations_id_particulier_fkey(
          nom,
          prenom,
          email,
          telephone
        )
      `)
      .eq('id_artisan', artisanId)
      .is('deleted_at', null);
    
    // Filtrage par statut
    if (options.statut) {
      query = query.eq('statut', options.statut);
    }
    
    // Tri par date de création (plus récent en premier)
    query = query.order('created_at', { ascending: false });
    
    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des invitations:', error);
      throw new Error('Erreur lors de la récupération des invitations: ' + error.message);
    }
    
    console.log('✅ Invitations récupérées:', data?.length || 0, 'invitations');
    
    return {
      success: true,
      data: data || [],
      count: data?.length || 0
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des invitations:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des invitations'
    };
  }
};

/**
 * Récupère les invitations envoyées par un particulier
 * @param {string} particulierId - ID du particulier
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Object>} - Liste des invitations
 */
export const getInvitationsForParticulier = async (particulierId, options = {}) => {
  try {
    let query = supabase
      .from('invitations')
      .select(`
        *,
        artisan:artisan!invitations_id_artisan_fkey(
          nom,
          prenom,
          specialite,
          email
        )
      `)
      .eq('id_particulier', particulierId)
      .is('deleted_at', null);
    
    // Filtrage par statut
    if (options.statut) {
      query = query.eq('statut', options.statut);
    }
    
    // Tri par date de création (plus récent en premier)
    query = query.order('created_at', { ascending: false });
    
    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des invitations:', error);
      throw new Error('Erreur lors de la récupération des invitations: ' + error.message);
    }
    
    console.log('✅ Invitations récupérées:', data?.length || 0, 'invitations');
    
    return {
      success: true,
      data: data || [],
      count: data?.length || 0
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des invitations:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des invitations'
    };
  }
};

/**
 * Met à jour le statut d'une invitation
 * @param {string} invitationId - ID de l'invitation
 * @param {string} nouveauStatut - Nouveau statut ('acceptée' ou 'refusée')
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateInvitationStatus = async (invitationId, nouveauStatut) => {
  try {
    const statutsValides = ['acceptée', 'refusée'];
    
    if (!statutsValides.includes(nouveauStatut)) {
      throw new Error(`Statut invalide. Statuts valides: ${statutsValides.join(', ')}`);
    }
    
    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'utilisateur est bien l'artisan destinataire
    const { data: invitation } = await supabase
      .from('invitations')
      .select('id_artisan, statut')
      .eq('id', invitationId)
      .single();
    
    if (!invitation) {
      throw new Error('Invitation non trouvée');
    }
    
    if (invitation.id_artisan !== user.id) {
      throw new Error('Vous n\'êtes pas autorisé à modifier cette invitation');
    }
    
    if (invitation.statut !== 'en attente') {
      throw new Error('Cette invitation a déjà été traitée');
    }
    
    // Mise à jour du statut
    const { data, error } = await supabase
      .from('invitations')
      .update({
        statut: nouveauStatut,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId)
      .select(`
        *,
        particulier:particulier!invitations_id_particulier_fkey(
          nom,
          prenom,
          email
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw new Error('Erreur lors de la mise à jour du statut: ' + error.message);
    }
    
    console.log('✅ Statut de l\'invitation mis à jour:', data);
    
    return {
      success: true,
      data: data,
      message: `Invitation ${nouveauStatut} avec succès`
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la mise à jour du statut:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour du statut'
    };
  }
};

/**
 * Supprime logiquement une invitation (soft delete)
 * @param {string} invitationId - ID de l'invitation à supprimer
 * @returns {Promise<Object>} - Résultat de la suppression
 */
export const deleteInvitation = async (invitationId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'utilisateur est le propriétaire de l'invitation
    const { data: invitation } = await supabase
      .from('invitations')
      .select('id_particulier, id_artisan')
      .eq('id', invitationId)
      .single();
    
    if (!invitation) {
      throw new Error('Invitation non trouvée');
    }
    
    if (invitation.id_particulier !== user.id && invitation.id_artisan !== user.id) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer cette invitation');
    }
    
    // Soft delete
    const { error } = await supabase
      .from('invitations')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', invitationId);
    
    if (error) {
      console.error('❌ Erreur lors de la suppression de l\'invitation:', error);
      throw new Error('Erreur lors de la suppression de l\'invitation: ' + error.message);
    }
    
    console.log('✅ Invitation supprimée:', invitationId);
    
    return {
      success: true,
      message: 'Invitation supprimée avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la suppression de l\'invitation:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression de l\'invitation'
    };
  }
};

/**
 * Récupère les statistiques des invitations pour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} userType - Type d'utilisateur ('artisan' ou 'particulier')
 * @returns {Promise<Object>} - Statistiques des invitations
 */
export const getInvitationStats = async (userId, userType) => {
  try {
    let query;
    
    if (userType === 'artisan') {
      query = supabase
        .from('invitations')
        .select('statut, created_at')
        .eq('id_artisan', userId)
        .is('deleted_at', null);
    } else if (userType === 'particulier') {
      query = supabase
        .from('invitations')
        .select('statut, created_at')
        .eq('id_particulier', userId)
        .is('deleted_at', null);
    } else {
      throw new Error('Type d\'utilisateur invalide');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw new Error('Erreur lors de la récupération des statistiques: ' + error.message);
    }
    
    const stats = {
      total: data?.length || 0,
      en_attente: data?.filter(d => d.statut === 'en attente').length || 0,
      acceptees: data?.filter(d => d.statut === 'acceptée').length || 0,
      refusees: data?.filter(d => d.statut === 'refusée').length || 0,
      recentes: data?.filter(d => {
        const date = new Date(d.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date > weekAgo;
      }).length || 0
    };
    
    console.log('✅ Statistiques des invitations:', stats);
    
    return {
      success: true,
      data: stats
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des statistiques:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des statistiques'
    };
  }
};

/**
 * Valide les données d'une invitation
 * @param {Object} invitationData - Données de l'invitation à valider
 * @returns {Object} - Résultat de la validation
 */
export const validateInvitation = (invitationData) => {
  const errors = {};
  
  // Validation de l'artisan destinataire
  if (!invitationData.id_artisan) {
    errors.id_artisan = 'L\'artisan est requis';
  }
  
  // Validation du service
  if (!invitationData.service?.trim()) {
    errors.service = 'Le service est requis';
  }
  
  // Validation du message
  if (!invitationData.message?.trim()) {
    errors.message = 'Le message est requis';
  } else if (invitationData.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères';
  } else if (invitationData.message.trim().length > 500) {
    errors.message = 'Le message ne peut pas dépasser 500 caractères';
  }
  
  // Validation de la description
  if (invitationData.description && invitationData.description.trim().length > 1000) {
    errors.description = 'La description ne peut pas dépasser 1000 caractères';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};
