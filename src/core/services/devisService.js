import { supabase } from '../services/supabaseClient';

/**
 * Crée un nouveau devis dans la base de données
 * @param {Object} devisData - Données du devis à créer
 * @returns {Promise<Object>} - Résultat de la création
 */
export const createDevis = async (devisData) => {
  try {
    console.log('🔧 Création du devis:', devisData);
    
    // Validation des données requises
    const requiredFields = ['nom_client', 'email_client', 'adresse_client', 'service', 'description', 'delai', 'montant_ht'];
    const missingFields = requiredFields.filter(field => !devisData[field] || devisData[field].trim() === '');
    
    if (missingFields.length > 0) {
      throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
    }
    
    // Récupérer l'utilisateur connecté pour obtenir id_artisan
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Préparation des données pour l'insertion selon votre structure
    const devisToInsert = {
      id_artisan: user.id, // Utiliser l'ID de l'utilisateur connecté
      id_particulier: null, // Sera rempli si le devis est pour un particulier
      nom_particulier: devisData.nom_client.trim(), // Nom du client
      telephone: devisData.telephone_client?.trim() || null,
      email: devisData.email_client.trim(),
      adresse: devisData.adresse_client.trim(),
      service: devisData.service,
      description: devisData.description.trim(),
      notes: devisData.notes?.trim() || null,
      delai: devisData.delai.trim(),
      montant_ht: parseFloat(devisData.montant_ht) || 0,
      tva: parseFloat(devisData.tva) || 20,
      montant_ttc: parseFloat(devisData.montant_ttc) || 0,
      articles: [], // Sera implémenté plus tard
      statut: 'brouillon',
      date_creation: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('devis')
      .insert([devisToInsert])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la création du devis:', error);
      
      // Gestion des erreurs spécifiques
      if (error.code === '23505') {
        throw new Error('Un numéro de devis existe déjà');
      } else if (error.code === '23503') {
        throw new Error('Référence invalide dans les données');
      } else {
        throw new Error('Erreur lors de la création du devis: ' + error.message);
      }
    }
    
    console.log('✅ Devis créé avec succès:', data);
    
    return {
      success: true,
      data: data,
      message: 'Devis créé avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la création du devis:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la création du devis'
    };
  }
};

/**
 * Met à jour le statut d'un devis
 * @param {string} devisId - ID du devis
 * @param {string} nouveauStatut - Nouveau statut (brouillon, envoyé, accepté, refusé, expiré)
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateStatutDevis = async (devisId, nouveauStatut) => {
  try {
    const statutsValides = ['brouillon', 'envoyé', 'accepté', 'refusé', 'expiré'];
    
    if (!statutsValides.includes(nouveauStatut)) {
      throw new Error(`Statut invalide. Statuts valides: ${statutsValides.join(', ')}`);
    }
    
    const { data, error } = await supabase
      .from('devis')
      .update({
        statut: nouveauStatut,
        updated_at: new Date().toISOString()
      })
      .eq('id', devisId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw new Error('Erreur lors de la mise à jour du statut: ' + error.message);
    }
    
    console.log('✅ Statut du devis mis à jour:', data);
    
    return {
      success: true,
      data: data,
      message: `Statut mis à jour: ${nouveauStatut}`
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
 * Récupère tous les devis d'un artisan
 * @param {string} artisanId - ID de l'artisan
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Object>} - Liste des devis
 */
export const getDevisByArtisan = async (artisanId, options = {}) => {
  try {
    let query = supabase
      .from('devis')
      .select('*')
      .eq('id_artisan', artisanId);
    
    // Filtrage par statut
    if (options.statut) {
      query = query.eq('statut', options.statut);
    }
    
    // Filtrer les devis non supprimés
    query = query.is('deleted_at', null);
    
    // Tri
    const orderBy = options.orderBy || 'created_at';
    const order = options.order || 'desc';
    query = query.order(orderBy, { ascending: order === 'asc' });
    
    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des devis:', error);
      throw new Error('Erreur lors de la récupération des devis: ' + error.message);
    }
    
    console.log('✅ Devis récupérés:', data?.length || 0, 'devis');
    
    return {
      success: true,
      data: data || [],
      count: data?.length || 0
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des devis:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des devis'
    };
  }
};

/**
 * Récupère un devis spécifique par son ID
 * @param {string} devisId - ID du devis
 * @returns {Promise<Object>} - Détails du devis
 */
