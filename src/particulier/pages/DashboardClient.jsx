/**
 * Dashboard Client Particulier - 7rayfi
 * Page principale du dashboard pour un client particulier
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, AlertCircle, MapPin, CheckCircle } from 'lucide-react';
import Sidebar from '../components/ClientLayout';
import HeroBanner from '../components/HeroBanner';
import StatCard from '../components/StatCard';
import DemandesView from './DemandesView.jsx';
import MessagesView from './MessagesView_Modern.jsx';
import ProfilView from './ProfilView_Modern.jsx';

const ClientDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();

    const renderContent = () => {
        if (pathname.endsWith('/demandes')) return <DemandesView />;
        if (pathname.endsWith('/messages')) return <MessagesView />;
        if (pathname.endsWith('/profil')) return <ProfilView />;
        if (pathname === '/dashboard/particulier' || pathname === '/dashboard/particulier/' || pathname.endsWith('/particulier')) {
            return <DashboardOverview />;
        }
        return <Navigate to="/dashboard/particulier" replace />;
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA] flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onMenuClick={() => setSidebarOpen(true)}
            />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

/**
 * Vue d'ensemble du dashboard (accueil)
 */
const DashboardOverview = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
    >
        {/* Hero Banner */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <HeroBanner />
        </motion.div>

        {/* Statistiques */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600 text-sm">Demandes terminées</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-yellow-600 text-sm font-medium">En cours</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2</h3>
                <p className="text-gray-600 text-sm">Demandes actives</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-purple-600 text-sm font-medium">Nouveau</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1</h3>
                <p className="text-gray-600 text-sm">En attente</p>
            </div>
        </motion.div>     

        {/* Aperçu des demandes récentes */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header avec style HeroBanner */}
                <div className="bg-gradient-to-r from-[#1E2D40] to-[#2A3F5F] px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Mes demandes</h2>
                            <p className="text-white/70">Suivez l'état de vos demandes de service</p>
                        </div>
                        <Link 
                            to="/dashboard/particulier/demandes"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-colors"
                        >
                            Voir tout
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Liste des demandes */}
                <div className="divide-y divide-gray-100">
                    {/* Demande 1 - Accepté */}
                    <div className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">Plombier</h3>
                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            Accepté
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Ahmed Mansouri</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Casablanca
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            12 Mars 2024
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Demande 2 - En attente */}
                    <div className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">Électricien</h3>
                                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                            En attente
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Youssef Alami</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Rabat
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            10 Mars 2024
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Demande 3 - Nouveau */}
                    <div className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">Peintre</h3>
                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                            Nouveau
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Karim El Ouardi</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Marrakech
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            8 Mars 2024
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">
                                <span className="font-bold text-lg text-gray-900">3 demandes</span> au total
                            </p>
                            <p className="text-sm text-gray-500 mt-1">2 en cours, 1 en attente</p>
                        </div>
                        <Link 
                            to="/dashboard/particulier/demandes"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#F97316] text-[#F97316] font-semibold hover:bg-[#F97316] hover:text-white transition-colors"
                        >
                            Gérer mes demandes
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

export default ClientDashboard;
