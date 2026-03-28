// src/pages/particulier/MessagesView.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MessageSquare, Send, Paperclip, Phone, Video, 
  MoreVertical, Check, CheckCheck, Clock, User, Star,
  Filter, Archive, Trash2
} from 'lucide-react';

const conversations = [
  {
    id: 1,
    artisan: {
      nom: 'Ahmed Mansouri',
      metier: 'Plombier',
      avatar: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=200',
      rating: 4.8,
      nbAvis: 12,
      enLigne: true
    },
    lastMessage: {
      text: 'Je serai là à l\'heure, prévoyez les matériaux nécessaires.',
      time: '10:05',
      date: 'Aujourd\'hui',
      sent: false,
      lu: true
    },
    unreadCount: 0,
    active: true
  },
  {
    id: 2,
    artisan: {
      nom: 'Youssef Alami',
      metier: 'Électricien',
      avatar: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=200',
      rating: 4.6,
      nbAvis: 8,
      enLigne: false
    },
    lastMessage: {
      text: 'Le devis est prêt, vous pouvez le consulter.',
      time: '09:30',
      date: 'Hier',
      sent: true,
      lu: false
    },
    unreadCount: 2,
    active: false
  },
  {
    id: 3,
    artisan: {
      nom: 'Fatima Zahra',
      metier: 'Femme de ménage',
      avatar: 'https://images.unsplash.com/photo-1580489938304-3c4a6b8c3b3?w=200',
      rating: 4.9,
      nbAvis: 23,
      enLigne: true
    },
    lastMessage: {
      text: 'Merci pour votre confiance !',
      time: '15:20',
      date: 'Lundi',
      sent: false,
      lu: true
    },
    unreadCount: 0,
    active: false
  }
];

export default function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [filter, setFilter] = useState('tous');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.artisan.metier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'tous' || 
                         (filter === 'non_lus' && conv.unreadCount > 0) ||
                         (filter === 'en_ligne' && conv.artisan.enLigne);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
              <p className="text-gray-600 mt-1">Communiquez avec vos artisans</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Rechercher une discussion..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tous">Tous les messages</option>
                <option value="non_lus">Non lus</option>
                <option value="en_ligne">En ligne</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Conversations</h2>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedConversation?.id === conv.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                      : 'hover:bg-gray-50'
                  }`}
                  whileHover={{ backgroundColor: selectedConversation?.id === conv.id ? '#EFF6FF' : '#F9FAFB' }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar et statut */}
                    <div className="relative">
                      <img
                        src={conv.artisan.avatar}
                        alt={conv.artisan.nom}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.artisan.enLigne && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.artisan.nom}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {conv.lastMessage.date} • {conv.lastMessage.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-600">{conv.artisan.metier}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{conv.artisan.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 truncate mb-2">{conv.lastMessage.text}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {conv.lastMessage.lu ? (
                            <CheckCheck className="h-4 w-4 text-blue-500" />
                          ) : conv.lastMessage.sent ? (
                            <Check className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header conversation */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedConversation.artisan.avatar}
                          alt={selectedConversation.artisan.nom}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {selectedConversation.artisan.enLigne && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.artisan.nom}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">{selectedConversation.artisan.metier}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{selectedConversation.artisan.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <Phone size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <Video size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Message exemple */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={selectedConversation.artisan.avatar}
                          alt={selectedConversation.artisan.nom}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{selectedConversation.artisan.nom}</p>
                          <p className="text-xs text-gray-500">10:05</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                        <p className="text-gray-800">Bonjour ! Je serai là à l\'heure, prévoyez les matériaux nécessaires.</p>
                      </div>
                    </div>
                  </div>

                  {/* Message envoyé */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="flex items-center space-x-2 mb-2 justify-end">
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-900">Vous</p>
                          <p className="text-xs text-gray-500">10:08</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">S</span>
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4">
                        <p className="text-white">Parfait ! Merci pour la confirmation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-end space-x-3">
                    <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Paperclip size={20} className="text-gray-600" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Tapez votre message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sélectionnez un artisan</h3>
                    <p className="text-gray-600 max-w-sm">
                      Commencez à discuter de vos projets avec nos experts qualifiés.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
