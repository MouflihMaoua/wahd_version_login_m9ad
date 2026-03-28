import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

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
                    error.email = "L'email est requis";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error.email = "L'email n'est pas valide";
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
            console.log('🔐 Tentative de connexion avec:', formData.email);

            // Connexion avec Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                console.error('❌ Erreur de connexion Supabase:', error);
                throw error;
            }

            if (!data.user) {
                throw new Error('Utilisateur non trouvé');
            }

            console.log('✅ Connexion réussie:', data.user);

            // Récupérer le rôle de l'utilisateur depuis les métadonnées
            const userRole = data.user.user_metadata?.role || 'particulier';
            
            // Créer l'objet utilisateur pour le store
            const mockUser = { 
                id: data.user.id, 
                email: data.user.email, 
                role: userRole,
                name: data.user.user_metadata?.nom || 'Utilisateur'
            };

            const mockToken = data.session.access_token;

            setAuth(mockUser, mockToken);
            toast.success('Bienvenue ! Connexion réussie.');

            // Redirection selon le rôle
            const redirectPath = userRole === 'admin' ? '/dashboard/admin' :
                userRole === 'artisan' ? '/dashboard/artisan' :
                    '/dashboard/particulier';

            console.log('🚀 Redirection vers:', redirectPath);
            navigate(redirectPath);

        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            
            let errorMessage = 'Identifiants incorrects';
            
            if (error.message?.includes('Invalid login credentials')) {
                errorMessage = 'Email ou mot de passe incorrect';
            } else if (error.message?.includes('Email not confirmed')) {
                errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);

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

    // Fonction de connexion avec Google
    const signInWithGoogle = async () => {
        try {
            console.log('🚀 Début connexion Google OAuth...');
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                console.error('❌ Erreur Google OAuth:', error);
                
                // Message d'erreur plus spécifique
                let errorMessage = 'Erreur lors de la connexion avec Google';
                if (error.message?.includes('provider is not enabled')) {
                    errorMessage = 'Google OAuth non configuré. Contactez l\'administrateur.';
                } else if (error.message?.includes('popup')) {
                    errorMessage = 'Popup bloqué. Autorisez les popups pour ce site.';
                } else if (error.message) {
                    errorMessage = `Erreur Google: ${error.message}`;
                }
                
                toast.error(errorMessage);
                return;
            }

            console.log('✅ Redirection vers Google OAuth réussie');
            toast.info('Redirection vers Google...');
            
        } catch (error) {
            console.error('❌ Exception Google OAuth:', error);
            toast.error('Erreur inattendue lors de la connexion Google');
        }
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
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <img src="/assets/logo_app.png" alt="7rayfi_logo" className="w-16 h-16 object-contain" />
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

                        <button type="button" onClick={signInWithGoogle} className="w-full bg-white border border-gray-100 text-brand-dark py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
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
