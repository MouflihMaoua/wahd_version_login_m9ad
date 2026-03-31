import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../core/services/supabaseClient';
import { 
  createEvaluation, 
  getEvaluationsByArtisan, 
  getAverageRating,
  hasEvaluatedToday 
} from '../../core/services/evaluationService';
import toast from 'react-hot-toast';

/**
 * Composant d'évaluation interactive avec étoiles
 */
const StarRating = ({ rating, setRating, size = 32, interactive = true }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${
            star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star
            size={size}
            className={`${star <= (hover || rating) ? 'fill-current' : ''} transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

/**
 * Composant principal : Profil Artisan avec Évaluation
 * Affiche le profil de l'artisan, permet l'évaluation et montre les avis existants
 */
const ArtisanProfileWithEvaluation = ({ artisanId, onClose }) => {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isParticulier, setIsParticulier] = useState(false);
  
  // État du formulaire d'évaluation
  const [rating, setRating] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [existingEvaluation, setExistingEvaluation] = useState(null);
  
  // État des évaluations
  const [evaluations, setEvaluations] = useState([]);
  const [averageRating, setAverageRating] = useState({ moyenne: 0, total: 0, repartition: {} });
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);

  // Charger l'utilisateur connecté
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Vérifier si c'est un particulier
        const { data: particulier } = await supabase
          .from('particulier')
          .select('id_particulier')
          .eq('id_particulier', user.id)
          .single();
        
        setIsParticulier(!!particulier);
      }
    };
    
    loadUser();
  }, []);

  // Charger les données de l'artisan
  const loadArtisanData = useCallback(async () => {
    if (!artisanId) return;
    
    try {
      setLoading(true);
      
      // Récupérer les infos de l'artisan
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisan')
        .select('id_artisan, nom_artisan, prenom_artisan, metier, ville, photo_profil, description')
        .eq('id_artisan', artisanId)
        .single();
      
      if (artisanError) throw artisanError;
      
      setArtisan({
        ...artisanData,
        nom_complet: `${artisanData.prenom_artisan || ''} ${artisanData.nom_artisan || ''}`.trim()
      });
    } catch (error) {
      console.error('Erreur chargement artisan:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }, [artisanId]);

  // Charger les évaluations et la moyenne
  const loadEvaluationsData = useCallback(async () => {
    if (!artisanId) return;
    
    try {
      setLoadingEvaluations(true);
      
      // Récupérer la moyenne
      const avgResult = await getAverageRating(artisanId);
      if (avgResult.success) {
        setAverageRating(avgResult.data);
      }
      
      // Récupérer les évaluations
      const evalsResult = await getEvaluationsByArtisan(artisanId);
      if (evalsResult.success) {
        setEvaluations(evalsResult.data);
      }
    } catch (error) {
      console.error('Erreur chargement évaluations:', error);
    } finally {
      setLoadingEvaluations(false);
    }
  }, [artisanId]);

  // Vérifier si l'utilisateur a déjà évalué
  const checkExistingEvaluation = useCallback(async () => {
    if (!user || !artisanId || !isParticulier) return;
    
    try {
      const result = await hasEvaluatedToday(artisanId);
      if (result.success && result.hasEvaluated) {
        setHasEvaluated(true);
        setExistingEvaluation(result.existingEvaluation);
        setRating(result.existingEvaluation.note);
        setCommentaire(result.existingEvaluation.commentaire || '');
      }
    } catch (error) {
      console.error('Erreur vérification évaluation:', error);
    }
  }, [user, artisanId, isParticulier]);

  useEffect(() => {
    loadArtisanData();
    loadEvaluationsData();
  }, [loadArtisanData, loadEvaluationsData]);

  useEffect(() => {
    checkExistingEvaluation();
  }, [checkExistingEvaluation]);

  // Soumettre l'évaluation
  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour évaluer');
      return;
    }
    
    if (!isParticulier) {
      toast.error('Seuls les particuliers peuvent évaluer');
      return;
    }
    
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
        id_artisan: artisanId,
        note: rating,
        commentaire: commentaire.trim()
      });
      
      if (result.success) {
        toast.success('Évaluation envoyée avec succès !');
        setHasEvaluated(true);
        setExistingEvaluation(result.data);
        // Recharger les évaluations
        await loadEvaluationsData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Artisan non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header du profil */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#2d5a87] p-8 text-white">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border-4 border-white/30">
            {artisan.photo_profil ? (
              <img 
                src={artisan.photo_profil} 
                alt={artisan.nom_complet}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1A3A5C] text-white font-bold text-3xl">
                {artisan.prenom_artisan?.charAt(0) || artisan.nom_artisan?.charAt(0) || 'A'}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{artisan.nom_complet}</h1>
            <p className="text-white/80 text-lg mb-2">{artisan.metier || 'Artisan'}</p>
            <p className="text-white/60 text-sm mb-4">{artisan.ville || 'Ville non précisée'}</p>
            
            {/* Rating moyen */}
            <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 w-fit">
              <StarRating 
                rating={Math.round(averageRating.moyenne)} 
                setRating={() => {}} 
                size={20} 
                interactive={false} 
              />
              <span className="font-semibold text-lg">{averageRating.moyenne.toFixed(1)}</span>
              <span className="text-white/60">({averageRating.total} avis)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Description */}
        {artisan.description && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">À propos</h3>
            <p className="text-gray-600 leading-relaxed">{artisan.description}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire d'évaluation */}
          {isParticulier && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
                {hasEvaluated ? 'Votre évaluation' : 'Évaluer cet artisan'}
              </h3>
              
              {hasEvaluated && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm">
                    Vous avez déjà évalué cet artisan aujourd'hui. Vous pourrez modifier votre évaluation demain.
                  </p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                {/* Rating étoiles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre note <span className="text-red-500">*</span>
                  </label>
                  <StarRating 
                    rating={rating} 
                    setRating={hasEvaluated ? () => {} : setRating} 
                    size={40}
                    interactive={!hasEvaluated}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {rating > 0 ? `${rating}/5 étoiles` : 'Cliquez pour noter'}
                  </p>
                </div>
                
                {/* Commentaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => !hasEvaluated && setCommentaire(e.target.value)}
                    disabled={hasEvaluated}
                    placeholder="Partagez votre expérience avec cet artisan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none resize-none h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={submitting || hasEvaluated || rating === 0}
                  className="w-full py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#e55a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : hasEvaluated ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Déjà évalué
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Envoyer l'évaluation
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Liste des évaluations */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
              Avis des clients
            </h3>
            
            {loadingEvaluations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
              </div>
            ) : evaluations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun avis pour le moment</p>
                <p className="text-sm text-gray-400 mt-1">
                  {isParticulier ? 'Soyez le premier à évaluer !' : 'Les avis apparaîtront ici'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                  {evaluations.map((avis, index) => (
                    <motion.div
                      key={avis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {avis.particulier_nom?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{avis.particulier_nom}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(avis.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <StarRating 
                            rating={avis.note} 
                            setRating={() => {}} 
                            size={16}
                            interactive={false}
                          />
                          {avis.commentaire && (
                            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                              {avis.commentaire}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfileWithEvaluation;
