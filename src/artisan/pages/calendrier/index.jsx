// pages/artisan/calendrier/index.jsx
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

export default function Calendrier() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Réparation fuite - Jean D.',
      start: '2024-01-15T10:00:00',
      end: '2024-01-15T12:00:00',
      backgroundColor: '#3b82f6'
    },
    {
      id: '2',
      title: 'Installation chauffe-eau - Marie M.',
      start: '2024-01-15T14:00:00',
      end: '2024-01-15T17:00:00',
      backgroundColor: '#10b981'
    },
    {
      id: '3',
      title: 'Dépannage électrique - Pierre D.',
      start: '2024-01-16T09:00:00',
      end: '2024-01-16T11:00:00',
      backgroundColor: '#f59e0b'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    service: '',
    startTime: '',
    endTime: '',
    address: '',
    notes: ''
  });

  // États pour la section Demandes
  const [demandes, setDemandes] = useState([
    {
      id: '1',
      client: 'Sophie Martin',
      metier: 'Plombier',
      probleme: 'Fuite d\'eau dans la cuisine',
      date: '2024-01-20',
      statut: 'en_attente'
    },
    {
      id: '2',
      client: 'Marc Dubois',
      metier: 'Électricien',
      probleme: 'Installation de prises électriques',
      date: '2024-01-21',
      statut: 'en_attente'
    },
    {
      id: '3',
      client: 'Julie Petit',
      metier: 'Peintre',
      probleme: 'Peinture des murs du salon',
      date: '2024-01-22',
      statut: 'en_attente'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetier, setSelectedMetier] = useState('');
  const [problemeDescription, setProblemeDescription] = useState('');
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setShowModal(true);
  };

  const handleEventDrop = (info) => {
    // Mettre à jour l'événement dans la base de données
    console.log('Événement déplacé:', info.event);
  };

  const handleEventClick = (info) => {
    // Afficher les détails de l'intervention
    console.log('Détails intervention:', info.event);
  };

  const toggleDisponibilite = (date, disponible) => {
    // Marquer un jour comme disponible/indisponible
    console.log('Jour:', date, disponible ? 'Disponible' : 'Indisponible');
  };

  // Fonctions pour la gestion des demandes
  const handleSearchArtisan = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectDemande = (demande) => {
    setSelectedDemande(demande);
    setShowDemandeModal(true);
  };

  const handleAccepterDemande = (demandeId) => {
    // Mettre à jour le statut de la demande
    setDemandes(prev => 
      prev.map(d => 
        d.id === demandeId 
          ? { ...d, statut: 'acceptee' }
          : d
      )
    );
    setShowDemandeModal(false);
    alert('Demande acceptée avec succès !');
  };

  const handleRefuserDemande = (demandeId) => {
    // Mettre à jour le statut de la demande
    setDemandes(prev => 
      prev.map(d => 
        d.id === demandeId 
          ? { ...d, statut: 'refusee' }
          : d
      )
    );
    setShowDemandeModal(false);
    alert('Demande refusée.');
  };

  const handleSubmitProbleme = (e) => {
    e.preventDefault();
    
    if (!selectedMetier || !problemeDescription) {
      alert('Veuillez sélectionner un métier et décrire le problème.');
      return;
    }

    // Simuler l'envoi du problème
    alert('Problème soumis avec succès ! Un artisan vous contactera bientôt.');
    setProblemeDescription('');
    setSelectedMetier('');
  };

  // Filtrer les artisans par métier
  const metiers = SERVICES_ARTISAN;
  const filteredDemandes = demandes.filter(demande => 
    demande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.metier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.probleme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewIntervention = () => {
    setShowModal(true);
    // Réinitialiser le formulaire
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    setFormData({
      client: '',
      service: '',
      startTime: localDateTime,
      endTime: localDateTime,
      address: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDateTime = (dateTime) => {
    const selectedDateTime = new Date(dateTime);
    const now = new Date();
    return selectedDateTime >= now;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Obtenir la date actuelle pour l'attribut min
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    // Validation des dates
    if (!validateDateTime(formData.startTime) || !validateDateTime(formData.endTime)) {
      alert('Les dates ne peuvent pas être dans le passé. Veuillez sélectionner des dates futures.');
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('La date de fin doit être postérieure à la date de début.');
      return;
    }
    
    // Créer un nouvel événement
    const newEvent = {
      id: Date.now().toString(),
      title: `${formData.service} - ${formData.client}`,
      start: formData.startTime,
      end: formData.endTime,
      backgroundColor: '#3b82f6'
    };

    // Ajouter l'événement à la liste
    setEvents(prev => [...prev, newEvent]);
    
    // Fermer la modal et réinitialiser le formulaire
    setShowModal(false);
    setFormData({
      client: '',
      service: '',
      startTime: localDateTime,
      endTime: localDateTime,
      address: '',
      notes: ''
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
          <p className="text-gray-600">Gérez vos interventions et disponibilités</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleNewIntervention}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nouvelle intervention
          </button>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          locale={frLocale}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
        />
      </div>

      {/* Section Demandes */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Demandes des clients</h2>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <a href="https://www.travaux.com/publiez-votre-projet/cloture" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H8m8 8l-8-8" />
              </svg>
              Envoyer une demande
            </a>
          </button>
        </div>

        {/* Recherche d'artisans */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rechercher un artisan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Métier
              </label>
              <select
                value={selectedMetier}
                onChange={(e) => setSelectedMetier(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Sélectionner un métier</option>
                {metiers.map(metier => (
                  <option key={metier} value={metier}>{metier}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du problème
              </label>
              <textarea
                value={problemeDescription}
                onChange={(e) => setProblemeDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="3"
                placeholder="Décrivez précisément le problème à résoudre..."
              ></textarea>
            </div>
          </div>
          <button
            onClick={handleSubmitProbleme}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Soumettre le problème
          </button>
        </div>

        {/* Liste des demandes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Demandes en attente</h3>
          
          {/* Barre de recherche */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchArtisan}
              placeholder="Rechercher par client, métier ou problème..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Liste des demandes filtrées */}
          <div className="space-y-3">
            {filteredDemandes.map(demande => (
              <div key={demande.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-900">{demande.client}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        demande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                        demande.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {demande.statut === 'en_attente' ? 'En attente' :
                         demande.statut === 'acceptee' ? 'Acceptée' : 'Refusée'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Métier:</span> {demande.metier}</p>
                      <p><span className="font-medium">Problème:</span> {demande.probleme}</p>
                      <p><span className="font-medium">Date:</span> {demande.date}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleSelectDemande(demande)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal pour les détails de la demande */}
      {showDemandeModal && selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Détails de la demande</h2>
              <button
                onClick={() => setShowDemandeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations client</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nom:</span> {selectedDemande.client}</p>
                  <p><span className="font-medium">Date:</span> {selectedDemande.date}</p>
                  <p><span className="font-medium">Statut:</span> 
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedDemande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                      selectedDemande.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedDemande.statut === 'en_attente' ? 'En attente' :
                       selectedDemande.statut === 'acceptee' ? 'Acceptée' : 'Refusée'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails de la demande</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Métier recherché:</span> {selectedDemande.metier}</p>
                  <p><span className="font-medium">Description:</span></p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-gray-700">{selectedDemande.probleme}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDemandeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedDemande.statut === 'en_attente' && (
                <>
                  <button
                    onClick={() => handleRefuserDemande(selectedDemande.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Refuser la demande
                  </button>
                  <button
                    onClick={() => handleAccepterDemande(selectedDemande.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accepter la demande
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter une intervention */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle intervention</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select 
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  <option value="Jean Dupont">Jean Dupont</option>
                  <option value="Marie Martin">Marie Martin</option>
                  <option value="Pierre Durand">Pierre Durand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <input
                  name="service"
                  type="text"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Type d'intervention"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Début
                  </label>
                  <input
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin
                  </label>
                  <input
                    name="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Adresse complète"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Informations supplémentaires..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer l'intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}