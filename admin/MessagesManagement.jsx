import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Reply, Trash2, Eye, Ban, Send, MessageSquare, AlertTriangle, CheckCircle, Clock, User, Calendar } from 'lucide-react';

const MessagesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState([]);

  // Données simulées
  const messages = [
    {
      id: 1,
      sender: {
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        type: 'client',
        avatar: 'MD'
      },
      recipient: {
        name: 'Pierre Lemoine',
        email: 'pierre.lemoine@email.com',
        type: 'artisan',
        avatar: 'PL'
      },
      subject: 'Demande de devis pour plomberie',
      content: 'Bonjour, j\'ai besoin d\'un devis pour une fuite d\'eau dans ma cuisine. Pouvez-vous intervenir rapidement ?',
      timestamp: '2024-03-01 14:30',
      status: 'pending',
      type: 'inquiry',
      priority: 'high',
      flagged: false,
      attachments: 2
    },
    {
      id: 2,
      sender: {
        name: 'Jean Martin',
        email: 'jean.martin@email.com',
        type: 'client',
        avatar: 'JM'
      },
      recipient: {
        name: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        type: 'artisan',
        avatar: 'MD'
      },
      subject: 'Réclamation sur la peinture',
      content: 'La peinture appliquée ne correspond pas à la couleur demandée. Je souhaite une correction.',
      timestamp: '2024-03-01 10:15',
      status: 'flagged',
      type: 'complaint',
      priority: 'high',
      flagged: true,
      attachments: 3
    },
    {
      id: 3,
      sender: {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        type: 'artisan',
        avatar: 'SB'
      },
      recipient: {
        name: 'Admin',
        email: 'admin@artisanpro.com',
        type: 'admin',
        avatar: 'AD'
      },
      subject: 'Question sur les commissions',
      content: 'Bonjour, je voudrais comprendre le calcul des commissions prélevées sur mes missions.',
      timestamp: '2024-02-28 16:45',
      status: 'resolved',
      type: 'support',
      priority: 'medium',
      flagged: false,
      attachments: 0
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesType = filterType === 'all' || message.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'flagged': return 'Signalé';
      case 'resolved': return 'Résolu';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'inquiry': return 'bg-blue-100 text-blue-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'support': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'inquiry': return 'Demande';
      case 'complaint': return 'Réclamation';
      case 'support': return 'Support';
      case 'review': return 'Avis';
      default: return 'Autre';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Gestion des Messages</h1>
          <p className="text-gray-600 mt-1">Modérez et gérez tous les messages de la plateforme</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <Send size={20} />
            Envoyer une notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-brand-dark">2,847</p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-brand-orange" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">156</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Signalés</p>
              <p className="text-2xl font-bold text-red-600">23</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-green-600">2,668</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Messages Alert */}
      {filterStatus === 'all' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-red-600 mr-3" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {messages.filter(m => m.status === 'flagged').length} messages signalés nécessitent votre attention
              </p>
              <p className="text-xs text-red-600 mt-1">
                Ces messages contiennent du contenu potentiellement inapproprié ou des réclamations
              </p>
            </div>
            <button 
              onClick={() => setFilterStatus('flagged')}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Voir les messages signalés
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par expéditeur, sujet ou contenu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="flagged">Signalés</option>
              <option value="resolved">Résolus</option>
              <option value="archived">Archivés</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="inquiry">Demandes</option>
              <option value="complaint">Réclamations</option>
              <option value="support">Support</option>
              <option value="review">Avis</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversation
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {message.sender.avatar}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {message.sender.name}
                            </p>
                            <span className="text-xs text-gray-500">→</span>
                            <p className="text-sm text-gray-600 truncate">
                              {message.recipient.name}
                            </p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.content}
                          </p>
                          {message.attachments > 0 && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">
                                📎 {message.attachments} pièce(s) jointe(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(message.type)}`}>
                      {getTypeText(message.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getPriorityColor(message.priority)}`}>
                      {message.priority === 'high' ? 'Haute' : message.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(message.status)}`}>
                      {getStatusText(message.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-brand-orange hover:text-brand-orange/80">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Reply size={18} />
                      </button>
                      {message.status === 'flagged' && (
                        <button className="text-green-600 hover:text-green-800">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à{' '}
            <span className="font-medium">{filteredMessages.length}</span> sur{' '}
            <span className="font-medium">{messages.length}</span> résultats
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
              Précédent
            </button>
            <button className="px-3 py-1 bg-brand-orange text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesManagement;
