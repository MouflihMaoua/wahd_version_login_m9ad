import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95';
    const variants = {
        primary: 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20 hover:shadow-[#FF6B35]/40 hover:-translate-y-0.5',
        secondary: 'bg-[#1A3A5C] text-white shadow-lg shadow-[#1A3A5C]/20 hover:shadow-[#1A3A5C]/40 hover:-translate-y-0.5',
        outline: 'border-2 border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white',
        ghost: 'text-[#1A3A5C] hover:bg-slate-100',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
