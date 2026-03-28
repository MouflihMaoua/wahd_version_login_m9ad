import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DangerZoneCard = ({ onDeleteAccount }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDeleteAccount();
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCancel = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Zone de danger
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-700 mb-2">
            La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données, 
            historique de missions, et informations personnelles seront définitivement effacées.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Avant de supprimer :</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Téléchargez vos données importantes</li>
              <li>• Annulez toutes les missions en cours</li>
              <li>• Récupérez vos fonds disponibles</li>
            </ul>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {!confirmDelete ? (
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer mon compte
            </button>
          ) : (
            <>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirmer la suppression
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DangerZoneCard;
