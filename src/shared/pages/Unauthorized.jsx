import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldX, 
  ArrowLeft, 
  Home,
  LogIn
} from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icone d'erreur */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX size={40} className="text-red-500" />
          </div>
        </div>

        {/* Message d'erreur */}
        <h1 className="text-3xl font-bold text-brand-dark mb-4">
          Accès non autorisé
        </h1>
        
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          
          <Link
            to="/connexion"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-brand-dark transition-all"
          >
            <LogIn size={18} />
            Se connecter
          </Link>
        </div>

        {/* Aide */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Besoin d'aide ?</strong>
          </p>
          <p className="text-sm text-gray-600">
            Assurez-vous d'être connecté avec le bon compte. Si vous pensez qu'il s'agit d'une erreur, 
            veuillez contacter notre support.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-brand-orange hover:text-brand-dark font-medium mt-3"
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
