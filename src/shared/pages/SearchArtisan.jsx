// src/pages/public/SearchArtisan.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Star, Phone, MessageSquare, ChevronRight, X, Clock, CheckCircle, Award, TrendingUp, Send } from 'lucide-react';
import { SERVICES_ARTISAN } from '../../core/constants/services';

const artisansData = [
  {
    id: 1,
    name: 'Ahmed Mansouri',
    metier: 'Plombier',
    ville: 'Casablanca',
    rating: 4.8,
    nbAvis: 156,
    tarifHoraire: 150,
    experience: 10,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=400',
    verified: true,
    specialites: ['Dépannage', 'Installation', 'Chauffage'],
  },
  {
    id: 2,
    name: 'Youssef Alami',
    metier: 'Électricien',
    ville: 'Rabat',
    rating: 4.9,
    nbAvis: 89,
    tarifHoraire: 200,
    experience: 8,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400',
    verified: true,
    specialites: ['Câblage', 'Tableau électrique', 'Éclairage'],
  },
  {
    id: 3,
    name: 'Amine Bennani',
    metier: 'Peintre',
    ville: 'Casablanca',
    rating: 4.7,
    nbAvis: 67,
    tarifHoraire: 250,
    experience: 12,
    disponibilite: 'Occupé',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
    verified: false,
    specialites: ['Peinture intérieure', 'Finition', 'Décoration'],
  },
  {
    id: 4,
    name: 'Sarah Tahiri',
    metier: 'Peintre',
    ville: 'Marrakech',
    rating: 4.6,
    nbAvis: 45,
    tarifHoraire: 100,
    experience: 6,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=400',
    verified: true,
    specialites: ['Peinture intérieure', 'Finition', 'Décoration'],
  },
  {
    id: 5,
    name: 'Omar Idrissi',
    metier: 'Technicien en électroménager et climatisation',
    ville: 'Tanger',
    rating: 4.5,
    nbAvis: 34,
    tarifHoraire: 180,
    experience: 15,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
    verified: false,
    specialites: ['Installation', 'Maintenance', 'Dépannage'],
  },
  {
    id: 6,
    name: 'Hassan Zemmouri',
    metier: 'Plombier',
    ville: 'Fès',
    rating: 4.8,
    nbAvis: 112,
    tarifHoraire: 180,
    experience: 9,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1595841055318-62400b65f242?w=400',
    verified: true,
    specialites: ['Plomberie générale', 'Chauffage', 'Dépannage'],
  },
  {
    id: 7,
    name: 'Fatima Zahra',
    metier: 'Femme de ménage',
    ville: 'Casablanca',
    rating: 4.9,
    nbAvis: 234,
    tarifHoraire: 80,
    experience: 5,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1580489938304-3c4a6b8c3b3?w=400',
    verified: true,
    specialites: ['Ménage complet', 'Repassage', 'Cuisine'],
  },
  {
    id: 8,
    name: 'Karim El Ouardi',
    metier: 'Technicien Climatisation',
    ville: 'Marrakech',
    rating: 4.7,
    nbAvis: 78,
    tarifHoraire: 220,
    experience: 7,
    disponibilite: 'Disponible',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    verified: true,
    specialites: ['Climatisation', 'Chauffage', 'Ventilation'],
  }
];

