import React from 'react';
import { MapPin, Edit2 } from 'lucide-react';

const AdresseCard = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Adresse</h3>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Edit2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
          <p className="text-gray-900">{user?.adresse || 'Non renseignée'}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <p className="text-gray-900">{user?.ville || 'Non renseignée'}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
          <p className="text-gray-900">{user?.code_postal || 'Non renseigné'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdresseCard;
