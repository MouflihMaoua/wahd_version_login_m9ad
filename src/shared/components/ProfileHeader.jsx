import React from 'react';
import { MapPin, Phone, Mail, Star, Briefcase } from 'lucide-react';

const ProfileHeader = ({ user, userType }) => {
  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Photo de profil */}
        <div className="flex-shrink-0">
          {user.photo_profil ? (
            <img
              src={user.photo_profil}
              alt={`${user.prenom} ${user.nom}`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user.prenom?.[0]}{user.nom?.[0]}
              </span>
            </div>
          )}
        </div>

        {/* Informations principales */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {user.prenom} {user.nom}
          </h1>
          
          {userType === 'artisan' && user.metier && (
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <Briefcase className="w-4 h-4" />
              <span className="text-blue-100">{user.metier}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {user.email && (
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-blue-100">{user.email}</span>
              </div>
            )}
            
            {user.telephone && (
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-blue-100">{user.telephone}</span>
              </div>
            )}
            
            {user.ville && (
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-blue-100">{user.ville}</span>
              </div>
            )}
          </div>

          {/* Rating pour artisans */}
          {userType === 'artisan' && user.note_moyenne && (
            <div className="flex items-center justify-center md:justify-start space-x-2 mt-3">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <span className="font-semibold">{user.note_moyenne}</span>
              {user.missions_completees && (
                <span className="text-blue-100 text-sm">
                  ({user.missions_completees} missions)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
