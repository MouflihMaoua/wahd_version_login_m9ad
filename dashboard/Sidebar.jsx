/**
 * Sidebar - Navigation latérale du dashboard client
 * Fond #1C2333, style actif avec bordure orange
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, MessageSquare, UserCircle, LogOut, Wrench, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const menuItems = [
    { name: "Vue d'ensemble", icon: LayoutDashboard, path: '/dashboard/particulier' },
    { name: 'Mes Missions', icon: CalendarDays, path: '/dashboard/particulier/missions' },
    { name: 'Discussions', icon: MessageSquare, path: '/dashboard/particulier/messages' },
    { name: 'Profil Client', icon: UserCircle, path: '/dashboard/particulier/profil' },
];

const Sidebar = ({ isOpen, onClose, onMenuClick }) => {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    return (
        <>
            {/* Overlay mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 w-72 h-screen bg-[#1C2333] flex flex-col z-50
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
            >
                {/* Fermer (mobile) */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-6 right-6 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
                >
                    <X size={20} />
                </button>

                {/* Logo */}
                <div className="p-8 pb-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/assets/logo_app.png" alt="7rayfi" className="w-12 h-12 rounded-2xl" />
                        <div>
                            <p className="text-white font-bold text-lg leading-tight">7rayfi</p>
                            <p className="text-white/40 text-[10px] font-semibold tracking-[0.3em]">DASHBOARD</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                                    ${isActive
                                        ? 'bg-white/10 text-white border-l-4 border-[#F97316] -ml-[4px] pl-[calc(1rem+4px)]'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                    }
                                `}
                            >
                                <Icon size={22} className="shrink-0" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Déconnexion */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-[#EF4444] hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={22} />
                        <span className="font-medium text-sm">Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
