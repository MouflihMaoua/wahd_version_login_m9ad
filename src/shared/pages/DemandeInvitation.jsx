import React, { useState, useEffect } from 'react';
import { supabase } from '../../core/services/supabaseClient';
import { useAuthStore } from '../../core/store/useAuthStore';
import toast from 'react-hot-toast';
import {
    Send, Clock, MapPin, Zap, FileText,
    CheckCircle, XCircle, Hourglass, ChevronDown,
    AlertTriangle, Flame, Minus, Calendar, User
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────── */
const URGENCE_CONFIG = {
    haute: {
        label: 'Haute',
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <Flame size={14} />,
    },
    moyenne: {
        label: 'Moyenne',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Zap size={14} />,
    },
    basse: {
        label: 'Basse',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <Minus size={14} />,
    },
};

const STATUT_CONFIG = {
    'en attente': {
        label: 'En attente',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Hourglass size={14} />,
    },
    acceptée: {
        label: 'Acceptée',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <CheckCircle size={14} />,
    },
    refusée: {
        label: 'Refusée',
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <XCircle size={14} />,
    },
};

/* ─────────────────────────────────────────────
   BADGE composant
───────────────────────────────────────────── */
const Badge = ({ config, label }) => (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}>
        {config.icon}
        {label || config.label}
    </span>
);

