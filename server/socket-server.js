const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuration CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5180',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Configuration Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5180',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Stockage des données en mémoire (à remplacer par une base de données en production)
const connectedUsers = new Map();
const rooms = new Map();
const messages = new Map();

// Salles par défaut
const defaultRooms = [
  { id: 'general', name: 'Général', description: 'Chat général pour tous' },
  { id: 'support', name: 'Support', description: 'Support technique et aide' },
  { id: 'artisan', name: 'Artisans', description: 'Chat pour les artisans' },
  { id: 'particulier', name: 'Particuliers', description: 'Chat pour les particuliers' }
];

// Initialiser les salles
defaultRooms.forEach(room => {
  rooms.set(room.id, { ...room, users: new Set() });
  messages.set(room.id, []);
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('🔌 Nouvelle connexion:', socket.id);

  // Récupérer les infos d'authentification
  const { userId, username } = socket.handshake.auth;
  
  if (!userId || !username) {
    console.log('❌ Connexion refusée: informations manquantes');
    socket.disconnect();
    return;
  }

  // Stocker les infos utilisateur
  const userInfo = {
    userId,
    username,
    socketId: socket.id,
    connectedAt: new Date().toISOString(),
    currentRoom: null
  };

  connectedUsers.set(socket.id, userInfo);
  
  // Envoyer les infos de l'utilisateur connecté
  socket.emit('user:connected', userInfo);

  // Envoyer la liste des utilisateurs connectés
  const usersList = Array.from(connectedUsers.values());
  io.emit('users:online', usersList);

  // Rejoindre une salle
  socket.on('room:join', ({ roomId }) => {
    if (!rooms.has(roomId)) {
      socket.emit('error', { message: 'Salle introuvable' });
      return;
    }

    // Quitter la salle actuelle si nécessaire
    if (userInfo.currentRoom) {
      const oldRoom = rooms.get(userInfo.currentRoom);
      if (oldRoom) {
        oldRoom.users.delete(socket.id);
        socket.leave(userInfo.currentRoom);
        socket.to(userInfo.currentRoom).emit('user:left', userInfo);
      }
    }

    // Rejoindre la nouvelle salle
    const room = rooms.get(roomId);
    room.users.add(socket.id);
    userInfo.currentRoom = roomId;

    socket.join(roomId);
    
    // Envoyer les messages précédents de la salle
    const roomMessages = messages.get(roomId) || [];
    socket.emit('room:messages', { roomId, messages: roomMessages });

    // Notifier les autres utilisateurs de la salle
    socket.to(roomId).emit('user:joined', userInfo);

    // Envoyer les infos de la salle
    socket.emit('room:joined', { 
      roomId, 
      room: {
        ...room,
        users: Array.from(room.users).map(socketId => connectedUsers.get(socketId))
      }
    });

    console.log(`🏠 ${username} a rejoint la salle ${roomId}`);
  });

  // Quitter une salle
  socket.on('room:leave', ({ roomId }) => {
    if (!userInfo.currentRoom || userInfo.currentRoom !== roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(socket.id);
      userInfo.currentRoom = null;
      socket.leave(roomId);
      socket.to(roomId).emit('user:left', userInfo);
      console.log(`🚪 ${username} a quitté la salle ${roomId}`);
    }
  });

  // Envoyer un message
  socket.on('chat:message', (message) => {
    if (!userInfo.currentRoom) {
      socket.emit('error', { message: 'Vous devez rejoindre une salle d\'abord' });
      return;
    }

    const messageData = {
      id: Date.now() + Math.random(),
      roomId: userInfo.currentRoom,
      content: message.content,
      type: message.type || 'text',
      timestamp: new Date().toISOString(),
      sender: {
        id: userInfo.userId,
        username: userInfo.username
      }
    };

    // Stocker le message
    const roomMessages = messages.get(userInfo.currentRoom) || [];
    roomMessages.push(messageData);
    messages.set(userInfo.currentRoom, roomMessages);

    // Limiter l'historique des messages (garder les 100 derniers)
    if (roomMessages.length > 100) {
      roomMessages.splice(0, roomMessages.length - 100);
    }

    // Diffuser le message à la salle
    io.to(userInfo.currentRoom).emit('chat:message', messageData);

    console.log(`💬 ${username} a envoyé un message dans ${userInfo.currentRoom}`);
  });

  // Message privé
  socket.on('chat:private', (message) => {
    const recipientSocket = Array.from(connectedUsers.values())
      .find(user => user.userId === message.recipientId)?.socketId;

    if (!recipientSocket) {
      socket.emit('error', { message: 'Utilisateur introuvable' });
      return;
    }

    const messageData = {
      id: Date.now() + Math.random(),
      content: message.content,
      timestamp: new Date().toISOString(),
      sender: {
        id: userInfo.userId,
        username: userInfo.username
      },
      isPrivate: true
    };

    // Envoyer uniquement au destinataire
    io.to(recipientSocket).emit('chat:private', messageData);
    // Envoyer une copie à l'expéditeur
    socket.emit('chat:private', messageData);

    console.log(`📨 ${username} a envoyé un message privé`);
  });

  // Indicateur de frappe
  socket.on('user:typing', (data) => {
    if (!userInfo.currentRoom) return;

    socket.to(userInfo.currentRoom).emit('user:typing', {
      roomId: userInfo.currentRoom,
      userId: userInfo.userId,
      username: userInfo.username,
      isTyping: data.isTyping
    });
  });

  // Utilisateur en ligne
  socket.on('user:online', (data) => {
    // Déjà géré lors de la connexion
  });

  // Déconnexion
  socket.on('disconnect', (reason) => {
    console.log(`❌ ${username} déconnecté:`, reason);

    // Quitter la salle actuelle
    if (userInfo.currentRoom) {
      const room = rooms.get(userInfo.currentRoom);
      if (room) {
        room.users.delete(socket.id);
        socket.to(userInfo.currentRoom).emit('user:left', userInfo);
      }
    }

    // Supprimer l'utilisateur
    connectedUsers.delete(socket.id);

    // Notifier les autres utilisateurs
    const usersList = Array.from(connectedUsers.values());
    io.emit('users:online', usersList);
  });

  // Erreurs
  socket.on('error', (error) => {
    console.error('❌ Erreur socket:', error);
  });
});

// Routes HTTP
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: connectedUsers.size,
    rooms: Array.from(rooms.keys())
  });
});

app.get('/api/rooms', (req, res) => {
  const roomsData = Array.from(rooms.values()).map(room => ({
    ...room,
    users: Array.from(room.users).map(socketId => {
      const user = connectedUsers.get(socketId);
      return user ? {
        userId: user.userId,
        username: user.username
      } : null;
    }).filter(Boolean)
  }));
  res.json(roomsData);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Socket.io démarré sur le port ${PORT}`);
  console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5180'}`);
  console.log(`🏠 Salles disponibles: ${defaultRooms.map(r => r.id).join(', ')}`);
});

module.exports = app;
