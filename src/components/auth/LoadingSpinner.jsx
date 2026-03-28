import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant de chargement global avec animation et branding
 */
const LoadingSpinner = ({ size = 'medium', text = 'Chargement...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-offwhite">
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Spinner principal */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-brand-orange/20 border-t-brand-orange animate-spin rounded-full`}>
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-brand-orange rounded-full"></div>
          </div>
          
          {/* Icône centrale */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-1/2 h-1/2 text-brand-orange" />
          </div>
        </div>

        {/* Texte de chargement */}
        <div className="text-center">
          <p className="text-lg font-semibold text-brand-dark mb-2">{text}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

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

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .delay-75 {
          animation-delay: 75ms;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
