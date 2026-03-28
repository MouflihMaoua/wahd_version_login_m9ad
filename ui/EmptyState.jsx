import React from 'react';
import { Ghost } from 'lucide-react';
import { cn } from '../../utils/cn';

const EmptyState = ({
    title = "Aucun résultat trouvé",
    description = "Nous n'avons rien trouvé correspondant à votre recherche.",
    icon: Icon = Ghost,
    className,
    actionLabel,
    onAction
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100",
            className
        )}>
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-gray-200">
                <Icon size={48} />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark mb-4">{title}</h3>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>

            {actionLabel && (
                <button
                    onClick={onAction}
                    className="mt-10 px-8 py-3 bg-brand-orange text-white rounded-2xl font-bold hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/10"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
