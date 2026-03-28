import React from 'react';
import { TrendingUp, Users, Calendar, Star } from 'lucide-react';

const ProfileStats = ({ user, userType }) => {
  if (!user) return null;

  const stats = userType === 'artisan' 
    ? [
        {
          label: 'Missions complétées',
          value: user.missions_completees || 0,
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          label: 'Note moyenne',
          value: user.note_moyenne ? `${user.note_moyenne}/5` : 'N/A',
          icon: <Star className="w-5 h-5" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        },
        {
          label: 'Années d\'expérience',
          value: user.annee_experience || 0,
          icon: <Calendar className="w-5 h-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        }
      ]
    : [
        {
          label: 'Artisans favoris',
          value: user.artisans_favoris || 0,
          icon: <Users className="w-5 h-5" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        },
        {
          label: 'Missions postées',
          value: user.missions_postees || 0,
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          label: 'Avis donnés',
          value: user.avis_donnés || 0,
          icon: <Star className="w-5 h-5" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        }
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
