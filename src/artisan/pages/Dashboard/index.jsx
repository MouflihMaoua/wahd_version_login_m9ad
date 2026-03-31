import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mail, 
  Calendar, 
  FileText, 
  Wrench, 
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Star,
  Loader2
} from 'lucide-react';
import { useAuthStore } from "../../../core/store/useAuthStore";
import { supabase } from "../../../core/services/supabaseClient";
import { profileService } from "../../../core/services/profileService";
import toast from 'react-hot-toast';
import ArtisanHome from './ArtisanHome';
import AvisPage from '../avis';
import ProfilPage from '../profil';
import MessagesPage from '../messages';
import CalendrierPage from '../calendrier';
import DemandesPage from '../demandes';
import DevisPage from '../devis';
import RevenusPage from '../revenus';
import ReputationArtisanPrivate from "../../components/ReputationArtisanPrivate";
import ProfilPersonnel from "../../components/ProfilPersonnel";
import logoApp from '../../../assets/logo_app.png';


const ArtisanDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Fetch artisan profile and notifications on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Fetch profile
        const profileData = await profileService.getUserProfile(session.user.id);
        if (profileData?.type === 'artisan') {
          setProfile(profileData.data);
        }

        // Fetch notification count (gracefully handle missing table)
        try {
          const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .eq('read', false);
          setNotificationCount(count || 0);
        } catch (notifErr) {
          console.log('Notifications table not available:', notifErr.message);
          setNotificationCount(0);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const menuItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/artisan' },
    { label: 'Messages', icon: Mail, path: '/dashboard/artisan/messages' },
    { label: 'Calendrier', icon: Calendar, path: '/dashboard/artisan/calendrier' },
    { label: 'Demandes', icon: FileText, path: '/dashboard/artisan/demandes' },
    { label: 'Devis', icon: FileText, path: '/dashboard/artisan/devis' },
    { label: 'Réputation', icon: Star, path: '/dashboard/artisan/reputation' },
    { label: 'Profil Personnel', icon: User, path: '/dashboard/artisan/profil' },
    { label: 'Revenus', icon: TrendingUp, path: '/dashboard/artisan/revenus' },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/dashboard/artisan' && location.pathname === '/dashboard/artisan/');
  };

  const getTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem ? currentItem.label : 'Tableau de bord';
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const getDisplayName = () => {
    if (profile?.prenom && profile?.nom) {
      return `${profile.prenom} ${profile.nom}`;
    }
    return user?.email?.split('@')[0] || 'Artisan';
  };

  const getAvatarUrl = () => {
    return profile?.photo_profil || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'artisan'}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#1A3A5C] to-[#0f2236] text-white transition-all duration-300 flex flex-col shadow-lg fixed h-screen left-0 top-0 z-40`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/dashboard/artisan" className={`flex items-center gap-3 transition-opacity ${!sidebarOpen && 'w-0 h-0 overflow-hidden'}`}>
            <img src={logoApp} alt="7rayfi" className="w-8 h-8 object-contain rounded-lg" />
            <div>
              <h1 className="font-bold text-lg leading-tight">7rayfi</h1>
              <p className="text-[10px] text-orange-400 font-semibold">Espace Artisan</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} className={`flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className={`${!sidebarOpen && 'hidden'} whitespace-nowrap font-medium`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User mini profile */}
        <div className="p-4 border-t border-white/10">
          <Link 
            to="/dashboard/artisan/profil"
            className={`flex items-center gap-3 mb-3 hover:bg-white/10 rounded-lg p-2 transition ${!sidebarOpen && 'hidden'}`}
          >
            <img 
              src={getAvatarUrl()} 
              alt={getDisplayName()}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getDisplayName()}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.metier || 'Artisan'}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl transition"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`${!sidebarOpen && 'hidden'} whitespace-nowrap`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar - Simplified */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              onClick={() => toast.info('Notifications: ' + notificationCount + ' non lues')}
            >
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2 relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <img
                  src={getAvatarUrl()}
                  alt={getDisplayName()}
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-left hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 block">{getDisplayName()}</span>
                  <span className="text-xs text-gray-500">{profile?.metier || 'Artisan'}</span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 min-w-max py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/dashboard/artisan/profil" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Mon profil</Link>
                  <Link to="/dashboard/artisan/settings" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Paramètres</Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route index element={<ArtisanHome />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="calendrier" element={<CalendrierPage />} />
              <Route path="demandes" element={<DemandesPage />} />
              <Route path="devis" element={<DevisPage />} />
              <Route path="reputation" element={<ReputationArtisanPrivate />} />
              <Route path="profil-personnel" element={<ProfilPersonnel userType="artisan" />} />
              <Route path="revenus" element={<RevenusPage />} />
              <Route path="profil" element={<ProfilPage />} />
              <Route path="avis" element={<AvisPage />} />
              <Route path="*" element={<Navigate to="" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
