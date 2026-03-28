import React from 'react';
import { Search as SearchIcon, MapPin, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

const SearchBar = ({ onSearch, className }) => {
    return (
        <div className={cn(
            "bg-white p-4 rounded-3xl shadow-xl shadow-brand-dark/5 flex flex-col md:flex-row items-center gap-4 w-full",
            className
        )}>
            <div className="flex items-center flex-grow w-full px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-brand-orange focus-within:bg-white transition-all group">
                <SearchIcon size={20} className="text-gray-400 group-focus-within:text-brand-orange mr-3 transition-colors" />
                <input
                    type="text"
                    placeholder="Quel artisan cherchez-vous ? (Plombier, Électricien...)"
                    className="bg-transparent border-none outline-none w-full text-brand-dark placeholder:text-gray-400 font-medium"
                    onChange={(e) => onSearch?.({ term: e.target.value })}
                />
            </div>

            <div className="flex items-center w-full md:w-64 px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-brand-orange focus-within:bg-white transition-all group">
                <MapPin size={20} className="text-gray-400 group-focus-within:text-brand-orange mr-3 transition-colors" />
                <select
                    className="bg-transparent border-none outline-none w-full text-brand-dark font-medium appearance-none cursor-pointer"
                    onChange={(e) => onSearch?.({ city: e.target.value })}
                >
                    <option value="">Toutes les villes</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Fès">Fès</option>
                </select>
            </div>

            <button className="w-full md:w-auto px-8 py-4 bg-brand-orange text-white rounded-2xl font-bold shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/90 active:scale-95 transition-all">
                Rechercher
            </button>

            <button className="hidden md:flex items-center justify-center p-4 bg-brand-dark text-white rounded-2xl hover:bg-brand-dark/90 transition-all">
                <SlidersHorizontal size={20} />
            </button>
        </div>
    );
};

export default SearchBar;
