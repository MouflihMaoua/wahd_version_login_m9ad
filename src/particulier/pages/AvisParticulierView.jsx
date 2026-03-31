/**
 * AvisParticulierView - Page Réputation pour les particuliers
 * Affiche uniquement les artisans avec qui le particulier a déjà discuté
 * Permet d'évaluer ces artisans
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, User, Loader2, MessageSquare, Award, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import { 
  getArtisansFromConversations, 
  getEvaluationsByArtisan, 
  getAverageRating,
  createEvaluation,
  hasEvaluatedToday
} from '../../core/services/evaluationService';
import toast from 'react-hot-toast';

/**
 * Composant d'évaluation avec étoiles interactif
 */
const StarRatingInput = ({ rating, setRating, size = 32, disabled = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          className={`transition-transform ${disabled ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
        >
          <Star
            size={size}
            className={`${star <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

/**
 * Modal de profil artisan avec formulaire d'évaluation
 */
const ArtisanProfileModal = ({ artisan, onClose, onEvaluationSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [existingEvaluation, setExistingEvaluation] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [averageRating, setAverageRating] = useState({ moyenne: 0, total: 0, repartition: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);

  // Charger les évaluations et vérifier si déjà évalué
  useEffect(() => {
    const loadData = async () => {
      if (!artisan) return;
      
      try {
        setLoadingEvaluations(true);
        
        // Récupérer la moyenne
        const avgResult = await getAverageRating(artisan.id_artisan);
        if (avgResult.success) {
          setAverageRating(avgResult.data);
        }
        
        // Récupérer les évaluations
        const evalsResult = await getEvaluationsByArtisan(artisan.id_artisan);
        if (evalsResult.success) {
          setEvaluations(evalsResult.data);
        }
        
        // Vérifier si déjà évalué aujourd'hui
        const checkResult = await hasEvaluatedToday(artisan.id_artisan);
        if (checkResult.success && checkResult.hasEvaluated) {
          setHasEvaluated(true);
          setExistingEvaluation(checkResult.existingEvaluation);
          setRating(checkResult.existingEvaluation.note);
          setCommentaire(checkResult.existingEvaluation.commentaire || '');
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoadingEvaluations(false);
      }
    };
    
    loadData();
  }, [artisan]);

  // Soumettre l'évaluation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }
    
    if (hasEvaluated) {
      toast.error('Vous avez déjà évalué cet artisan aujourd\'hui');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const result = await createEvaluation({
        id_artisan: artisan.id_artisan,
        note: rating,
        commentaire: commentaire.trim()
      });
      
      if (result.success) {
        toast.success('Évaluation envoyée avec succès !');
        setHasEvaluated(true);
        setExistingEvaluation(result.data);
        
        // Recharger les évaluations
        const avgResult = await getAverageRating(artisan.id_artisan);
        if (avgResult.success) {
          setAverageRating(avgResult.data);
        }
        
        const evalsResult = await getEvaluationsByArtisan(artisan.id_artisan);
        if (evalsResult.success) {
          setEvaluations(evalsResult.data);
        }
        
        if (onEvaluationSubmitted) {
          onEvaluationSubmitted();
        }
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.error('Erreur lors de l\'envoi de l\'évaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (!artisan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3A5C] to-[#2d5a87] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border-4 border-white/30">
              {artisan.photo_profil ? (
                <img src={artisan.photo_profil} alt={artisan.nom_complet} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1A3A5C] text-white font-bold text-2xl">
                  {artisan.prenom_artisan?.charAt(0) || artisan.nom_artisan?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{artisan.nom_complet}</h2>
              <p className="text-white/80">{artisan.metier || 'Artisan'}</p>
              <p className="text-white/60 text-sm">{artisan.ville || 'Ville non précisée'}</p>
              
              {/* Rating moyen */}
              <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-full px-3 py-1 w-fit">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-semibold">{averageRating.moyenne.toFixed(1)}</span>
                <span className="text-white/60">({averageRating.total} avis)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          {artisan.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">À propos</h3>
              <p className="text-gray-600 leading-relaxed">{artisan.description}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Formulaire d'évaluation */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
                {hasEvaluated ? 'Votre évaluation' : 'Évaluer cet artisan'}
              </h3>
              
              {hasEvaluated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm">
                    Vous avez déjà évalué cet artisan aujourd'hui.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre note <span className="text-red-500">*</span>
                  </label>
                  <StarRatingInput 
                    rating={rating} 
                    setRating={setRating} 
                    size={36}
                    disabled={hasEvaluated}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {rating > 0 ? `${rating}/5 étoiles` : 'Cliquez pour noter'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => !hasEvaluated && setCommentaire(e.target.value)}
                    disabled={hasEvaluated}
                    placeholder="Partagez votre expérience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none resize-none h-28 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || hasEvaluated || rating === 0}
                  className="w-full py-2.5 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#e55a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Envoi...</>
                  ) : hasEvaluated ? (
                    <><CheckCircle className="h-5 w-5" /> Déjà évalué</>
                  ) : (
                    <><Send className="h-5 w-5" /> Envoyer mon avis</>
                  )}
                </button>
              </form>
            </div>
            
            {/* Liste des avis */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis des clients</h3>
              
              {/* Répartition des notes */}
              {averageRating.total > 0 && (
                <div className="mb-4 space-y-1">
                  {[5, 4, 3, 2, 1].map((note) => (
                    <div key={note} className="flex items-center gap-2 text-sm">
                      <span className="w-6 text-gray-600">{note}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 rounded-full h-2 transition-all"
                          style={{ 
                            width: `${averageRating.total > 0 ? (averageRating.repartition[note] / averageRating.total) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="w-6 text-gray-500 text-right">{averageRating.repartition[note] || 0}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {loadingEvaluations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
                </div>
              ) : evaluations.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucun avis pour le moment</p>
                  <p className="text-xs text-gray-400 mt-1">Soyez le premier à évaluer !</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {evaluations.slice(0, 5).map((avis) => (
                      <motion.div
                        key={avis.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {avis.particulier_nom?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900 truncate">{avis.particulier_nom}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(avis.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={star <= avis.note ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            {avis.commentaire && (
                              <p className="mt-1 text-gray-600 text-sm">{avis.commentaire}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {evaluations.length > 5 && (
                    <p className="text-center text-sm text-gray-500 pt-2">
                      + {evaluations.length - 5} avis supplémentaires
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Page principale Réputation pour les particuliers
 */
const AvisParticulierView = () => {
  const [loading, setLoading] = useState(true);
  const [artisans, setArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [error, setError] = useState(null);

  // Charger les artisans des conversations
  const loadArtisans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getArtisansFromConversations();
      
      if (result.success) {
        // Pour chaque artisan, récupérer sa note moyenne
        const artisansWithRatings = await Promise.all(
          (result.data || []).map(async (artisan) => {
            const ratingResult = await getAverageRating(artisan.id_artisan);
            return {
              ...artisan,
              moyenne: ratingResult.success ? ratingResult.data.moyenne : 0,
              totalAvis: ratingResult.success ? ratingResult.data.total : 0
            };
          })
        );
        
        // Trier par note moyenne décroissante
        const sortedArtisans = artisansWithRatings.sort((a, b) => b.moyenne - a.moyenne);
        setArtisans(sortedArtisans);
      } else {
        setError(result.error || 'Erreur lors du chargement');
        toast.error(result.error || 'Erreur lors du chargement des artisans');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur inconnue');
      toast.error('Erreur lors du chargement des artisans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtisans();
  }, [loadArtisans]);

  // Filtrer les artisans
  const filteredArtisans = artisans.filter(artisan => {
    const searchLower = searchTerm.toLowerCase();
    return (
      artisan.nom_complet?.toLowerCase().includes(searchLower) ||
      artisan.metier?.toLowerCase().includes(searchLower) ||
      artisan.ville?.toLowerCase().includes(searchLower)
    );
  });

  // Calculer les statistiques globales
  const totalArtisans = artisans.length;
  const artisansAvecAvis = artisans.filter(a => a.totalAvis > 0).length;
  const moyenneGenerale = totalArtisans > 0 
    ? (artisans.reduce((acc, a) => acc + a.moyenne, 0) / totalArtisans).toFixed(1)
    : '0.0';
  const totalEvaluations = artisans.reduce((acc, a) => acc + a.totalAvis, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Artisans</h1>
          <p className="text-gray-600">Artisans avec qui vous avez discuté et que vous pouvez évaluer</p>
        </div>
      </div>

      {/* Message si aucun artisan */}
      {artisans.length === 0 && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <MessageSquare className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Aucun artisan à évaluer</h3>
          <p className="text-blue-700 max-w-md mx-auto mb-4">
            Vous n'avez pas encore de conversations avec des artisans. 
            Rendez-vous dans la page "Chercher" pour contacter des artisans.
          </p>
          <a
            href="/dashboard/particulier/search"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Chercher des artisans
          </a>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadArtisans}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {artisans.length > 0 && (
        <>
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un artisan, métier, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
            />
          </div>

          {/* Liste des artisans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtisans.map((artisan) => (
              <motion.div
                key={artisan.id_artisan}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedArtisan(artisan)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {artisan.photo_profil ? (
                      <img 
                        src={artisan.photo_profil} 
                        alt={artisan.nom_complet}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1A3A5C] text-white font-bold text-xl">
                        {artisan.prenom_artisan?.charAt(0) || artisan.nom_artisan?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{artisan.nom_complet}</h3>
                    <p className="text-sm text-[#FF6B35]">{artisan.metier || 'Artisan'}</p>
                    <p className="text-xs text-gray-500">{artisan.ville || 'Ville non précisée'}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= Math.round(artisan.moyenne) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {artisan.moyenne.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">({artisan.totalAvis} avis)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#e55a25] transition-colors">
                    {artisan.totalAvis > 0 ? 'Voir profil & avis' : 'Évaluer'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArtisans.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Aucun artisan ne correspond à votre recherche</p>
            </div>
          )}
        </>
      )}

      {/* Modal de profil artisan */}
      <AnimatePresence>
        {selectedArtisan && (
          <ArtisanProfileModal
            artisan={selectedArtisan}
            onClose={() => setSelectedArtisan(null)}
            onEvaluationSubmitted={loadArtisans}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvisParticulierView;
