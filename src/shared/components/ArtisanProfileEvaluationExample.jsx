/**
 * EXEMPLE D'INTÉGRATION - ArtisanProfileWithEvaluation
 * 
 * Ce fichier montre comment intégrer le composant d'évaluation dans votre application
 */

import React, { useState } from 'react';
import ArtisanProfileWithEvaluation from '../shared/components/ArtisanProfileWithEvaluation';
import { useParams } from 'react-router-dom';

// ============================================
// EXEMPLE 1: Page de profil artisan (route)
// ============================================
export const ArtisanProfilePage = () => {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ArtisanProfileWithEvaluation 
          artisanId={id} 
        />
      </div>
    </div>
  );
};

// ============================================
// EXEMPLE 2: Modal d'évaluation (dans une liste)
// ============================================
export const SearchResultsWithEvaluation = () => {
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const artisans = [
    { id: 'uuid-1', nom: 'Artisan 1', metier: 'Plombier' },
    { id: 'uuid-2', nom: 'Artisan 2', metier: 'Électricien' },
  ];

  const handleOpenProfile = (artisan) => {
    setSelectedArtisan(artisan.id);
    setShowModal(true);
  };

  return (
    <div>
      {/* Liste des artisans */}
      <div className="grid gap-4">
        {artisans.map(artisan => (
          <div 
            key={artisan.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenProfile(artisan)}
          >
            <h3>{artisan.nom}</h3>
            <p className="text-gray-600">{artisan.metier}</p>
            <button className="mt-2 text-[#FF6B35] font-medium">
              Voir profil et avis →
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedArtisan && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <ArtisanProfileWithEvaluation 
              artisanId={selectedArtisan}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXEMPLE 3: Intégration dans SearchArtisan.jsx
// ============================================
/*
Dans votre fichier SearchArtisan.jsx, ajoutez :

1. Importez le composant :
   import ArtisanProfileWithEvaluation from '../../shared/components/ArtisanProfileWithEvaluation';

2. Ajoutez les états :
   const [showProfileModal, setShowProfileModal] = useState(false);
   const [selectedArtisanId, setSelectedArtisanId] = useState(null);

3. Dans la carte artisan, ajoutez un bouton :
   <button 
     onClick={() => {
       setSelectedArtisanId(artisan.id_artisan);
       setShowProfileModal(true);
     }}
     className="mt-2 text-[#FF6B35] font-medium hover:underline"
   >
     Voir profil et évaluer
   </button>

4. Ajoutez le modal à la fin du composant :
   {showProfileModal && selectedArtisanId && (
     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
       <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
         <button
           onClick={() => setShowProfileModal(false)}
           className="absolute -top-10 right-0 text-white text-2xl"
         >
           ✕
         </button>
         <ArtisanProfileWithEvaluation 
           artisanId={selectedArtisanId}
           onClose={() => setShowProfileModal(false)}
         />
       </div>
     </div>
   )}
*/

// ============================================
// EXEMPLE 4: Route dans App.jsx ou DashboardClient.jsx
// ============================================
/*
Ajoutez cette route dans votre fichier de routing :

import ArtisanProfileWithEvaluation from './shared/components/ArtisanProfileWithEvaluation';

// Dans vos routes :
<Route 
  path="/artisan/:id/profile" 
  element={
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ArtisanProfileWithEvaluation artisanId={useParams().id} />
      </div>
    </div>
  } 
/>
*/

export default ArtisanProfilePage;
