import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, MapPin, SlidersHorizontal, ArrowRight, Ghost } from 'lucide-react';
import SearchBar from '../components/public/SearchBar';
import ArtisanCard from '../../artisan/components/ArtisanCard';
import EmptyState from '../components/ui/EmptyState';
import { SERVICES_ARTISAN } from '../../core/constants/services';

const artisansData = [
    { id: 1, name: 'Ahmed Mansouri', job: 'Plombier', city: 'Casablanca', rating: 4.8, reviews: 156, price: 'À partir de 150 DH', image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=400', verified: true },
    { id: 2, name: 'Youssef Alami', job: 'Électricien', city: 'Rabat', rating: 4.9, reviews: 89, price: 'À partir de 200 DH', image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400', verified: true },
    { id: 3, name: 'Amine Bennani', job: 'Ménage', city: 'Casablanca', rating: 4.7, reviews: 67, price: 'À partir de 250 DH', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400', verified: false },
    { id: 4, name: 'Sarah Tahiri', job: 'Peintre', city: 'Marrakech', rating: 4.6, reviews: 45, price: 'À partir de 100 DH', image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=400', verified: true },
    { id: 5, name: 'Omar Idrissi', job: 'Technicien en électroménager et climatisation', city: 'Tanger', rating: 4.5, reviews: 34, price: 'Sur devis', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', verified: false },
    { id: 6, name: 'Hassan Zemmouri', job: 'Plombier', city: 'Fès', rating: 4.8, reviews: 112, price: 'À partir de 180 DH', image: 'https://images.unsplash.com/photo-1595841055318-62400b65f242?w=400', verified: true },
];

const categories = ['Tous', ...SERVICES_ARTISAN];

const Search = () => {
    const [filters, setFilters] = useState({ term: '', city: '' });
    const [selectedCat, setSelectedCat] = useState('Tous');

    const filteredArtisans = artisansData.filter(artisan => {
        const matchesSearch = artisan.name.toLowerCase().includes(filters.term.toLowerCase()) ||
            artisan.job.toLowerCase().includes(filters.term.toLowerCase());
        const matchesCat = selectedCat === 'Tous' || artisan.job === selectedCat;
        const matchesCity = !filters.city || artisan.city === filters.city;
        return matchesSearch && matchesCat && matchesCity;
    });

    return (
        <div className="min-h-screen bg-brand-offwhite pt-36 pb-24 font-sans selection:bg-brand-orange selection:text-white">
            <div className="container mx-auto px-6">
                {/* Header Search Area - Focused & Premium */}
                <div className="max-w-5xl mx-auto mb-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black font-heading text-brand-navy mb-8"
                    >
                        Trouvez l'expertise qu'il vous <span className="text-brand-orange">faut</span>.
                    </motion.h1>
                    <div className="bg-white p-2 rounded-full shadow-premium border border-gray-100/50">
                        <SearchBar onSearch={(vals) => setFilters(prev => ({ ...prev, ...vals }))} className="shadow-none border-none p-0" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filtres */}
                    <aside className="lg:w-1/4 space-y-10">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-premium sticky top-36 bg-grain overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl" />

                            <h3 className="text-xl font-black font-heading text-brand-navy mb-8 tracking-tight">Expertises</h3>
                            <div className="flex flex-wrap gap-3 lg:flex-col lg:gap-4">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCat(cat)}
                                        className={cn(
                                            "px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left group flex justify-between items-center",
                                            selectedCat === cat
                                                ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30 translate-x-1'
                                                : 'bg-gray-50 text-gray-500 hover:bg-brand-navy hover:text-white'
                                        )}
                                    >
                                        {cat}
                                        {selectedCat === cat && <ChevronRight size={14} />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-gray-100">
                                <div className="bg-brand-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
                                    <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-brand-orange/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <h3 className="font-black font-heading text-lg mb-3 relative z-10 leading-tight">Vous êtes un artisan ?</h3>
                                    <p className="text-xs text-white/40 mb-6 relative z-10 font-bold leading-relaxed">Boostez votre visibilité et recevez des chantiers qualifiés.</p>
                                    <button className="text-xs font-black uppercase tracking-widest text-brand-orange flex items-center group-hover:gap-2 transition-all relative z-10">
                                        Nous rejoindre <ArrowRight size={14} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Area */}
                    <div className="lg:w-3/4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-2">
                            <div>
                                <h2 className="text-3xl font-black font-heading text-brand-navy tracking-tight">
                                    {filteredArtisans.length} <span className="text-gray-400 font-bold">artisans trouvés</span>
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">À proximité de chez vous</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hidden sm:block">Trier par :</span>
                                <div className="relative">
                                    <select className="bg-white px-8 py-4 rounded-2xl text-brand-navy font-black text-xs uppercase tracking-widest border border-gray-100 outline-none appearance-none cursor-pointer focus:border-brand-orange/30 focus:shadow-xl transition-all pr-12">
                                        <option>Pertinence</option>
                                        <option>Mieux notés</option>
                                        <option>Moins chers</option>
                                    </select>
                                    <SlidersHorizontal size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-orange pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {filteredArtisans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <AnimatePresence mode='popLayout'>
                                    {filteredArtisans.map((artisan, index) => (
                                        <motion.div
                                            key={artisan.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <ArtisanCard
                                                artisan={artisan}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[4rem] p-24 text-center border border-gray-100 shadow-premium bg-grain overflow-hidden relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-150">
                                    <SearchIcon size={300} />
                                </div>
                                <EmptyState
                                    title="Aucun artisan trouvé"
                                    description="Nos artisans sont peut-être tous occupés. Essayez d'élargir votre zone de recherche."
                                    onAction={() => {
                                        setSelectedCat('Tous');
                                        setFilters({ term: '', city: '' });
                                    }}
                                    actionLabel="Réinitialiser les filtres"
                                />
                            </div>
                        )}

                        {/* Pagination - Premium Style */}
                        {filteredArtisans.length > 0 && (
                            <div className="mt-16 flex justify-center items-center gap-3">
                                <button className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all shadow-sm">1</button>
                                <button className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-navy hover:border-brand-orange transition-all shadow-sm">2</button>
                                <button className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-navy hover:border-brand-orange transition-all shadow-sm">...</button>
                                <button className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center shadow-xl hover:bg-brand-orange transition-all"><ArrowRight size={20} /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
