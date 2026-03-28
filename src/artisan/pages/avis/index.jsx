// src/pages/artisan/avis/index.jsx
import { useState } from 'react';
import { Star, ThumbsUp, Flag, MessageSquare, Filter, Search } from 'lucide-react';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

export default function AvisPage() {
  const [filter, setFilter] = useState('tous');

  const stats = {
    noteMoyenne: 4.8,
    totalAvis: 24,
    repartition: {
      5: 18,
      4: 4,
      3: 1,
      2: 1,
      1: 0
    }
  };

  const avis = [
    {
      id: 1,
      client: "Sophie Martin",
      avatar: null,
      note: 5,
      commentaire: "Excellent travail, très professionnel. Je recommande vivement !",
      date: "2024-01-10",
      reponse: null,
      service: "Plombier"
    },
    {
      id: 2,
      client: "Thomas Bernard",
      avatar: null,
      note: 4,
      commentaire: "Bon travail, mais un peu de retard sur le rendez-vous.",
      date: "2024-01-08",
      reponse: "Désolé pour le retard, content que le travail vous plaise.",
      service: "Électricien"
    },
    {
      id: 3,
      client: "Julie Dubois",
      avatar: null,
      note: 5,
      commentaire: "Intervention rapide et efficace. Prix correct.",
      date: "2024-01-05",
      reponse: null,
      service: "Technicien en électroménager et climatisation"
    }
  ];

  const renderStars = (note) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < note ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Avis clients</h1>
        <p className="text-gray-600">Consultez et gérez les avis de vos clients</p>
      </div>

      {/* Note globale */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-gray-900">{stats.noteMoyenne}</span>
              <div className="flex">{renderStars(5)}</div>
              <span className="text-sm text-gray-600">sur 5</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Basé sur {stats.totalAvis} avis</p>
          </div>
          
          {/* Répartition */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((note) => (
              <div key={note} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-8">{note} ★</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 rounded-full h-2"
                    style={{ width: `${(stats.repartition[note] / stats.totalAvis) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{stats.repartition[note]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les avis..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>Tous les services</option>
          {SERVICES_ARTISAN.map((service, index) => (
            <option key={index} value={service}>{service}</option>
          ))}
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>Toutes les notes</option>
          <option>5 étoiles</option>
          <option>4 étoiles</option>
          <option>3 étoiles</option>
          <option>2 étoiles</option>
          <option>1 étoile</option>
        </select>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {avis.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{item.client}</h3>
                    <span className="text-sm text-gray-500">{item.service}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">{renderStars(item.note)}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700">{item.commentaire}</p>
                  
                  {/* Réponse */}
                  {item.reponse && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Votre réponse :</span> {item.reponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!item.reponse && (
                  <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    <MessageSquare className="h-4 w-4" />
                    <span>Répondre</span>
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Signaler">
                  <Flag className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}