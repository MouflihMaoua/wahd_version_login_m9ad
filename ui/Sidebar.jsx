// src/components/ui/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar,
  MessageCircle,
  FileText,
  DollarSign,
  Star,
  User,
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', path: '/artisan/dashboard', icon: LayoutDashboard },
  { name: 'Demandes', path: '/artisan/demandes', icon: Users },
  { name: 'Interventions', path: '/artisan/interventions', icon: Briefcase },
  { name: 'Calendrier', path: '/artisan/calendrier', icon: Calendar },
  { name: 'Messages', path: '/artisan/messages', icon: MessageCircle },
  { name: 'Devis', path: '/artisan/devis', icon: FileText },
  { name: 'Revenus', path: '/artisan/revenus', icon: DollarSign },
  { name: 'Avis', path: '/artisan/avis', icon: Star },
  { name: 'Profil', path: '/artisan/profil', icon: User },
  { name: 'Paramètres', path: '/artisan/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">ArtisanPro</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}