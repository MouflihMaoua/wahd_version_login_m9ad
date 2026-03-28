import React from 'react';
import Footer from '../components/public/Footer';
import { Toaster } from 'react-hot-toast';

/**
 * Layout pour les pages publiques (non connectés)
 * Utilise les children passés directement depuis App.jsx
 */
const PublicLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-offwhite">
            <Toaster position="top-right" />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
