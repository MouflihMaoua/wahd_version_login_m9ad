import { Suspense } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Inbox,
  FileSpreadsheet,
  Star,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Hammer,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../core/services/supabaseClient';
import { useAuthStore } from '../../core/store/useAuthStore';
import { cn } from '../utils/cn';

const NAV = [
  { to: '/admin', end: true, label: 'Vue d’ensemble', icon: LayoutDashboard },
  { to: '/admin/artisans', label: 'Artisans', icon: Hammer },
  { to: '/admin/particuliers', label: 'Particuliers', icon: UserCircle },
  { to: '/admin/demandes', label: 'Demandes', icon: Inbox },
  { to: '/admin/devis', label: 'Devis', icon: FileSpreadsheet },
  { to: '/admin/avis', label: 'Avis', icon: Star },
  { to: '/admin/moderation', label: 'Modération', icon: ShieldAlert },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    window.location.href = '/connexion';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A3A5C]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-100 px-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1A3A5C] text-white shadow-md shadow-[#1A3A5C]/25">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1A3A5C] truncate">7rayfi</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">
                Administration
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#1A3A5C] text-white shadow-md shadow-[#1A3A5C]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#1A3A5C]'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 mb-2">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md">
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Console</p>
            <h1 className="text-lg font-bold text-[#1A3A5C] truncate">
              {location.pathname === '/admin'
                ? NAV.find((n) => n.end)?.label ?? 'Vue d’ensemble'
                : NAV.filter((n) => !n.end).find((n) => location.pathname.startsWith(n.to))?.label ??
                  'Admin'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-800">Live Supabase</span>
          </div>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto"
        >
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 border-2 border-[#1A3A5C]/20 border-t-[#1A3A5C] rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </motion.main>
      </div>
    </div>
  );
}
