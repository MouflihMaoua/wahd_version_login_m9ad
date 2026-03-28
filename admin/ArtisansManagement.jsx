import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Ban, Trash2, Eye, UserPlus, Shield, Star, MapPin, CheckCircle, Clock, XCircle, Wrench, FileText, Award } from 'lucide-react';

const ArtisansManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [selectedArtisans, setSelectedArtisans] = useState([]);
  const [showArtisanDetails, setShowArtisanDetails] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  // Données simulées
  const artisans = [
    {
      id: 1,
      name: 'Pierre Lemoine',
      email: 'pierre.lemoine@email.com',
      phone: '+33 6 12 34 56 78',
      specialty: 'Plombier',
      city: 'Paris',
      registrationDate: '2024-01-15',
      status: 'validated',
      avatar: 'PL',
      rating: 4.8,
      reviews: 127,
      completedJobs: 156,
      lastLogin: '2024-03-01 14:30',
      documents: {
        identity: true,
        insurance: true,
        certification: true
      },
      // Informations complètes du formulaire d'inscription
      registrationData: {
        role: 'artisan',
        informations: {
          nom: 'Lemoine',
          prenom: 'Pierre',
          email: 'pierre.lemoine@email.com',
          telephone: '+33 6 12 34 56 78',
          sexe: 'Homme',
          description: 'Plombier expérimenté avec plus de 10 ans d\'expérience dans les installations sanitaires et le dépannage.'
        },
        professionnel: {
          metier: 'Plombier',
          distance: '30km',
          aExperience: true,
          anneesExperience: 12,
          photoProfil: 'pierre_photo.jpg'
        },
        disponibilite: {
          ville: 'Paris',
          codePostal: '75001'
        },
        securite: {
          password: '••••••••',
          confirmPassword: '••••••••'
        }
      }
    },
    {
      id: 2,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 6 23 45 67 89',
      specialty: 'Peintre',
      city: 'Lyon',
      registrationDate: '2024-02-20',
      status: 'pending',
      avatar: 'MD',
      rating: 0,
      reviews: 0,
      completedJobs: 0,
      lastLogin: '2024-02-28 09:15',
      documents: {
        identity: true,
        insurance: false,
        certification: true
      },
      // Informations complètes du formulaire d'inscription
      registrationData: {
        role: 'artisan',
        informations: {
          nom: 'Dubois',
          prenom: 'Marie',
          email: 'marie.dubois@email.com',
          telephone: '+33 6 23 45 67 89',
          sexe: 'Femme',
          description: 'Peintre professionnelle spécialisée dans les finitions intérieures et extérieures, travaux de rénovation.'
        },
        professionnel: {
          metier: 'Peintre',
          distance: '20km',
          aExperience: true,
          anneesExperience: 8,
          photoProfil: 'marie_photo.jpg'
        },
        disponibilite: {
          ville: 'Lyon',
          codePostal: '69000'
        },
        securite: {
          password: '••••••••',
          confirmPassword: '••••••••'
        }
      }
    },
    {
      id: 3,
      name: 'Jean Bernard',
      email: 'jean.bernard@email.com',
      phone: '+33 6 34 56 78 90',
      specialty: 'Électricien',
      city: 'Marseille',
      registrationDate: '2024-03-01',
      status: 'suspended',
      avatar: 'JB',
      rating: 4.2,
      reviews: 89,
      completedJobs: 112,
      lastLogin: '2024-02-25 16:45',
      documents: {
        identity: true,
        insurance: true,
        certification: false
      },
      // Informations complètes du formulaire d'inscription
      registrationData: {
        role: 'artisan',
        informations: {
          nom: 'Bernard',
          prenom: 'Jean',
          email: 'jean.bernard@email.com',
          telephone: '+33 6 34 56 78 90',
          sexe: 'Homme',
          description: 'Électricien certifié, spécialisé en installations domestiques et maintenance préventive.'
        },
        professionnel: {
          metier: 'Électricien',
          distance: '>30km',
          aExperience: true,
          anneesExperience: 15,
          photoProfil: 'jean_photo.jpg'
        },
        disponibilite: {
          ville: 'Marseille',
          codePostal: '13000'
        },
        securite: {
          password: '••••••••',
          confirmPassword: '••••••••'
        }
      }
    }
  ];

  const specialties = ['Plombier', 'Peintre', 'Électricien', 'Femme de ménage', 'Technicien Climatisation'];

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        artisan.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || artisan.status === filterStatus;
    const matchesSpecialty = filterSpecialty === 'all' || artisan.specialty === filterSpecialty;
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'validated': return 'Validé';
      case 'pending': return 'En attente';
      case 'suspended': return 'Suspendu';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'suspended': return <XCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return null;
    }
  };

  // Fonction pour afficher les détails de l'artisan
  const handleShowArtisanDetails = (artisan) => {
    setSelectedArtisan(artisan);
    setShowArtisanDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Gestion des Artisans</h1>
          <p className="text-gray-600 mt-1">Validez et gérez tous les artisans de la plateforme</p>
        </div>
        <button className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
          <UserPlus size={20} />
          Inviter un artisan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Artisans</p>
              <p className="text-2xl font-bold text-brand-dark">456</p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <Wrench className="text-brand-orange" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Validés</p>
              <p className="text-2xl font-bold text-green-600">389</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">34</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspendus</p>
              <p className="text-2xl font-bold text-red-600">23</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Validation Alert */}
      {filterStatus === 'all' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <Clock className="text-yellow-600 mr-3" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {artisans.filter(a => a.status === 'pending').length} artisans en attente de validation
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Veuillez vérifier leurs documents avant de valider leur compte
              </p>
            </div>
            <button 
              onClick={() => setFilterStatus('pending')}
              className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              Voir les validations
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="validated">Validés</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendus</option>
              <option value="rejected">Rejetés</option>
            </select>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="all">Toutes les spécialités</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Artisans Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artisan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArtisans.map((artisan) => (
                <tr key={artisan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center font-medium">
                        {artisan.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{artisan.name}</div>
                        <div className="text-sm text-gray-500">ID: #{artisan.id.toString().padStart(6, '0')}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="mr-1" />
                          {artisan.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{artisan.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{artisan.email}</div>
                    <div className="text-sm text-gray-500">{artisan.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm font-medium text-gray-900">{artisan.rating}</span>
                      <span className="text-xs text-gray-500">({artisan.reviews})</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {artisan.completedJobs} missions
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {artisan.documents.identity && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center" title="Identité vérifiée">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                      )}
                      {artisan.documents.insurance && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center" title="Assurance vérifiée">
                          <Shield size={12} className="text-green-600" />
                        </div>
                      )}
                      {artisan.documents.certification && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center" title="Certification vérifiée">
                          <Award size={12} className="text-green-600" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(artisan.status)}
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(artisan.status)}`}>
                        {getStatusText(artisan.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleShowArtisanDetails(artisan)}
                        className="text-brand-orange hover:text-brand-orange/80"
                        title="Voir les détails de l'inscription"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit size={18} />
                      </button>
                      {artisan.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800">
                            <CheckCircle size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à{' '}
            <span className="font-medium">{filteredArtisans.length}</span> sur{' '}
            <span className="font-medium">{artisans.length}</span> résultats
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
              Précédent
            </button>
            <button className="px-3 py-1 bg-brand-orange text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal des détails de l'artisan */}
      {showArtisanDetails && selectedArtisan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand-dark">Détails de l'inscription - {selectedArtisan.name}</h2>
              <button
                onClick={() => setShowArtisanDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations du rôle */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4 flex items-center">
                  <Wrench className="mr-2 text-brand-orange" />
                  Type de compte: {selectedArtisan.registrationData?.role === 'artisan' ? 'Artisan' : 'Particulier'}
                </h3>
              </div>

              {/* Informations personnelles */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.nom || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prénom</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.prenom || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.telephone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexe</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.sexe || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{selectedArtisan.registrationData?.informations?.description || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Informations professionnelles */}
              {selectedArtisan.registrationData?.professionnel && (
                <div className="bg-brand-orange/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">Informations professionnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Métier</p>
                      <p className="font-medium">{selectedArtisan.registrationData.professionnel.metier || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance de déplacement</p>
                      <p className="font-medium">{selectedArtisan.registrationData.professionnel.distance || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expérience professionnelle</p>
                      <p className="font-medium">{selectedArtisan.registrationData.professionnel.aExperience ? 'Oui' : 'Non'}</p>
                    </div>
                    {selectedArtisan.registrationData.professionnel.aExperience && (
                      <div>
                        <p className="text-sm text-gray-600">Nombre d'années</p>
                        <p className="font-medium">{selectedArtisan.registrationData.professionnel.anneesExperience || '-'} ans</p>
                      </div>
                    )}
                    {selectedArtisan.registrationData.professionnel.photoProfil && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Photo de profil</p>
                        <p className="font-medium">{selectedArtisan.registrationData.professionnel.photoProfil}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Disponibilité */}
              {selectedArtisan.registrationData?.disponibilite && (
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">Disponibilité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ville</p>
                      <p className="font-medium">{selectedArtisan.registrationData.disponibilite.ville || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Code postal</p>
                      <p className="font-medium">{selectedArtisan.registrationData.disponibilite.codePostal || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sécurité */}
              {selectedArtisan.registrationData?.securite && (
                <div className="bg-purple-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">Sécurité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Mot de passe</p>
                      <p className="font-medium">{selectedArtisan.registrationData.securite.password || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confirmation mot de passe</p>
                      <p className="font-medium">{selectedArtisan.registrationData.securite.confirmPassword || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statut actuel */}
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Statut de validation</h3>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedArtisan.status)}
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedArtisan.status)}`}>
                    {getStatusText(selectedArtisan.status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Inscrit le {new Date(selectedArtisan.registrationDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowArtisanDetails(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Fermer
              </button>
              {selectedArtisan.status === 'pending' && (
                <>
                  <button
                    className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                  >
                    Rejeter l'inscription
                  </button>
                  <button
                    className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-bold hover:bg-green-700 transition-all"
                  >
                    Valider l'inscription
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisansManagement;
