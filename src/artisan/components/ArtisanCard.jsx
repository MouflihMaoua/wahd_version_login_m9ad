import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const ArtisanCard = ({ artisan, className }) => {
    return (
        <motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            className={cn(
                "group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-premium hover:shadow-2xl hover:border-brand-orange/20 transition-all duration-700 relative overflow-hidden",
                className
            )}
        >
            <div className="relative mb-6 overflow-hidden rounded-[2rem] aspect-[4/3] shadow-inner bg-gray-50 bg-grain">
                <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-5 right-5 flex gap-2">
                    {artisan.verified && (
                        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-xl shadow-lg text-emerald-600 border border-white" title="Profil Vérifié">
                            <ShieldCheck size={20} />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-5 left-5">
                    <span className="px-5 py-2 bg-brand-navy/80 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10">
                        {artisan.job}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black text-brand-navy font-heading tracking-tight group-hover:text-brand-orange transition-colors duration-500">
                            {artisan.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">
                            <MapPin size={14} className="mr-2 text-brand-orange" />
                            {artisan.city}
                        </div>
                    </div>
                    <div className="flex items-center bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/10">
                        <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1.5" />
                        <span className="text-sm font-black text-brand-navy leading-none">{artisan.rating}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100/80">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Tarif estimé</span>
                        <p className="font-black text-lg text-brand-navy font-heading tracking-tight">{artisan.price || 'Sur devis'}</p>
                    </div>
                    <Link
                        to={`/artisan/${artisan.id}`}
                        className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white group-hover:shadow-2xl group-hover:shadow-brand-navy/30 transition-all duration-500 active:scale-90"
                    >
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ArtisanCard;
