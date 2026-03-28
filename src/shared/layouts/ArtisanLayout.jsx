import React from 'react';
import ArtisanNavbar from '../../components/navbar/ArtisanNavbar';
import Footer from '../components/public/Footer';
import { Toaster } from 'react-hot-toast';

/**
 * Layout dédié pour les utilisateurs de type "artisan"
 * Utilise ArtisanNavbar et s'applique uniquement aux pages d'artisans
 */
const ArtisanLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-offwhite">
            <Toaster position="top-right" />
            <ArtisanNavbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default ArtisanLayout;
