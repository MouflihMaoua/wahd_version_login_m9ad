import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../core/store/useAuthStore';

// Composant de loading simplifié pour éviter les erreurs d'import
const LoadingSpinner = ({ text = 'Chargement...' }) => {
  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange animate-spin rounded-full"></div>
        <p className="text-lg font-semibold text-brand-dark">{text}</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles = null, requiredRole = null }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner text="Chargement de votre espace..." />;
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérifier le rôle si requis (compatibilité ancienne syntaxe)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérifier les rôles autorisés (nouvelle syntaxe)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
