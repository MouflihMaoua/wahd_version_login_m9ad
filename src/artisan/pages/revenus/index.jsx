// src/pages/artisan/revenus/index.jsx
import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function RevenusPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');

  // Données fictives pour les statistiques
  const stats = {
    totalRevenus: 45600,
    revenusMois: 12400,
    revenusAnnee: 156000,
    croissance: 12.5,
    panierMoyen: 539
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Revenus</h1>
        <p className="text-gray-600">Suivez vos revenus et performances</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tous">Tous</option>
            <option value="mois">Ce mois</option>
            <option value="annee">Cette année</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalRevenus} DH</h3>
          <p className="text-gray-600 text-sm">Total revenus</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.revenusMois} DH</h3>
          <p className="text-gray-600 text-sm">Revenus ce mois</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.revenusAnnee} DH</h3>
          <p className="text-gray-600 text-sm">Revenus annuels</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm">+5.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.panierMoyen} DH</h3>
          <p className="text-gray-600 text-sm">Panier moyen</p>
        </div>
      </div>

      {/* Message de développement */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Graphiques en développement</h3>
          <p className="text-gray-600">Les graphiques détaillés et les tableaux de revenus seront bientôt disponibles.</p>
        </div>
      </div>
    </div>
  );
}
