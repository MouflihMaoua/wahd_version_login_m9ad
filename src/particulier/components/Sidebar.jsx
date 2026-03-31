import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  User,
  LogOut,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import logoApp from '../../assets/logo_app.png';

// Navigation items for the particulier dashboard
const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    path: '/dashboard/particulier',
  },
  {
    id: 'recherche',
    label: 'Chercher Artisan',
    icon: Search,
    path: '/recherche-artisan',
  },
  {
    id: 'demandes',
    label: 'Mes demandes',
    icon: FileText,
    path: '/dashboard/particulier/demandes',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    path: '/dashboard/particulier/messages',
  },
  {
    id: 'profil',
    label: 'Mon profil',
    icon: User,
    path: '/dashboard/particulier/profil',
  },
];

const Sidebar = ({ isOpen, onClose, onMenuClick }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path) => {
    if (path === '/dashboard/particulier') {
      return pathname === path || pathname === '/dashboard/particulier/';
    }
    return pathname.startsWith(path);
  };

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Utilisateur';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* ── Mobile overlay ────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile hamburger button (visible when sidebar closed) ── */}
      <button
        onClick={onMenuClick}
        className="fixed top-4 left-4 z-20 lg:hidden w-10 h-10 flex items-center justify-center bg-[#1A3A5C] text-white rounded-xl shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Sidebar panel ─────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-40
          bg-gradient-to-b from-[#1A3A5C] to-[#0f2236]
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:fixed
        `}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={logoApp}
              alt="7rayfi"
              className="w-9 h-9 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-white font-bold text-lg tracking-tight">7rayfi</span>
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── User card ───────────────────────────────────── */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 px-3 py-3 bg-white/8 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{displayName}</p>
              <p className="text-white/50 text-xs">Particulier</p>
            </div>
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────── */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pb-2 pt-1">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150
                  ${active
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <item.icon
                  size={18}
                  className={active ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors'}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer / Logout ──────────────────────────────── */}
        <div className="px-4 pb-6 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150 group"
          >
            <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
