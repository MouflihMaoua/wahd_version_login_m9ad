/**
 * Topbar - Barre supérieure du dashboard
 * Recherche, notifications, profil utilisateur
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
    const [notifCount] = useState(3);

    return (
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-[#E2E8F0]">
            <div className="h-20 lg:h-24 flex items-center justify-between gap-4 px-4 lg:px-8 pl-20 lg:pl-8">
                {/* Hamburger mobile */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden shrink-0 w-12 h-12 rounded-2xl bg-[#F4F6FA] flex items-center justify-center text-[#1C2333]"
                >
                    <Menu size={24} />
                </button>

                {/* Barre de recherche */}
                <div className="flex-1 max-w-2xl min-w-0">
                    <div className="relative">
                        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        <input
                            type="text"
                            placeholder="Rechercher un service, un artisan..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[#F4F6FA] border-2 border-transparent focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/20 outline-none transition-all text-[#1C1917] font-medium placeholder:text-[#64748B]"
                        />
                    </div>
                </div>

                {/* Droite : Notifications + Profil */}
                <div className="flex items-center gap-6 shrink-0">
                    <button className="relative w-12 h-12 rounded-2xl bg-[#F4F6FA] flex items-center justify-center text-[#64748B] hover:bg-[#F97316]/10 hover:text-[#F97316] transition-colors">
                        <Bell size={22} />
                        {notifCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notifCount}
                            </span>
                        )}
                    </button>

                    <div className="w-px h-10 bg-[#E2E8F0]" />

                    <Link to="/dashboard/particulier/profil" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-[#1C1917] font-bold text-sm leading-tight">Karim Bennani</p>
                            <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-wider">Client Or</p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                                alt="Avatar"
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
