import React from 'react';
import ParticulierNavbar from '../../components/navbar/ParticulierNavbar';
import Footer from '../components/public/Footer';
import { Toaster } from 'react-hot-toast';

/**
 * Layout dédié pour les utilisateurs de type "particulier"
 * Utilise ParticulierNavbar et s'applique uniquement aux pages de particuliers
 */
const ParticulierLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-offwhite">
            <Toaster position="top-right" />
            <ParticulierNavbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default ParticulierLayout;
