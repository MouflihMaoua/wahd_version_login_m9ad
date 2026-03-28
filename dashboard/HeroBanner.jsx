/**
 * HeroBanner - Carte de bienvenue
 * Fond #1E2D40, CTA orange et bouton outline
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  
  return (
    <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative rounded-3xl bg-[#1E2D40] p-8 lg:p-12 overflow-hidden"
    >
        {/* Décorations arrière-plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F97316]/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Gauche */}
            <div className="flex-1">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 max-w-4xl mx-auto"
                >
                    Ravi de vous revoir,{' '}
                    <span className="text-[#F97316]">Karim</span> 
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 text-lg mb-8 max-w-xl"
                >
                    Vous avez 2 réservations actives pour cette semaine. Besoin d'un autre expert ?
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                >
                    <Link
                        to="/recherche-artisan"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F97316] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#EA6C0A] transition-colors"
                    >
                        Trouver un artisan
                        <ChevronRight size={18} />
                    </Link>
                    <Link
                        to="/dashboard/particulier/demandes"
                        className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                        Mes Demandes
                    </Link>
                </motion.div>
            </div>

            {/* Droite - Carte flottante */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden xl:block shrink-0"
            >
                <div className="w-48 rounded-2xl bg-[#1A2535] p-8 text-center shadow-xl">
                    <p className="text-5xl font-extrabold text-[#F97316] mb-1">12</p>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Travaux Finis
                    </p>
                </div>
            </motion.div>
        </div>
    </motion.div>
  );
};

export default HeroBanner;
