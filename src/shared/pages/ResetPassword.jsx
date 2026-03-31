import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../core/services/supabaseClient';
import { authService } from '../../core/services/authService';
import logoApp from '../../assets/logo_app.png';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Mot de passe requis')
      .min(8, 'Au moins 8 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[a-z]/, 'Au moins une minuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

/**
 * Page atteinte via le lien dans l'email Supabase.
 * Supabase avec detectSessionInUrl=true consomme automatiquement le token.
 * On doit donc vérifier la session existante, pas seulement le hash URL.
 */
function debugLog(label, data) {
  console.log(`[ResetPassword] ${label}:`, data);
}

const ResetPassword = () => {
  const [phase, setPhase] = useState('loading'); // loading | ready | error | success
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const doneRef = useRef(false);
  const authListenerRef = useRef(null);

  const markReady = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    debugLog('Phase', 'ready');
    setPhase('ready');
  }, []);

  const markError = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    debugLog('Phase', 'error');
    setPhase('error');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Vérification robuste de la session de recovery
  const verifyRecoverySession = useCallback(async () => {
    debugLog('Starting verification', { url: window.location.href });
    
    // Attendre que Supabase traite le token (jusqu'à 3 secondes)
    for (let i = 0; i < 15; i++) {
      if (doneRef.current) return;
      
      const { data: { session }, error } = await supabase.auth.getSession();
      debugLog(`Attempt ${i + 1}`, { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        error: error?.message 
      });
      
      // Si on a une session avec un utilisateur, c'est bon
      if (session?.user) {
        debugLog('Session found', { userId: session.user.id });
        markReady();
        return;
      }
      
      await new Promise((r) => setTimeout(r, 200));
    }
    
    // Si on arrive ici, pas de session trouvée
    if (!doneRef.current) {
      debugLog('No session after retries', null);
      markError();
    }
  }, [markReady, markError]);

  useEffect(() => {
    doneRef.current = false;
    debugLog('Mounting component', { 
      hash: window.location.hash,
      search: window.location.search 
    });

    // Écouter les changements d'état auth (PASSWORD_RECOVERY event)
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      debugLog('Auth state change', { event, hasUser: !!session?.user });
      
      if (event === 'PASSWORD_RECOVERY' && session?.user) {
        markReady();
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Supabase a traité le token et créé une session
        markReady();
      }
    });

    authListenerRef.current = data;

    // Démarrer la vérification
    verifyRecoverySession();

    return () => {
      data.subscription.unsubscribe();
    };
  }, [verifyRecoverySession, markReady]);

  const onSubmit = async ({ password }) => {
    try {
      debugLog('Submitting new password', null);
      const { error } = await authService.updatePassword(password);
      if (error) {
        debugLog('Update password error', error.message);
        toast.error(error.message || 'Impossible de mettre à jour le mot de passe');
        return;
      }
      await supabase.auth.signOut();
      setPhase('success');
      toast.success('Mot de passe mis à jour. Vous pouvez vous reconnecter.');
    } catch (e) {
      debugLog('Submit exception', e.message);
      toast.error(e.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-navy to-brand-dark flex items-center justify-center p-4 pb-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoApp} alt="7rayfi" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-white">7rayfi</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {phase === 'loading' && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Vérification du lien…</p>
              <p className="text-gray-300 text-sm mt-2">
                Si vous venez de cliquer sur l’email, patientez quelques secondes.
              </p>
            </div>
          )}

          {phase === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/40">
                <Lock size={28} className="text-red-300" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Lien invalide ou expiré</h1>
              <p className="text-gray-300 text-sm mb-6">
                Demandez un nouveau lien depuis la page « Mot de passe oublié ». Vérifiez aussi que
                l’URL de redirection est bien autorisée dans Supabase (Redirect URLs).
              </p>
              <Link
                to="/mot-de-passe-oublie"
                className="inline-flex items-center bg-brand-orange text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all"
              >
                Demander un nouveau lien
              </Link>
            </div>
          )}

          {phase === 'ready' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
                <p className="text-gray-300 text-sm">
                  Choisissez un mot de passe fort (8+ caractères, majuscule, minuscule, chiffre).
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('password')}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:bg-white/20 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      aria-label={showPw ? 'Masquer' : 'Afficher'}
                    >
                      {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400 ml-2">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Confirmer</label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type={showPw2 ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:bg-white/20 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPw2((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      aria-label={showPw2 ? 'Masquer' : 'Afficher'}
                    >
                      {showPw2 ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400 ml-2">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl"
                >
                  Enregistrer le mot de passe
                </button>
              </form>

              <div className="text-center mt-6">
                <Link
                  to="/connexion"
                  className="inline-flex items-center text-brand-orange hover:text-orange-400 font-semibold text-sm"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}

          {phase === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Mot de passe mis à jour</h2>
              <p className="text-gray-300 mb-8 text-sm">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <Link
                to="/connexion"
                className="inline-flex items-center bg-brand-orange text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all"
              >
                Aller à la connexion
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
