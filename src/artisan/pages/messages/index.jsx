// pages/artisan/messages/index.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Paperclip, Send, Image, MoreVertical, Loader2, ArrowLeft, User } from 'lucide-react';
import { 
  getMessages, 
  sendMessage, 
  markMessagesAsRead, 
  getConversations,
  subscribeToMessages 
} from '../../../core/services/messageService';
import { useAuthStore } from '../../../core/store/useAuthStore';
import toast from 'react-hot-toast';

export default function Messagerie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  
  // State
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const subscriptionRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  // Handle navigation from demandes page
  useEffect(() => {
    if (location.state?.demandeId && location.state?.id_particulier) {
      const { demandeId, id_particulier } = location.state;
      selectOrCreateConversation(demandeId, id_particulier);
    }
  }, [location.state]);

  // Subscribe to real-time messages when chat is selected
  useEffect(() => {
    if (selectedChat && user?.id) {
      loadMessages(selectedChat.id_particulier);
      markMessagesAsRead(user.id, selectedChat.id_particulier, 'artisan');
      
      // Subscribe to real-time messages
      subscriptionRef.current = subscribeToMessages(
        user.id,
        selectedChat.id_particulier,
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
      
      // Polling fallback toutes les 5 secondes si le realtime ne fonctionne pas
      const pollInterval = setInterval(() => {
        loadMessages(selectedChat.id_particulier);
      }, 5000);
      
      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        clearInterval(pollInterval);
      };
    }
  }, [selectedChat, user?.id]);

  const loadConversations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const result = await getConversations();
      
      if (result.success) {
        const mappedConversations = result.data.map(conv => ({
          id: conv.id,
          id_particulier: conv.id_particulier,
          id_artisan: conv.id_artisan,
          client: conv.other_user 
            ? `${conv.other_user.prenom_particulier || ''} ${conv.other_user.nom_particulier || ''}`.trim()
            : 'Client',
          avatar: conv.other_user?.photo_profil || null,
          lastMessage: conv.last_message,
          lastMessageAt: conv.last_message_at,
          unreadCount: conv.unread_count,
          online: false
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

  const loadMessages = async (particulierId) => {
    if (!user?.id || !particulierId) return;
    
    try {
      const result = await getMessages(user.id, particulierId);
      if (result.success) {
        setMessages(result.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erreur load messages:', error);
    }
  };

  const selectOrCreateConversation = async (demandeId, particulierId) => {
    const existingConv = conversations.find(c => c.id_particulier === particulierId);
    
    if (existingConv) {
      setSelectedChat(existingConv);
    } else {
      const newConv = {
        id: `${user.id}_${particulierId}`,
        id_particulier: particulierId,
        id_artisan: user.id,
        client: 'Nouveau client',
        avatar: null,
        lastMessage: '',
        unreadCount: 0,
        online: false
      };
      setSelectedChat(newConv);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !user?.id) return;
    
    try {
      setSending(true);
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
        setConversations(prev => prev.map(conv => 
          conv.id === selectedChat.id 
            ? { ...conv, lastMessage: messageInput.trim(), lastMessageAt: new Date().toISOString() }
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

  const filteredConversations = conversations.filter(conv => 
    conv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Liste des conversations */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucune conversation
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                  selectedChat?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {conv.avatar ? (
                      <img 
                        src={conv.avatar} 
                        alt={conv.client}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">{conv.client}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage || 'Nouvelle conversation'}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Header du chat */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {location.state?.from === 'demandes' && (
                  <button 
                    onClick={() => navigate('/dashboard/artisan/demandes')}
                    className="p-2 hover:bg-gray-100 rounded-full mr-2"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}
                {selectedChat.avatar ? (
                  <img 
                    src={selectedChat.avatar} 
                    alt={selectedChat.client}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{selectedChat.client}</h3>
                  <p className="text-xs text-green-600">En ligne</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <div
                        className={`flex ${msg.envoye_par === 'artisan' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.envoye_par === 'artisan'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.contenu}</p>
                          <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                            msg.envoye_par === 'artisan' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(msg.date_envoi)}</span>
                            {msg.envoye_par === 'artisan' && (
                              <span>{msg.lu ? '✓✓' : '✓'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
                    
            {/* Message input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                <div className="flex space-x-2">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Image className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={sending || !messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
              <p>Choisissez un client pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}