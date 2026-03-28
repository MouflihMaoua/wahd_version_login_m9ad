import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  FileText, 
  User, 
  LogOut,
  Home,
  Menu,
  X,
  ChevronDown,
  Calendar,
  ClipboardList,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';

const ParticulierNavbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    setDropdownOpen(false);
  };

  // Navigation complète basée sur les pages réellement accessibles
  const navLinks = [
    { 
      href: '/recherche-artisan', 
      label: 'Chercher Artisan', 
      icon: Search,
      description: 'Trouver des artisans qualifiés'
    },
    { 
      href: '/dashboard/particulier/demandes', 
      label: 'Mes Demandes', 
      icon: FileText,
      description: 'Gérer mes demandes de service'
    },
    { 
      href: '/dashboard/particulier/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      description: 'Discussions avec les artisans'
    },
    { 
      href: '/dashboard/particulier/missions', 
      label: 'Mes Services', 
      icon: ClipboardList,
      description: 'Services demandés et en cours'
    },
    { 
      href: '/dashboard/particulier/profil', 
      label: 'Mon Profil', 
      icon: User,
      description: 'Informations personnelles'
    },
  ];

  // Active link highlight - logique précise
  const isActive = (path) => {
    if (path === '/recherche-artisan') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Classes dynamiques pour les liens actifs
  const getLinkClasses = (active) => `
    px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-300
    ${active 
      ? 'bg-emerald-500 text-white shadow-lg transform scale-105 border-2 border-emerald-600' 
      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:transform hover:scale-105 border-2 border-transparent hover:border-emerald-200'
    }
  `;

  // Classes pour le dropdown
  const getDropdownClasses = (open) => `
    absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50
    ${open ? 'animate-fadeIn' : 'hidden'}
  `;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-40">
        {/* Logo */}
        <Link 
          to="/dashboard/particulier" 
          className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Home size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-brand-dark">7rayfi</span>
            <span className="text-emerald-500 font-bold text-sm">.pro</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {navLinks.map(({ href, label, icon: Icon, description }) => (
            <Link
              key={href}
              to={href}
              className={getLinkClasses(isActive(href))}
              title={description}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Badge de rôle */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 shadow-sm">
            Particulier
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-200 group-hover:border-emerald-300 transition-all duration-300">
                <User size={20} className="text-emerald-600" />
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-600 transition-all duration-300 ${dropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} 
              />
            </button>
            
            {/* Dropdown Content */}
            <div className={getDropdownClasses(dropdownOpen)}>
              {/* User Info Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.nom || user?.prenom || user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-600 font-medium">En ligne</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/dashboard/particulier/profil"
                  className="px-6 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={18} className="text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
                  <div className="flex-1">
                    <div className="font-medium">Mon Profil</div>
                    <div className="text-xs text-gray-500">Gérer mes informations</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-270" />
                </Link>
                
                <Link
                  to="/dashboard/particulier/settings"
                  className="px-6 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={18} className="text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
                  <div className="flex-1">
                    <div className="font-medium">Paramètres</div>
                    <div className="text-xs text-gray-500">Préférences et confidentialité</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-270" />
                </Link>
                
                <div className="border-t border-gray-100 my-2"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-all duration-200 group"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Déconnexion</div>
                    <div className="text-xs text-gray-500">Quitter mon espace</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link 
            to="/dashboard/particulier" 
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-brand-dark">7rayfi</span>
              <span className="text-emerald-500 font-bold text-xs">.pro</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Badge de rôle mobile */}
            <div className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
              Particulier
            </div>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              {mobileOpen ? <X size={24} className="text-emerald-600" /> : <Menu size={24} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="px-4 py-2 bg-white border-t border-gray-100 animate-slideDown">
            {/* User Info Mobile */}
            <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <User size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.nom || user?.prenom || user?.email?.split('@')[0] || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600 font-medium">En ligne</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links Mobile */}
            {navLinks.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-300 mb-2 ${
                  isActive(href)
                    ? 'bg-emerald-500 text-white shadow-lg border-2 border-emerald-600'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 border-2 border-transparent hover:border-emerald-200'
                }`}
              >
                <Icon size={20} />
                <div className="flex-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-75">{description}</div>
                </div>
              </Link>
            ))}
            
            {/* Mobile Actions */}
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all duration-300 rounded-xl"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ParticulierNavbar;
