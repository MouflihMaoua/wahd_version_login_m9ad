import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";

const ProfileHeader = ({ user, onEditClick, onPhotoClick }) => {
  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Background gradient */}
      <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600" />
      
      <div className="px-8 pb-8">
        {/* Avatar section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-8">
          <div
            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-white cursor-pointer hover:scale-105 transition-transform"
            onClick={onPhotoClick}
          >
            <span className="text-4xl font-black text-white">{initials}</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-black text-brand-navy mb-1">
              {user.prenom} {user.nom}
            </h1>
            <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-4">
              Client Premium
            </p>
            <button
              onClick={onEditClick}
              className="px-6 py-2.5 bg-brand-navy text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors"
            >
              Modifier le profil
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Mail size={18} className="text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
              <p className="text-sm font-bold text-gray-900">{user.email || "non spécifié"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Phone size={18} className="text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Téléphone</p>
              <p className="text-sm font-bold text-gray-900">{user.telephone || "non spécifié"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <MapPin size={18} className="text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Localisation</p>
              <p className="text-sm font-bold text-gray-900">{user.ville || "non spécifiée"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