/* ─────────────────────────────────────────────
   FORMULAIRE D'INVITATION (côté particulier)
───────────────────────────────────────────── */
const FormulaireInvitation = ({ idArtisan, onSuccess }) => {
    const user = useAuthStore((s) => s.user);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        service: '',
        message: '',
        description: '',
        urgence: 'moyenne',
    });

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        const err = {};
        if (name === 'service' && !value.trim()) err.service = 'Le service est requis.';
        if (name === 'message' && !value.trim()) err.message = 'Le message est requis.';
        if (name === 'description' && !value.trim()) err.description = 'La description est requise.';
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const fieldErr = validateField(name, value);
        setErrors((prev) => {
            const next = { ...prev };
            if (Object.keys(fieldErr).length > 0) {
                next[name] = fieldErr[name];
            } else {
                delete next[name];
            }
            return next;
        });
    };

    const validateAll = () => {
        const newErrors = {};
        ['service', 'message', 'description'].forEach((f) => {
            Object.assign(newErrors, validateField(f, formData[f]));
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        setIsSubmitting(true);
        try {
            // Récupérer l'id_particulier depuis la table particulier
            const { data: particulierData, error: pErr } = await supabase
                .from('particulier')
                .select('id_particulier')
                .eq('id_particulier', user.id)
                .single();

            if (pErr || !particulierData) throw new Error("Profil particulier introuvable.");

            const { error: insertErr } = await supabase.from('invitations').insert({
                id_particulier: particulierData.id_particulier,
                id_artisan: idArtisan,
                service: formData.service,
                message: formData.message,
                description: formData.description,
                urgence: formData.urgence,
                statut: 'en attente',
            });

            if (insertErr) throw insertErr;

            toast.success('Invitation envoyée avec succès !');
            setFormData({ service: '', message: '', description: '', urgence: 'moyenne' });
            setIsOpen(false);
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Erreur lors de l'envoi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-lg shadow-brand-dark/10 group"
                >
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    Envoyer une invitation
                </button>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-brand-dark px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <Send size={20} />
                            <h2 className="text-lg font-bold">Nouvelle invitation</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors text-xl font-light"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Service */}
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                <Zap size={14} className="inline mr-1" />
                                Service demandé *
                            </label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.service ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none transition-all text-brand-dark font-medium cursor-pointer`}
                            >
                                <option value="">Sélectionnez un service</option>
                                <option value="Plomberie">🔧 Plomberie</option>
                                <option value="Électricité">⚡ Électricité</option>
                                <option value="Menuiserie">🔨 Menuiserie</option>
                                <option value="Peinture">🎨 Peinture</option>
                                <option value="Maçonnerie">🏗️ Maçonnerie</option>
                                <option value="Climatisation">❄️ Climatisation</option>
                                <option value="Serrurerie">🔐 Serrurerie</option>
                                <option value="Jardinage">🌿 Jardinage</option>
                                <option value="Nettoyage">🧹 Nettoyage</option>
                                <option value="Autre">📦 Autre</option>
                            </select>
                            {errors.service && <p className="mt-1 text-xs text-red-500 ml-1">{errors.service}</p>}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                <FileText size={14} className="inline mr-1" />
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Décrivez brièvement votre besoin..."
                                className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.message ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none resize-none transition-all text-brand-dark placeholder-gray-400`}
                            />
                            {errors.message && <p className="mt-1 text-xs text-red-500 ml-1">{errors.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                <FileText size={14} className="inline mr-1" />
                                Description détaillée *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Donnez plus de détails sur le travail à effectuer..."
                                className={`w-full px-4 py-3 bg-gray-50 rounded-2xl border ${errors.description ? 'border-red-400' : 'border-transparent focus:border-brand-orange'} outline-none resize-none transition-all text-brand-dark placeholder-gray-400`}
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-500 ml-1">{errors.description}</p>}
                        </div>

                        {/* Urgence */}
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">
                                <Zap size={14} className="inline mr-1" />
                                Niveau d'urgence
                            </label>
                            <div className="relative">
                                <select
                                    name="urgence"
                                    value={formData.urgence}
                                    onChange={handleChange}
                                    className="w-full appearance-none px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-orange outline-none transition-all text-brand-dark font-medium cursor-pointer"
                                >
                                    <option value="basse">🟢 Basse — Pas pressé</option>
                                    <option value="moyenne">🟡 Moyenne — Dans les prochains jours</option>
                                    <option value="haute">🔴 Haute — Urgent !</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-brand-dark text-white py-3 rounded-2xl font-bold hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-dark/10 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Envoyer
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   TABLEAU DES INVITATIONS (côté artisan)
───────────────────────────────────────────── */
const TableauInvitations = ({ invitations, loading, onUpdateStatut }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-orange rounded-full animate-spin mr-3" />
                Chargement des invitations...
            </div>
        );
    }

    if (!invitations || invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Send size={28} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-500 mb-1">Aucune invitation reçue</p>
                <p className="text-sm">Les nouvelles demandes apparaîtront ici.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="text-left px-6 py-4 font-bold">Particulier</th>
                        <th className="text-left px-6 py-4 font-bold">Service</th>
                        <th className="text-left px-6 py-4 font-bold">Message</th>
                        <th className="text-left px-6 py-4 font-bold">Urgence</th>
                        <th className="text-left px-6 py-4 font-bold">Date</th>
                        <th className="text-left px-6 py-4 font-bold">Statut</th>
                        <th className="text-left px-6 py-4 font-bold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {invitations.map((invitation) => {
                        const urgCfg = URGENCE_CONFIG[invitation.urgence] || URGENCE_CONFIG.moyenne;
                        const statCfg = STATUT_CONFIG[invitation.statut] || STATUT_CONFIG['en attente'];
                        const date = new Date(invitation.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        });

                        return (
                            <tr key={invitation.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                                {/* Particulier */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-brand-dark">
                                                {invitation.particulier?.prenom} {invitation.particulier?.nom}
                                            </p>
                                            <p className="text-xs text-gray-400">{invitation.particulier?.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Service */}
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-xs font-medium">
                                        {invitation.service}
                                    </span>
                                </td>

                                {/* Message */}
                                <td className="px-6 py-4 max-w-[220px]">
                                    <p className="text-gray-700 line-clamp-2">{invitation.message || '—'}</p>
                                </td>

                                {/* Urgence */}
                                <td className="px-6 py-4">
                                    <Badge config={urgCfg} />
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Calendar size={13} />
                                        <span>{date}</span>
                                    </div>
                                </td>

                                {/* Statut */}
                                <td className="px-6 py-4">
                                    <Badge config={statCfg} />
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    {invitation.statut === 'en attente' ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUpdateStatut(invitation.id, 'acceptée')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all"
                                            >
                                                <CheckCircle size={13} />
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() => onUpdateStatut(invitation.id, 'refusée')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                                            >
                                                <XCircle size={13} />
                                                Refuser
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Traitée</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE — usage selon le rôle
───────────────────────────────────────────── */
const DemandeInvitation = ({ idArtisan }) => {
    const user = useAuthStore((s) => s.user);
    const role = user?.role; // 'particulier' | 'artisan'

    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatut, setFilterStatut] = useState('all');

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('invitations')
                .select(`
                    *,
                    particulier (
                        id_particulier,
                        nom,
                        prenom,
                        email
                    )
                `)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (role === 'artisan') {
                // Récupérer l'id_artisan de l'artisan connecté
                const { data: artisanData } = await supabase
                    .from('artisan')
                    .select('id_artisan')
                    .eq('id_artisan', user.id)
                    .single();

                if (artisanData) {
                    query = query.eq('id_artisan', artisanData.id_artisan);
                }
            } else {
                // Côté particulier : ses propres demandes
                const { data: particulierData } = await supabase
                    .from('particulier')
                    .select('id_particulier')
                    .eq('id_particulier', user.id)
                    .single();

                if (particulierData) {
                    query = query.eq('id_particulier', particulierData.id_particulier);
                }
            }

            if (filterStatut !== 'all') {
                query = query.eq('statut', filterStatut);
            }

            const { data, error } = await query;
            if (error) throw error;
            setInvitations(data || []);
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors du chargement des invitations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, [filterStatut]);

    const handleUpdateStatut = async (idInvitation, newStatut) => {
        try {
            const { error } = await supabase
                .from('invitations')
                .update({ statut: newStatut, updated_at: new Date().toISOString() })
                .eq('id', idInvitation);

            if (error) throw error;

            toast.success(newStatut === 'acceptée' ? 'Invitation acceptée !' : 'Invitation refusée.');
            fetchInvitations();
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de la mise à jour.');
        }
    };

    // Compteurs
    const counts = {
        all: invitations.length,
        'en attente': invitations.filter((d) => d.statut === 'en attente').length,
        acceptée: invitations.filter((d) => d.statut === 'acceptée').length,
        refusée: invitations.filter((d) => d.statut === 'refusée').length,
    };

    return (
        <div className="min-h-screen bg-brand-offwhite p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-dark mb-1">
                        {role === 'artisan' ? 'Invitations reçues' : 'Mes demandes'}
                    </h1>
                    <p className="text-gray-500">
                        {role === 'artisan'
                            ? 'Gérez les demandes envoyées par les particuliers.'
                            : 'Suivez l\'état de vos invitations envoyées aux artisans.'}
                    </p>
                </div>

                {/* Formulaire d'envoi (particulier seulement) */}
                {role === 'particulier' && idArtisan && (
                    <FormulaireInvitation idArtisan={idArtisan} onSuccess={fetchInvitations} />
                )}

                {/* Stats rapides */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { key: 'all', label: 'Total', color: 'text-brand-dark', bg: 'bg-white' },
                        { key: 'en attente', label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { key: 'acceptée', label: 'Acceptées', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { key: 'refusée', label: 'Refusées', color: 'text-red-500', bg: 'bg-red-50' },
                    ].map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setFilterStatut(s.key)}
                            className={`${s.bg} rounded-2xl p-4 text-left border-2 transition-all ${filterStatut === s.key ? 'border-brand-orange shadow-md' : 'border-transparent shadow-sm hover:shadow-md'}`}
                        >
                            <p className={`text-2xl font-bold ${s.color}`}>{counts[s.key]}</p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">{s.label}</p>
                        </button>
                    ))}
                </div>

                {/* Tableau */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-brand-dark flex items-center gap-2">
                            <Send size={16} />
                            {filterStatut === 'all' ? 'Toutes les invitations' : `Invitations : ${STATUT_CONFIG[filterStatut]?.label}`}
                        </h2>
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-semibold">
                            {counts[filterStatut] || 0} résultat{counts[filterStatut] !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <TableauInvitations
                        invitations={invitations}
                        loading={loading}
                        onUpdateStatut={handleUpdateStatut}
                    />
                </div>
            </div>
        </div>
    );
};

export default DemandeInvitation;
