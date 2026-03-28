/**
 * StatCard - Carte de statistique
 * Icône colorée, label, valeur, tendance
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, CheckCircle, Wallet, TrendingUp } from 'lucide-react';

const iconMap = { Calendar, Heart, CheckCircle, Wallet };
const colorMap = {
    orange: { bg: 'bg-[#F97316]/10', text: 'text-[#F97316]', icon: Calendar },
    green: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', icon: Heart },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: CheckCircle },
    yellow: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', icon: Wallet },
};

const StatCard = ({ icon, label, value, trend, color }) => {
    const config = colorMap[color] || colorMap.orange;
    const Icon = iconMap[icon] || config.icon;

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.text} flex items-center justify-center`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span
                        className={`text-xs font-bold flex items-center gap-0.5 ${
                            trend.positive ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                    >
                        {trend.value.includes('+') && <TrendingUp size={14} />}
                        {trend.value}
                    </span>
                )}
            </div>
            <p className="text-[#64748B] font-medium text-sm mt-4">{label}</p>
            <p className="text-[#1C1917] text-2xl lg:text-3xl font-bold mt-1">{value}</p>
        </motion.div>
    );
};

export default StatCard;
