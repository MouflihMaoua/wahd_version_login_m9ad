import React from 'react';
import { ArrowRight, Wrench } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur votre espace client
          </h1>
          <p className="text-blue-100 mb-6">
            Trouvez les meilleurs artisans pour tous vos projets
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
            Rechercher un artisan
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
        <div className="hidden lg:block">
          <Wrench className="h-32 w-32 text-blue-300" />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
