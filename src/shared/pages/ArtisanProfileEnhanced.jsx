import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../core/services/supabaseClient';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';
import {
    Star, MapPin, Phone, Mail, Calendar, Award,
    Send, Heart, Share2, MessageCircle, CheckCircle,
    XCircle, Clock, Zap, FileText, User, Camera,
    ChevronLeft, Shield, Tools, Clock3
} from 'lucide-react';

const ArtisanProfile = () => {
    const { idArtisan } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const role = user?.role;

    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showInvitationForm, setShowInvitationForm] = useState(false);

    useEffect(() => {
        fetchArtisanProfile();
    }, [idArtisan]);

    const fetchArtisanProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('artisan')
                .select(`
                    *,
                    artisan_services (
                        service_nom,
                        description
                    )
                `)
                .eq('id_artisan', idArtisan)
                .single();

            if (error) throw error;
            setArtisan(data);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvitation = () => {
        if (!user) {
            toast.error('Veuillez vous connecter pour envoyer une invitation');
            navigate('/connexion');
            return;
        }

        if (role !== 'particulier') {
            toast.error('Seuls les particuliers peuvent envoyer des invitations');
            return;
        }

        setShowInvitationForm(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Artisan non trouvé</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-brand-orange hover:text-brand-dark transition-colors"
                    >
                        ← Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-offwhite">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-brand-dark transition-colors"
                        >
                            <ChevronLeft size={20} />
                            Retour
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Heart size={20} className="text-gray-600" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Share2 size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-brand-dark to-brand-orange text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Photo */}
                        <div className="relative">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                {artisan.photo_url ? (
                                    <img
                                        src={artisan.photo_url}
                                        alt={artisan.nom}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-white/80" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                                <CheckCircle size={20} className="text-white" />
                            </div>
                        </div>

                        {/* Infos */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                {artisan.prenom} {artisan.nom}
                            </h1>
                            <p className="text-xl text-white/90 mb-4">{artisan.specialite}</p>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    <span>{artisan.ville}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400" />
                                    <span>4.8 (42 avis)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield size={16} />
                                    <span>Vérifié</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSendInvitation}
                                className="flex items-center justify-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-2xl font-bold hover:bg-brand-offwhite transition-all shadow-lg"
                            >
                                <Send size={18} />
                                Envoyer une invitation
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/30 transition-all border border-white/30">
                                <MessageCircle size={18} />
                                Contacter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulaire d'invitation */}
            {showInvitationForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                                <Send size={20} />
                                Envoyer une invitation à {artisan.prenom}
                            </h3>
                            <button
                                onClick={() => setShowInvitationForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <InvitationForm
                            idArtisan={idArtisan}
                            onSuccess={() => {
                                setShowInvitationForm(false);
                                toast.success('Invitation envoyée avec succès !');
                            }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                À propos
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {artisan.description || 'Artisan professionnel avec plusieurs années d\'expérience dans le domaine de la ' + artisan.specialite.toLowerCase() + '. Je m\'engage à fournir un travail de qualité avec des matériaux durables et un service impeccable.'}
                            </p>
                        </div>

                        {/* Services */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                                <Tools size={20} />
                                Services proposés
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {artisan.artisan_services?.map((service, index) => (
                                    <div key={index} className="p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/20">
                                        <h4 className="font-semibold text-brand-dark mb-2">{service.service_nom}</h4>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                    </div>
                                )) || (
                                    <div className="col-span-2 text-center text-gray-500 py-8">
                                        Services non disponibles
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Disponibilité */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                                <Clock3 size={20} />
                                Disponibilité
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                                    <div key={day} className="text-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                                            index < 5 ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-4">Disponible du lundi au vendredi, 9h-18h</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Carte de contact */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h4 className="font-bold text-brand-dark mb-4">Coordonnées</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={18} className="text-brand-orange" />
                                    <span>{artisan.telephone || 'Non disponible'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail size={18} className="text-brand-orange" />
                                    <span>{artisan.email || 'Non disponible'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin size={18} className="text-brand-orange" />
                                    <span>{artisan.ville}, {artisan.code_postal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h4 className="font-bold text-brand-dark mb-4">Statistiques</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Projets complétés</span>
                                    <span className="font-bold text-brand-dark">127</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Taux de réponse</span>
                                    <span className="font-bold text-brand-dark">98%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Membre depuis</span>
                                    <span className="font-bold text-brand-dark">2023</span>
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                                <Award size={18} />
                                Certifications
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Artisan certifié</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Assurance professionnelle</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Garantie travaux</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant de formulaire d'invitation simplifié
const InvitationForm = ({ idArtisan, onSuccess }) => {
    const [formData, setFormData] = useState({
        service: '',
        message: '',
        description: '',
        urgence: 'moyenne'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.service.trim()) newErrors.service = 'Le service est requis';
        if (!formData.message.trim()) newErrors.message = 'Le message est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('artisan-connect-auth'));
            if (!user?.state?.user) throw new Error('Utilisateur non connecté');

            const { error } = await supabase.from('invitations').insert({
                id_particulier: user.state.user.id,
                id_artisan: idArtisan,
                service: formData.service,
                message: formData.message,
                description: formData.description,
                urgence: formData.urgence,
                statut: 'en attente'
            });

            if (error) throw error;
            onSuccess();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de l\'envoi de l\'invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                    Service demandé *
                </label>
                <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.service ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none transition-all`}
                >
                    <option value="">Sélectionnez un service</option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Menuiserie">Menuiserie</option>
                    <option value="Peinture">Peinture</option>
                    <option value="Maçonnerie">Maçonnerie</option>
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                    Message *
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Décrivez brièvement votre besoin..."
                    className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.message ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none resize-none transition-all`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                    Description détaillée *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Donnez plus de détails sur le travail à effectuer..."
                    className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.description ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none resize-none transition-all`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                    Niveau d'urgence
                </label>
                <select
                    name="urgence"
                    value={formData.urgence}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-orange outline-none transition-all"
                >
                    <option value="basse">🟢 Basse — Pas pressé</option>
                    <option value="moyenne">🟡 Moyenne — Dans les prochains jours</option>
                    <option value="haute">🔴 Haute — Urgent !</option>
                </select>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-dark text-white py-3 rounded-2xl font-bold hover:bg-brand-orange transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={16} />
                            Envoyer l'invitation
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ArtisanProfile;
