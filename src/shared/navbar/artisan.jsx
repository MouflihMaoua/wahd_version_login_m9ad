import React, { useState } from 'react';
import {
  LayoutDashboard,
  Mail,
  Calendar,
  FileText,
  Wrench,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';

export default function artisan({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '#/artisan' },
    { label: 'Messages', icon: Mail, path: '#/artisan/messages' },
    { label: 'Calendrier', icon: Calendar, path: '#/artisan/calendrier' },
    { label: 'Demandes', icon: FileText, path: '#/artisan/demandes' },
    { label: 'Devis', icon: FileText, path: '#/artisan/devis' },
    { label: 'Revenus', icon: TrendingUp, path: '#/artisan/revenus' },
    { label: 'Profil', icon: User, path: '#/artisan/profil' },
    { label: 'Paramètres', icon: Settings, path: '#/artisan/settings' },
  ];

  const isActive = (path) => {
    return window.location.hash === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>Artisan Hub</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={() => window.location.hash = item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition cursor-pointer ${
                isActive(item.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <item.icon size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition">
            <LogOut size={20} />
            <span className={`${!sidebarOpen && 'hidden'}`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Espace Artisan</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <img
              src="https://via.placeholder.com/40"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}