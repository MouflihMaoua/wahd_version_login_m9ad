import { Shield, Database, Mail, UserPlus, CheckCircle } from 'lucide-react';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { useAuthStore } from '../../core/store/useAuthStore';
import { supabase } from '../../core/services/supabaseClient';
import { addUserAsAdmin, checkIfUserIsAdmin } from '../services/adminApi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (user?.id) {
        const admin = await checkIfUserIsAdmin(user.id);
        setIsAdmin(admin);
      }
      setChecking(false);
    }
    checkAdmin();
  }, [user?.id]);

  const handleAddAsAdmin = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await addUserAsAdmin(user.id, user.name?.split(' ')[0] || 'Admin', user.name?.split(' ')[1] || 'User');
      setIsAdmin(true);
      toast.success('Vous êtes maintenant administrateur de la plateforme !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    window.location.href = '/connexion';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminCard hover={false}>
        <AdminCardHeader
          icon={Shield}
          title="Paramètres administrateur"
          subtitle="Accès et sécurité"
        />
        <div className="px-6 pb-6 space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-[#1A3A5C] font-bold">
              <Mail className="h-4 w-4" /> Compte connecté
            </div>
            <p className="mt-2 font-semibold">{user?.name ?? '—'}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs font-mono text-slate-500 mt-1">id : {user?.id}</p>
          </div>

          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/40 p-4">
            <div className="flex items-center gap-2 text-orange-700 font-bold">
              <Database className="h-4 w-4" /> Accès base de données
            </div>
            <p className="mt-2 text-xs sm:text-sm">
              Pour lire ou modifier toutes les tables, votre UUID doit être présent dans{' '}
              <code className="rounded bg-white/80 px-1 py-0.5 font-mono text-[11px]">
                public.administrateur
              </code>
            </p>
            
            {checking ? (
              <p className="mt-3 text-xs text-slate-500">Vérification...</p>
            ) : isAdmin ? (
              <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Vous êtes administrateur de la plateforme
              </div>
            ) : (
              <button
                onClick={handleAddAsAdmin}
                disabled={loading}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4" />
                {loading ? 'Ajout en cours...' : "Devenir administrateur"}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Le rôle applicatif <strong>admin</strong> (email contenant « admin ») protège les routes React.
            Les politiques Supabase garantissent que seuls les utilisateurs enregistrés comme administrateurs
            plateforme accèdent aux données sensibles via l’API.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
