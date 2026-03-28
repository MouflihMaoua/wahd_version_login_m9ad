import React from 'react';
import { cn } from '../../utils/cn';

const StatusBadge = ({ status }) => {
    const configs = {
        'en attente': {
            label: 'En attente',
            styles: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
            dot: 'bg-brand-orange animate-pulse shadow-[0_0_8px_#FF6B35]'
        },
        'confirmé': {
            label: 'Confirmé',
            styles: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            dot: 'bg-emerald-500'
        },
        'refusé': {
            label: 'Refusé',
            styles: 'bg-red-50 text-red-500 border-red-100',
            dot: 'bg-red-500'
        },
        'terminé': {
            label: 'Terminé',
            styles: 'bg-blue-50 text-blue-600 border-blue-100',
            dot: 'bg-blue-500'
        },
    };

    const config = configs[status.toLowerCase()] || configs['en attente'];

    return (
        <span className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
            config.styles
        )}>
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
            {config.label}
        </span>
    );
};

export default StatusBadge;
