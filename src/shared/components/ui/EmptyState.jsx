import React from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';

const EmptyState = ({ 
  icon = Search,
  title = "Aucun résultat trouvé",
  description = "Essayez de modifier votre recherche ou vos filtres",
  action = null,
  actionText = "Réessayer"
}) => {
  const IconComponent = icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <IconComponent className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
