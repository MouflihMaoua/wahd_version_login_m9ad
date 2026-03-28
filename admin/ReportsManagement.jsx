import React, { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, AlertTriangle, CheckCircle, Clock, Calendar, User, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const ReportsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  // Données simulées
  const reports = [
    {
      id: 1,
      title: 'Rapport mensuel - Février 2024',
      type: 'monthly',
      status: 'completed',
      generatedDate: '2024-03-01 09:00',
      generatedBy: 'Admin System',
      description: 'Rapport complet des activités du mois de février',
      metrics: {
        users: 1234,
        artisans: 456,
        missions: 2847,
        revenue: 125680
      },
      file: {
        name: 'rapport-fevrier-2024.pdf',
        size: '2.4 MB',
        downloads: 45
      }
    },
    {
      id: 2,
      title: 'Signalements utilisateurs - Mars 2024',
      type: 'user_reports',
      status: 'processing',
      generatedDate: '2024-03-01 14:30',
      generatedBy: 'Marie Admin',
      description: 'Analyse des signalements et réclamations utilisateurs',
      metrics: {
        totalReports: 23,
        resolvedReports: 18,
        pendingReports: 5,
        averageResolutionTime: '48h'
      },
      file: {
        name: 'signalements-mars-2024.xlsx',
        size: '856 KB',
        downloads: 12
      }
    },
    {
      id: 3,
      title: 'Performance des artisans - Q1 2024',
      type: 'performance',
      status: 'scheduled',
      generatedDate: null,
      generatedBy: null,
      description: 'Analyse de performance des artisans pour le premier trimestre',
      metrics: null,
      file: null
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'processing': return 'En cours';
      case 'scheduled': return 'Programmé';
      case 'failed': return 'Échoué';
      default: return 'Inconnu';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'user_reports': return 'bg-red-100 text-red-800';
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'monthly': return 'Mensuel';
      case 'user_reports': return 'Signalements';
      case 'performance': return 'Performance';
      case 'financial': return 'Financier';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Rapports et Signalements</h1>
          <p className="text-gray-600 mt-1">Générez et consultez tous les rapports de la plateforme</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <FileText size={20} />
            Générer un rapport
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rapports</p>
              <p className="text-2xl font-bold text-brand-dark">156</p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <FileText className="text-brand-orange" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ce mois</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Signalements</p>
              <p className="text-2xl font-bold text-red-600">89</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Téléchargements</p>
              <p className="text-2xl font-bold text-green-600">1,234</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Download className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rapport mensuel</p>
                <p className="text-xs text-gray-500">Générer le rapport du mois</p>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Signalements</p>
                <p className="text-xs text-gray-500">Exporter les signalements</p>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Performance</p>
                <p className="text-xs text-gray-500">Analyser les performances</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
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
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">Dernière année</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminés</option>
              <option value="processing">En cours</option>
              <option value="scheduled">Programmés</option>
              <option value="failed">Échoués</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="monthly">Mensuels</option>
              <option value="user_reports">Signalements</option>
              <option value="performance">Performance</option>
              <option value="financial">Financiers</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapport
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de génération
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Généré par
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {report.description}
                      </div>
                      {report.metrics && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                          {Object.entries(report.metrics).map(([key, value]) => (
                            <span key={key}>
                              {key}: <span className="font-medium">{value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(report.type)}`}>
                      {getTypeText(report.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.generatedDate ? (
                      <>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-400" />
                          {new Date(report.generatedDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(report.generatedDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">Non généré</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.generatedBy || (
                      <span className="text-gray-400">Système</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.file ? (
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{report.file.name}</div>
                          <div className="text-xs text-gray-500">
                            {report.file.size} • {report.file.downloads} téléchargements
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-brand-orange hover:text-brand-orange/80">
                        <Eye size={18} />
                      </button>
                      {report.file && (
                        <button className="text-green-600 hover:text-green-800">
                          <Download size={18} />
                        </button>
                      )}
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
            <span className="font-medium">{filteredReports.length}</span> sur{' '}
            <span className="font-medium">{reports.length}</span> résultats
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

export default ReportsManagement;
