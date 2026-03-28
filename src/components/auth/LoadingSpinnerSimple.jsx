import React from 'react';

/**
 * Composant de chargement simplifié pour éviter les erreurs d'import
 */
const LoadingSpinner = ({ text = 'Chargement...' }) => {
  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Spinner simple */}
        <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange animate-spin rounded-full"></div>
        
        {/* Texte */}
        <p className="text-lg font-semibold text-brand-dark">{text}</p>
        
        {/* Brand */}
        <div className="mt-8 text-center">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">7R</span>
            </div>
            <span className="text-xl font-bold text-brand-dark">rayfi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
