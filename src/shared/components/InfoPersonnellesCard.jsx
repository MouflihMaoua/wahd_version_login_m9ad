import React from 'react';
import { User, Edit2 } from 'lucide-react';

const InfoPersonnellesCard = ({ user, userType, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Edit2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <p className="text-gray-900">{user?.prenom} {user?.nom}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <p className="text-gray-900">{user?.telephone}</p>
        </div>
        
        {userType === 'artisan' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <p className="text-gray-900">{user?.metier}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPersonnellesCard;
