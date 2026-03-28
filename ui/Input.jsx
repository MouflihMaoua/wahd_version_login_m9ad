import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-sm font-bold text-[#1A3A5C]">{label}</label>}
            <input
                className={`px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/5 transition-all ${error ? 'border-red-500' : ''}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
    );
};

export default Input;
