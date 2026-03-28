import React from "react";
import { BarChart3, Heart, Star } from "lucide-react";

const ProfileStats = ({ user, userType }) => {
  console.log(" ProfileStats - user:", user);
  console.log(" ProfileStats - userType:", userType);
  
  // Données dynamiques basées sur le profil utilisateur
  const statItems = userType === 'artisan' ? [
    {
      label: "Missions complétées",
      value: user?.missions_completees || "0",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Années d'expérience",
      value: user?.annee_experience || "0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Statut validation",
      value: user?.statut_validation ? "Validé" : "En attente",
      icon: Heart,
      color: user?.statut_validation ? "text-green-600" : "text-orange-600",
      bgColor: user?.statut_validation ? "bg-green-50" : "bg-orange-50",
    },
  ] : [
    {
      label: "Artisans favoris",
      value: user?.artisans_favoris || "0",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Missions postées",
      value: user?.missions_postees || "0",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Avis donnés",
      value: user?.avis_donnés || "0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
              <Icon size={24} className={stat.color} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              {stat.label}
            </p>
            <p className="text-4xl font-black text-brand-navy">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
