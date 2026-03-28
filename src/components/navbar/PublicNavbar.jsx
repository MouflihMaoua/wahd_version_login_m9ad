import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Menu, 
  X,
  LogIn,
  UserPlus
} from 'lucide-react';

const PublicNavbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/recherche-artisan', label: 'Rechercher Artisan', icon: Search },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-brand-dark">7rayfi</span>
          <span className="text-brand-orange font-bold">.pro</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all ${
                isActive(href)
                  ? 'bg-brand-orange text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:text-brand-dark hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/connexion"
            className="px-4 py-2 rounded-xl border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
          >
            <LogIn size={16} />
            <span>Connexion</span>
          </Link>
          <Link
            to="/inscription"
            className="px-4 py-2 rounded-xl bg-brand-orange text-white hover:bg-brand-dark font-semibold text-sm transition-all flex items-center gap-2 shadow-lg"
          >
            <UserPlus size={16} />
            <span>S'inscrire</span>
          </Link>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-brand-dark">7rayfi</span>
            <span className="text-brand-orange font-bold">.pro</span>
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
          <div className="px-4 py-2 bg-white border-b border-gray-200 mt-16">
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
            
            <div className="border-t border-gray-200 mt-2 pt-2 space-y-2">
              <Link
                to="/connexion"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-medium text-sm transition-all flex items-center gap-2"
              >
                <LogIn size={16} />
                <span>Connexion</span>
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg bg-brand-orange text-white hover:bg-brand-dark font-medium text-sm transition-all flex items-center gap-2"
              >
                <UserPlus size={16} />
                <span>S'inscrire</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default PublicNavbar;
