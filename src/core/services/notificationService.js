import { supabase } from './supabaseClient';

/**
 * Crée une nouvelle notification
 * @param {Object} notificationData - Données de la notification
 * @returns {Promise<Object>} - Résultat de la création
 */
export const createNotification = async (notificationData) => {
  try {
    const { user_id, type, title, message, data = {} } = notificationData;
    
    if (!user_id || !type || !title || !message) {
      throw new Error('Champs requis manquants: user_id, type, title, message');
    }
    
    const { data: result, error } = await supabase
      .from('notifications')
      .insert([{
        user_id,
        type,
        title,
        message,
        data,
        is_read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Erreur création notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère les notifications de l'utilisateur connecté
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Object>} - Liste des notifications
 */
export const getNotifications = async (options = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    
    if (options.unreadOnly) {
      query = query.eq('is_read', false);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [], count: data?.length || 0 };
  } catch (error) {
    console.error('❌ Erreur récupération notifications:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Récupère le nombre de notifications non lues
 * @returns {Promise<Object>} - Nombre de notifications
 */
export const getUnreadCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: true, count: 0 };
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .is('deleted_at', null);
    
    if (error) throw error;
    
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('❌ Erreur comptage notifications:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

/**
 * Marque une notification comme lue
 * @param {string} notificationId - ID de la notification
 * @returns {Promise<Object>} - Résultat
 */
export const markAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur marquage lu:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Marque toutes les notifications comme lues
 * @returns {Promise<Object>} - Résultat
 */
export const markAllAsRead = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur marquage tous lus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Supprime une notification (soft delete)
 * @param {string} notificationId - ID de la notification
 * @returns {Promise<Object>} - Résultat
 */
export const deleteNotification = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crée une notification lorsqu'une invitation est acceptée
 * @param {string} particulierId - ID du particulier
 * @param {string} artisanId - ID de l'artisan
 * @param {string} invitationId - ID de l'invitation
 */
export const notifyInvitationAccepted = async (particulierId, artisanId, invitationId) => {
  return createNotification({
    user_id: particulierId,
    type: 'invitation_accepted',
    title: 'Invitation acceptée ! 🎉',
    message: 'Votre demande a été acceptée. Vous pouvez maintenant discuter avec l\'artisan.',
    data: { invitation_id: invitationId, artisan_id: artisanId }
  });
};

/**
 * Crée une notification lorsqu'une invitation est refusée
 * @param {string} particulierId - ID du particulier
 * @param {string} artisanId - ID de l'artisan
 * @param {string} invitationId - ID de l'invitation
 */
export const notifyInvitationRefused = async (particulierId, artisanId, invitationId) => {
  return createNotification({
    user_id: particulierId,
    type: 'invitation_refused',
    title: 'Invitation refusée',
    message: 'Votre demande a été refusée par l\'artisan.',
    data: { invitation_id: invitationId, artisan_id: artisanId }
  });
};

/**
 * Crée une notification lorsqu'un devis est accepté
 * @param {string} artisanId - ID de l'artisan
 * @param {string} particulierId - ID du particulier
 * @param {string} devisId - ID du devis
 */
export const notifyDevisAccepted = async (artisanId, particulierId, devisId) => {
  return createNotification({
    user_id: artisanId,
    type: 'devis_accepted',
    title: 'Devis accepté ! 💰',
    message: 'Le client a accepté votre devis. Le bouton de paiement est maintenant disponible pour le client.',
    data: { devis_id: devisId, particulier_id: particulierId }
  });
};

/**
 * Crée une notification lorsqu'un devis est refusé
 * @param {string} artisanId - ID de l'artisan
 * @param {string} particulierId - ID du particulier
 * @param {string} devisId - ID du devis
 */
export const notifyDevisRefused = async (artisanId, particulierId, devisId) => {
  return createNotification({
    user_id: artisanId,
    type: 'devis_refused',
    title: 'Devis refusé',
    message: 'Le client a refusé votre devis.',
    data: { devis_id: devisId, particulier_id: particulierId }
  });
};

/**
 * Crée une notification pour un nouveau devis
 * @param {string} particulierId - ID du particulier
 * @param {string} artisanId - ID de l'artisan
 * @param {string} devisId - ID du devis
 */
export const notifyNewDevis = async (particulierId, artisanId, devisId) => {
  return createNotification({
    user_id: particulierId,
    type: 'new_devis',
    title: 'Nouveau devis reçu 📋',
    message: 'Vous avez reçu un nouveau devis de l\'artisan. Consultez-le dans votre espace.',
    data: { devis_id: devisId, artisan_id: artisanId }
  });
};

/**
 * Crée une notification pour un nouveau message
 * @param {string} recipientId - ID du destinataire
 * @param {string} senderId - ID de l'expéditeur
 * @param {string} conversationId - ID de la conversation
 */
export const notifyNewMessage = async (recipientId, senderId, conversationId) => {
  return createNotification({
    user_id: recipientId,
    type: 'new_message',
    title: 'Nouveau message 💬',
    message: 'Vous avez reçu un nouveau message.',
    data: { conversation_id: conversationId, sender_id: senderId }
  });
};

/**
 * Souscrit aux notifications en temps réel
 * @param {Function} callback - Fonction appelée lors d'une nouvelle notification
 * @returns {Object} - Subscription
 */
export const subscribeToNotifications = (callback) => {
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};
