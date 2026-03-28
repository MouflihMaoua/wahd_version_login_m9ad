import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../../services/socketService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const ChatLobby = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([
    { id: 'general', name: 'Général', description: 'Chat général pour tous', users: 0 },
    { id: 'support', name: 'Support', description: 'Support technique et aide', users: 0 },
    { id: 'artisan', name: 'Artisans', description: 'Chat pour les artisans', users: 0 },
    { id: 'particulier', name: 'Particuliers', description: 'Chat pour les particuliers', users: 0 }
  ]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connecter au socket
    socketService.connect(user.id, user.username || user.email);

    // Configurer les callbacks
    socketService.notifyUsersUpdated = (users) => {
      setConnectedUsers(users);
      setIsConnected(true);
      
      // Mettre à jour le nombre d'utilisateurs par salle
      setRooms(prev => prev.map(room => ({
        ...room,
        users: users.filter(u => u.currentRoom === room.id).length
      })));
    };

    socketService.notifyError = (error) => {
      toast.error(`Erreur de connexion: ${error.message}`);
    };

    // Nettoyage
    return () => {
      socketService.disconnect();
    };
  }, [user, navigate]);

  const joinRoom = (roomId) => {
    if (!isConnected) {
      toast.error('Connexion en cours...');
      return;
    }
    navigate(`/chat/${roomId}`);
  };

  const formatNumber = (num) => {
    return num > 0 ? `${num} en ligne` : 'Hors ligne';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Salles de Chat</h1>
              <p className="text-sm text-gray-500">Choisissez une salle pour discuter</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {connectedUsers.length} utilisateur{connectedUsers.length > 1 ? 's' : ''} connecté{connectedUsers.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Salles de chat */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Salles disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => joinRoom(room.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${room.users > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-600">{formatNumber(room.users)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Salle: #{room.id}</span>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Rejoindre →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Utilisateurs connectés */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Utilisateurs connectés ({connectedUsers.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {connectedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun utilisateur connecté
                  </p>
                ) : (
                  connectedUsers.map((connectedUser) => (
                    <div key={connectedUser.userId} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {connectedUser.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {connectedUser.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {connectedUser.currentRoom || 'Lobby'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Statistiques */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total salles:</span>
                    <span className="font-medium">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">En ligne:</span>
                    <span className="font-medium text-green-600">{connectedUsers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Statut:</span>
                    <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Connecté' : 'Déconnecté'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLobby;
