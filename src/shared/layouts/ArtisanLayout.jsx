import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Layout dédié pour les utilisateurs de type "artisan"
 * Sans navbar - navigation uniquement via la sidebar interne du Dashboard
 */
const ArtisanLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <main className="min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default ArtisanLayout;
