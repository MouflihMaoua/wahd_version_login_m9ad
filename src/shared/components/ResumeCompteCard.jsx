import React from 'react';
import { Calendar, Award, Users } from 'lucide-react';

const ResumeCompteCard = ({ user, userType }) => {
  const stats = userType === 'artisan' 
    ? {
        missions: user?.missions_completees || 0,
        note: user?.note_moyenne || 0,
        experience: user?.annee_experience || 0
      }
    : {
        favoris: user?.artisans_favoris || 0,
        missions: user?.missions_postees || 0,
        avis: user?.avis_donnés || 0
      };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé du compte</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userType === 'artisan' ? (
          <>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2 inline-block">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.missions}</p>
              <p className="text-sm text-gray-600">Missions complétées</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2 inline-block">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.note}</p>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-2 inline-block">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.experience}</p>
              <p className="text-sm text-gray-600">Années d'expérience</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-lg mb-2 inline-block">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.favoris}</p>
              <p className="text-sm text-gray-600">Artisans favoris</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2 inline-block">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.missions}</p>
              <p className="text-sm text-gray-600">Missions postées</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2 inline-block">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avis}</p>
              <p className="text-sm text-gray-600">Avis donnés</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeCompteCard;
