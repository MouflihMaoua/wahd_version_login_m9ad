/**
 * DemandesView - Vue Mes Demandes Envoyées
 * Liste des demandes envoyées aux artisans avec messagerie
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Clock, User, Phone, Mail, Star, CheckCircle, XCircle, AlertCircle, Eye, Send, MessageCircle, X } from 'lucide-react';

const DemandesView = () => {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [allDemandes, setAllDemandes] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Charger les demandes depuis localStorage au montage
  useEffect(() => {
    const demandesEnvoyees = JSON.parse(localStorage.getItem('demandesArtisans') || '[]');
    setAllDemandes(demandesEnvoyees);
  }, []);

  // Filtrer les demandes
  const filteredDemandes = allDemandes.filter(demande => {
    const matchesSearch = demande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (demande.artisanName && demande.artisanName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'tous' || demande.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepté':
        return 'bg-green-100 text-green-800';
      case 'refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgence) => {
    switch (urgence) {
      case 'basse':
        return 'bg-green-100 text-green-800';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'haute':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = (demande) => {
    if (!messageText.trim()) return;
    
    // Simuler l'envoi du message
    alert(`Message envoyé à ${demande.artisanName}:\n\n"${messageText}"\n\n(Dans une vraie application, le message serait sauvegardé et envoyé)`);
    setMessageText('');
    setShowMessageModal(false);
  };

  const openMessageModal = (demande) => {
    setSelectedDemande(demande);
    setShowMessageModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Demandes Envoyées</h1>
          <p className="text-gray-600">Suivez vos demandes envoyées aux artisans</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="tous">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="en_attente">En attente</option>
          <option value="accepté">Accepté</option>
          <option value="refusé">Refusé</option>
        </select>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total demandes</p>
              <p className="text-2xl font-bold text-gray-900">{allDemandes.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{allDemandes.filter(d => d.statut === 'en_attente').length}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-green-600">{allDemandes.filter(d => d.statut === 'accepté').length}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-red-600">{allDemandes.filter(d => d.statut === 'refusé').length}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {filteredDemandes.length > 0 ? (
          filteredDemandes.map((demande) => (
            <motion.div
              key={demande.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{demande.service}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demande.statut)}`}>
                      {demande.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(demande.urgence)}`}>
                      Urgence: {demande.urgence}
                    </span>
                  </div>
                  
                  {/* Afficher les informations de l'artisan si disponible */}
                  {demande.artisanName && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        {demande.artisanImage && (
                          <img 
                            src={demande.artisanImage} 
                            alt={demande.artisanName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-blue-900">Artisan:</p>
                          <p className="text-sm text-blue-800">{demande.artisanName} - {demande.artisanMetier}</p>
                          <p className="text-xs text-blue-600">{demande.artisanVille}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-3">{demande.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{demande.adresse}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{demande.date} à {demande.heure}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <div className="text-right mb-3">
                    <p className="text-lg font-bold text-gray-900">{demande.prix}</p>
                  </div>
                  
                  {/* Bouton de messagerie - seulement si la demande est acceptée */}
                  {demande.statut === 'accepté' && (
                    <button
                      onClick={() => openMessageModal(demande)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Envoyer message
                    </button>
                  )}
                  
                  {/* Indicateur pour les autres statuts */}
                  {demande.statut === 'nouveau' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm">En attente de réponse</span>
                    </div>
                  )}
                  
                  {demande.statut === 'en_attente' && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm">En cours...</span>
                    </div>
                  )}
                  
                  {demande.statut === 'refusé' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm">Demande refusée</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Vous n'avez pas encore envoyé de demande. Utilisez le formulaire ci-dessus pour envoyer votre première demande.
            </p>
          </div>
        )}
      </div>

      {/* Modal de messagerie */}
      <AnimatePresence>
        {showMessageModal && selectedDemande && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Envoyer un message</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    À: <span className="font-medium text-blue-600">{selectedDemande.artisanName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="4"
                  ></textarea>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSendMessage(selectedDemande)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send size={16} />
                    Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemandesView;
