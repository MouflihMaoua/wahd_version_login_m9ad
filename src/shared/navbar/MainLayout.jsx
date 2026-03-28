import React from 'react';
import Footer from '../components/public/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-offwhite">
            <Toaster position="top-right" />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
