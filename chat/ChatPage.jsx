import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import ChatLobby from '../components/chat/ChatLobby';
import { useAuthStore } from '../store/useAuthStore';

const ChatPage = () => {
  const { user } = useAuthStore();
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Définition des salles disponibles
  const availableRooms = {
    general: { id: 'general', name: 'Général' },
    support: { id: 'support', name: 'Support' },
    artisan: { id: 'artisan', name: 'Artisans' },
    particulier: { id: 'particulier', name: 'Particuliers' }
  };

  // Vérifier si la salle existe
  const room = availableRooms[roomId];
  
  // Rediriger vers le lobby si pas de salle spécifiée
  if (!roomId) {
    return <ChatLobby />;
  }

  // Rediriger vers le lobby si la salle n'existe pas
  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salle introuvable</h1>
          <p className="text-gray-600 mb-6">La salle "#{roomId}" n'existe pas.</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au lobby
          </button>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au chat.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Afficher la salle de chat
  return <ChatRoom roomId={room.id} roomName={room.name} />;
};

export default ChatPage;