const metiers = ['Tous', ...SERVICES_ARTISAN];
const villes = ['Toutes', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'];
const triOptions = ['Pertinence', 'Mieux notés', 'Prix croissant', 'Prix décroissant', 'Plus d\'expérience'];

const SearchArtisan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetier, setSelectedMetier] = useState('Tous');
  const [selectedVille, setSelectedVille] = useState('Toutes');
  const [tri, setTri] = useState('Pertinence');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredArtisans, setFilteredArtisans] = useState(artisansData);
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    let filtered = artisansData.filter(artisan => {
      const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artisan.metier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMetier = selectedMetier === 'Tous' || artisan.metier === selectedMetier;
      const matchesVille = selectedVille === 'Toutes' || artisan.ville === selectedVille;
      
      return matchesSearch && matchesMetier && matchesVille;
    });

    // Tri
    switch (tri) {
      case 'Mieux notés':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Prix croissant':
        filtered.sort((a, b) => a.tarifHoraire - b.tarifHoraire);
        break;
      case 'Prix décroissant':
        filtered.sort((a, b) => b.tarifHoraire - a.tarifHoraire);
        break;
      case 'Plus d\'expérience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      default:
        // Pertinence - tri par défaut
        break;
    }

    setFilteredArtisans(filtered);
  }, [searchTerm, selectedMetier, selectedVille, tri]);

  const handleOpenDemandeModal = (artisan) => {
    setSelectedArtisan(artisan);
    setShowDemandeModal(true);
  };

  const handleCloseDemandeModal = () => {
    setShowDemandeModal(false);
    setSelectedArtisan(null);
  };

  const handleEnvoyerDemande = (e) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(e.target);
    const description = formData.get('description');
    const ville = formData.get('ville');
    const codePostal = formData.get('codePostal');
    const urgence = formData.get('urgence');

    // Créer une nouvelle demande
    const nouvelleDemande = {
      id: Date.now(),
      client: "Client Actuel",
      service: selectedArtisan.metier,
      description: description,
      adresse: `${ville} - ${codePostal}`,
      telephone: "À définir",
      email: "À définir",
      date: new Date().toISOString().split('T')[0],
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      urgence: urgence,
      statut: "nouveau",
      prix: "À estimer",
      note: 0,
      photos: 0,
      artisanId: selectedArtisan.id,
      artisanName: selectedArtisan.name,
      artisanMetier: selectedArtisan.metier,
      artisanVille: selectedArtisan.ville,
      artisanImage: selectedArtisan.image
    };

    // Sauvegarder la demande dans localStorage
    const demandesExistantes = JSON.parse(localStorage.getItem('demandesArtisans') || '[]');
    demandesExistantes.push(nouvelleDemande);
    localStorage.setItem('demandesArtisans', JSON.stringify(demandesExistantes));

    alert(`✅ Demande envoyée avec succès à ${selectedArtisan.name} !\n\nVotre demande a été sauvegardée et sera visible dans votre dashboard.`);
    handleCloseDemandeModal();
  };

  const ArtisanCard = ({ artisan }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Header avec image et statut */}
      <div className="relative">
        <img 
          src={artisan.image} 
          alt={artisan.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            artisan.disponibilite === 'Disponible' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {artisan.disponibilite}
          </span>
        </div>
        {artisan.verified && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Nom et métier */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{artisan.name}</h3>
            <p className="text-sm text-gray-600">{artisan.metier}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{artisan.tarifHoraire} DH</p>
            <p className="text-xs text-gray-500">/heure</p>
          </div>
        </div>

        {/* Localisation et expérience */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-blue-500" />
            <span>{artisan.ville}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-blue-500" />
            <span>{artisan.experience} ans d'expérience</span>
          </div>
        </div>

        {/* Rating et missions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 ml-1">{artisan.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({artisan.nbAvis} avis)</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Award size={16} className="text-blue-500" />
            <span>{artisan.missionsCompletees} missions</span>
          </div>
        </div>

        {/* Spécialités */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Spécialités:</p>
          <div className="flex flex-wrap gap-2">
            {artisan.specialites.slice(0, 3).map((spec, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenDemandeModal(artisan)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <Send size={16} />
            <span>Envoyer demande</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Trouvez l'artisan <span className="text-blue-600">parfait</span> pour votre projet
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez notre réseau de professionnels vérifiés et qualifiés dans toute la région
            </p>
          </div>

          {/* Barre de recherche principale */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou métier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Filter size={20} />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Filtre métier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Métier</label>
                  <select
                    value={selectedMetier}
                    onChange={(e) => setSelectedMetier(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {metiers.map(metier => (
                      <option key={metier} value={metier}>{metier}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <select
                    value={selectedVille}
                    onChange={(e) => setSelectedVille(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {villes.map(ville => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                  <select
                    value={tri}
                    onChange={(e) => setTri(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {triOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMetier('Tous');
                    setSelectedVille('Toutes');
                    setTri('Pertinence');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête des résultats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredArtisans.length} artisans trouvés
            </h2>
            <p className="text-gray-600">
              {searchTerm && `pour "${searchTerm}"`}
              {selectedMetier !== 'Tous' && ` • ${selectedMetier}`}
              {selectedVille !== 'Toutes' && ` • ${selectedVille}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp size={16} />
            <span>Tri: {tri}</span>
          </div>
        </div>

        {/* Grid des artisans */}
        {filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun artisan trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Essayez de modifier vos critères de recherche ou de filtres pour trouver des artisans disponibles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMetier('Tous');
                setSelectedVille('Toutes');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>

      {/* Modal de demande */}
      <AnimatePresence>
        {showDemandeModal && selectedArtisan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDemandeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Envoyer une demande</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Artisan sélectionné : <span className="font-medium text-blue-600">{selectedArtisan.name}</span> - {selectedArtisan.metier}
                  </p>
                </div>
                <button
                  onClick={handleCloseDemandeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Formulaire de demande */}
              <form onSubmit={handleEnvoyerDemande} className="space-y-6">
                {/* Description du problème */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description du problème</h3>
                  <textarea
                    name="description"
                    placeholder="Décrivez précisément le problème à résoudre..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Localisation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="ville"
                      placeholder="Ex: Casablanca"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="codePostal"
                      placeholder="Ex: 20000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                {/* Urgence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'urgence
                  </label>
                  <select 
                    name="urgence"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseDemandeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send size={16} />
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchArtisan;
