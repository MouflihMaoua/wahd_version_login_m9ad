// src/pages/particulier/MessagesView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, MessageSquare, Send, Paperclip, Phone, Video, 
  MoreVertical, Check, CheckCheck, Clock, User, Star,
  Filter, Loader2, ArrowLeft
} from 'lucide-react';
import { 
  getMessages, 
  sendMessage, 
  markMessagesAsRead, 
  getConversations,
  subscribeToMessages 
} from '../../core/services/messageService';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  
  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('tous');
  const subscriptionRef = useRef(null);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.artisan?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.artisan?.metier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'tous' || 
                         (filter === 'non_lus' && conv.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  // Handle navigation from demandes page
  useEffect(() => {
    if (location.state?.demandeId && location.state?.id_artisan) {
      const { demandeId, id_artisan } = location.state;
      selectOrCreateConversation(demandeId, id_artisan);
    }
  }, [location.state]);

  // Subscribe to real-time messages when chat is selected
  useEffect(() => {
    if (selectedConversation && user?.id) {
      loadMessages(selectedConversation.id_artisan);
      markMessagesAsRead(selectedConversation.id_artisan, user.id, 'particulier');
      
      // Subscribe to real-time messages
      subscriptionRef.current = subscribeToMessages(
        selectedConversation.id_artisan,
        user.id,
        (newMessage) => {
          console.log('📨 Nouveau message reçu:', newMessage);
          setMessages(prev => {
            // Éviter les doublons
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          scrollToBottom();
        }
      );
      
      // Polling fallback toutes les 5 secondes
      const pollInterval = setInterval(() => {
        loadMessages(selectedConversation.id_artisan);
      }, 5000);
      
      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        clearInterval(pollInterval);
      };
    }
  }, [selectedConversation, user?.id]);

  const loadConversations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const result = await getConversations();
      
      if (result.success) {
        const mappedConversations = result.data.map(conv => ({
          id: conv.id,
          id_artisan: conv.id_artisan,
          id_particulier: conv.id_particulier,
          artisan: {
            nom: conv.other_user 
              ? `${conv.other_user.prenom_artisan || ''} ${conv.other_user.nom_artisan || ''}`.trim()
              : 'Artisan',
            metier: conv.other_user?.metier || 'Artisan',
            avatar: conv.other_user?.photo_profil || null,
            rating: 4.5,
            nbAvis: 0,
            enLigne: false
          },
          lastMessage: {
            text: conv.last_message || '',
            time: formatTime(conv.last_message_at),
            date: formatDate(conv.last_message_at),
            sent: conv.last_message_sender === 'particulier',
            lu: conv.last_message?.lu || false
          },
          unreadCount: conv.unread_count,
          active: false
        }));
        setConversations(mappedConversations);
      } else {
        toast.error('Erreur lors du chargement des conversations');
      }
    } catch (error) {
      console.error('Erreur load conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (artisanId) => {
    if (!user?.id || !artisanId) return;
    
    try {
      const result = await getMessages(artisanId, user.id);
      if (result.success) {
        setMessages(result.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erreur load messages:', error);
    }
  };

  const selectOrCreateConversation = async (demandeId, artisanId) => {
    const existingConv = conversations.find(c => c.id_artisan === artisanId);
    
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      const newConv = {
        id: `${artisanId}_${user.id}`,
        id_artisan: artisanId,
        id_particulier: user.id,
        artisan: {
          nom: 'Nouvel artisan',
          metier: 'Artisan',
          avatar: null,
          rating: 0,
          nbAvis: 0,
          enLigne: false
        },
        lastMessage: { text: '', time: '', date: '', sent: false, lu: false },
        unreadCount: 0,
        active: true
      };
      setSelectedConversation(newConv);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user?.id) return;
    
    try {
      setSending(true);
      const result = await sendMessage({
        id_artisan: selectedConversation.id_artisan,
        id_particulier: user.id,
        contenu: messageInput.trim(),
        envoye_par: 'particulier'
      });
      
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
        setMessageInput('');
        scrollToBottom();
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: {
                  text: messageInput.trim(),
                  time: formatTime(new Date()),
                  date: 'Aujourd\'hui',
                  sent: true,
                  lu: false
                }
              }
            : conv
        ));
      } else {
        toast.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Aujourd\'hui';
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucune conversation
                </div>
              ) : (
                filteredConversations.map((conv) => (
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
                        {conv.artisan?.avatar ? (
                          <img
                            src={conv.artisan.avatar}
                            alt={conv.artisan.nom}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        {conv.artisan?.enLigne && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.artisan?.nom || 'Artisan'}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {conv.lastMessage?.time}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-gray-600">{conv.artisan?.metier || 'Artisan'}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{conv.artisan?.rating || 0}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 truncate mb-2">
                          {conv.lastMessage?.text || 'Nouvelle conversation'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {conv.lastMessage?.sent ? (
                              conv.lastMessage?.lu ? (
                                <CheckCheck className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Check className="h-4 w-4 text-gray-400" />
                              )
                            ) : null}
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
                ))
              )}
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
                      {location.state?.from === 'demandes' && (
                        <button 
                          onClick={() => navigate('/dashboard/particulier/demandes')}
                          className="p-2 hover:bg-gray-200 rounded-full mr-2"
                        >
                          <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                      )}
                      <div className="relative">
                        {selectedConversation.artisan?.avatar ? (
                          <img
                            src={selectedConversation.artisan.avatar}
                            alt={selectedConversation.artisan.nom}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        {selectedConversation.artisan?.enLigne && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.artisan?.nom || 'Artisan'}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">{selectedConversation.artisan?.metier || 'Artisan'}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{selectedConversation.artisan?.rating || 0}</span>
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
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p className="mb-2">Aucun message encore</p>
                        <p className="text-sm">Commencez la conversation !</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const showDate = index === 0 || 
                        formatDate(messages[index - 1].date_envoi) !== formatDate(msg.date_envoi);
                      
                      return (
                        <div key={msg.id || index}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatDate(msg.date_envoi)}
                              </span>
                            </div>
                          )}
                          
                          {msg.envoye_par === 'artisan' ? (
                            <div className="flex justify-start">
                              <div className="max-w-xs lg:max-w-md">
                                <div className="flex items-center space-x-2 mb-2">
                                  {selectedConversation.artisan?.avatar ? (
                                    <img
                                      src={selectedConversation.artisan.avatar}
                                      alt={selectedConversation.artisan.nom}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-medium text-gray-900">{selectedConversation.artisan?.nom || 'Artisan'}</p>
                                    <p className="text-xs text-gray-500">{formatTime(msg.date_envoi)}</p>
                                  </div>
                                </div>
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                                  <p className="text-gray-800">{msg.contenu}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <div className="max-w-xs lg:max-w-md">
                                <div className="flex items-center space-x-2 mb-2 justify-end">
                                  <div className="text-right">
                                    <p className="text-xs font-medium text-gray-900">Vous</p>
                                    <p className="text-xs text-gray-500">{formatTime(msg.date_envoi)}</p>
                                  </div>
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                      {user?.email?.charAt(0).toUpperCase() || 'V'}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4">
                                  <p className="text-white">{msg.contenu}</p>
                                  <div className="text-right mt-1">
                                    <span className="text-xs text-blue-200">
                                      {msg.lu ? '✓✓' : '✓'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
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
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !messageInput.trim()}
                        className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
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
