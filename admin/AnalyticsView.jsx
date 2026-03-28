import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Wrench, DollarSign, Calendar, BarChart3, PieChart, Activity, ArrowUp, ArrowDown, Eye, Download } from 'lucide-react';

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Données simulées
  const stats = {
    overview: {
      totalUsers: 1234,
      totalArtisans: 456,
      totalMissions: 2847,
      totalRevenue: 125680,
      userGrowth: 12.5,
      artisanGrowth: 8.3,
      missionGrowth: 15.7,
      revenueGrowth: 22.1
    },
    performance: {
      avgResponseTime: '2h 30min',
      avgRating: 4.6,
      completionRate: 94.2,
      satisfactionRate: 91.8
    }
  };

  const chartData = [
    { month: 'Jan', users: 980, artisans: 380, missions: 2100, revenue: 95000 },
    { month: 'Fév', users: 1050, artisans: 410, missions: 2350, revenue: 108000 },
    { month: 'Mar', users: 1234, artisans: 456, missions: 2847, revenue: 125680 }
  ];

  const topArtisans = [
    { name: 'Pierre Lemoine', specialty: 'Plombier', missions: 156, rating: 4.8, revenue: 12500 },
    { name: 'Marie Dubois', specialty: 'Peintre', missions: 142, rating: 4.9, revenue: 11800 },
    { name: 'Jean Bernard', specialty: 'Électricien', missions: 128, rating: 4.7, revenue: 10200 },
    { name: 'Sophie Martin', specialty: 'Femme de ménage', missions: 115, rating: 4.6, revenue: 8900 }
  ];

  const recentActivity = [
    { type: 'user', action: 'Nouvel utilisateur inscrit', user: 'Marie Dupont', time: 'Il y a 5 minutes' },
    { type: 'mission', action: 'Mission complétée', user: 'Pierre Lemoine', time: 'Il y a 15 minutes' },
    { type: 'revenue', action: 'Paiement reçu', user: 'Jean Martin', time: 'Il y a 30 minutes' },
    { type: 'artisan', action: 'Nouvel artisan validé', user: 'Sophie Bernard', time: 'Il y a 1 heure' }
  ];

  const MetricCard = ({ title, value, growth, icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          growth > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {growth > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{Math.abs(growth)}%</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Analytics et Statistiques</h1>
          <p className="text-gray-600 mt-1">Tableau de bord analytique de la plateforme</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">Dernière année</option>
          </select>
          <button className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <Download size={20} />
            Exporter
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Utilisateurs"
          value={stats.overview.totalUsers.toLocaleString()}
          growth={stats.overview.userGrowth}
          icon={<Users className="text-blue-600" size={24} />}
          color="bg-blue-100"
        />
        <MetricCard
          title="Total Artisans"
          value={stats.overview.totalArtisans.toLocaleString()}
          growth={stats.overview.artisanGrowth}
          icon={<Wrench className="text-brand-orange" size={24} />}
          color="bg-brand-orange/10"
        />
        <MetricCard
          title="Total Missions"
          value={stats.overview.totalMissions.toLocaleString()}
          growth={stats.overview.missionGrowth}
          icon={<Calendar className="text-green-600" size={24} />}
          color="bg-green-100"
        />
        <MetricCard
          title="Revenu Total"
          value={`€${stats.overview.totalRevenue.toLocaleString()}`}
          growth={stats.overview.revenueGrowth}
          icon={<DollarSign className="text-purple-600" size={24} />}
          color="bg-purple-100"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Temps de réponse moyen</p>
            <Activity className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.performance.avgResponseTime}</p>
          <p className="text-xs text-green-600 mt-1">-15% vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Note moyenne</p>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.performance.avgRating}/5</p>
          <p className="text-xs text-green-600 mt-1">+0.2 vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Taux de complétion</p>
            <PieChart className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.performance.completionRate}%</p>
          <p className="text-xs text-green-600 mt-1">+2.1% vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Taux de satisfaction</p>
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.performance.satisfactionRate}%</p>
          <p className="text-xs text-green-600 mt-1">+1.8% vs mois dernier</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution de la croissance</h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-gray-600">
                    {data.users} utilisateurs • {data.artisans} artisans • {data.missions} missions
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-xs text-blue-600">Utilisateurs</div>
                    <div className="text-sm font-bold text-blue-800">{data.users}</div>
                  </div>
                  <div className="bg-brand-orange/10 rounded-lg p-2">
                    <div className="text-xs text-brand-orange">Artisans</div>
                    <div className="text-sm font-bold text-brand-orange">{data.artisans}</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-2">
                    <div className="text-xs text-green-600">Missions</div>
                    <div className="text-sm font-bold text-green-800">{data.missions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artisans */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Artisans performants</h3>
          <div className="space-y-4">
            {topArtisans.map((artisan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {artisan.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{artisan.name}</p>
                    <p className="text-xs text-gray-600">{artisan.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{artisan.rating}</span>
                  </div>
                  <div className="text-xs text-gray-600">{artisan.missions} missions</div>
                  <div className="text-xs font-medium text-green-600">€{artisan.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'mission' ? 'bg-green-100' :
                  activity.type === 'revenue' ? 'bg-purple-100' :
                  'bg-brand-orange/10'
                }`}>
                  {activity.type === 'user' && <Users className="text-blue-600" size={16} />}
                  {activity.type === 'mission' && <Calendar className="text-green-600" size={16} />}
                  {activity.type === 'revenue' && <DollarSign className="text-purple-600" size={16} />}
                  {activity.type === 'artisan' && <Wrench className="text-brand-orange" size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h3>
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 w-16">{data.month}</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-8 relative">
                  <div 
                    className="bg-gradient-to-r from-brand-orange to-brand-accent h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(data.revenue / 125680) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      €{data.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">
                +{index > 0 ? Math.round(((data.revenue - chartData[index - 1].revenue) / chartData[index - 1].revenue) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
