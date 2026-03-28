import React, { useState } from "react";
import { X, Upload, Eye, FileText } from "lucide-react";

const ProfileEditModal = ({ isOpen, onClose, user, onPhotoSave, onCinUpdate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cinFile, setCinFile] = useState(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (evt) => setPhotoPreview(evt.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCinUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCinFile(file);
      console.log("CIN uploadé:", file.name);
    }
  };

  const handleSave = () => {
    if (selectedPhoto && photoPreview) {
      onPhotoSave(selectedPhoto, photoPreview);
    }
    if (cinFile) {
      onCinUpdate(cinFile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-brand-navy">Modifier le profil</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Photo Upload Section */}
          <div>
            <p className="text-sm font-bold text-gray-700 uppercase mb-3">Photo de profil</p>
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
              ) : (
                <>
                  <Upload size={24} className="text-orange-600 mb-2" />
                  <span className="text-xs font-bold text-gray-600">Sélectionner une photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
            </label>
            {selectedPhoto && (
              <p className="text-xs text-gray-500 mt-2">{selectedPhoto.name}</p>
            )}
          </div>

          {/* CIN Section */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-bold text-gray-700 uppercase mb-3">Carte d'Identité</p>
            
            {/* View CIN Button */}
            <button
              onClick={() => alert("Voir CIN : Fonctionnalité pour télécharger le CIN existant")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg font-medium text-sm text-gray-700 transition mb-3"
            >
              <Eye size={16} />
              Voir CIN
            </button>

            {/* Upload CIN */}
            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
              <FileText size={20} className="text-orange-600 mb-2" />
              <span className="text-xs font-bold text-gray-600 text-center">Modifier CIN (PDF)</span>
              <input type="file" accept=".pdf" onChange={handleCinUpload} className="hidden" />
            </label>
            {cinFile && (
              <p className="text-xs text-gray-500 mt-2">📄 {cinFile.name}</p>
            )}
          </div>

        </div>

        {/* Footer / Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition"
          >
            Enregistrer
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileEditModal;
