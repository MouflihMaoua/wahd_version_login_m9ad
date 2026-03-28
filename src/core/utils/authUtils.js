// Enhanced authentication utilities for role-based redirection

export const handleLoginRedirect = (userRole, navigate) => {
  const redirectPath = userRole === 'artisan' ? '/dashboard/artisan/profil' :
                      userRole === 'particulier' ? '/recherche-artisan' :
                      userRole === 'admin' ? '/admin' :
                      '/'; // Default fallback to home page
  
  navigate(redirectPath);
};

export const determineUserRole = async (userId, supabase) => {
  try {
    // Check if user is artisan
    const { data: artisanData, error: artisanError } = await supabase
      .from('artisan')
      .select('*')
      .eq('id_artisan', userId)
      .maybeSingle();

    if (artisanData && !artisanError) {
      return { role: 'artisan', userData: artisanData };
    }

    // Check if user is particulier
    const { data: particulierData, error: particulierError } = await supabase
      .from('particulier')
      .select('*')
      .eq('id_particulier', userId)
      .maybeSingle();

    if (particulierData && !particulierError) {
      return { role: 'particulier', userData: particulierData };
    }

    return { role: null, userData: null };
  } catch (error) {
    console.error('Error determining user role:', error);
    return { role: null, userData: null };
  }
};

export const authenticateWithSupabase = async (email, password, supabase) => {
  try {
    console.log('🔐 Tentative d\'authentification pour:', email);
    console.log('🌐 Supabase URL:', supabase.supabaseUrl);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    console.log('📊 Réponse Supabase:', { authData, authError });

    if (authError) {
      console.error('❌ Erreur Supabase:', authError);
      
      // Messages d'erreur plus spécifiques
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Identifiants incorrects. Vérifiez votre email et mot de passe.');
      } else if (authError.message.includes('Email not confirmed')) {
        throw new Error('Veuillez confirmer votre adresse email avant de vous connecter.');
      } else if (authError.message.includes('User not found')) {
        throw new Error('Aucun compte trouvé avec cette adresse email.');
      } else {
        throw new Error(authError.message || 'Erreur lors de la connexion');
      }
    }

    if (!authData?.user) {
      console.error('❌ Aucun utilisateur retourné');
      throw new Error('Utilisateur non trouvé');
    }

    console.log('✅ Authentification réussie pour:', authData.user.email);
    return authData;
  } catch (error) {
    console.error('💥 Erreur d\'authentification:', error);
    throw error;
  }
};
