// src/pages/artisan/demandes/index.jsx
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Clock, User, Phone, Mail, Star, CheckCircle, XCircle, AlertCircle, Eye, Send, ChevronRight } from 'lucide-react';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

export default function DemandesPage() {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [allDemandes, setAllDemandes] = useState([]);

  // Demandes par défaut
  const defaultDemandes = [
    {
      id: 1,
      client: "Sophie Martin",
      service: "Plombier",
      description: "Fuite d'eau sous l'évier de la cuisine",
      adresse: "15 Rue Hassan II, Casablanca",
      telephone: "06 12 34 56 78",
      email: "sophie.martin@email.com",
      date: "2024-01-20",
      heure: "14:00",
      urgence: "moyenne",
      statut: "nouveau",
      prix: "À estimer",
      note: 4.5,
      
    },
    {
      id: 2,
      client: "Thomas Bernard",
      service: "Électricien",
      description: "Installation d'un nouveau compteur électrique",
      adresse: "23 Avenue Mohammed V, Rabat",
      telephone: "06 98 76 54 32",
      email: "thomas.bernard@email.com",
      date: "2024-01-21",
      heure: "10:00",
      urgence: "basse",
      statut: "accepté",
      prix: "2500 DH",
      note: 4.8,
    },
    {
      id: 3,
      client: "Julie Dubois",
      service: "Technicien en électroménager et climatisation",
      description: "Panne de chaudière - pas d'eau chaude",
      adresse: "7 Boulevard Zerktouni, Marrakech",
      telephone: "06 45 67 89 01",
      email: "julie.dubois@email.com",
      date: "2024-01-19",
      heure: "08:00",
      urgence: "haute",
      statut: "en_attente",
      prix: "À estimer",
      note: 4.2,
    }
  ];

  // Charger les demandes depuis localStorage au montage du composant
  useEffect(() => {
    const demandesEnvoyees = JSON.parse(localStorage.getItem('demandesArtisans') || '[]');
    setAllDemandes([...defaultDemandes, ...demandesEnvoyees]);
  }, []);

  // Filtrer les demandes
  const demandes = allDemandes.filter(demande => {
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
    switch (urgence) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-orange-100 text-orange-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccepter = (id) => {
    console.log('Demande acceptée:', id);
    // Mettre à jour le statut dans la base de données
  };

  const handleRefuser = (id) => {
    console.log('Demande refusée:', id);
    // Mettre à jour le statut dans la base de données
  };

  const handleVoirDetails = (demande) => {
    console.log('Voir détails de la demande:', demande.id);
    // Rediriger vers une page de détails (simuler pour l'instant)
    alert(`Redirection vers les détails de la demande ${demande.id}\n\nClient: ${demande.client}\nService: ${demande.service}\n\n(Dans une vraie application, cela redirigerait vers une page de détails complète)`);
    
    // Alternative: rediriger vers une page de détails si elle existe
    // window.location.href = `/dashboard/artisan/demandes/${demande.id}`;
  };

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
            <span className="text-blue-800 font-medium">{allDemandes.length} demandes</span>
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
        {demandes.map((demande) => (
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
                
                {/* Afficher les informations de l'artisan si la demande vient de la recherche */}
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
                        <p className="text-sm font-medium text-blue-900">Artisan concerné:</p>
                        <p className="text-sm text-blue-800">{demande.artisanName} - {demande.artisanMetier}</p>
                        <p className="text-xs text-blue-600">{demande.artisanVille}</p>
                      </div>
                    </div>
                  </div>
                )}
                
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
                    <Phone className="h-4 w-4" />
                    <span>{demande.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{demande.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{demande.date} à {demande.heure}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="h-4 w-4" />
                    <span>{demande.note} ⭐</span>
                  </div>
                </div>

              
              </div>

              <div className="ml-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{demande.prix}</p>
                  </div>
                  
                </div>
                
                {demande.statut === 'nouveau' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAccepter(demande.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accepter
                    </button>
                    <button
                      onClick={() => handleRefuser(demande.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Refuser
                    </button>
                  </div>
                )}
                
                {demande.statut === 'en_attente' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">En cours...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {demandes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune demande trouvée</p>
        </div>
      )}
    </div>
  );
}
