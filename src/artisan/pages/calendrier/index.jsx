// pages/artisan/calendrier/index.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Briefcase,
  Navigation
} from 'lucide-react';
import { supabase } from '../../../core/services/supabaseClient';
import toast from 'react-hot-toast';

export default function Calendrier() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();
  }, []);

  // Fonction pour charger les demandes acceptées
  const loadAcceptedDemandes = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Récupérer les demandes acceptées (simplifié sans jointure)
      const { data: demandes, error } = await supabase
        .from('demande')
        .select('id_demande, description, date_demande, statut, urgence, id_particulier')
        .eq('id_artisan', userId)
        .in('statut', ['acceptee', 'en_cours', 'terminee'])
        .order('date_demande', { ascending: true });

      if (error) throw error;

      // Transformer les demandes en événements calendrier
      const calendarEvents = demandes?.map(demande => {
        const date = new Date(demande.date_demande);
        const nomComplet = 'Client';
        
        // Déterminer la couleur selon l'urgence
        let backgroundColor = '#3b82f6'; // bleu par défaut
        let borderColor = '#2563eb';
        
        if (demande.urgence === 'urgent') {
          backgroundColor = '#ef4444'; // rouge
          borderColor = '#dc2626';
        } else if (demande.urgence === 'haute') {
          backgroundColor = '#f97316'; // orange
          borderColor = '#ea580c';
        } else if (demande.statut === 'terminee') {
          backgroundColor = '#10b981'; // vert
          borderColor = '#059669';
        }

        return {
          id: demande.id_demande,
          title: `Intervention - ${nomComplet}`,
          start: date.toISOString(),
          end: new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2h par défaut
          backgroundColor,
          borderColor,
          textColor: '#ffffff',
          extendedProps: {
            ...demande,
            nomComplet
          }
        };
      }) || [];

      setEvents(calendarEvents);
      
    } catch (err) {
      console.error('Erreur chargement calendrier:', err);
      toast.error('Erreur lors du chargement du calendrier');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les données au montage
  useEffect(() => {
    if (userId) {
      loadAcceptedDemandes();
    }
  }, [userId, loadAcceptedDemandes]);

  // Souscription temps réel aux changements de demandes
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel('demandes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demande',
          filter: `id_artisan=eq.${userId}`
        },
        (payload) => {
          console.log('Changement détecté:', payload);
          loadAcceptedDemandes(); // Recharger automatiquement
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, loadAcceptedDemandes]);

  // Gestion clic sur un événement
  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info.event.extendedProps);
    setShowEventModal(true);
  };

  // Gestion clic sur une date
  const handleDateClick = (arg) => {
    // Optionnel: créer un nouvel événement manuel
    console.log('Date cliquée:', arg.date);
  };

  // Rafraîchissement manuel
  const handleRefresh = async () => {
    await loadAcceptedDemandes();
    toast.success('Calendrier actualisé');
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le badge d'urgence
  const getUrgenceBadge = (urgence) => {
    const styles = {
      'urgent': 'bg-red-100 text-red-800 border-red-200',
      'haute': 'bg-orange-100 text-orange-800 border-orange-200',
      'normale': 'bg-blue-100 text-blue-800 border-blue-200',
      'basse': 'bg-green-100 text-green-800 border-green-200'
    };
    return styles[urgence] || styles['normale'];
  };

  // Obtenir le badge de statut
  const getStatutBadge = (statut) => {
    const styles = {
      'acceptee': 'bg-green-100 text-green-800 border-green-200',
      'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'terminee': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[statut] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Calendrier</h1>
          <p className="text-gray-600">
            {events.length} intervention{events.length > 1 ? 's' : ''} programmée{events.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button 
            onClick={() => setCurrentView(currentView === 'timeGridWeek' ? 'dayGridMonth' : 'timeGridWeek')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentView === 'timeGridWeek' ? 'Vue Mois' : 'Vue Semaine'}
          </button>
        </div>
      </motion.div>

      {/* Légende */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 mb-4 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Urgent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Haute priorité</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Normale</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Terminée</span>
        </div>
      </motion.div>

      {/* Calendrier */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView={currentView}
          locale={frLocale}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </motion.div>

      {/* Modal Détails de l'intervention */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      Intervention
                    </h2>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getUrgenceBadge(selectedEvent.urgence)}`}>
                      {selectedEvent.urgence === 'urgent' ? 'Urgent' : 
                       selectedEvent.urgence === 'haute' ? 'Haute' : 
                       selectedEvent.urgence === 'basse' ? 'Basse' : 'Normale'}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatutBadge(selectedEvent.statut)}`}>
                    {selectedEvent.statut === 'acceptee' ? 'Acceptée' :
                     selectedEvent.statut === 'en_cours' ? 'En cours' :
                     selectedEvent.statut === 'terminee' ? 'Terminée' : selectedEvent.statut}
                  </span>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Contenu */}
              <div className="space-y-6">
                {/* Date et heure */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date prévue</p>
                    <p className="text-gray-600">{formatDate(selectedEvent.date_demande)}</p>
                  </div>
                </div>

                {/* Client */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {selectedEvent.nomComplet?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedEvent.nomComplet}</p>
                        <p className="text-sm text-gray-500">ID: {selectedEvent.id_particulier?.slice(0, 8) || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Description de la demande
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun événement */}
      {events.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center"
        >
          <CalendarIcon className="h-12 w-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Aucune intervention programmée</h3>
          <p className="text-blue-700 max-w-md mx-auto">
            Les demandes que vous acceptez apparaîtront automatiquement ici.
          </p>
          <a
            href="/dashboard/artisan/demandes"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir les demandes
          </a>
        </motion.div>
      )}
    </div>
  );
}
