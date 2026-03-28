import React, { useState } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, Calendar, User, Activity, Shield, FileText, RefreshCw, Trash2 } from 'lucide-react';

const SystemLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Données simulées
  const logs = [
    {
      id: 1,
      timestamp: '2024-03-01 14:30:15',
      level: 'error',
      action: 'login_failed',
      user: {
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        ip: '192.168.1.100'
      },
      description: 'Échec de connexion - mot de passe incorrect',
      details: 'Tentative de connexion depuis IP 192.168.1.100',
      module: 'auth',
      status: 'resolved'
    },
    {
      id: 2,
      timestamp: '2024-03-01 14:25:42',
      level: 'warning',
      action: 'user_suspended',
      user: {
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        ip: '192.168.1.101'
      },
      description: 'Utilisateur suspendu pour activité suspecte',
      details: 'Suspension automatique après 5 tentatives de connexion échouées',
      module: 'user_management',
      status: 'active'
    },
    {
      id: 3,
      timestamp: '2024-03-01 14:20:18',
      level: 'info',
      action: 'artisan_validated',
      user: {
        name: 'Pierre Lemoine',
        email: 'pierre.lemoine@email.com',
        ip: '192.168.1.102'
      },
      description: 'Nouvel artisan validé',
      details: 'Validation manuelle par administrateur',
      module: 'artisan_management',
      status: 'completed'
    },
    {
      id: 4,
      timestamp: '2024-03-01 14:15:33',
      level: 'success',
      action: 'payment_processed',
      user: {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        ip: '192.168.1.103'
      },
      description: 'Paiement traité avec succès',
      details: 'Mission #12345 - Montant: €250.00',
      module: 'payment',
      status: 'completed'
    },
    {
      id: 5,
      timestamp: '2024-03-01 14:10:27',
      level: 'error',
      action: 'database_error',
      user: {
        name: 'System',
        email: 'system@artisanpro.com',
        ip: 'localhost'
      },
      description: 'Erreur de connexion à la base de données',
      details: 'Timeout de connexion après 30 secondes',
      module: 'database',
      status: 'resolved'
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesLevel && matchesAction;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'error': return 'Erreur';
      case 'warning': return 'Avertissement';
      case 'info': return 'Information';
      case 'success': return 'Succès';
      default: return 'Inconnu';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return <AlertTriangle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'info': return <Activity size={16} />;
      case 'success': return <CheckCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'login_failed': return 'Connexion échouée';
      case 'user_suspended': return 'Utilisateur suspendu';
      case 'artisan_validated': return 'Artisan validé';
      case 'payment_processed': return 'Paiement traité';
      case 'database_error': return 'Erreur base de données';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Logs Système</h1>
          <p className="text-gray-600 mt-1">Journal des activités et erreurs système</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Auto-rafraîchissement' : 'Auto-rafraîchissement'}
          </button>
          <button className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <Download size={20} />
            Exporter les logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-brand-dark">15,234</p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <FileText className="text-brand-orange" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Erreurs</p>
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
              <p className="text-sm text-gray-600">Avertissements</p>
              <p className="text-2xl font-bold text-yellow-600">156</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">24 dernières heures</p>
              <p className="text-2xl font-bold text-blue-600">892</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {filterLevel === 'all' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-red-600 mr-3" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {logs.filter(l => l.level === 'error').length} erreurs critiques nécessitent votre attention
              </p>
              <p className="text-xs text-red-600 mt-1">
                Des erreurs système ont été détectées et nécessitent une intervention immédiate
              </p>
            </div>
            <button 
              onClick={() => setFilterLevel('error')}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Voir les erreurs
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
                placeholder="Rechercher par utilisateur, description ou détails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="1h">Dernière heure</option>
              <option value="24h">24 dernières heures</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              <option value="error">Erreurs</option>
              <option value="warning">Avertissements</option>
              <option value="info">Informations</option>
              <option value="success">Succès</option>
            </select>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Toutes les actions</option>
              <option value="login_failed">Connexions échouées</option>
              <option value="user_suspended">Utilisateurs suspendus</option>
              <option value="artisan_validated">Artisans validés</option>
              <option value="payment_processed">Paiements traités</option>
              <option value="database_error">Erreurs base de données</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(log.level)}`}>
                        {getLevelText(log.level)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getActionText(log.action)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{log.user.name}</div>
                      <div className="text-gray-500">{log.user.email}</div>
                      <div className="text-xs text-gray-400">IP: {log.user.ip}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900">{log.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-brand-orange hover:text-brand-orange/80">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download size={18} />
                      </button>
                      {log.level === 'error' && log.status === 'resolved' && (
                        <button className="text-green-600 hover:text-green-800">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
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
            <span className="font-medium">{filteredLogs.length}</span> sur{' '}
            <span className="font-medium">{logs.length}</span> résultats
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

export default SystemLogs;