export const getDevisById = async (devisId) => {
  try {
    const { data, error } = await supabase
      .from('devis')
      .select('*')
      .eq('id', devisId)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la récupération du devis:', error);
      throw new Error('Erreur lors de la récupération du devis: ' + error.message);
    }
    
    if (!data) {
      throw new Error('Devis non trouvé');
    }
    
    console.log('✅ Devis récupéré:', data);
    
    return {
      success: true,
      data: data
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération du devis:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération du devis'
    };
  }
};

/**
 * Supprime logiquement un devis (soft delete)
 * @param {string} devisId - ID du devis à supprimer
 * @returns {Promise<Object>} - Résultat de la suppression
 */
export const deleteDevis = async (devisId) => {
  try {
    const { error } = await supabase
      .from('devis')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', devisId);
    
    if (error) {
      console.error('❌ Erreur lors de la suppression du devis:', error);
      throw new Error('Erreur lors de la suppression du devis: ' + error.message);
    }
    
    console.log('✅ Devis supprimé:', devisId);
    
    return {
      success: true,
      message: 'Devis supprimé avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la suppression du devis:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression du devis'
    };
  }
};

/**
 * Calcule le montant TTC à partir du HT et de la TVA
 * @param {number} montantHt - Montant HT
 * @param {number} tva - Taux de TVA en pourcentage
 * @returns {number} - Montant TTC
 */
export const calculerMontantTTC = (montantHt, tva = 20) => {
  const ht = parseFloat(montantHt) || 0;
  const tauxTva = parseFloat(tva) || 20;
  return ht + (ht * tauxTva / 100);
};

/**
 * Valide les données d'un devis
 * @param {Object} devisData - Données du devis à valider
 * @returns {Object} - Résultat de la validation
 */
export const validateDevis = (devisData) => {
  const errors = {};
  
  // Validation des informations client
  if (!devisData.nom_client?.trim()) {
    errors.nom_client = 'Le nom du client est requis';
  }
  
  if (!devisData.email_client?.trim()) {
    errors.email_client = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(devisData.email_client)) {
    errors.email_client = 'L\'email n\'est pas valide';
  }
  
  if (devisData.telephone_client && !/^0[5-7]\d{8}$/.test(devisData.telephone_client.replace(/\s/g, ''))) {
    errors.telephone_client = 'Le téléphone n\'est pas valide';
  }
  
  if (!devisData.adresse_client?.trim()) {
    errors.adresse_client = 'L\'adresse est requise';
  }
  
  // Validation des détails du service
  if (!devisData.service) {
    errors.service = 'Le service est requis';
  }
  
  if (!devisData.description?.trim()) {
    errors.description = 'La description est requise';
  }
  
  if (!devisData.delai?.trim()) {
    errors.delai = 'Le délai est requis';
  }
  
  // Validation de la tarification
  if (!devisData.montant_ht || parseFloat(devisData.montant_ht) <= 0) {
    errors.montant_ht = 'Le montant HT est requis et doit être supérieur à 0';
  }
  
  if (devisData.tva && (parseFloat(devisData.tva) < 0 || parseFloat(devisData.tva) > 100)) {
    errors.tva = 'La TVA doit être entre 0 et 100';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

/**
 * Récupère les statistiques des devis pour un artisan
 * @param {string} artisanId - ID de l'artisan
 * @returns {Promise<Object>} - Statistiques des devis
 */
export const getDevisStats = async (artisanId) => {
  try {
    const { data, error } = await supabase
      .from('devis')
      .select('statut, montant_ttc')
      .eq('id_artisan', artisanId)
      .is('deleted_at', null);
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw new Error('Erreur lors de la récupération des statistiques: ' + error.message);
    }
    
    const stats = {
      total: data?.length || 0,
      brouillons: data?.filter(d => d.statut === 'brouillon').length || 0,
      envoyes: data?.filter(d => d.statut === 'envoyé').length || 0,
      acceptes: data?.filter(d => d.statut === 'accepté').length || 0,
      refuses: data?.filter(d => d.statut === 'refusé').length || 0,
      expires: data?.filter(d => d.statut === 'expiré').length || 0,
      chiffreAffaires: data?.filter(d => d.statut === 'accepté').reduce((sum, d) => sum + (d.montant_ttc || 0), 0) || 0,
      montantMoyen: data?.length > 0 ? data.reduce((sum, d) => sum + (d.montant_ttc || 0), 0) / data.length : 0
    };
    
    console.log('✅ Statistiques des devis:', stats);
    
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
