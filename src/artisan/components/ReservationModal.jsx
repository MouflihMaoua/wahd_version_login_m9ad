import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const reservationSchema = z.object({
    date: z.string().min(1, 'La date est requise'),
    time: z.string().min(1, "L'heure est requise"),
    description: z.string().min(10, 'Décrivez brièvement votre besoin (min 10 car.)'),
});

const ReservationModal = ({ isOpen, onClose, artisan }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(reservationSchema),
    });

    const onSubmit = async (data) => {
        try {
            // Simulation appel API backend Laravel
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Demande envoyée ! Ahmed vous répondra sous peu.');
            onClose();
        } catch (error) {
            toast.error('Une erreur est survenue');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-brand-dark p-8 md:p-10 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center space-x-6">
                                <img src={artisan.image} className="w-20 h-20 rounded-3xl object-cover ring-2 ring-brand-orange" />
                                <div>
                                    <h2 className="text-2xl font-bold">Réserver {artisan.name}</h2>
                                    <p className="text-brand-orange font-bold text-sm tracking-wide">{artisan.job}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-brand-dark flex items-center">
                                        <Calendar size={16} className="mr-2 text-brand-orange" />
                                        Date souhaitée
                                    </label>
                                    <input
                                        {...register('date')}
                                        type="date"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-brand-orange focus:bg-white transition-all text-sm font-medium"
                                    />
                                    {errors.date && <p className="text-xs text-red-500 font-bold">{errors.date.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-brand-dark flex items-center">
                                        <Clock size={16} className="mr-2 text-brand-orange" />
                                        Créneau horaire
                                    </label>
                                    <select
                                        {...register('time')}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-brand-orange focus:bg-white transition-all text-sm font-medium appearance-none"
                                    >
                                        <option value="">Choisir</option>
                                        <option value="matin">Matin (09:00 - 12:00)</option>
                                        <option value="apres-midi">Après-midi (14:00 - 18:00)</option>
                                        <option value="soir">Soir (Après 18:00)</option>
                                    </select>
                                    {errors.time && <p className="text-xs text-red-500 font-bold">{errors.time.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brand-dark flex items-center">
                                    <MessageSquare size={16} className="mr-2 text-brand-orange" />
                                    Description de votre besoin
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows="4"
                                    placeholder="Expliquez en quelques mots ce que vous souhaitez..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-brand-orange focus:bg-white transition-all text-sm font-medium"
                                />
                                {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
                            </div>

                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex items-start space-x-3">
                                <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-green-800 font-medium leading-relaxed">
                                    Votre demande sera transmise à l'artisan qui vous répondra via la messagerie interne. Aucun paiement n'est requis à cette étape.
                                </p>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 active:scale-95 transition-all flex items-center justify-center space-x-3"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Envoyer la demande</span>
                                        <Calendar size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReservationModal;
