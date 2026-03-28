/**
 * ParticulierNavbar — Top navbar for the particulier dashboard
 * Replaces the sidebar entirely. Brand: navy (#1A3A5C) + orange (#FF6B35)
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, FileText, MessageSquare,
  User, LogOut, ChevronDown, Menu, X, FileCheck, Bell
} from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import { supabase } from '../../core/services/supabaseClient';
import toast from 'react-hot-toast';

/* ── Nav links ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: '/dashboard/particulier',          label: 'Accueil',          icon: LayoutDashboard },
  { href: '/recherche-artisan',              label: 'Chercher',         icon: Search },
  { href: '/dashboard/particulier/demandes', label: 'Demandes',         icon: FileText },
  { href: '/dashboard/particulier/devis',    label: 'Devis',            icon: FileCheck },
  { href: '/dashboard/particulier/messages', label: 'Messages',         icon: MessageSquare },
];

const ParticulierNavbar = () => {
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [devisCount,   setDevisCount]   = useState(0);
  const profileRef = useRef(null);

  /* ── Close profile dropdown on outside click ─────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Fetch pending devis count ───────────────────────────────── */
  useEffect(() => {
    const fetchPendingDevis = async () => {
      if (!user) return;
      try {
        const { count } = await supabase
          .from('devis')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'envoyé');
        setDevisCount(count ?? 0);
      } catch { /* silent */ }
    };
    fetchPendingDevis();
  }, [user]);

  /* ── Auth ─────────────────────────────────────────────────────── */
  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    window.location.href = '/';
  };

  /* ── Active link logic ───────────────────────────────────────── */
  const isActive = (href) => {
    if (href === '/dashboard/particulier') {
      return location.pathname === href || location.pathname === href + '/';
    }
    return location.pathname.startsWith(href);
  };

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Utilisateur';
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* ── Desktop Navbar ─────────────────────────────────────── */}
      <nav className="hidden md:flex items-center justify-between px-6 lg:px-8 h-16 bg-[#1A3A5C] shadow-lg sticky top-0 z-40">

        {/* Logo */}
        <Link to="/dashboard/particulier" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/assets/logo_app.png" alt="7rayfi"
            className="w-8 h-8 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-white font-bold text-lg tracking-tight">7rayfi</span>
          <span className="text-[#FF6B35] text-xs font-bold">.pro</span>
        </Link>

        {/* Nav links — center */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            const isDevis = href.endsWith('/devis');
            return (
              <Link
                key={href}
                to={href}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={15} />
                {label}
                {/* Devis pending badge */}
                {isDevis && devisCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {devisCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right — role badge + user dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 bg-[#FF6B35]/20 text-[#FF9A6C] text-xs font-bold rounded-full border border-[#FF6B35]/30">
            Particulier
          </span>

          {/* User dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C] flex items-center justify-center text-white font-bold text-xs shadow">
                {initials}
              </div>
              <ChevronDown
                size={14}
                className={`text-white/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#1A3A5C]/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C] flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A3A5C] truncate">{displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    to="/dashboard/particulier/profil"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF6B35]/5 hover:text-[#FF6B35] transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    Mon Profil
                  </Link>
                  <Link
                    to="/dashboard/particulier/devis"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF6B35]/5 hover:text-[#FF6B35] transition-colors"
                  >
                    <FileCheck size={16} className="text-gray-400" />
                    Mes Devis
                    {devisCount > 0 && (
                      <span className="ml-auto text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                        {devisCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1 pb-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Navbar ──────────────────────────────────────── */}
      <nav className="md:hidden bg-[#1A3A5C] shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/dashboard/particulier" className="flex items-center gap-2">
            <img src="/assets/logo_app.png" alt="7rayfi" className="w-7 h-7 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-white font-bold">7rayfi</span>
            <span className="text-[#FF6B35] text-xs font-bold">.pro</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#FF6B35]/20 text-[#FF9A6C] text-xs font-bold rounded-full">
              Particulier
            </span>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#12293f] px-4 py-3 space-y-1">
            {/* User card */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-white/5 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF9A6C] flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{displayName}</p>
                <p className="text-white/40 text-xs">{user?.email}</p>
              </div>
            </div>

            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              const isDevis = href.endsWith('/devis');
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#FF6B35] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {isDevis && devisCount > 0 && (
                    <span className="ml-auto text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full">
                      {devisCount}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="border-t border-white/10 pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default ParticulierNavbar;
