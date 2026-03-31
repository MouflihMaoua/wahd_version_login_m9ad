# Documentation: Implémentation du Chat en Temps Réel

Ce document explique étape par étape comment le système de chat en temps réel a été implémenté entre artisans et particuliers.

---

## Architecture Générale

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCHÉMA DE DONNÉES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   artisan    │         │  particulier │                     │
│  │  (table)     │         │   (table)    │                     │
│  └──────┬───────┘         └──────┬───────┘                     │
│         │                        │                               │
│         │                        │                               │
│         │      ┌───────────────┴───────────────┐               │
│         │      │                                 │               │
│         └──────►         message_chat            │               │
│                │         (table)                 │               │
│                │                                 │               │
│                │  - id_artisan (FK)              │               │
│                │  - id_particulier (FK)          │               │
│                │  - contenu (TEXT)               │               │
│                │  - envoye_par (ENUM)            │               │
│                │  - lu (BOOLEAN)                 │               │
│                │  - date_envoi (TIMESTAMP)       │               │
│                └─────────────────────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Étape 1: Structure de la Base de Données

### Table `message_chat`

```sql
CREATE TABLE public.message_chat (
    id SERIAL PRIMARY KEY,
    id_artisan UUID NOT NULL REFERENCES public.artisan(id_artisan),
    id_particulier UUID NOT NULL REFERENCES public.particulier(id_particulier),
    contenu TEXT NOT NULL,
    envoye_par VARCHAR NOT NULL, -- 'artisan' ou 'particulier'
    lu BOOLEAN DEFAULT false,
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Politiques RLS (Row Level Security)

Les politiques suivantes ont été créées pour sécuriser l'accès :

```sql
-- Artisans peuvent envoyer des messages
CREATE POLICY "Allow artisans to insert messages"
  ON public.message_chat FOR INSERT TO authenticated
  WITH CHECK (envoye_par = 'artisan' AND id_artisan = auth.uid());

-- Particuliers peuvent envoyer des messages  
CREATE POLICY "Allow particuliers to insert messages"
  ON public.message_chat FOR INSERT TO authenticated
  WITH CHECK (envoye_par = 'particulier' AND id_particulier = auth.uid());

-- Les deux parties peuvent lire leurs messages
CREATE POLICY "Allow read for involved users"
  ON public.message_chat FOR SELECT TO authenticated
  USING (id_artisan = auth.uid() OR id_particulier = auth.uid());
```

---

## Étape 2: Service de Messages (`messageService.js`)

### 2.1 Envoi de Message

```javascript
export const sendMessage = async ({ id_artisan, id_particulier, contenu, envoye_par }) => {
  try {
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
    return { success: false, error: error.message };
  }
};
```

### 2.2 Récupération des Messages

```javascript
export const getMessages = async (id_artisan, id_particulier) => {
  const { data, error } = await supabase
    .from('message_chat')
    .select('*')
    .eq('id_artisan', id_artisan)
    .eq('id_particulier', id_particulier)
    .order('date_envoi', { ascending: true });
  
  return { success: true, data: data || [] };
};
```

### 2.3 Récupération des Conversations

```javascript
export const getConversations = async () => {
  // 1. Détecter si l'utilisateur est artisan ou particulier
  const { data: artisan } = await supabase
    .from('artisan')
    .select('id_artisan')
    .eq('id_artisan', user.id)
    .single();
  
  const isArtisan = !!artisan;
  
  // 2. Récupérer les messages
  const { data } = await supabase
    .from('message_chat')
    .select('*')
    .eq(isArtisan ? 'id_artisan' : 'id_particulier', user.id)
    .order('date_envoi', { ascending: false });
  
  // 3. Récupérer les infos des utilisateurs associés
  const otherUserIds = [...new Set(
    data?.map(m => isArtisan ? m.id_particulier : m.id_artisan)
  )];
  
  const { data: users } = await supabase
    .from(isArtisan ? 'particulier' : 'artisan')
    .select('...')
    .in(isArtisan ? 'id_particulier' : 'id_artisan', otherUserIds);
  
  // 4. Grouper les messages par conversation
  const conversationsMap = new Map();
  data?.forEach(msg => {
    const key = `${msg.id_artisan}_${msg.id_particulier}`;
    // ... regroupement logique
  });
  
  return { success: true, data: Array.from(conversationsMap.values()) };
};
```

### 2.4 Marquer comme Lu

```javascript
export const markMessagesAsRead = async (id_artisan, id_particulier, pour) => {
  const { error } = await supabase
    .from('message_chat')
    .update({ lu: true })
    .eq('id_artisan', id_artisan)
    .eq('id_particulier', id_particulier)
    .neq('envoye_par', pour)  // Seulement les messages de l'autre
    .eq('lu', false);
  
  return { success: !error };
};
```

### 2.5 Subscription Temps Réel

```javascript
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
        // Filtrer côté client
        if (newMessage.id_artisan === id_artisan && 
            newMessage.id_particulier === id_particulier) {
          callback(newMessage);
        }
      }
    )
    .subscribe();
  
  return channel;
};
```

---

## Étape 3: Interface Artisan (`messages/index.jsx`)

### 3.1 Structure du Composant

```javascript
const ArtisanMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const subscriptionRef = useRef(null);
  // ...
};
```

### 3.2 Chargement Initial

```javascript
// Charger les conversations au montage
useEffect(() => {
  loadConversations();
}, [user?.id]);

