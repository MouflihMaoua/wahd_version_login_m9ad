import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Shield,
  UserCheck,
  FileText,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Star,
  MessageSquare,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { cn } from '../../utils/cn';
import NotificationBell from '../../components/ui/NotificationBell';

// Import des pages admin
import UsersManagement from './UsersManagement';
import ArtisansManagement from './ArtisansManagement';
import MessagesManagement from './MessagesManagement';
import ReportsManagement from './ReportsManagement';
import AnalyticsView from './AnalyticsView';
import SystemLogs from './SystemLogs';
import SettingsManagement from './SettingsManagement';

// Composant AdminHome
const AdminHome = () => {
    const [showArtisanDetails, setShowArtisanDetails] = useState(false);
    const [selectedArtisan, setSelectedArtisan] = useState(null);

    // Données simulées pour les artisans en attente
    const pendingArtisans = [
        {
            id: 1,
            name: 'Artisan #1532',
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
                    password: '•••••••••',
                    confirmPassword: '••••••••'
                }
            },
            registrationTime: '1h'
        },
        {
            id: 2,
            name: 'Artisan #3064',
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
                    password: '•••••••••',
                    confirmPassword: '••••••••'
                }
            },
            registrationTime: '2h'
        },
        {
            id: 3,
            name: 'Artisan #4596',
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
                    password: '•••••••••',
                    confirmPassword: '••••••••'
                }
            },
            registrationTime: '3h'
        }
    ];

    // Fonction pour afficher les détails de l'artisan
    const handleShowArtisanDetails = (artisan) => {
        setSelectedArtisan(artisan);
        setShowArtisanDetails(true);
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'validated': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="space-y-10 fade-up">
                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Utilisateurs', value: '1.2k', icon: Users, color: 'text-blue-500 bg-blue-50' },
                        { label: 'Artisans', value: '450', icon: Shield, color: 'text-orange-500 bg-orange-50' },
                        { label: 'Réservations', value: '8.4k', icon: Calendar, color: 'text-green-500 bg-green-50' },
                        { label: 'Alertes', value: '12', icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-brand-dark">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Moderation Queue */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-brand-dark">Artisans en attente de validation</h2>
                        <button className="text-sm font-bold text-brand-orange hover:underline">Tout voir</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingArtisans.map((artisan, i) => (
                            <div key={artisan.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-400">ID</div>
                                    <div>
                                        <h4 className="font-bold text-brand-dark text-lg">{artisan.name}</h4>
                                        <p className="text-sm text-gray-500">Inscrit il y a {artisan.registrationTime} • Dossier complet</p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleShowArtisanDetails(artisan)}
                                        className="px-6 py-2.5 bg-brand-orange text-white rounded-xl font-bold text-xs hover:bg-brand-orange/90 transition-all"
                                        title="Voir les détails de l'inscription"
                                    >
                                        Voir les détails
                                    </button>
                                    <button className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs hover:bg-green-600 transition-all">Valider</button>
                                    <button className="px-6 py-2.5 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-500 transition-all">Refuser</button>
                                </div>
                            </div>
                        ))}
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
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowArtisanDetails(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Fermer
                            </button>
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/admin' },
        { label: 'Utilisateurs', icon: Users, path: '/dashboard/admin/users' },
        { label: 'Artisans', icon: Shield, path: '/dashboard/admin/artisans' },
        { label: 'Messages', icon: MessageSquare, path: '/dashboard/admin/messages' },
        { label: 'Rapports', icon: FileText, path: '/dashboard/admin/reports' },
        { label: 'Analytics', icon: TrendingUp, path: '/dashboard/admin/analytics' },
        { label: 'Logs Système', icon: AlertTriangle, path: '/dashboard/admin/logs' },
        { label: 'Paramètres', icon: Settings, path: '/dashboard/admin/settings' },
    ];

    const isActive = (path) => {
        return location.pathname === path || 
               (path === '/dashboard/admin' && location.pathname === '/dashboard/admin/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out w-64`}>
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <Link to="/dashboard/admin" className="text-2xl font-bold text-brand-orange">AdminPro</Link>
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 lg:hidden">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                isActive(item.path)
                                    ? 'bg-brand-orange text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex items-center justify-between h-16 bg-white border-b px-4">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 mx-4">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Bell className="h-6 w-6 text-gray-500" />
                        <div className="relative">
                            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <Link to="/dashboard/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon Profil</Link>
                                    <Link to="/dashboard/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</Link>
                                    <hr className="my-1" />
                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Déconnexion</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 max-w-7xl mx-auto">
                        <Routes>
                            <Route index element={<AdminHome />} />
                            <Route path="users" element={<UsersManagement />} />
                            <Route path="artisans" element={<ArtisansManagement />} />
                            <Route path="messages" element={<MessagesManagement />} />
                            <Route path="reports" element={<ReportsManagement />} />
                            <Route path="analytics" element={<AnalyticsView />} />
                            <Route path="logs" element={<SystemLogs />} />
                            <Route path="settings" element={<SettingsManagement />} />
                            <Route path="*" element={<Navigate to="" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
