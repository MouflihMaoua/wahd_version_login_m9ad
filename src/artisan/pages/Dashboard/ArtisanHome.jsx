import { useState } from 'react';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  Clock,
  AlertCircle,
  ChevronRight,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

export default function ArtisanHome() {
  const [isOnline, setIsOnline] = useState(true);

  const stats = {
    demandes: 12,
    interventionsToday: 3,
    revenusMois: 4850,
    noteMoyenne: 4.8
  };

  const prochainesInterventions = [
    { id: 1, client: "Jean Dupont", service: "Plombier", heure: "14:30", adresse: "12 rue de Paris" },
    { id: 2, client: "Marie Martin", service: "Électricien", heure: "16:00", adresse: "8 av. Victor Hugo" },
    { id: 3, client: "Pierre Durand", service: "Technicien en électroménager et climatisation", heure: "18:30", adresse: "3 bd Haussmann" }
  ];

  const demandesUrgentes = [
    { id: 1, client: "Urgent: Fuite eau", temps: "Il y a 10 min", priorite: "haute" },
    { id: 2, client: "Panne électrique", temps: "Il y a 25 min", priorite: "moyenne" }
  ];

  const revenusSemaine = [
    { jour: "Lun", montant: 320 },
    { jour: "Mar", montant: 450 },
    { jour: "Mer", montant: 280 },
    { jour: "Jeu", montant: 590 },
    { jour: "Ven", montant: 480 },
    { jour: "Sam", montant: 650 },
    { jour: "Dim", montant: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec disponibilité */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, Ahmed 👋</h1>
          <p className="text-gray-600">Voici votre résumé du jour</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Statut:</span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOnline ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Demandes reçues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.demandes}</p>
              <p className="text-xs text-green-600 mt-1">+3 aujourd'hui</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interventions aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interventionsToday}</p>
              <p className="text-xs text-gray-500 mt-1">3 rendez-vous</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus du mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revenusMois} DH</p>
              <p className="text-xs text-green-600 mt-1">+12% vs mois dernier</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.noteMoyenne}/5</p>
              <p className="text-xs text-gray-500 mt-1">24 avis</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* Graphique revenus */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenus de la semaine</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Cette semaine</option>
                <option>Semaine dernière</option>
                <option>Ce mois</option>
              </select>
            </div>
            <div className="h-48 flex items-end justify-between space-x-2">
              {revenusSemaine.map((jour, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition"
                    style={{ height: `${(jour.montant / 650) * 150}px` }}
                  />
                  <p className="text-xs text-gray-600 mt-2">{jour.jour}</p>
                  <p className="text-xs font-medium">{jour.montant} DH</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite - 1/3 */}
        <div className="space-y-6">
         

          {/* Calendrier mini */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ce mois</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((jour, i) => (
                <div key={i} className="font-medium text-gray-500 py-1">{jour}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`py-1 rounded-full ${
                  i + 1 === 15 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
