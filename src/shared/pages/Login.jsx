import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import { supabase } from '../../core/services/supabaseClient';
import { authenticateWithSupabase, determineUserRole } from '../../core/utils/authUtils';
import toast from 'react-hot-toast';
import logoApp from '../../assets/logo_app.png';

const Login = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    // États pour gérer les valeurs du formulaire et les erreurs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fonctions de validation pour chaque champ
    const validateField = (name, value) => {
        const error = {};

        switch (name) {
            case 'email':
                if (!value || value.trim().length === 0) {
                    error.email = 'L\'email est requis';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error.email = 'L\'email n\'est pas valide';
                }
                break;

            case 'password':
                if (!value || value.trim().length === 0) {
                    error.password = 'Le mot de passe est requis';
                } else if (value.length < 8) {
                    error.password = 'Le mot de passe doit contenir au moins 8 caractères';
                }
                break;

            default:
                break;
        }

        return error;
    };

    // Validation de tout le formulaire
    const validateForm = () => {
        const newErrors = {};

        // Valider chaque champ
        Object.keys(formData).forEach(field => {
            const fieldError = validateField(field, formData[field]);
            if (Object.keys(fieldError).length > 0) {
                Object.assign(newErrors, fieldError);
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Gestionnaire de changement pour les inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Mettre à jour les données du formulaire
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Valider le champ en temps réel
        const fieldError = validateField(name, value);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (Object.keys(fieldError).length > 0) {
                newErrors[name] = fieldError[name];
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    // Gestionnaire de soumission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Valider le formulaire
        const isValid = validateForm();
        
        if (!isValid) {
            return;
        }

        // Si le formulaire est valide, procéder à la soumission
        setIsSubmitting(true);
        
        try {
            const authData = await authenticateWithSupabase(formData.email, formData.password, supabase);
            const session = authData.session;
            const sbUser = authData.user;

            let role = null;
            if (sbUser.email?.toLowerCase().includes('admin')) {
                role = 'admin';
            } else {
                const resolved = await determineUserRole(sbUser.id, supabase);
                role = resolved.role;
            }

            if (!role) {
                await supabase.auth.signOut();
                toast.error("Aucun profil artisan ou particulier lié à ce compte. Inscrivez-vous d'abord.");
                return;
            }

            const appUser = {
                id: sbUser.id,
                email: sbUser.email ?? formData.email,
                name: sbUser.user_metadata?.username ?? sbUser.email ?? 'Utilisateur',
                role
            };

            setAuth(appUser, session?.access_token ?? null);
            toast.success('Bienvenue ! Connexion réussie.');

            const redirectPath = role === 'admin' ? '/admin' :
                role === 'artisan' ? '/dashboard/artisan' :
                    '/recherche-artisan';

            navigate(redirectPath);

        } catch (error) {
            toast.error(error.message || 'Identifiants incorrects');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour vérifier si un champ a une erreur
    const hasError = (fieldName) => {
        return errors[fieldName] && errors[fieldName].length > 0;
    };

    // Fonction pour obtenir la classe CSS en fonction de l'erreur
    const getFieldClassName = (fieldName) => {
        if (hasError(fieldName)) {
            return 'border-red-500';
        }
        return 'border-gray-100';
    };

    return (
        <div className="min-h-screen flex bg-brand-offwhite">

            {/* Côté gauche - Décoratif */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative items-center justify-center p-20 overflow-hidden">

                <div className="absolute top-0 right-0 w-full h-full opacity-20">

                    <div className="absolute top-10 right-10 w-64 h-64 bg-brand-orange rounded-full blur-[120px]"></div>

                    <div className="absolute bottom-40 left-20 w-80 h-80 bg-brand-orange rounded-full blur-[150px]"></div>

                </div>

                <div className="relative z-10 text-white max-w-lg">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <img src={logoApp} alt="7rayfi_logo" className="w-16 h-16 object-contain" />
                    </Link>

                    <h2 className="text-5xl font-bold leading-tight mb-8">
                        Accédez à votre espace professionnel.
                    </h2>

                    <p className="text-xl text-gray-400 mb-12">
                        Gérez vos réservations, communiquez avec vos clients et développez votre activité en toute simplicité.
                    </p>

                    <div className="grid grid-cols-2 gap-8">

                        <div>
                            <p className="text-3xl font-bold text-brand-orange">10k+</p>
                            <p className="text-gray-500">Utilisateurs actifs</p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-brand-orange">4.9</p>
                            <p className="text-gray-500">Note moyenne</p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Côté droit - Formulaire */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

                <div className="max-w-md w-full">

                    <div className="mb-12 text-center lg:text-left">

                        <h1 className="text-4xl font-bold text-brand-dark mb-4">Connexion</h1>

                        <p className="text-gray-500">Heureux de vous revoir ! Veuillez entrer vos identifiants.</p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Adresse Email</label>
                            <div className={`flex items-center px-4 py-4 bg-white rounded-2xl border ${getFieldClassName('email')} shadow-sm focus-within:border-brand-orange transition-all`}>
                                <Mail size={20} className="text-gray-400 mr-3" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemple@mail.com"
                                    className="bg-transparent border-none outline-none w-full text-brand-dark"
                                />
                            </div>
                            {hasError('email') && <p className="mt-1 text-xs text-red-500 ml-2">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-brand-dark">Mot de passe</label>
                            </div>
                            <div className={`flex items-center px-4 py-4 bg-white rounded-2xl border ${getFieldClassName('password')} shadow-sm focus-within:border-brand-orange transition-all`}>
                                <Lock size={20} className="text-gray-400 mr-3" />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="bg-transparent border-none outline-none w-full text-brand-dark"
                                />
                            </div>
                            {hasError('password') && <p className="mt-1 text-xs text-red-500 ml-2">{errors.password}</p>}
                           <Link to="/mot-de-passe-oublie" className="text-sm font-semibold text-brand-orange hover:underline">Mot de passe oublié ?</Link>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold hover:bg-brand-orange transition-all flex items-center justify-center group shadow-xl shadow-brand-dark/10"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="px-4 text-xs text-gray-400 font-bold uppercase tracking-widest">OU</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <button type="button" className="w-full bg-white border border-gray-100 text-brand-dark py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="Google" />
                            Continuer avec Google
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500">
                        Pas encore de compte ?{' '}
                        <Link to="/inscription" className="text-brand-orange font-bold hover:underline">Créer un compte</Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;