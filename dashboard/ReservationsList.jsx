/**
 * ReservationsList - Liste des dernières réservations
 * Badges statut : EN ATTENTE (orange), CONFIRMÉ (vert), TERMINÉ (gris)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const reservations = [
    {
        id: 1,
        artisan: 'Ahmed Mansouri',
        metier: 'Plombier',
        ville: 'Casablanca',
        date: '25 Fév 2025',
        heure: '10:00',
        status: 'EN ATTENTE',
        image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=100',
    },
    {
        id: 2,
        artisan: 'Youssef Alami',
        metier: 'Électricien',
        ville: 'Rabat',
        date: '24 Fév 2025',
        heure: '14:30',
        status: 'CONFIRMÉ',
        image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=100',
    },
    {
        id: 3,
        artisan: 'Said Bennani',
        metier: 'Menuisier',
        ville: 'Fès',
        date: '20 Fév 2025',
        heure: '09:00',
        status: 'TERMINÉ',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
];

const statusStyles = {
    'EN ATTENTE': 'bg-[#F97316]/10 text-[#F97316]',
    CONFIRMÉ: 'bg-[#10B981]/10 text-[#10B981]',
    TERMINÉ: 'bg-[#64748B]/10 text-[#64748B]',
};

const ReservationsList = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden"
    >
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#1C1917]">Dernières Réservations</h2>
            <Link
                to="/dashboard/particulier/missions"
                className="text-[#F97316] text-sm font-semibold hover:text-[#EA6C0A] flex items-center gap-1"
            >
                Voir tout <ChevronRight size={16} />
            </Link>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
            {reservations.map((res, i) => (
                <motion.div
                    key={res.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 flex items-center justify-between hover:bg-[#F4F6FA]/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={res.image}
                            alt={res.artisan}
                            className="w-14 h-14 rounded-2xl object-cover"
                        />
                        <div>
                            <p className="font-bold text-[#1C1917]">{res.artisan}</p>
                            <p className="text-sm text-[#64748B]">{res.metier} • {res.ville}</p>
                            <p className="text-xs text-[#64748B] mt-1">
                                {res.date} à {res.heure}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                statusStyles[res.status] || statusStyles['EN ATTENTE']
                            }`}
                        >
                            {res.status}
                        </span>
                        <Link
                            to={`/dashboard/particulier/missions`}
                            className="p-2 rounded-xl text-[#64748B] hover:bg-[#F4F6FA] hover:text-[#F97316] transition-colors"
                        >
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export default ReservationsList;
