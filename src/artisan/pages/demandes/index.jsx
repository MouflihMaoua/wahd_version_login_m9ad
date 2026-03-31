// src/pages/artisan/demandes/index.jsx
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { getInvitationsForArtisan, updateInvitationStatus } from '../../../core/services/invitationService';
import { notifyInvitationAccepted, notifyInvitationRefused } from '../../../core/services/notificationService';
import { getOrCreateConversationForDemande } from '../../../core/services/messageService';
import { useAuthStore } from '../../../core/store/useAuthStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function DemandesPage() {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Charger les demandes depuis Supabase
  useEffect(() => {
    const loadDemandes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const result = await getInvitationsForArtisan(user.id);
        
        if (result.success) {
          const mappedDemandes = result.data.map(inv => ({
            id: inv.id,
            client: inv.particulier ? `${inv.particulier.prenom_particulier || ''} ${inv.particulier.nom_particulier || ''}`.trim() : 'Client',
            service: inv.description?.substring(0, 50) || 'Demande',
            description: inv.description || 'Pas de description',
            adresse: inv.ville || 'Non spécifiée',
            date: new Date(inv.date_demande || inv.created_at).toLocaleDateString('fr-FR'),
            heure: new Date(inv.date_demande || inv.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            urgence: inv.urgence || 'moyenne',
            statut: inv.statut === 'pending' ? 'nouveau' : inv.statut === 'accepted' ? 'accepté' : inv.statut === 'refused' ? 'refusé' : inv.statut,
            prix: 'À estimer',
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
    const matchesSearch = demande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'tous' || demande.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'accepté': return 'bg-green-100 text-green-800';
      case 'refusé': return 'bg-red-100 text-red-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgence) => {
    switch (urgence?.toLowerCase()) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-orange-100 text-orange-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccepter = async (demande) => {
    try {
      setActionLoading(demande.id);
      
      const result = await updateInvitationStatus(demande.id, 'acceptée');
      
      if (result.success) {
        await notifyInvitationAccepted(demande.rawData.id_particulier, user.id, demande.id);
        await getOrCreateConversationForDemande(demande.id);
        
        toast.success('Demande acceptée ! Une conversation a été ouverte avec le client.');
        
        setDemandes(prev => prev.map(d => 
          d.id === demande.id ? { ...d, statut: 'accepté' } : d
        ));
      } else {
        toast.error(result.error || 'Erreur lors de l\'acceptation');
      }
    } catch (err) {
      console.error('Erreur acceptation:', err);
      toast.error('Erreur lors de l\'acceptation de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async (demande) => {
    try {
      setActionLoading(demande.id);
      
      const result = await updateInvitationStatus(demande.id, 'refusée');
      
      if (result.success) {
        await notifyInvitationRefused(demande.rawData.id_particulier, user.id, demande.id);
        
        toast.success('Demande refusée. Le client en a été notifié.');
        
        setDemandes(prev => prev.map(d => 
          d.id === demande.id ? { ...d, statut: 'refusé' } : d
        ));
      } else {
        toast.error(result.error || 'Erreur lors du refus');
      }
    } catch (err) {
      console.error('Erreur refus:', err);
      toast.error('Erreur lors du refus de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOuvrirConversation = (demande) => {
    navigate('/dashboard/artisan/messages', { 
      state: { 
        demandeId: demande.id,
        id_particulier: demande.rawData?.id_particulier,
        from: 'demandes'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demandes des Clients</h1>
            <p className="text-gray-600">Gérez les nouvelles demandes d'intervention</p>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-medium">{demandes.length} demandes</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="nouveau">Nouveaux</option>
            <option value="accepté">Acceptés</option>
            <option value="refusé">Refusés</option>
            <option value="en_attente">En attente</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="grid gap-4">
        {filteredDemandes.map((demande) => (
          <div key={demande.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{demande.client}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demande.statut)}`}>
                    {demande.statut}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(demande.urgence)}`}>
                    Urgence: {demande.urgence}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{demande.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{demande.service}</span>
                  </div>
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

              <div className="ml-4">
                <div className="text-right mb-3">
                  <p className="text-lg font-bold text-gray-900">{demande.prix}</p>
                </div>
                
                {demande.statut === 'nouveau' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAccepter(demande)}
                      disabled={actionLoading === demande.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === demande.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Accepter
                    </button>
                    <button
                      onClick={() => handleRefuser(demande)}
                      disabled={actionLoading === demande.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === demande.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Refuser
                    </button>
                  </div>
                )}
                
                {demande.statut === 'accepté' && (
                  <button
                    onClick={() => handleOuvrirConversation(demande)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Discuter
                  </button>
                )}
                
                {demande.statut === 'refusé' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm">Refusée</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDemandes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune demande trouvée</p>
        </div>
      )}
    </div>
  );
}
