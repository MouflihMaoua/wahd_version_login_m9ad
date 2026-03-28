/**
 * DashboardClient - Particulier Dashboard
 * No sidebar — all navigation lives in ParticulierNavbar (via ParticulierLayout)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, AlertCircle, MapPin, CheckCircle } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import DemandesView from './DemandesView.jsx';
import MessagesView from './MessagesView_Modern.jsx';
import ProfilView from './ProfilView_Modern.jsx';
import DevisView from './DevisView.jsx';

const ClientDashboard = () => {
    const { pathname } = useLocation();

    const renderContent = () => {
        if (pathname.endsWith('/demandes'))  return <DemandesView />;
        if (pathname.endsWith('/messages'))  return <MessagesView />;
        if (pathname.endsWith('/profil'))    return <ProfilView />;
        if (pathname.endsWith('/devis'))     return <DevisView />;
        if (
            pathname === '/dashboard/particulier' ||
            pathname === '/dashboard/particulier/' ||
            pathname.endsWith('/particulier')
        ) {
            return <DashboardOverview />;
        }
        return <Navigate to="/dashboard/particulier" replace />;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

/* ── Dashboard Overview (accueil) ─────────────────────────────── */
const DashboardOverview = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
    >
        {/* Hero Banner */}
        <HeroBanner />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
                icon={<CheckCircle className="h-5 w-5 text-[#FF6B35]" />}
                label="Demandes terminées"
                value="8"
                badge="+12%"
                badgeColor="text-emerald-600"
                bg="bg-[#FF6B35]/10"
            />
            <StatCard
                icon={<Clock className="h-5 w-5 text-[#1A3A5C]" />}
                label="Demandes actives"
                value="2"
                badge="En cours"
                badgeColor="text-amber-600"
                bg="bg-[#1A3A5C]/10"
            />
            <StatCard
                icon={<AlertCircle className="h-5 w-5 text-purple-500" />}
                label="En attente"
                value="1"
                badge="Nouveau"
                badgeColor="text-purple-600"
                bg="bg-purple-100"
            />
        </div>

        {/* Recent requests preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A3A5C] to-[#12293f] px-6 py-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Mes demandes récentes</h2>
                    <p className="text-white/60 text-sm mt-0.5">Suivez l'état de vos demandes</p>
                </div>
                <Link
                    to="/dashboard/particulier/demandes"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#e55a25] transition-colors"
                >
                    Voir tout
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="divide-y divide-gray-50">
                <RequestRow icon={<CheckCircle className="h-5 w-5 text-emerald-500" />} bg="bg-emerald-50"
                    service="Plombier" artisan="Ahmed Mansouri" ville="Casablanca"
                    date="12 Mars 2024" badge="Accepté" badgeColor="bg-emerald-100 text-emerald-700" />
                <RequestRow icon={<Clock className="h-5 w-5 text-amber-500" />} bg="bg-amber-50"
                    service="Électricien" artisan="Youssef Alami" ville="Rabat"
                    date="10 Mars 2024" badge="En attente" badgeColor="bg-amber-100 text-amber-700" />
                <RequestRow icon={<AlertCircle className="h-5 w-5 text-gray-400" />} bg="bg-gray-50"
                    service="Peintre" artisan="Karim El Ouardi" ville="Marrakech"
                    date="8 Mars 2024" badge="Nouveau" badgeColor="bg-gray-100 text-gray-600" />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    <span className="font-bold text-gray-800">3 demandes</span> au total · 2 en cours
                </p>
                <Link
                    to="/dashboard/particulier/demandes"
                    className="inline-flex items-center gap-1.5 text-sm text-[#FF6B35] font-semibold hover:underline"
                >
                    Gérer mes demandes
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    </motion.div>
);

const StatCard = ({ icon, label, value, badge, badgeColor, bg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                {icon}
            </div>
            <span className={`text-xs font-semibold ${badgeColor}`}>{badge}</span>
        </div>
        <p className="text-2xl font-bold text-[#1A3A5C]">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
);

const RequestRow = ({ icon, bg, service, artisan, ville, date, badge, badgeColor }) => (
    <div className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1A3A5C] text-sm">{service}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 ${badgeColor} text-xs font-medium rounded-full`}>
                        {badge}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{artisan} · <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{ville}</span> · <span className="inline-flex items-center gap-0.5"><Calendar className="h-3 w-3" />{date}</span></p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
        </div>
    </div>
);

export default ClientDashboard;
