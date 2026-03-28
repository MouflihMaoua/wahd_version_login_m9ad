// Enhanced validation utilities for registration
export const validatePassword = (password) => {
  const errors = [];
  
  // Minimum 8 characters
  if (!password || password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  // At least one number
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCINFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Le fichier est requis');
    return { isValid: false, errors };
  }
  
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Seuls les fichiers JPG, PNG et WebP sont autorisés');
  }
  
  // File size validation (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('La taille du fichier ne doit pas dépasser 5MB');
  }
  
  // Minimum file size (at least 10KB to avoid empty files)
  const minSize = 10 * 1024; // 10KB in bytes
  if (file.size < minSize) {
    errors.push('Le fichier semble corrompu ou trop petit');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'Très faible', color: 'red' };
  
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  const strengthLevels = [
    { strength: 0, label: 'Très faible', color: 'red' },
    { strength: 1, label: 'Faible', color: 'orange' },
    { strength: 2, label: 'Moyen', color: 'yellow' },
    { strength: 3, label: 'Bon', color: 'blue' },
    { strength: 4, label: 'Fort', color: 'green' },
    { strength: 5, label: 'Très fort', color: 'green' },
    { strength: 6, label: 'Excellent', color: 'green' }
  ];
  
  return strengthLevels[Math.min(score, 6)];
};
