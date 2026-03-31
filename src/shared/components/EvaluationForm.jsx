import React, { useState } from 'react';
import { Star, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createEvaluation, updateEvaluation } from '../../core/services/evaluationService';
import toast from 'react-hot-toast';

/**
 * EvaluationForm - Modal pour évaluer un artisan
 * @param {Object} props
 * @param {boolean} props.isOpen - Le modal est-il ouvert
 * @param {Function} props.onClose - Fonction pour fermer le modal
 * @param {string} props.artisanId - ID de l'artisan à évaluer
 * @param {string} props.artisanName - Nom de l'artisan
 * @param {Function} props.onSuccess - Callback après succès
 * @param {Object} props.existingEvaluation - Évaluation existante à modifier (optionnel)
 */
const EvaluationForm = ({ isOpen, onClose, artisanId, artisanName, onSuccess, existingEvaluation }) => {
  const [note, setNote] = useState(existingEvaluation?.note || 0);
  const [hoveredNote, setHoveredNote] = useState(0);
  const [commentaire, setCommentaire] = useState(existingEvaluation?.commentaire || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = (selectedNote) => {
    setNote(selectedNote);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (note === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = existingEvaluation
        ? await updateEvaluation(existingEvaluation.id_evaluation, { note, commentaire })
        : await createEvaluation({ id_artisan: artisanId, note, commentaire });

      if (result.success) {
        toast.success(existingEvaluation ? 'Évaluation mise à jour !' : 'Merci pour votre évaluation !');
        onSuccess?.(result.data);
        onClose();
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredNote(star)}
            onMouseLeave={() => setHoveredNote(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
            disabled={loading}
          >
            <Star
              size={40}
              className={`transition-colors duration-200 ${
                star <= (hoveredNote || note)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-100 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getNoteLabel = () => {
    const labels = {
      1: 'Très insatisfait',
      2: 'Insatisfait',
      3: 'Moyen',
      4: 'Satisfait',
      5: 'Très satisfait'
    };
    return note > 0 ? labels[note] : '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {existingEvaluation ? 'Modifier votre avis' : 'Évaluer l\'artisan'}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">{artisanName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div className="text-center space-y-3">
                <p className="text-gray-700 font-medium">Comment évaluez-vous ce service ?</p>
                {renderStars()}
                <p className="text-sm text-gray-500 min-h-[20px]">
                  {getNoteLabel()}
                </p>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || note === 0}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {existingEvaluation ? 'Mettre à jour' : 'Envoyer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EvaluationForm;
