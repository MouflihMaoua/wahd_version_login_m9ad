import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import { MapPin, ShieldCheck, Mail, Phone, Calendar, Clock, MessageSquare, Heart, Share2, ArrowLeft, Star } from 'lucide-react';

import { Link } from 'react-router-dom';

import { cn } from '../core/utils/cn';

import ReservationModal from '../artisan/components/ReservationModal';

import StarRating from '../components/ui/StarRating';



const ArtisanProfile = () => {

    const { id } = useParams();

    const [activeTab, setActiveTab] = useState('services');

    const [isModalOpen, setIsModalOpen] = useState(false);



    // Simulation données

    const artisan = {

        id: id || '1',

        name: 'Ahmed Mansouri',

        job: 'Plombier Expert',

        city: 'Casablanca (Maarif)',

        rating: 4.9,

        reviewCount: 124,

        verified: true,

        bio: "Avec plus de 15 ans d'expérience dans la plomberie sanitaire et industrielle, je vous assure un travail soigné, rapide et durable. Spécialisé dans la détection de fuites et l'installation de systèmes complexes.",

        image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800',

        experience: '15 ans',

        completedJobs: 850,

        services: [

            { name: 'Réparation de fuite', price: 'À partir de 150 DH', icon: '💧' },

            { name: 'Installation Sanitaire', price: 'À partir de 500 DH', icon: '🚿' },

            { name: 'Débouchage Canalisation', price: 'À partir de 200 DH', icon: '🪠' },

            { name: 'Installation Chauffe-eau', price: 'Sur devis', icon: '🔥' },

        ],

        reviews: [

            { id: 1, user: 'Yasmine B.', rating: 5, date: 'Il y a 2 jours', comment: 'Travail très propre et ponctuel. Je recommande vivement Ahmed !' },

            { id: 2, user: 'Omar T.', rating: 4, date: 'Il y a 1 semaine', comment: 'Professionnel dévoué, a trouvé la fuite rapidement.' },

        ],

        gallery: [

            'https://images.unsplash.com/photo-1581244276891-83393a8ba21d?auto=format&fit=crop&q=80&w=400',

            'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',

            'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400',

        ]

    };



    return (

        <div className="min-h-screen bg-brand-offwhite pb-24 pt-32 font-sans selection:bg-brand-orange selection:text-white">

            <div className="container mx-auto px-6 max-w-7xl">

                <Link to="/recherche" className="inline-flex items-center text-gray-500 hover:text-brand-orange mb-10 font-black uppercase tracking-widest text-[10px] transition-all hover:translate-x-[-4px]">

                    <ArrowLeft size={16} className="mr-2" /> Retour aux résultats

                </Link>



                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">



                    {/* Colonne Gauche - Infos & Contenu */}

                    <div className="lg:col-span-8 space-y-12">

                        {/* Header Profil - Premium Style */}

                        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-premium overflow-hidden relative group bg-grain">

                            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>



                            <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">

                                <div className="relative shrink-0">

                                    <div className="w-52 h-52 rounded-[3.5rem] p-1.5 bg-gradient-to-tr from-brand-orange to-orange-300">

                                        <img src={artisan.image} alt={artisan.name} className="w-full h-full rounded-[3rem] object-cover border-4 border-white shadow-2xl" />

                                    </div>

                                    {artisan.verified && (

                                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-xl">

                                            <ShieldCheck size={24} />

                                        </div>

                                    )}

                                </div>



                                <div className="flex-grow pt-4">

                                    <div className="flex justify-between items-start mb-6">

                                        <div>

                                            <h1 className="text-4xl md:text-5xl font-black font-heading text-brand-navy tracking-tighter mb-2">{artisan.name}</h1>

                                            <div className="flex items-center gap-3">

                                                <span className="px-5 py-2 bg-brand-orange/10 text-brand-orange text-xs font-black uppercase tracking-widest rounded-full">{artisan.job}</span>

                                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">

                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" /> Disponible

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex space-x-3">

                                            <button className="p-4 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm">

                                                <Heart size={20} />

                                            </button>

                                            <button className="p-4 bg-gray-50 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-2xl transition-all shadow-sm">

                                                <Share2 size={20} />

                                            </button>

                                        </div>

                                    </div>



                                    <div className="flex flex-wrap gap-8 mb-10">

                                        <div className="flex items-center text-sm font-bold text-gray-500">

                                            <MapPin size={20} className="mr-3 text-brand-orange" /> {artisan.city}

                                        </div>

                                        <div className="flex items-center">

                                            <div className="bg-yellow-400/10 p-1 rounded-lg mr-3">

                                                <Star size={18} className="text-yellow-500 fill-yellow-500" />

                                            </div>

                                            <span className="font-black text-brand-navy text-lg leading-none mr-2">{artisan.rating}</span>

                                            <span className="text-xs font-bold text-gray-400">({artisan.reviewCount} avis authentifiés)</span>

                                        </div>

                                    </div>



                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                        <div className="bg-gray-50/50 p-6 rounded-3xl text-center border border-gray-100 hover:border-brand-orange/20 transition-colors group">

                                            <p className="text-3xl font-black font-heading text-brand-navy group-hover:text-brand-orange transition-colors">{artisan.completedJobs}+</p>

                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Travaux</p>

                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-3xl text-center border border-gray-100 hover:border-emerald-500/20 transition-colors group">

                                            <p className="text-3xl font-black font-heading text-emerald-500 transition-colors">98%</p>

                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Succès</p>

                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-3xl text-center col-span-2 border border-brand-navy/5 flex items-center justify-center gap-4 group">

                                            <Clock size={24} className="text-brand-orange" />

                                            <div className="text-left">

                                                <p className="text-lg font-black text-brand-navy leading-none mb-1">Disponible</p>

                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Aujourd'hui, 09:00 - 18:00</p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div className="mt-12 pt-12 border-t border-gray-100/80">

                                <h3 className="text-2xl font-black font-heading mb-6 text-brand-navy">Présentation</h3>

                                <p className="text-gray-500 leading-relaxed text-lg font-medium max-w-3xl">{artisan.bio}</p>

                            </div>

                        </div>



                        {/* Tabs Navigation - Premium Glassmorphism */}

                        <div className="flex space-x-2 bg-white/70 p-2.5 rounded-[2.5rem] backdrop-blur-xl border border-white shadow-premium max-w-md mx-auto sticky top-36 z-30">

                            {['services', 'avis', 'portfolio'].map(tab => (

                                <button

                                    key={tab}

                                    onClick={() => setActiveTab(tab)}

                                    className={cn(

                                        "flex-grow py-4 px-8 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all duration-500",

                                        activeTab === tab

                                            ? 'bg-brand-navy text-white shadow-xl shadow-brand-navy/20'

                                            : 'text-gray-400 hover:bg-gray-50 hover:text-brand-navy'

                                    )}

                                >

                                    {tab}

                                </button>

                            ))}

                        </div>



                        {/* Tabs Content */}

                        <div className="space-y-8">

                            {activeTab === 'services' && (

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {artisan.services.map((service, i) => (

                                        <motion.div

                                            key={i}

                                            whileHover={{ y: -5 }}

                                            className="bg-white p-8 rounded-[3rem] border border-gray-100 flex items-center shadow-premium group hover:border-brand-orange/20 transition-all"

                                        >

                                            <div className="w-20 h-20 bg-gray-50 group-hover:bg-brand-orange/10 rounded-[2rem] flex items-center justify-center text-3xl mr-6 transition-colors">

                                                {service.icon}

                                            </div>

                                            <div>

                                                <h4 className="font-black font-heading text-xl text-brand-navy mb-1">{service.name}</h4>

                                                <p className="text-brand-orange font-black uppercase tracking-widest text-[10px]">{service.price}</p>

                                            </div>

                                        </motion.div>

                                    ))}

                                </div>

                            )}



                            {activeTab === 'avis' && (

                                <div className="space-y-8">

                                    {artisan.reviews.map(review => (

                                        <div key={review.id} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-premium relative">

                                            <div className="absolute top-8 right-12 flex gap-0.5">

                                                {[...Array(5)].map((_, i) => (

                                                    <Star key={i} size={14} className={cn("fill-current", i < review.rating ? "text-yellow-400" : "text-gray-100")} />

                                                ))}

                                            </div>

                                            <div className="flex justify-between items-center mb-8">

                                                <div className="flex items-center gap-6">

                                                    <div className="w-16 h-16 bg-brand-navy rounded-3xl flex items-center justify-center font-black text-white text-xl font-heading shadow-lg shadow-brand-navy/20">

                                                        {review.user[0]}

                                                    </div>

                                                    <div>

                                                        <h4 className="font-black font-heading text-xl text-brand-navy">{review.user}</h4>

                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.date}</p>

                                                    </div>

                                                </div>

                                            </div>

                                            <p className="text-gray-500 leading-relaxed text-lg font-medium italic">"{review.comment}"</p>

                                        </div>

                                    ))}

                                </div>

                            )}



                            {activeTab === 'portfolio' && (

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

                                    {artisan.gallery.map((img, i) => (

                                        <div key={i} className="group relative overflow-hidden rounded-[3rem] aspect-square shadow-premium">

                                            <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Travail réalisé" />

                                            <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                                                <Share2 size={32} className="text-white" />

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>



                    {/* Colonne Droite - Action Card - Premium Navy */}

                    <div className="lg:col-span-4">

                        <div className="sticky top-36 space-y-10">

                            <div className="bg-brand-navy text-white rounded-[4rem] p-12 md:p-14 shadow-premium relative overflow-hidden bg-grain">

                                <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[80px]" />



                                <h3 className="text-3xl font-black font-heading mb-8 relative z-10 tracking-tight leading-tight uppercase italic opacity-20">Réservation</h3>

                                <h4 className="text-2xl font-black font-heading mb-4 relative z-10 leading-tight">Envie de concrétiser votre projet ?</h4>

                                <p className="text-white/40 text-sm mb-12 leading-relaxed relative z-10 font-bold uppercase tracking-widest italic">

                                    Intervention rapide & Devis gratuit

                                </p>



                                <button

                                    onClick={() => setIsModalOpen(true)}

                                    className="w-full bg-brand-orange text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-brand-orange transition-all duration-500 shadow-2xl relative z-10 active:scale-95 leading-none"

                                >

                                    Faire une demande

                                </button>



                                <div className="mt-12 flex items-center justify-between relative z-10">

                                    <div className="text-center group">

                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2 group-hover:text-brand-orange transition-colors">Réponse</p>

                                        <p className="font-black font-heading text-xl">~2h</p>

                                    </div>

                                    <div className="w-px h-10 bg-white/10" />

                                    <div className="text-center group">

                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2 group-hover:text-brand-orange transition-colors">Devis</p>

                                        <p className="font-black font-heading text-xl">Gratuit</p>

                                    </div>

                                </div>

                            </div>



                            {/* Quick Actions - Premium White Glass */}

                            <div className="grid grid-cols-2 gap-6 px-4">

                                <button

                                    className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-premium hover:border-brand-orange/20 transition-all group"

                                >

                                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">

                                        <MessageSquare size={24} className="text-brand-orange group-hover:rotate-12 transition-all" />

                                    </div>

                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy opacity-60">Message</span>

                                </button>

                                <button

                                    className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-premium hover:border-blue-500/20 transition-all group"

                                >

                                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">

                                        <Phone size={24} className="text-blue-500 group-hover:-rotate-12 transition-all" />

                                    </div>

                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy opacity-60">Appeler</span>

                                </button>

                            </div>

                        </div>

                    </div>



                </div>

            </div>



            <ReservationModal

                isOpen={isModalOpen}

                onClose={() => setIsModalOpen(false)}

                artisan={artisan}

            />

        </div>

    );

};



export default ArtisanProfile;

