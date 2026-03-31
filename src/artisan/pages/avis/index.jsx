// src/pages/artisan/avis/index.jsx
import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, Flag, MessageSquare, Filter, Search, Loader2 } from 'lucide-react';
import { getEvaluationsByArtisan, getAverageRating } from '../../../core/services/evaluationService';
import { supabase } from '../../../core/services/supabaseClient';
import toast from 'react-hot-toast';

export default function AvisPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [stats, setStats] = useState({
    moyenne: 0,
    total: 0,
    repartition: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNote, setFilterNote] = useState('tous');
  const [userId, setUserId] = useState(null);

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  // Charger les évaluations
  const loadEvaluations = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const result = await getEvaluationsByArtisan(userId);
      
      if (result.success) {
        setEvaluations(result.data);
      } else {
        toast.error(result.error || 'Erreur lors du chargement des évaluations');
      }
    } catch (err) {
      console.error('Erreur chargement évaluations:', err);
      toast.error('Erreur lors du chargement des évaluations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      setStatsLoading(true);
      const result = await getAverageRating(userId);
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [userId]);

  // Charger les données au montage
  useEffect(() => {
    if (userId) {
      loadEvaluations();
      loadStats();
    }
  }, [userId, loadEvaluations, loadStats]);

  // Filtrer les évaluations
  const filteredEvaluations = evaluations.filter(item => {
    const matchesSearch = 
      searchTerm === '' || 
      item.particulier_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.commentaire?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNote = 
      filterNote === 'tous' || 
      item.note === parseInt(filterNote);
    
    return matchesSearch && matchesNote;
  });

  const renderStars = (note) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < note ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return formatDate(dateString);
  };

  if (loading || statsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Avis clients</h1>
        <p className="text-gray-600">Consultez et gérez les évaluations de vos clients</p>
      </div>

      {/* Note globale */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        {stats.total === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500">Aucune évaluation pour le moment</p>
            <p className="text-sm text-gray-400 mt-1">Les avis de vos clients apparaîtront ici</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">{stats.moyenne.toFixed(1)}</span>
                <div className="flex">{renderStars(5)}</div>
                <span className="text-sm text-gray-600">sur 5</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Basé sur {stats.total} avis</p>
            </div>
            
            {/* Répartition */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((note) => (
                <div key={note} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{note} ★</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.repartition[note] / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{stats.repartition[note]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les avis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <select 
          value={filterNote}
          onChange={(e) => setFilterNote(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="tous">Toutes les notes</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>
      </div>

      {/* Liste des avis */}
      {filteredEvaluations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || filterNote !== 'tous' 
              ? 'Aucun avis ne correspond à vos critères' 
              : 'Aucune évaluation pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvaluations.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.particulier_photo ? (
                      <img 
                        src={item.particulier_photo} 
                        alt={item.particulier_nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg">
                        {item.particulier_nom?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                      <h3 className="font-semibold text-gray-900">{item.particulier_nom}</h3>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{getTimeAgo(item.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(item.note)}</div>
                    </div>
                    
                    {item.commentaire && (
                      <p className="mt-3 text-gray-700 leading-relaxed">{item.commentaire}</p>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Signaler"
                    onClick={() => toast.info('Fonctionnalité à venir')}
                  >
                    <Flag className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}