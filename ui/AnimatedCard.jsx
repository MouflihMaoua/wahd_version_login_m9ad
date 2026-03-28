import React from 'react';

const AnimatedCard = ({ children, className = '', delay = 0 }) => {
    return (
        <div
            className={`bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-slide-up ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default AnimatedCard;
