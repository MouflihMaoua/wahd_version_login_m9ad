# 🚀 Chat en Temps Réel - Socket.io

Implémentation complète d'un système de chat en temps réel avec Socket.io pour votre application 7rayfi.

## 📋 Architecture

### Frontend (React)
- **Socket Service** - Gestion de la connexion Socket.io
- **Chat Components** - Composants React pour le chat
- **Real-time Updates** - Messages, utilisateurs, frappe

### Backend (Node.js + Socket.io)
- **Socket.io Server** - Serveur de chat en temps réel
- **Room Management** - Gestion des salles de chat
- **User Management** - Gestion des utilisateurs connectés

## 📁 Fichiers créés

### Frontend
```
src/
├── services/
│   └── socketService.js          # Service Socket.io client
├── components/chat/
│   ├── ChatRoom.jsx             # Composant salle de chat
│   └── ChatLobby.jsx           # Lobby des salles
└── pages/
    └── ChatPage.jsx             # Page principale du chat
```

### Backend
```
server/
├── socket-server.js              # Serveur Socket.io
└── package.json                # Dépendances backend
```

## 🛠️ Installation

### 1. Installer les dépendances frontend
```bash
npm install socket.io-client
```

### 2. Installer les dépendances backend
```bash
cd server
npm install
```

### 3. Variables d'environnement
Créer `.env` dans le dossier `server/`:
```env
PORT=3001
CLIENT_URL=http://localhost:5180
```

## 🚀 Démarrage

### 1. Démarrer le serveur backend
```bash
cd server
npm run dev
```
Le serveur démarrera sur `http://localhost:3001`

### 2. Démarrer l'application frontend
```bash
npm run dev
```
L'application sera sur `http://localhost:5180`

## 🎯 Fonctionnalités

### ✅ Chat en temps réel
- Messages instantanés
- Indicateur de frappe
- Historique des messages
- Support des emojis

### ✅ Gestion des salles
- Lobby des salles
- Rejoindre/quitter une salle
- Salles thématiques (général, support, artisan, particulier)

### ✅ Gestion des utilisateurs
- Liste des utilisateurs connectés
- Statut en ligne/hors ligne
- Messages privés

### ✅ Interface utilisateur
- Design moderne et responsive
- Notifications toast
- Scroll automatique
- Formatage des heures

## 🔄 Routes

### Frontend
- `/chat` - Lobby des salles
- `/chat/:roomId` - Salle de chat spécifique

### Backend API
- `GET /api/health` - Statut du serveur
- `GET /api/rooms` - Liste des salles et utilisateurs

## 🏠 Salles disponibles

1. **Général** (`general`) - Chat général pour tous
2. **Support** (`support`) - Support technique et aide
3. **Artisans** (`artisan`) - Chat pour les artisans
4. **Particuliers** (`particulier`) - Chat pour les particuliers

## 💬 Événements Socket.io

### Client → Serveur
- `room:join` - Rejoindre une salle
- `room:leave` - Quitter une salle
- `chat:message` - Envoyer un message
- `chat:private` - Message privé
- `user:typing` - Indicateur de frappe

### Serveur → Client
- `chat:message` - Message reçu
- `user:joined` - Utilisateur a rejoint
- `user:left` - Utilisateur a quitté
- `users:online` - Liste des utilisateurs
- `user:typing` - Indicateur de frappe
- `room:messages` - Historique des messages

## 🔧 Configuration

### Variables d'environnement
```env
# Frontend (.env)
VITE_SOCKET_URL=http://localhost:3001

# Backend (server/.env)
PORT=3001
CLIENT_URL=http://localhost:5180
```

### Ajouter les routes dans App.jsx
```jsx
import ChatPage from './pages/ChatPage';

// Ajouter dans les routes
<Route path="/chat" element={<ChatPage />} />
<Route path="/chat/:roomId" element={<ChatPage />} />
```

## 🎨 Personnalisation

### Ajouter une nouvelle salle
1. **Backend** - Ajouter dans `defaultRooms` dans `socket-server.js`
2. **Frontend** - Ajouter dans `availableRooms` dans `ChatPage.jsx`

### Thèmes et styles
- Modifier les classes Tailwind dans les composants
- Ajouter des thèmes clairs/sombres
- Personnaliser les couleurs

## 🔒 Sécurité

### En production
- Utiliser HTTPS/WSS
- Ajouter l'authentification JWT
- Valider les entrées utilisateur
- Limiter le nombre de messages

### Performance
- Utiliser Redis pour le stockage
- Implémenter la pagination des messages
- Ajouter des rate limits

## 📊 Monitoring

### Logs serveur
```bash
# Connexions
🔌 Nouvelle connexion: socketId
🏠 username a rejoint la salle roomId
💬 username a envoyé un message
❌ username déconnecté: reason
```

### Métriques
- Nombre d'utilisateurs connectés
- Messages par seconde
- Salles actives
- Temps de réponse

## 🚀 Déploiement

### Production
1. **Backend** - Déployer sur VPS/Heroku
2. **Frontend** - Déployer sur Vercel/Netlify
3. **Database** - Utiliser PostgreSQL/Redis
4. **SSL** - Configurer HTTPS/WSS

### Docker
```dockerfile
# Dockerfile pour le serveur
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🎯 Prochaines améliorations

- [ ] Messages avec fichiers/images
- [ ] Réactions aux messages
- [ ] Salles privées
- [ ] Modération
- [ ] Notifications push
- [ ] Sauvegarde des conversations
- [ ] Recherche dans les messages
- [ ] Mode sombre
- [ ] Voix/vidéo

---

**Le chat en temps réel est maintenant prêt !** 🚀

Démarrez le serveur backend et testez le chat sur votre application 7rayfi !
