import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ placeholder = "Rechercher un artisan...", onSearch, onLocationChange, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, location);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 bg-white rounded-lg shadow-md p-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ville"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (onLocationChange) onLocationChange(e.target.value);
            }}
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent md:w-40"
          />
        </div>
        
        <button
          type="button"
          onClick={onFilter}
          className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          type="submit"
          className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
