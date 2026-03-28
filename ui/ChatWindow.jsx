import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, Trash2, X, MoreHorizontal, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const ChatWindow = ({ contact, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Bonjour ! Est-ce que vous êtes disponible demain matin ?", role: 'me', time: '09:00', status: 'read' },
        { id: 2, text: "Bonjour, oui tout à fait. Pour quelle prestation ?", role: 'other', time: '09:05' },
        { id: 3, text: "Un dépannage plomberie pour une fuite sous l'évier.", role: 'me', time: '09:10', status: 'sent' },
    ]);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputText,
            role: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-brand-dark text-white flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img src={contact?.image || "https://i.pravatar.cc/150"} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-orange/20" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-brand-dark" />
                    </div>
                    <div>
                        <h3 className="font-bold">{contact?.name || "Artisan"}</h3>
                        <p className="text-xs text-gray-400 font-medium">En ligne</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/5"><MoreHorizontal size={20} /></button>
                    {onClose && (
                        <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/5">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50 space-y-6 no-scrollbar">
                {messages.map((msg, i) => {
                    const isMe = msg.role === 'me';
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={msg.id}
                            className={cn(
                                "flex flex-col max-w-[80%]",
                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div className={cn(
                                "p-4 rounded-[1.5rem] text-sm font-medium shadow-sm",
                                isMe
                                    ? "bg-brand-orange text-white rounded-tr-none"
                                    : "bg-white text-brand-dark rounded-tl-none border border-gray-100"
                            )}>
                                {msg.text}
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{msg.time}</span>
                                {isMe && (
                                    <CheckCheck size={14} className={cn(msg.status === 'read' ? "text-blue-500" : "text-gray-300")} />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-100 flex items-center space-x-4">
                <div className="flex space-x-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-brand-orange transition-colors"><Image size={20} /></button>
                    <button type="button" className="p-2 text-gray-400 hover:text-brand-orange transition-colors"><Smile size={20} /></button>
                </div>

                <div className="flex-grow">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="w-full bg-gray-50 border border-gray-50 rounded-2xl px-6 py-4 text-sm font-medium focus:bg-white focus:border-brand-orange outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="w-14 h-14 bg-brand-dark text-white rounded-2xl flex items-center justify-center hover:bg-brand-orange transition-all shadow-lg active:scale-95 shrink-0"
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
