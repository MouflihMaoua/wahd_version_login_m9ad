// src/components/public/SearchNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Wrench, ChevronDown, User, MessageSquare, 
  Calendar, Settings, LogOut, Search, Bell, Home 
} from 'lucide-react';

const NAV_LINKS = [
  { 
    href: '/recherche-artisan', 
    label: 'Rechercher Artisan',
    icon: Search 
  },
  
  { 
    href: '/', 
    label: 'Accueil',
    icon: Home 
  },
];

export default function SearchNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/assets/logo_app.png" alt="7rayfi_logo" className="w-16 h-16 object-contain" />
                <span className="text-xl font-bold text-gray-900"></span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.href || 
                    (link.href === '/recherche-artisan' && location.pathname === '/recherche-artisan')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
             

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Karim Bennani</p>
                    <p className="text-xs text-blue-600">Client</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    KB
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/dashboard/particulier/profil"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      Mon profil
                    </Link>
                    <Link
                      to="/dashboard/particulier/messages"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <MessageSquare size={16} />
                      Messages
                    </Link>
                    <Link
                      to="/dashboard/particulier/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} />
                      Paramètres
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white border-b border-gray-200'
      }`}>
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/logo_app.png" alt="7rayfi_logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold text-gray-900">7rayfi</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="bg-white border-t border-gray-200">
            <div className="px-4 sm:px-6 py-4 space-y-2">
              {/* Connexion button mobile */}
              <Link
                to="/connexion"
                onClick={() => {
                  console.log('SearchNavbar Connexion button clicked - navigating to /connexion');
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 bg-brand-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
              >
                <User size={20} />
                Connexion
              </Link>
              
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.href || 
                    (link.href === '/recherche-artisan' && location.pathname === '/recherche-artisan')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              
              <hr className="my-4 border-gray-200" />
              
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    KB
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Karim Bennani</p>
                    <p className="text-xs text-blue-600">Client</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/dashboard/particulier/profil"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <User size={16} />
                    Mon profil
                  </Link>
                  <Link
                    to="/dashboard/particulier/messages"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <MessageSquare size={16} />
                    Messages
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left">
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
