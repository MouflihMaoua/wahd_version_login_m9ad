/**
 * DemandesView - Vue Mes Demandes Envoyées
 * Liste des demandes envoyées aux artisans avec données réelles Supabase
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Loader2, MessageCircle, Star } from 'lucide-react';
import { getInvitationsForParticulier } from '../../core/services/invitationService';
import { useAuthStore } from '../../core/store/useAuthStore';
import EvaluationForm from '../../shared/components/EvaluationForm';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DemandesView = () => {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluationModal, setEvaluationModal] = useState({
    isOpen: false,
    artisanId: null,
    artisanName: null
  });
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Charger les demandes depuis Supabase
  useEffect(() => {
    const loadDemandes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const result = await getInvitationsForParticulier(user.id);
        
        if (result.success) {
          const mappedDemandes = result.data.map(inv => ({
            id: inv.id,
            artisan: inv.artisan ? `${inv.artisan.prenom || ''} ${inv.artisan.nom || ''}`.trim() : 'Artisan',
            service: inv.service,
            description: inv.message || inv.description || 'Pas de description',
            adresse: inv.description?.includes('Ville:') ? inv.description.split('Ville:')[1]?.split(',')[0] : 'Non spécifiée',
            telephone: inv.artisan?.telephone || 'Non spécifié',
            email: inv.artisan?.email || 'Non spécifié',
            date: new Date(inv.created_at).toLocaleDateString('fr-FR'),
            heure: new Date(inv.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            urgence: inv.description?.includes('Urgence:') ? inv.description.split('Urgence:')[1] : 'moyenne',
            statut: inv.statut === 'pending' ? 'en_attente' : inv.statut === 'accepted' ? 'accepté' : 'refusé',
            artisanMetier: inv.artisan?.specialite || inv.service,
            rawData: inv
          }));
          setDemandes(mappedDemandes);
        } else {
          toast.error(result.error || 'Erreur lors du chargement des demandes');
        }
      } catch (err) {
        console.error('Erreur chargement demandes:', err);
        toast.error('Erreur lors du chargement des demandes');
      } finally {
        setLoading(false);
      }
    };

    loadDemandes();
  }, [user?.id]);

  // Filtrer les demandes
  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = demande.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.artisan.toLowerCase().includes(searchTerm.toLowerCase());
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
    switch (urgence?.toLowerCase()) {
      case 'basse': return 'bg-green-100 text-green-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'haute': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOuvrirConversation = (demande) => {
    navigate('/dashboard/particulier/messages', { 
      state: { 
        demandeId: demande.id,
        id_artisan: demande.rawData?.id_artisan,
        from: 'demandes'
      }
    });
  };

  const handleOpenEvaluation = (demande) => {
    setEvaluationModal({
      isOpen: true,
      artisanId: demande.rawData?.id_artisan,
      artisanName: demande.artisan
    });
  };

  const handleCloseEvaluation = () => {
    setEvaluationModal({
      isOpen: false,
      artisanId: null,
      artisanName: null
    });
  };

  const handleEvaluationSuccess = () => {
    toast.success('Évaluation envoyée avec succès !');
    handleCloseEvaluation();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{demandes.length}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{demandes.filter(d => d.statut === 'en_attente').length}</p>
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
              <p className="text-2xl font-bold text-green-600">{demandes.filter(d => d.statut === 'accepté').length}</p>
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
              <p className="text-2xl font-bold text-red-600">{demandes.filter(d => d.statut === 'refusé').length}</p>
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
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Artisan:</p>
                        <p className="text-sm text-blue-800">{demande.artisan} - {demande.artisanMetier}</p>
                      </div>
                    </div>
                  </div>
                  
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
                  
                  {/* Boutons pour demandes acceptées */}
                  {demande.statut === 'accepté' && (
                    <>
                      <button
                        onClick={() => handleOuvrirConversation(demande)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Discuter
                      </button>
                      <button
                        onClick={() => handleOpenEvaluation(demande)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2"
                      >
                        <Star className="h-4 w-4" />
                        Évaluer
                      </button>
                    </>
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
              Vous n'avez pas encore envoyé de demande. Recherchez un artisan et envoyez-lui une demande.
            </p>
          </div>
        )}
      </div>

      {/* Modal d'évaluation */}
      <EvaluationForm
        isOpen={evaluationModal.isOpen}
        onClose={handleCloseEvaluation}
        artisanId={evaluationModal.artisanId}
        artisanName={evaluationModal.artisanName}
        onSuccess={handleEvaluationSuccess}
      />
    </div>
  );
};

export default DemandesView;
