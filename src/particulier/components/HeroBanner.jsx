import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';

const HeroBanner = () => {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'vous';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bonjour' :
    hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="relative bg-gradient-to-br from-[#1A3A5C] to-[#0f2236] rounded-2xl overflow-hidden p-8 text-white">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6B35]/15 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          {/* Greeting badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35]/20 border border-[#FF6B35]/30 rounded-full text-xs font-semibold text-[#FF9A6C] mb-4">
            <Sparkles size={11} />
            {greeting}, {firstName} 👋
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Votre espace <span className="text-[#FF6B35]">particulier</span>
          </h1>
          <p className="text-white/60 text-sm max-w-sm">
            Trouvez les meilleurs artisans qualifiés pour tous vos projets.
          </p>
        </div>

        <Link
          to="/recherche-artisan"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a25] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:-translate-y-0.5"
        >
          <Search size={16} />
          Chercher un artisan
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;
