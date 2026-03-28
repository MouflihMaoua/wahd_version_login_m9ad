import React from 'react';

const ArtisanCard = ({ name, job, rating, photo, price }) => {
    return (
        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
            <div className="relative mb-4">
                <img
                    src={photo || "https://images.unsplash.com/photo-1540560085459-7daa99738d21?q=80&w=400&h=300&auto=format&fit=crop"}
                    alt={name}
                    className="w-full h-44 rounded-[24px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xl border border-white/50">
                    <span className="text-amber-500">★</span>
                    <span className="text-[11px] font-black text-[#1A3A5C]">{rating}</span>
                </div>
            </div>
            <h4 className="font-black text-[#1A3A5C] text-lg truncate">{name}</h4>
            <p className="text-sm text-slate-500 font-bold mb-5">{job}</p>
            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-lg font-black text-[#1A3A5C]">{price || "---"}</span>
                <button
                    onClick={() => window.location.hash = '#/profile'}
                    className="bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all"
                >
                    Réserver
                </button>
            </div>
        </div>
    );
};

export default ArtisanCard;
