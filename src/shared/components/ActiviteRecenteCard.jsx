import React from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const ActiviteRecenteCard = ({ user }) => {
  const activities = [
    {
      id: 1,
      type: 'mission_completee',
      title: 'Mission complétée',
      description: 'Installation plomberie - Casablanca',
      date: user?.date_derniere_mission || new Date().toISOString(),
      status: 'success'
    },
    {
      id: 2,
      type: 'nouveau_message',
      title: 'Nouveau message',
      description: 'Message de Sophie Martin',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'info'
    },
    {
      id: 3,
      type: 'avis_recu',
      title: 'Nouvel avis reçu',
      description: '5 étoiles - Installation électrique',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'success'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'mission_completee':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'nouveau_message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'avis_recu':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600 truncate">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiviteRecenteCard;
