import React from 'react';
import { Shield, Edit2 } from 'lucide-react';

const SecuriteCard = ({ onEditPassword, onEdit2FA }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
        <Shield className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Mot de passe</p>
            <p className="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
          </div>
          <button
            onClick={onEditPassword}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Modifier
          </button>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <div>
            <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
            <p className="text-sm text-gray-500">Non activée</p>
          </div>
          <button
            onClick={onEdit2FA}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Activer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuriteCard;
