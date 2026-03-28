import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Mail,
  FileText,
  User,
  LogOut,
  Home,
  Menu,
  X,
  Calendar,
  Settings,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';

const ArtisanNavbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    // La redirection sera gérée par le ProtectedRoute
  };

  const navLinks = [
    { href: '/dashboard/artisan', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/invitations', label: 'Invitations', icon: FileText },
    { href: '/devis/creer', label: 'Devis', icon: FileText },
    { href: '/dashboard/artisan/messages', label: 'Messages', icon: Mail },
    { href: '/dashboard/artisan/calendrier', label: 'Calendrier', icon: Calendar },
    { href: '/dashboard/artisan/revenus', label: 'Revenus', icon: TrendingUp },
    { href: '/dashboard/artisan/profil', label: 'Profil', icon: User },
    { href: '/dashboard/artisan/settings', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100">
        {/* Logo */}
        <Link to="/dashboard/artisan" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-brand-dark">7rayfi</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                isActive(href)
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {/* Badge de rôle */}
          <div className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-xs font-semibold border border-brand-orange/20">
            Artisan
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User size={20} className="text-gray-600" />
            </button>
            
            {/* Dropdown */}
            {mobileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Artisan</p>
                </div>
                <Link
                  to="/dashboard/artisan/profil"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={16} />
                  Mon profil
                </Link>
                <Link
                  to="/dashboard/artisan/settings"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Settings size={16} />
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard/artisan" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-brand-dark">7rayfi</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="px-4 py-2 bg-white border-b border-gray-200">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium ${
                  isActive(href)
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
            
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-lg"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default ArtisanNavbar;