const loadConversations = async () => {
  const result = await getConversations();
  if (result.success) {
    setConversations(result.data.map(conv => ({
      id: conv.id,
      id_particulier: conv.id_particulier,
      client: conv.other_user 
        ? `${conv.other_user.prenom_particulier} ${conv.other_user.nom_particulier}`
        : 'Client',
      unreadCount: conv.unread_count,
      // ...
    })));
  }
};
```

### 3.3 Subscription et Polling

```javascript
useEffect(() => {
  if (selectedChat && user?.id) {
    loadMessages(selectedChat.id_particulier);
    markMessagesAsRead(user.id, selectedChat.id_particulier, 'artisan');
    
    // 1. Subscription temps réel
    subscriptionRef.current = subscribeToMessages(
      user.id,
      selectedChat.id_particulier,
      (newMessage) => {
        setMessages(prev => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        scrollToBottom();
      }
    );
    
    // 2. Polling fallback (5 secondes)
    const pollInterval = setInterval(() => {
      loadMessages(selectedChat.id_particulier);
    }, 5000);
    
    return () => {
      subscriptionRef.current?.unsubscribe();
      clearInterval(pollInterval);
    };
  }
}, [selectedChat, user?.id]);
```

### 3.4 Envoi de Message

```javascript
const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!messageInput.trim() || !selectedChat || !user?.id) return;
  
  const result = await sendMessage({
    id_artisan: user.id,
    id_particulier: selectedChat.id_particulier,
    contenu: messageInput.trim(),
    envoye_par: 'artisan'
  });
  
  if (result.success) {
    setMessages(prev => [...prev, result.data]);
    setMessageInput('');
    scrollToBottom();
    // Mettre à jour la conversation dans la liste
    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat.id 
        ? { ...conv, lastMessage: messageInput.trim() }
        : conv
    ));
  }
};
```

### 3.5 Affichage des Messages

```javascript
{messages.map((msg, index) => (
  <div key={msg.id || index}>
    {/* Afficher la date si changée */}
    {showDate && (
      <div className="flex justify-center my-4">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {formatDate(msg.date_envoi)}
        </span>
      </div>
    )}
    
    {/* Message aligné selon l'expéditeur */}
    <div className={`flex ${
      msg.envoye_par === 'artisan' ? 'justify-end' : 'justify-start'
    }`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${
        msg.envoye_par === 'artisan'
          ? 'bg-blue-600 text-white'    // Artisan = bleu (droite)
          : 'bg-gray-100 text-gray-900' // Particulier = gris (gauche)
      }`}>
        <p className="text-sm">{msg.contenu}</p>
        <div className="text-xs mt-1">
          <span>{formatTime(msg.date_envoi)}</span>
          {msg.envoye_par === 'artisan' && (
            <span>{msg.lu ? '✓✓' : '✓'}</span>  // Lu/non lu
          )}
        </div>
      </div>
    </div>
  </div>
))}
```

---

## Étape 4: Interface Particulier (`MessagesView_Modern.jsx`)

La structure est identique à l'artisan avec quelques différences :

### 4.1 Rôles Inversés

```javascript
// Envoi de message
const result = await sendMessage({
  id_artisan: selectedConversation.id_artisan,
  id_particulier: user.id,
  contenu: messageInput.trim(),
  envoye_par: 'particulier'  // ← particulier au lieu de artisan
});

// Marquer comme lu
markMessagesAsRead(
  selectedConversation.id_artisan, 
  user.id, 
  'particulier'  // ← particulier au lieu de artisan
);

// Subscription
subscribeToMessages(
  selectedConversation.id_artisan,
  user.id,
  (newMessage) => { /* ... */ }
);
```

### 4.2 Affichage Inversé

```javascript
// Particulier = bleu (droite), Artisan = gris (gauche)
<div className={`flex ${
  msg.envoye_par === 'particulier' ? 'justify-end' : 'justify-start'
}`}>
  <div className={`${
    msg.envoye_par === 'particulier'
      ? 'bg-blue-600 text-white'    // Particulier = bleu
      : 'bg-gray-100 text-gray-900' // Artisan = gris
  }`}>
```

---

## Étape 5: Navigation depuis les Demandes

### 5.1 Artisan (`demandes/index.jsx`)

```javascript
const handleOuvrirConversation = (demande) => {
  navigate('/dashboard/artisan/messages', { 
    state: { 
      demandeId: demande.id,
      id_particulier: demande.rawData?.id_particulier,
      from: 'demandes'
    }
  });
};
```

### 5.2 Particulier (`DemandesView.jsx`)

```javascript
const handleOuvrirConversation = (demande) => {
  navigate('/dashboard/particulier/messages', { 
    state: { 
      demandeId: demande.id,
      id_artisan: demande.rawData?.id_artisan,
      from: 'demandes'
    }
  });
};
```

### 5.3 Ouverture Automatique de la Conversation

```javascript
// Dans messages/index.jsx
useEffect(() => {
  const { demandeId, id_particulier } = location.state || {};
  if (demandeId && id_particulier) {
    selectOrCreateConversation(demandeId, id_particulier);
  }
}, [location.state]);
```

---

## Étape 6: Fonctionnalités Implémentées

### ✅ Fonctionnalités de Base
- [x] Envoi de messages entre artisan et particulier
- [x] Affichage de la liste des conversations
- [x] Affichage des messages d'une conversation
- [x] Marquage des messages comme lus
- [x] Compteur de messages non lus

### ✅ Fonctionnalités Temps Réel
- [x] Subscription Supabase Realtime
- [x] Polling fallback (5 secondes)
- [x] Mise à jour automatique sans refresh

### ✅ UX/UI
- [x] Messages alignés selon l'expéditeur
- [x] Indicateurs de lecture (✓ / ✓✓)
- [x] Groupage par date (Aujourd'hui / Hier)
- [x] Scroll automatique vers le dernier message
- [x] Navigation depuis les demandes acceptées

### ✅ Sécurité
- [x] Row Level Security (RLS)
- [x] Authentification requise
- [x] Accès limité aux conversations impliquées

---

## Architecture du Flux de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUX DE MESSAGES                        │
└─────────────────────────────────────────────────────────────────┘

ARTISAN envoie un message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌──────────────┐         ┌──────────────────┐
  │   Artisan    │ ──────► │   Supabase DB    │
  │   (UI)       │  POST   │  message_chat    │
  └──────────────┘         └────────┬─────────┘
                                    │
                                    │ Realtime Event
                                    │ (postgres_changes)
                                    ▼
  ┌──────────────┐         ┌──────────────────┐
  │  Particulier │ ◄────── │   Supabase       │
  │    (UI)      │  WebSocket │  Realtime      │
  └──────────────┘         └──────────────────┘
                                    │
                                    │ (fallback si échec)
                                    ▼
                              ┌────────────┐
                              │   Polling  │
                              │  (5 sec)   │
                              └────────────┘

PARTICULIER envoie un message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  (Même flux mais dans l'autre direction)
```

---

## Fichiers Concernés

| Fichier | Description |
|---------|-------------|
| `src/core/services/messageService.js` | Service pour envoyer/récupérer/s'abonner aux messages |
| `src/artisan/pages/messages/index.jsx` | Interface de chat pour l'artisan |
| `src/particulier/pages/MessagesView_Modern.jsx` | Interface de chat pour le particulier |
| `src/artisan/pages/demandes/index.jsx` | Lien vers le chat depuis les demandes (artisan) |
| `src/particulier/pages/DemandesView.jsx` | Lien vers le chat depuis les demandes (particulier) |
| `fix-message-chat-rls.sql` | Script SQL pour les politiques RLS |

---

## Configuration Supabase Requise

### 1. Activer Realtime sur la table

```sql
-- Dans le Dashboard Supabase → Database → Replication
-- Activer "Realtime" pour la table message_chat
```

### 2. Vérifier les politiques RLS

```sql
-- Exécuter le script fix-message-chat-rls.sql
```

### 3. Vérifier les clés étrangères

```sql
-- S'assurer que id_artisan et id_particulier sont des UUID
-- et qu'ils référencent bien les tables correspondantes
```

---

## Dépannage

### Problème: Les messages ne s'affichent pas en temps réel

**Solutions:**
1. Vérifier que Realtime est activé dans Supabase
2. Vérifier les politiques RLS
3. Le polling fallback (5s) prend le relais automatiquement

### Problème: 403 Forbidden lors de l'envoi

**Solutions:**
1. Exécuter le script SQL pour créer les politiques RLS
2. Vérifier que l'utilisateur est bien authentifié
3. Vérifier que `envoye_par` correspond au rôle de l'utilisateur

### Problème: 406 Not Acceptable

**Solutions:**
1. C'est normal si l'utilisateur n'est pas trouvé dans la table artisan
2. Le code gère ce cas et considère l'utilisateur comme particulier

---

## Conclusion

Le système de chat utilise:
- **Supabase Database** pour le stockage
- **Supabase Realtime** pour les mises à jour instantanées
- **Polling** comme solution de secours
- **RLS** pour la sécurité
- **React Hooks** pour la gestion d'état

Les messages apparaissent maintenant automatiquement dans les **5 secondes** maximum après leur envoi.
