import { supabase } from '../services/supabaseClient';

/**
 * Récupère les artisans avec qui le particulier connecté a eu des conversations
 * @returns {Promise<Object>} - Liste des artisans uniques
 */
export const getArtisansFromConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    // Récupérer tous les messages où le particulier est impliqué
    const { data: messages, error: messagesError } = await supabase
      .from('message_chat')
      .select('id_artisan')
      .eq('id_particulier', user.id);

    if (messagesError) throw messagesError;

    if (!messages || messages.length === 0) {
      return {
        success: true,
        data: [],
        message: 'Aucune conversation trouvée'
      };
    }

    // Extraire les IDs uniques des artisans
    const artisanIds = [...new Set(messages.map(m => m.id_artisan))];

    // Récupérer les informations des artisans
    const { data: artisans, error: artisansError } = await supabase
      .from('artisan')
      .select('id_artisan, nom_artisan, prenom_artisan, metier, ville, photo_profil, description')
      .in('id_artisan', artisanIds);

    if (artisansError) throw artisansError;

    // Formater les données
    const formattedArtisans = artisans?.map(artisan => ({
      ...artisan,
      nom_complet: `${artisan.prenom_artisan || ''} ${artisan.nom_artisan || ''}`.trim()
    })) || [];

    return {
      success: true,
      data: formattedArtisans,
      count: formattedArtisans.length
    };

  } catch (error) {
    console.error('💥 Erreur récupération artisans des conversations:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des artisans',
      data: []
    };
  }
};

/**
 * Crée une nouvelle évaluation (avis) d'un particulier vers un artisan
 * @param {Object} evaluationData - Données de l'évaluation
 * @param {string} evaluationData.id_artisan - ID de l'artisan évalué
 * @param {number} evaluationData.note - Note de 1 à 5
 * @param {string} evaluationData.commentaire - Commentaire optionnel
 * @returns {Promise<Object>} - Résultat de la création
 */
export const createEvaluation = async (evaluationData) => {
  try {
    console.log('🔧 Création de l\'évaluation:', evaluationData);
    
    // Validation des données requises
    if (!evaluationData.id_artisan) {
      throw new Error('L\'ID de l\'artisan est requis');
    }
    
    if (!evaluationData.note || evaluationData.note < 1 || evaluationData.note > 5) {
      throw new Error('La note doit être entre 1 et 5');
    }
    
    // Récupérer l'utilisateur connecté (particulier)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'utilisateur est un particulier
    const { data: profile, error: profileError } = await supabase
      .from('particulier')
      .select('id_particulier, nom_particulier, prenom_particulier')
      .eq('id_particulier', user.id)
      .single();
    
    if (profileError || !profile) {
      throw new Error('Seul un particulier peut évaluer un artisan');
    }
    
    // Vérifier que l'artisan existe
    const { data: artisan, error: artisanError } = await supabase
      .from('artisan')
      .select('id_artisan, nom_artisan, prenom_artisan')
      .eq('id_artisan', evaluationData.id_artisan)
      .single();
    
    if (artisanError || !artisan) {
      throw new Error('Artisan non trouvé');
    }
    
    // Vérifier si une évaluation existe déjà pour aujourd'hui (même jour)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: existingEval, error: existingError } = await supabase
      .from('evaluation')
      .select('id_evaluation')
      .eq('id_artisan', evaluationData.id_artisan)
      .eq('id_particulier', user.id)
      .gte('date_evaluation', today.toISOString())
      .lt('date_evaluation', tomorrow.toISOString())
      .maybeSingle();
    
    if (existingError) {
      console.error('Erreur vérification évaluation existante:', existingError);
    }
    
    if (existingEval) {
      throw new Error('Vous avez déjà évalué cet artisan aujourd\'hui. Vous pouvez modifier votre évaluation existante.');
    }
    
    // Préparation des données pour l'insertion
    const evaluationToInsert = {
      id_artisan: evaluationData.id_artisan,
      id_particulier: user.id,
      note: evaluationData.note,
      commentaire: evaluationData.commentaire?.trim() || null,
      date_evaluation: new Date().toISOString()
    };
    
    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('evaluation')
      .insert([evaluationToInsert])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la création de l\'évaluation:', error);
      
      // Gestion des erreurs spécifiques
      if (error.code === '23505') {
        throw new Error('Vous avez déjà évalué cet artisan aujourd\'hui');
      } else if (error.code === '23503') {
        throw new Error('Référence invalide - artisan ou particulier non trouvé');
      } else {
        throw new Error('Erreur lors de la création de l\'évaluation: ' + error.message);
      }
    }
    
    console.log('✅ Évaluation créée avec succès:', data);
    
    return {
      success: true,
      data: {
        ...data,
        particulier_nom: `${profile.prenom_particulier || ''} ${profile.nom_particulier || ''}`.trim()
      },
      message: 'Évaluation créée avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la création de l\'évaluation:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la création de l\'évaluation'
    };
  }
};

/**
 * Récupère toutes les évaluations d'un artisan
 * @param {string} artisanId - ID de l'artisan
 * @returns {Promise<Object>} - Liste des évaluations
 */
