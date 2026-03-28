import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import ArtisanHome from './ArtisanHome';
import ArtisanMessages from '../messages';
import ArtisanCalendrier from '../calendrier';
import ArtisanDemandes from '../demandes';
import ArtisanDevis from '../devis';
import ArtisanRevenus from '../revenus';
import ArtisanProfil from '../profil';

const ArtisanDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/artisan' },
    { label: 'Messages', icon: Mail, path: '/dashboard/artisan/messages' },
    { label: 'Calendrier', icon: Calendar, path: '/dashboard/artisan/calendrier' },
    { label: 'Demandes', icon: FileText, path: '/dashboard/artisan/demandes' },
    { label: 'Devis', icon: FileText, path: '/dashboard/artisan/devis' },
    { label: 'Revenus', icon: TrendingUp, path: '/dashboard/artisan/revenus' },
    { label: 'Profil', icon: User, path: '/dashboard/artisan/profil' },
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
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-lg fixed h-screen left-0 top-0 z-40`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1 className={`font-bold text-lg transition-opacity ${!sidebarOpen && 'w-0 h-0 overflow-hidden'}`}>
            Artisan Hub
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`${!sidebarOpen && 'hidden'} whitespace-nowrap`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`${!sidebarOpen && 'hidden'} whitespace-nowrap`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
            <p className="text-sm text-gray-500">Espace Artisan • Ahmed Bennani</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2 relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">Ahmed</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-max">
                  <Link to="/dashboard/artisan/profil" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">Mon profil</Link>
                  <Link to="/dashboard/artisan/settings" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">Paramètres</Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
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
              <Route path="messages" element={<ArtisanMessages />} />
              <Route path="calendrier" element={<ArtisanCalendrier />} />
              <Route path="demandes" element={<ArtisanDemandes />} />
              <Route path="devis" element={<ArtisanDevis />} />
              <Route path="revenus" element={<ArtisanRevenus />} />
              <Route path="profil" element={<ArtisanProfil />} />
              <Route path="*" element={<Navigate to="" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
