// pages/artisan/messages/index.jsx
import { useState, useRef, useEffect } from 'react';
import { Search, Paperclip, Send, Image, MapPin, FileText, MoreVertical } from 'lucide-react';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

export default function Messagerie() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      client: "Sophie Martin",
      avatar: null,
      lastMessage: "Quand pouvez-vous passer ?",
      time: "10:30",
      unread: 2,
      online: true,
      service: "Plombier"
    },
    {
      id: 2,
      client: "Thomas Bernard",
      avatar: null,
      lastMessage: "Merci pour votre travail",
      time: "09:15",
      unread: 0,
      online: false,
      service: "Électricien"
    },
    {
      id: 3,
      client: "Julie Dubois",
      avatar: null,
      lastMessage: "Le devis est parfait !",
      time: "Hier",
      unread: 0,
      online: false,
      service: "Technicien en électroménager et climatisation"
    }
  ];

  const messages = {
    1: [
      { id: 1, from: 'client', text: 'Bonjour, j\'ai une fuite d\'eau sous mon évier', time: '10:15', status: 'lu' },
      { id: 2, from: 'artisan', text: 'Bonjour Sophie, je peux passer cette après-midi vers 14h ?', time: '10:20', status: 'lu' },
      { id: 3, from: 'client', text: 'Oui c\'est parfait ! Combien de temps pensez-vous ?', time: '10:25', status: 'lu' },
      { id: 4, from: 'artisan', text: 'Environ 1h30, je vous enverrai un devis avant', time: '10:28', status: 'lu' },
      { id: 5, from: 'client', text: 'Quand pouvez-vous passer ?', time: '10:30', status: 'livre' },
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Message envoyé:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Liste des conversations */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                selectedChat === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 truncate">{conv.client}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{conv.service}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Header du chat */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {conversations.find(c => c.id === selectedChat)?.client}
                  </h3>
                  <p className="text-xs text-green-600">En ligne</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages[selectedChat]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'artisan' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.from === 'artisan'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                                        <p className="text-sm">{msg.text}</p>
                                        <div className={`text-xs mt-1 flex items-center justify-end space-x-1`}>
                                          <span>{msg.time}</span>
                                          {msg.from === 'artisan' && <span>{msg.status === 'lu' ? '✓✓' : '✓'}</span>}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
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
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="Votre message..."
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                                      <Send className="h-5 w-5" />
                                    </button>
                                  </form>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500">
                                Sélectionnez une conversation
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }