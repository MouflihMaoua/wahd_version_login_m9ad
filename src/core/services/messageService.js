import { supabase } from './supabaseClient';

/**
 * Envoie un message dans une conversation entre artisan et particulier
 * @param {Object} messageData - Données du message
 * @param {string} messageData.id_artisan - ID de l'artisan
 * @param {string} messageData.id_particulier - ID du particulier
 * @param {string} messageData.contenu - Contenu du message
 * @param {string} messageData.envoye_par - 'artisan' ou 'particulier'
 * @returns {Promise<Object>} - Résultat
 */
export const sendMessage = async (messageData) => {
  try {
    const { id_artisan, id_particulier, contenu, envoye_par } = messageData;
    
    if (!id_artisan || !id_particulier || !contenu || !envoye_par) {
      throw new Error('id_artisan, id_particulier, contenu et envoye_par sont requis');
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .from('message_chat')
      .insert([{
        id_artisan,
        id_particulier,
        contenu,
        envoye_par,
        lu: false,
        date_envoi: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur envoi message:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère les messages entre un artisan et un particulier
 * @param {string} id_artisan - ID de l'artisan
 * @param {string} id_particulier - ID du particulier
 * @returns {Promise<Object>} - Liste des messages
 */
export const getMessages = async (id_artisan, id_particulier) => {
  try {
    if (!id_artisan || !id_particulier) {
      throw new Error('id_artisan et id_particulier sont requis');
    }
    
    const { data, error } = await supabase
      .from('message_chat')
      .select('*')
      .eq('id_artisan', id_artisan)
      .eq('id_particulier', id_particulier)
      .order('date_envoi', { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('❌ Erreur récupération messages:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Récupère toutes les conversations de l'utilisateur connecté
 * Regroupe les messages par pair (artisan, particulier)
 * @returns {Promise<Object>} - Liste des conversations
 */
export const getConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Déterminer si l'utilisateur est un artisan ou un particulier
    const { data: artisan } = await supabase
      .from('artisan')
      .select('id_artisan')
      .eq('id_artisan', user.id)
      .single();
    
    const isArtisan = !!artisan;
    
    // Récupérer les messages sans jointures
    const { data, error } = await supabase
      .from('message_chat')
      .select('*')
      .eq(isArtisan ? 'id_artisan' : 'id_particulier', user.id)
      .order('date_envoi', { ascending: false });
    
    if (error) throw error;
    
    // Récupérer les infos des utilisateurs associés
    const otherUserIds = [...new Set(isArtisan 
      ? data?.map(m => m.id_particulier) 
      : data?.map(m => m.id_artisan)
    )];
    
    let otherUsers = {};
    if (otherUserIds.length > 0) {
      const { data: users } = await supabase
        .from(isArtisan ? 'particulier' : 'artisan')
        .select(isArtisan 
          ? 'id_particulier, nom_particulier, prenom_particulier, photo_profil'
          : 'id_artisan, nom_artisan, prenom_artisan, photo_profil, metier'
        )
        .in(isArtisan ? 'id_particulier' : 'id_artisan', otherUserIds);
      
      otherUsers = users?.reduce((acc, u) => {
        const id = isArtisan ? u.id_particulier : u.id_artisan;
        acc[id] = u;
        return acc;
      }, {}) || {};
    }
    
    // Grouper les messages par conversation
    const conversationsMap = new Map();
    
    data?.forEach(msg => {
      const key = `${msg.id_artisan}_${msg.id_particulier}`;
      const otherUserId = isArtisan ? msg.id_particulier : msg.id_artisan;
      
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          id: key,
          id_artisan: msg.id_artisan,
          id_particulier: msg.id_particulier,
          last_message: msg.contenu,
          last_message_at: msg.date_envoi,
          last_message_sender: msg.envoye_par,
          unread_count: msg.lu ? 0 : 1,
          other_user: otherUsers[otherUserId] || null,
          messages: []
        });
      } else {
        const conv = conversationsMap.get(key);
        if (!msg.lu) {
          conv.unread_count += 1;
        }
      }
      
      conversationsMap.get(key).messages.push({
        id: msg.id,
        content: msg.contenu,
        sender_type: msg.envoye_par,
        created_at: msg.date_envoi,
        is_read: msg.lu
      });
    });
    
    // Convertir la Map en tableau et trier par date du dernier message
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
    
    return { success: true, data: conversations };
  } catch (error) {
    console.error('❌ Erreur récupération conversations:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Marque les messages comme lus
 * @param {string} id_artisan - ID de l'artisan
 * @param {string} id_particulier - ID du particulier
 * @param {string} pour - 'artisan' ou 'particulier' - pour qui on marque comme lu
 * @returns {Promise<Object>} - Résultat
 */
export const markMessagesAsRead = async (id_artisan, id_particulier, pour) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Marquer comme lu les messages envoyés par l'autre personne
    const { error } = await supabase
      .from('message_chat')
      .update({ lu: true })
      .eq('id_artisan', id_artisan)
      .eq('id_particulier', id_particulier)
      .neq('envoye_par', pour)
      .eq('lu', false);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur marquage messages lus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Compte les messages non lus pour l'utilisateur
 * @returns {Promise<Object>} - Nombre de messages
 */
export const getUnreadMessagesCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: true, count: 0 };
    
    // Déterminer si l'utilisateur est un artisan ou un particulier
    const { data: artisan } = await supabase
      .from('artisan')
      .select('id_artisan')
      .eq('id_artisan', user.id)
      .single();
    
    const isArtisan = !!artisan;
    
    let query;
    if (isArtisan) {
      query = supabase
        .from('message_chat')
        .select('*', { count: 'exact', head: true })
        .eq('id_artisan', user.id)
        .eq('envoye_par', 'particulier')
        .eq('lu', false);
    } else {
      query = supabase
        .from('message_chat')
        .select('*', { count: 'exact', head: true })
        .eq('id_particulier', user.id)
        .eq('envoye_par', 'artisan')
        .eq('lu', false);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('❌ Erreur comptage messages:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

/**
 * Récupère ou initialise une conversation basée sur une demande
 * @param {string} demandeId - ID de la demande
 * @returns {Promise<Object>} - Conversation info avec id_artisan et id_particulier
 */
export const getOrCreateConversationForDemande = async (demandeId) => {
  try {
    // Récupérer la demande pour obtenir les IDs
    const { data: demande, error } = await supabase
      .from('demande')
      .select('id_artisan, id_particulier, description')
      .eq('id_demande', demandeId)
      .single();
    
    if (error || !demande) {
      throw new Error('Demande non trouvée');
    }
    
    return {
      success: true,
      data: {
        id_artisan: demande.id_artisan,
        id_particulier: demande.id_particulier,
        hasMessages: false
      }
    };
  } catch (error) {
    console.error('❌ Erreur getOrCreateConversation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère la liste des particuliers avec qui l'artisan a des conversations
 * @returns {Promise<Object>} - Liste des particuliers
 */
export const getParticuliersFromChat = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Vérifier que c'est bien un artisan
    const { data: artisan } = await supabase
      .from('artisan')
      .select('id_artisan')
      .eq('id_artisan', user.id)
      .single();
    
    if (!artisan) {
      return { success: false, error: 'Seuls les artisans peuvent voir leurs contacts', data: [] };
    }
    
    // Récupérer tous les messages de l'artisan pour trouver les particuliers uniques
    const { data: messages, error } = await supabase
      .from('message_chat')
      .select('id_particulier')
      .eq('id_artisan', user.id);
    
    if (error) throw error;
    
    // Extraire les IDs uniques des particuliers
    const particulierIds = [...new Set(messages?.map(m => m.id_particulier) || [])];
    
    if (particulierIds.length === 0) {
      return { success: true, data: [], message: 'Aucun contact trouvé' };
    }
    
    // Récupérer les infos des particuliers
    const { data: particuliers, error: particulierError } = await supabase
      .from('particulier')
      .select('id_particulier, nom_particulier, prenom_particulier, email_particulier, telephone_particulier, ville, photo_profil')
      .in('id_particulier', particulierIds);
    
    if (particulierError) throw particulierError;
    
    // Formater les données
    const formattedParticuliers = particuliers?.map(p => ({
      id: p.id_particulier,
      nom: `${p.prenom_particulier || ''} ${p.nom_particulier || ''}`.trim(),
      prenom: p.prenom_particulier,
      nomFamille: p.nom_particulier,
      email: p.email_particulier,
      telephone: p.telephone_particulier,
      ville: p.ville,
      photo: p.photo_profil
    })) || [];
    
    return { 
      success: true, 
      data: formattedParticuliers,
      count: formattedParticuliers.length
    };
    
  } catch (error) {
    console.error('❌ Erreur récupération contacts chat:', error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des contacts',
      data: []
    };
  }
};

/**
 * Souscrit aux nouveaux messages d'une conversation
 * @param {string} id_artisan - ID de l'artisan
 * @param {string} id_particulier - ID du particulier
 * @param {Function} callback - Fonction appelée
 * @returns {Object} - Subscription
 */
export const subscribeToMessages = (id_artisan, id_particulier, callback) => {
  const channel = supabase
    .channel(`messages:${id_artisan}_${id_particulier}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'message_chat'
      },
      (payload) => {
        const newMessage = payload.new;
        // Filtrer côté client pour ne recevoir que les messages de cette conversation
        if (newMessage.id_artisan === id_artisan && newMessage.id_particulier === id_particulier) {
          callback(newMessage);
        }
      }
    )
    .subscribe();
  
  return channel;
};

