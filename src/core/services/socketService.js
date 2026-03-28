import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connectedUsers = new Map();
    this.messages = [];
    this.currentRoom = null;
  }

  // Connexion au serveur Socket.io
  connect(userId, username) {
    if (this.socket && this.socket.connected) {
      console.log('🔌 Socket déjà connecté');
      return this.socket;
    }

    console.log('🔌 Connexion au serveur Socket.io...');
    
    // URL du serveur Socket.io (à adapter selon votre configuration)
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: {
        userId,
        username
      },
      transports: ['websocket', 'polling']
    });

    // Événements de connexion
    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.io:', this.socket.id);
      this.emit('user:online', { userId, username });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Déconnecté du serveur Socket.io:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.io:', error);
    });

    // Événements du chat
    this.setupChatEvents();

    return this.socket;
  }

  // Configuration des événements de chat
  setupChatEvents() {
    // Réception d'un message
    this.socket.on('chat:message', (message) => {
      console.log('💬 Message reçu:', message);
      this.messages.push(message);
      this.notifyMessageReceived(message);
    });

    // Utilisateur connecté
    this.socket.on('user:joined', (user) => {
      console.log('👤 Utilisateur connecté:', user);
      this.connectedUsers.set(user.userId, user);
      this.notifyUserJoined(user);
    });

    // Utilisateur déconnecté
    this.socket.on('user:left', (user) => {
      console.log('👤 Utilisateur déconnecté:', user);
      this.connectedUsers.delete(user.userId);
      this.notifyUserLeft(user);
    });

    // Liste des utilisateurs connectés
    this.socket.on('users:online', (users) => {
      console.log('👥 Utilisateurs connectés:', users);
      this.connectedUsers.clear();
      users.forEach(user => {
        this.connectedUsers.set(user.userId, user);
      });
      this.notifyUsersUpdated(users);
    });

    // État de frappe (typing)
    this.socket.on('user:typing', (data) => {
      console.log('⌨️ Utilisateur en train d\'écrire:', data);
      this.notifyUserTyping(data);
    });

    // Erreurs
    this.socket.on('error', (error) => {
      console.error('❌ Erreur Socket.io:', error);
      this.notifyError(error);
    });
  }

  // Rejoindre une salle de chat
  joinRoom(roomId) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Socket non connecté');
      return false;
    }

    console.log('🏠 Rejoindre la salle:', roomId);
    this.currentRoom = roomId;
    this.socket.emit('room:join', { roomId });
    return true;
  }

  // Quitter une salle de chat
  leaveRoom() {
    if (!this.socket || !this.socket.connected) {
      return false;
    }

    console.log('🚪 Quitter la salle:', this.currentRoom);
    this.socket.emit('room:leave', { roomId: this.currentRoom });
    this.currentRoom = null;
    return true;
  }

  // Envoyer un message
  sendMessage(roomId, content, type = 'text') {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Socket non connecté');
      return false;
    }

    const message = {
      id: Date.now() + Math.random(),
      roomId,
      content,
      type,
      timestamp: new Date().toISOString(),
      sender: {
        id: this.socket.auth?.userId,
        username: this.socket.auth?.username
      }
    };

    console.log('📤 Envoi message:', message);
    this.socket.emit('chat:message', message);
    return message;
  }

  // Envoyer un message privé
  sendPrivateMessage(recipientId, content) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Socket non connecté');
      return false;
    }

    const message = {
      id: Date.now() + Math.random(),
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      sender: {
        id: this.socket.auth?.userId,
        username: this.socket.auth?.username
      }
    };

    console.log('📤 Envoi message privé:', message);
    this.socket.emit('chat:private', message);
    return message;
  }

  // Indiquer qu'on écrit
  startTyping(roomId) {
    if (!this.socket || !this.socket.connected) return false;
    
    this.socket.emit('user:typing', {
      roomId,
      userId: this.socket.auth?.userId,
      isTyping: true
    });
    return true;
  }

  // Indiquer qu'on a arrêté d'écrire
  stopTyping(roomId) {
    if (!this.socket || !this.socket.connected) return false;
    
    this.socket.emit('user:typing', {
      roomId,
      userId: this.socket.auth?.userId,
      isTyping: false
    });
    return true;
  }

  // Obtenir les messages d'une salle
  getRoomMessages(roomId) {
    return this.messages.filter(msg => msg.roomId === roomId);
  }

  // Obtenir les utilisateurs connectés
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  // Déconnexion
  disconnect() {
    if (this.socket) {
      console.log('🔌 Déconnexion du serveur Socket.io');
      this.socket.disconnect();
      this.socket = null;
      this.connectedUsers.clear();
      this.messages = [];
      this.currentRoom = null;
    }
  }

  // Vérifier si connecté
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Callbacks (à surcharger dans les composants)
  notifyMessageReceived(message) {}
  notifyUserJoined(user) {}
  notifyUserLeft(user) {}
  notifyUsersUpdated(users) {}
  notifyUserTyping(data) {}
  notifyError(error) {}
}

// Exporter une instance singleton
export const socketService = new SocketService();
export default socketService;
