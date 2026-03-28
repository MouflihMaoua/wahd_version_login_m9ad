import React, { useState, useEffect, useRef } from 'react';
import { socketService } from '../../services/socketService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const ChatRoom = ({ roomId, roomName }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Configuration des callbacks du socket
  useEffect(() => {
    if (!user) return;

    // Connecter au socket
    socketService.connect(user.id, user.username || user.email);

    // Configurer les callbacks
    socketService.notifyMessageReceived = (message) => {
      if (message.roomId === roomId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    socketService.notifyUserJoined = (userJoined) => {
      toast.success(`${userJoined.username} a rejoint le chat`);
      setConnectedUsers(socketService.getConnectedUsers());
    };

    socketService.notifyUserLeft = (userLeft) => {
      toast(`${userLeft.username} a quitté le chat`, { icon: '👋' });
      setConnectedUsers(socketService.getConnectedUsers());
    };

    socketService.notifyUsersUpdated = (users) => {
      setConnectedUsers(users);
    };

    socketService.notifyUserTyping = (data) => {
      if (data.roomId === roomId) {
        setTypingUsers(prev => {
          const newTyping = new Set(prev);
          if (data.isTyping) {
            newTyping.add(data.userId);
          } else {
            newTyping.delete(data.userId);
          }
          return newTyping;
        });
      }
    };

    // Rejoindre la salle
    socketService.joinRoom(roomId);

    // Nettoyage
    return () => {
      socketService.leaveRoom();
      socketService.disconnect();
    };
  }, [user, roomId]);

  // Scroll automatique en bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gestion de la frappe
  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      socketService.startTyping(roomId);
    }

    // Arrêter d'écrire après 1 seconde d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (value.trim().length === 0) {
        setIsTyping(false);
        socketService.stopTyping(roomId);
      }
    }, 1000);
  };

  // Envoyer un message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message = socketService.sendMessage(roomId, newMessage.trim());
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setIsTyping(false);
      socketService.stopTyping(roomId);
      scrollToBottom();
    }
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si le message est de l'utilisateur actuel
  const isOwnMessage = (message) => {
    return message.sender?.id === user?.id;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Utilisateurs connectés */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{roomName}</h3>
          <p className="text-sm text-gray-500">{connectedUsers.length} connectés</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Utilisateurs connectés</h4>
          <div className="space-y-2">
            {connectedUsers.map(connectedUser => (
              <div key={connectedUser.userId} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{connectedUser.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{roomName}</h2>
          <p className="text-sm text-gray-500">Chat en temps réel</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage(message)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {!isOwnMessage(message) && (
                  <p className="text-xs font-medium mb-1 opacity-75">
                    {message.sender?.username}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Indicateur de frappe */}
          {typingUsers.size > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <p className="text-sm">
                  {Array.from(typingUsers).map(userId => {
                    const typingUser = connectedUsers.find(u => u.userId === userId);
                    return typingUser?.username;
                  }).filter(Boolean).join(', ')} 
                  {typingUsers.size === 1 ? 'est' : 'sont'} en train d'écrire...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
