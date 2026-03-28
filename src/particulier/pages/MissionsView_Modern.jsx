// src/pages/particulier/MissionsView.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, MessageSquare, Search, Filter, Clock, MapPin, 
  CheckCircle, AlertCircle, Star, TrendingUp, User 
} from 'lucide-react';

const missions = [
  {
    id: 1,
    artisan: 'Ahmed Mansouri',
    metier: 'Plombier',
    ville: 'Casablanca (Maarif)',
    date: 'Demain, 10:00',
    dateObj: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'confirmé',
    image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=200',
    prix: 1200,
    description: 'Réparation fuite d\'eau sous évier',
    rating: 4.8,
    nbAvis: 12
  },
  {
    id: 2,
    artisan: 'Youssef Alami',
    metier: 'Électricien',
    ville: 'Rabat (Gauthier)',
    date: '25 Fév 2025, 14:30',
    dateObj: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'en attente',
    image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=200',
    prix: 850,
    description: 'Installation de prises électriques',
    rating: 4.6,
    nbAvis: 8
  },
  {
    id: 3,
    artisan: 'Fatima Zahra',
    metier: 'Femme de ménage',
    ville: 'Marrakech (Guéliz)',
    date: '22 Fév 2025, 09:00',
    dateObj: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'terminé',
    image: 'https://images.unsplash.com/photo-1580489938304-3c4a6b8c3b3?w=200',
    prix: 450,
    description: 'Ménage complet appartement 2 pièces',
    rating: 4.9,
    nbAvis: 23
  }
];

const statusConfig = {
  confirmé: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Confirmé'
  },
  'en attente': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'En attente'
  },
  terminé: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircle,
    label: 'Terminé'
  }
};

export default function MissionsView() {
  const [filterStatus, setFilterStatus] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredMissions = missions.filter(mission => {
    const matchesStatus = filterStatus === 'tous' || mission.status === filterStatus;
    const matchesSearch = mission.artisan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.metier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.ville.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return b.dateObj - a.dateObj;
    } else if (sortBy === 'prix') {
      return b.prix - a.prix;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const getStatusInfo = (status) => statusConfig[status] || statusConfig['en attente'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Missions</h1>
              <p className="text-gray-600 mt-1">Suivez vos travaux en cours et terminés</p>
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
                  placeholder="Rechercher une mission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="confirmé">Confirmés</option>
                <option value="en attente">En attente</option>
                <option value="terminé">Terminés</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Plus récent</option>
                <option value="prix">Prix croissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMissions.map((mission, index) => {
              const statusInfo = getStatusInfo(mission.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image et statut */}
                  <div className="relative h-48">
                    <img 
                      src={mission.image} 
                      alt={mission.artisan} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon size={14} />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {/* Artisan et métier */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img 
                            src={mission.image} 
                            alt={mission.artisan} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{mission.artisan}</h3>
                          <p className="text-sm text-gray-600">{mission.metier}</p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{mission.rating}</span>
                        <span className="text-sm text-gray-500">({mission.nbAvis})</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{mission.description}</p>

                    {/* Localisation et date */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-blue-500" />
                        <span>{mission.ville}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{mission.date}</span>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{mission.prix} DH</p>
                        <p className="text-sm text-gray-500">Estimation</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/dashboard/particulier/missions/${mission.id}`}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <User size={18} />
                        <span>Gérer</span>
                      </Link>
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        <MessageSquare size={18} />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredMissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune mission trouvée</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Essayez de modifier vos filtres de recherche ou revenez plus tard pour voir de nouvelles missions.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
