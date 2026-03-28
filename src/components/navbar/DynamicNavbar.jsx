import React from 'react';
import { useAuthStore } from '../../core/store/useAuthStore';
import PublicNavbar from './PublicNavbar';
import ParticulierNavbar from './ParticulierNavbar';
import ArtisanNavbar from './ArtisanNavbar';

/**
 * Composant de navigation dynamique qui s'adapte selon le rôle de l'utilisateur
 * et l'état de connexion.
 */
const DynamicNavbar = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Si l'utilisateur n'est pas connecté, afficher la navbar publique
  if (!isAuthenticated || !user) {
    return <PublicNavbar />;
  }

  // Si l'utilisateur est connecté, afficher la navbar selon son rôle
  switch (user.role) {
    case 'particulier':
      return <ParticulierNavbar />;
    
    case 'artisan':
      return <ArtisanNavbar />;
    
    case 'admin':
      // TODO: Implémenter AdminNavbar si nécessaire
      return <PublicNavbar />;
    
    default:
      return <PublicNavbar />;
  }
};

export default DynamicNavbar;
