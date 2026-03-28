import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../core/services/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur getSession:', error.message);
          setError(error.message);
          setTimeout(() => navigate('/connexion'), 3000);
          return;
        }

        if (!data.session) {
          console.log('❌ Aucune session trouvée, redirection vers connexion');
          setError('Aucune session trouvée');
          setTimeout(() => navigate('/connexion'), 3000);
          return;
        }

        const user = data.session.user;
        console.log('✅ User connecté:', user);

        // Vérifier si le user existe déjà dans artisan
        const { data: artisan, error: artisanError } = await supabase
          .from('artisan')
          .select('*')
          .eq('id_artisan', user.id)
          .maybeSingle();

        console.log('artisan:', artisan);
        console.log('artisanError:', artisanError);

        if (artisan) {
          console.log('➡ Redirection vers profil artisane');
          navigate('/profil-artisane');
          return;
        }

        // Vérifier si le user existe déjà dans particulier
        const { data: particulier, error: particulierError } = await supabase
          .from('particulier')
          .select('*')
          .eq('id_particulier', user.id)
          .maybeSingle();

        console.log('particulier:', particulier);
        console.log('particulierError:', particulierError);

        if (particulier) {
          console.log('➡ Redirection vers profil particulier');
          navigate('/profil-particulier');
          return;
        }

        // Nouveau user => compléter profil via inscription Google
        console.log('🆕 Nouveau user, redirection vers /register-google');
        navigate('/register-google');
      } catch (err) {
        console.error('Exception dans AuthCallback:', err);
        setError('Erreur lors du traitement de l\'authentification');
        setTimeout(() => navigate('/connexion'), 3000);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
      <div className="text-center">
        {loading ? (
          <>
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-brand-dark">Connexion en cours...</p>
            <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
          </>
        ) : error ? (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-red-600 mb-2">Erreur de connexion</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <p className="text-xs text-gray-400">Redirection automatique...</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
