import { Shield, Database, Mail } from 'lucide-react';
import { AdminCard, AdminCardHeader } from '../components/ui/AdminCard';
import { useAuthStore } from '../../core/store/useAuthStore';
import { supabase } from '../../core/services/supabaseClient';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

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
                public.platform_admins
              </code>
              . Exécutez le fichier{' '}
              <code className="font-mono text-[11px]">setup-admin-dashboard.sql</code> puis :{' '}
              <code className="block mt-2 font-mono text-[11px] break-all bg-white/80 rounded-lg p-2">
                {`INSERT INTO public.platform_admins (user_id) VALUES ('VOTRE_UUID');`}
              </code>
            </p>
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
