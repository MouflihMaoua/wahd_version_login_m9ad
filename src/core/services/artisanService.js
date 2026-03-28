import { supabase } from '../services/supabaseClient';
import { hashPassword, validatePassword } from '../utils/passwordUtils';
import toast from 'react-hot-toast';

/**
 * Creates a new artisan user with secure password handling and CIN upload
 * @param {Object} artisanData - Artisan registration data
 * @returns {Promise<Object>} - Registration result
 */
export const createArtisanSecurely = async (artisanData) => {
  try {
    console.log('🔧 Starting secure artisan registration with CIN');
    
    // Validate password
    const passwordValidation = validatePassword(artisanData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    // Validate CIN
    if (!artisanData.cin || artisanData.cin.trim().length < 4) {
      throw new Error('Le numéro CIN est requis et doit contenir au moins 4 caractères');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(artisanData.password);
    console.log('🔐 Password hashed successfully');
    
    // Upload CIN images if provided
    let cinRectoUrl = null;
    let cinVersoUrl = null;
    
    if (artisanData.cinRectoFile) {
      const fileExt = artisanData.cinRectoFile.name.split('.').pop();
      const fileName = `cin-recto-${Date.now()}.${fileExt}`;
      
      const { data: rectoData, error: rectoError } = await supabase.storage
        .from('cin-documents')
        .upload(fileName, artisanData.cinRectoFile);
      
      if (rectoError) {
        console.error('❌ CIN Recto upload error:', rectoError);
        throw new Error('Erreur lors du téléchargement du CIN recto: ' + rectoError.message);
      }
      
      const { data: rectoUrl } = supabase.storage
        .from('cin-documents')
        .getPublicUrl(fileName);
      
      cinRectoUrl = rectoUrl.publicUrl;
      console.log('✅ CIN Recto uploaded:', cinRectoUrl);
    }
    
    if (artisanData.cinVersoFile) {
      const fileExt = artisanData.cinVersoFile.name.split('.').pop();
      const fileName = `cin-verso-${Date.now()}.${fileExt}`;
      
      const { data: versoData, error: versoError } = await supabase.storage
        .from('cin-documents')
        .upload(fileName, artisanData.cinVersoFile);
      
      if (versoError) {
        console.error('❌ CIN Verso upload error:', versoError);
        throw new Error('Erreur lors du téléchargement du CIN verso: ' + versoError.message);
      }
      
      const { data: versoUrl } = supabase.storage
        .from('cin-documents')
        .getPublicUrl(fileName);
      
      cinVersoUrl = versoUrl.publicUrl;
      console.log('✅ CIN Verso uploaded:', cinVersoUrl);
    }
    
    // 1. First create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: artisanData.email.trim(),
      password: artisanData.password, // Supabase handles password securely
      options: {
        data: {
          username: artisanData.nom + ' ' + artisanData.prenom,
          role: 'artisan'
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      throw new Error('Erreur lors de la création du compte: ' + authError.message);
    }
    
    if (!authData?.user) {
      throw new Error('Échec de la création du compte utilisateur');
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // 2. Then create artisan profile with hashed password and CIN
    const { data: profileData, error: profileError } = await supabase
      .from('artisan')
      .insert({
        id_artisan: authData.user.id,
        nom: artisanData.nom,
        prenom: artisanData.prenom,
        email: artisanData.email.trim(),
        telephone: artisanData.telephone || null,
        specialite: artisanData.specialite || null,
        experience: artisanData.experience || null,
        cin: artisanData.cin.trim(), // Store CIN
        carte_cin_recto: cinRectoUrl, // Store CIN recto URL
        carte_cin_verso: cinVersoUrl, // Store CIN verso URL
        password: hashedPassword, // Store hashed password as backup
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Profile error:', profileError);
      
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      // Handle CIN duplicate error
      if (profileError.message.includes('duplicate key') || profileError.message.includes('unique constraint')) {
        if (profileError.message.includes('cin')) {
          throw new Error('Ce numéro de CIN est déjà utilisé. Veuillez vérifier vos informations.');
        }
      }
      
      throw new Error('Erreur lors de la création du profil artisan: ' + profileError.message);
    }
    
    console.log('✅ Artisan profile created with CIN:', profileData);
    
    return {
      success: true,
      data: {
        user: authData.user,
        profile: profileData
      },
      message: 'Compte artisan créé avec succès'
    };
    
  } catch (error) {
    console.error('💥 Registration error:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'inscription'
    };
  }
};

/**
 * Updates artisan profile with secure password handling
 * @param {string} artisanId - The artisan ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Update result
 */
export const updateArtisanSecurely = async (artisanId, updateData) => {
  try {
    let updateFields = {
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    // Hash password if it's being updated
    if (updateData.password) {
      const passwordValidation = validatePassword(updateData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }
      
      updateFields.password = await hashPassword(updateData.password);
      console.log('🔐 Password updated and hashed');
    }
    
    const { data, error } = await supabase
      .from('artisan')
      .update(updateFields)
      .eq('id_artisan', artisanId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Update error:', error);
      throw new Error('Erreur lors de la mise à jour du profil: ' + error.message);
    }
    
    console.log('✅ Artisan profile updated:', data);
    
    return {
      success: true,
      data: data,
      message: 'Profil artisan mis à jour avec succès'
    };
    
  } catch (error) {
    console.error('💥 Update error:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour'
    };
  }
};

/**
 * Verifies artisan credentials using hashed password
 * @param {string} email - Artisan email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} - Verification result
 */
export const verifyArtisanCredentials = async (email, password) => {
  try {
    console.log('🔍 Verifying artisan credentials for:', email);
    
    // First get artisan profile
    const { data: artisan, error: artisanError } = await supabase
      .from('artisan')
      .select('password, email, id_artisan, nom, prenom')
      .eq('email', email.trim())
      .single();
    
    if (artisanError || !artisan) {
      throw new Error('Artisan non trouvé avec cet email');
    }
    
    // Compare with hashed password using Web Crypto API
    const [saltBase64, storedHash] = artisan.password.split(':');
    
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
    
    if (!isMatch) {
      throw new Error('Mot de passe incorrect');
    }
    
    console.log('✅ Artisan credentials verified');
    
    return {
      success: true,
      data: {
        id_artisan: artisan.id_artisan,
        email: artisan.email,
        nom: artisan.nom,
        prenom: artisan.prenom
      }
    };
    
  } catch (error) {
    console.error('💥 Verification error:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la vérification'
    };
  }
};
