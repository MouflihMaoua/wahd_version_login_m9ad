import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, LogOut, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils/cn';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, logout, role } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gérer l'ancrage au chargement de la page
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    const navLinks = [
        { name: 'Trouver un artisan', href: '/recherche-artisan' },
        { name: 'Comment ça marche', href: '/#how-it-works' },
    ];

    const handleNavClick = (href) => {
        console.log('Navigation vers:', href);
        if (href.startsWith('#')) {
            // Si on est sur la page d'accueil
            if (location.pathname === '/') {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Si on est sur une autre page, on va à la page d'accueil avec l'ancre
                window.location.href = '/' + href;
            }
        } else {
            window.location.href = href;
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const getDashboardLink = () => {
        switch (role) {
            case 'admin': return '/admin';
            case 'artisan': return '/dashboard/artisan';
            default: return '/dashboard/artisan';
        }
    };

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500",
            isScrolled ? "bg-white/80 backdrop-blur-xl shadow-premium py-3" : "bg-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/assets/logo_app.png" alt="7rayfi_logo" className="w-16 h-16 object-contain" />
                        <span className="text-xl font-bold text-gray-900">7rayfi</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(link.href);
                                }}
                                className={cn(
                                    "font-bold text-sm uppercase tracking-widest transition-all hover:text-brand-orange cursor-pointer",
                                    isScrolled || location.pathname !== '/' ? "text-brand-navy/70" : "text-white/80"
                                )}
                            >
                                {link.name}
                            </a>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <Link
                                    to={getDashboardLink()}
                                    className="flex items-center space-x-2 bg-brand-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-lg active:scale-95"
                                >
                                    <User size={18} />
                                    <span>Mon Compte</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={cn(
                                        "p-2 transition-colors hover:text-red-500",
                                        isScrolled || location.pathname !== '/' ? "text-brand-navy/70" : "text-white/70"
                                    )}
                                >
                                    <LogOut size={22} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-5">
                                <Link
                                    to="/connexion"
                                    className={cn(
                                        "font-bold text-sm uppercase tracking-widest hover:text-brand-orange transition-colors",
                                        isScrolled || location.pathname !== '/' ? "text-brand-navy" : "text-white"
                                    )}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/inscription"
                                    className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 hover:-translate-y-1 transition-all active:scale-95"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "p-2 transition-colors",
                                isScrolled || location.pathname !== '/' ? "text-brand-navy" : "text-white"
                            )}
                        >
                            {isOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute top-full left-0 w-full bg-white transition-all duration-500 overflow-hidden shadow-2xl-soft",
                isOpen ? "max-h-[500px] opacity-100 border-t border-gray-50" : "max-h-0 opacity-0"
            )}>
                <div className="px-6 pt-4 pb-10 space-y-2 bg-grain relative">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(link.href);
                                setIsOpen(false);
                            }}
                            className="block px-4 py-5 text-lg font-bold text-brand-navy hover:bg-brand-orange/5 hover:text-brand-orange rounded-2xl transition-all cursor-pointer"
                        >
                            {link.name}
                        </a>
                    ))}
                    {!isAuthenticated ? (
                        <div className="pt-6 grid grid-cols-1 gap-4">
                            <Link
                                to="/inscription"
                                className="flex items-center justify-center px-4 py-5 bg-brand-orange text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-orange/20"
                                onClick={() => setIsOpen(false)}
                            >
                                S'inscrire gratuitement
                            </Link>
                            <Link
                                to="/connexion"
                                className="flex items-center justify-center px-4 py-5 border-2 border-brand-navy/10 text-brand-navy rounded-2xl font-bold text-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Connexion
                            </Link>
                        </div>
                    ) : (
                        <div className="pt-6 space-y-4">
                            <Link
                                to={getDashboardLink()}
                                className="flex items-center justify-center gap-3 w-full px-4 py-5 bg-brand-navy text-white rounded-2xl font-bold text-lg shadow-xl"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={20} />
                                Tableau de bord
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-full px-4 py-5 text-red-500 font-bold text-lg"
                            >
                                <LogOut size={20} className="mr-3" />
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
