import React, { useState } from 'react';
import { Bell, Check, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Réservation confirmée', message: 'Ahmed a accepté votre demande.', time: '10 min', read: false, type: 'success' },
        { id: 2, title: 'Nouveau message', message: 'Youssef vous a envoyé un message.', time: '1h', read: false, type: 'message' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gray-50 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-2xl transition-all relative flex items-center justify-center group"
            >
                <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="absolute right-0 mt-6 w-[420px] bg-white rounded-[3.5rem] shadow-premium border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-10 pb-8 flex justify-between items-end">
                                <div>
                                    <h3 className="font-heading text-2xl font-black text-brand-navy tracking-tight">Notifications</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Vous avez {unreadCount} alertes non lues</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="px-5 py-2.5 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-orange hover:text-white transition-all">
                                        Tout lire
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[480px] overflow-y-auto no-scrollbar px-6 pb-6 space-y-4">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <motion.div
                                            key={notif.id}
                                            whileHover={{ x: 5 }}
                                            className={cn(
                                                "p-6 rounded-[2.5rem] transition-all border border-transparent group",
                                                !notif.read ? "bg-gray-50 border-gray-100 shadow-sm" : "hover:bg-gray-50/50"
                                            )}
                                        >
                                            <div className="flex gap-5">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                                    notif.type === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                                )}>
                                                    {notif.type === 'success' ? <Check size={20} /> : <MessageSquare size={20} />}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-heading font-black text-brand-navy leading-tight">{notif.title}</h4>
                                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest pt-1">{notif.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{notif.message}</p>
                                                </div>
                                            </div>
                                            {!notif.read && (
                                                <div className="mt-4 flex justify-end">
                                                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-full shadow-[0_0_8px_#FF6B35]" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                                            <Bell size={32} />
                                        </div>
                                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Silence complet</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-brand-navy text-center bg-grain relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl" />
                                <button className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">
                                    Voir tout l'historique
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
