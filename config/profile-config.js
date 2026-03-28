// Configuration du mode de profil
// true = mode démo (données mockées)
// false = mode Supabase (données réelles)

export const USE_DEMO_MODE = true;

// Export conditionnel du service
export const getProfileService = () => {
  if (USE_DEMO_MODE) {
    return import('../services/profileService-demo').then(module => module.profileService);
  } else {
    return import('../services/profileService').then(module => module.profileService);
  }
};