export const getEvaluationsByArtisan = async (artisanId) => {
  try {
    if (!artisanId) {
      throw new Error('ID de l\'artisan requis');
    }
    
    const { data, error } = await supabase
      .from('evaluation')
      .select(`
        id_evaluation,
        note,
        commentaire,
        date_evaluation,
        id_particulier,
        particulier:particulier(id_particulier, nom_particulier, prenom_particulier, photo_profil)
      `)
      .eq('id_artisan', artisanId)
      .order('date_evaluation', { ascending: false });
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des évaluations:', error);
      throw new Error('Erreur lors de la récupération des évaluations: ' + error.message);
    }
    
    // Formater les données pour l'affichage
    const formattedData = data?.map(evalItem => ({
      id: evalItem.id_evaluation,
      note: evalItem.note,
      commentaire: evalItem.commentaire,
      date: evalItem.date_evaluation,
      id_particulier: evalItem.id_particulier,
      particulier_nom: evalItem.particulier 
        ? `${evalItem.particulier.prenom_particulier || ''} ${evalItem.particulier.nom_particulier || ''}`.trim()
        : 'Particulier anonyme',
      particulier_photo: evalItem.particulier?.photo_profil || null
    })) || [];
    
    console.log('✅ Évaluations récupérées:', formattedData.length, 'évaluations');
    
    return {
      success: true,
      data: formattedData,
      count: formattedData.length
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des évaluations:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des évaluations',
      data: []
    };
  }
};

/**
 * Calcule la note moyenne et les statistiques d'un artisan
 * @param {string} artisanId - ID de l'artisan
 * @returns {Promise<Object>} - Statistiques des évaluations
 */
export const getAverageRating = async (artisanId) => {
  try {
    if (!artisanId) {
      throw new Error('ID de l\'artisan requis');
    }
    
    const { data, error } = await supabase
      .from('evaluation')
      .select('note')
      .eq('id_artisan', artisanId);
    
    if (error) {
      console.error('❌ Erreur lors du calcul de la moyenne:', error);
      throw new Error('Erreur lors du calcul de la moyenne: ' + error.message);
    }
    
    const evaluations = data || [];
    const total = evaluations.length;
    
    if (total === 0) {
      return {
        success: true,
        data: {
          moyenne: 0,
          total: 0,
          repartition: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      };
    }
    
    const sum = evaluations.reduce((acc, curr) => acc + (curr.note || 0), 0);
    const moyenne = Math.round((sum / total) * 10) / 10;
    
    // Calculer la répartition par note
    const repartition = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    evaluations.forEach(evalItem => {
      const note = evalItem.note;
      if (note >= 1 && note <= 5) {
        repartition[note]++;
      }
    });
    
    return {
      success: true,
      data: {
        moyenne,
        total,
        repartition
      }
    };
    
  } catch (error) {
    console.error('💥 Erreur lors du calcul de la moyenne:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors du calcul de la moyenne',
      data: {
        moyenne: 0,
        total: 0,
        repartition: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    };
  }
};

/**
 * Vérifie si un particulier a déjà évalué un artisan aujourd'hui
 * @param {string} artisanId - ID de l'artisan
 * @returns {Promise<Object>} - Résultat de la vérification
 */
export const hasEvaluatedToday = async (artisanId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, hasEvaluated: false, error: 'Non connecté' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data, error } = await supabase
      .from('evaluation')
      .select('id_evaluation, note, commentaire')
      .eq('id_artisan', artisanId)
      .eq('id_particulier', user.id)
      .gte('date_evaluation', today.toISOString())
      .lt('date_evaluation', tomorrow.toISOString())
      .maybeSingle();
    
    if (error) {
      console.error('Erreur vérification évaluation:', error);
      return { success: false, hasEvaluated: false, error: error.message };
    }
    
    return {
      success: true,
      hasEvaluated: !!data,
      existingEvaluation: data
    };
    
  } catch (error) {
    console.error('💥 Erreur:', error);
    return { success: false, hasEvaluated: false, error: error.message };
  }
};

/**
 * Met à jour une évaluation existante
 * @param {string} evaluationId - ID de l'évaluation
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateEvaluation = async (evaluationId, updateData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'évaluation appartient au particulier connecté
    const { data: existingEval, error: fetchError } = await supabase
      .from('evaluation')
      .select('id_particulier')
      .eq('id_evaluation', evaluationId)
      .single();
    
    if (fetchError || !existingEval) {
      throw new Error('Évaluation non trouvée');
    }
    
    if (existingEval.id_particulier !== user.id) {
      throw new Error('Vous ne pouvez pas modifier cette évaluation');
    }
    
    const updates = {};
    if (updateData.note !== undefined) {
      if (updateData.note < 1 || updateData.note > 5) {
        throw new Error('La note doit être entre 1 et 5');
      }
      updates.note = updateData.note;
    }
    if (updateData.commentaire !== undefined) {
      updates.commentaire = updateData.commentaire?.trim() || null;
    }
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('evaluation')
      .update(updates)
      .eq('id_evaluation', evaluationId)
      .select()
      .single();
    
    if (error) {
      throw new Error('Erreur lors de la mise à jour: ' + error.message);
    }
    
    return {
      success: true,
      data,
      message: 'Évaluation mise à jour avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur mise à jour:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour'
    };
  }
};

/**
 * Supprime une évaluation
 * @param {string} evaluationId - ID de l'évaluation
 * @returns {Promise<Object>} - Résultat de la suppression
 */
export const deleteEvaluation = async (evaluationId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier que l'évaluation appartient au particulier connecté
    const { data: existingEval, error: fetchError } = await supabase
      .from('evaluation')
      .select('id_particulier')
      .eq('id_evaluation', evaluationId)
      .single();
    
    if (fetchError || !existingEval) {
      throw new Error('Évaluation non trouvée');
    }
    
    if (existingEval.id_particulier !== user.id) {
      throw new Error('Vous ne pouvez pas supprimer cette évaluation');
    }
    
    const { error } = await supabase
      .from('evaluation')
      .delete()
      .eq('id_evaluation', evaluationId);
    
    if (error) {
      throw new Error('Erreur lors de la suppression: ' + error.message);
    }
    
    return {
      success: true,
      message: 'Évaluation supprimée avec succès'
    };
    
  } catch (error) {
    console.error('💥 Erreur suppression:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression'
    };
  }
};
