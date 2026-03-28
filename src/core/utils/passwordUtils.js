/**
 * Hashes a password using Web Crypto API with salt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password in format salt:hash
 */
export const hashPassword = async (password) => {
  try {
    // Validate password before hashing
    if (!password || password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    // Generate random salt
    const saltArray = crypto.getRandomValues(new Uint8Array(16));
    const saltBytes = Array.from(saltArray);
    const saltBase64 = btoa(String.fromCharCode(...saltBytes));
    
    // Encode password with salt
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltBase64);
    
    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    console.log('🔐 Password hashed successfully with Web Crypto API');
    return `${saltBase64}:${hashBase64}`;
  } catch (error) {
    console.error('💥 Error hashing password:', error);
    throw new Error('Erreur lors du hachage du mot de passe');
  }
};

/**
 * Compares a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    // Split salt and hash
    const [saltBase64, storedHash] = hashedPassword.split(':');
    
    if (!saltBase64 || !storedHash) {
      throw new Error('Format de mot de passe invalide');
    }
    
    // Hash the provided password with the same salt
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltBase64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    const isMatch = hashBase64 === storedHash;
    console.log('🔍 Password comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('💥 Error comparing password:', error);
    throw new Error('Erreur lors de la comparaison du mot de passe');
  }
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  // Minimum length
  if (!password || password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  // Contains number
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  // Contains special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Generates a secure random password
 * @param {number} length - The desired password length (default 12)
 * @returns {string} - A secure random password
 */
export const generateSecurePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};
