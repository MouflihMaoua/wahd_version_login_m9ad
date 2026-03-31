import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Eye,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import logoApp from '../../assets/logo_app.png';
import { supabase } from '../../core/services/supabaseClient';

const VILLES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
];

const METIERS = [
  'Plombier',
  'Peintre',
  'Électricienne',
  'Ménage',
  'Technicien Climatisation Certifié',
];

const SEXES = ['Homme', 'Femme'];

const RegisterGoogle = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cinRectoFile, setCinRectoFile] = useState(null);
  const [cinVersoFile, setCinVersoFile] = useState(null);
  const [aExperience, setAExperience] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingGoogleSession, setCheckingGoogleSession] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewType, setPreviewType] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sexe: '',
    ville: '',
    codePostal: '',
    description: '',
    metier: '',
    anneesExperience: '',
    cin: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadGoogleUser = async () => {
      try {
        console.log('🔍 Vérification de la session Google...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        console.log('📊 Session data:', sessionData);
        console.log('❌ Session error:', sessionError);

        if (sessionError) {
          console.error('Erreur session:', sessionError);
          toast.error(`Erreur de session: ${sessionError.message}`);
          navigate('/connexion');
          return;
        }

        if (!sessionData?.session) {
          console.error('Aucune session trouvée');
          toast.error('Aucune session Google trouvée. Veuillez vous connecter avec Google d\'abord.');
          navigate('/connexion');
          return;
        }

        const user = sessionData.session.user;
        const provider =
          user.app_metadata?.provider ||
          user.app_metadata?.providers?.[0] ||
          null;

        if (provider !== 'google') {
          toast.error('Cette page est réservée à l\'inscription via Google. Veuillez vous connecter avec Google.');
          navigate('/inscription');
          return;
        }

        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          '';

        const givenName = user.user_metadata?.given_name || '';
        const familyName = user.user_metadata?.family_name || '';

        let nom = familyName || '';
        let prenom = givenName || '';

        if ((!nom || !prenom) && fullName) {
          const parts = fullName.trim().split(/\s+/);
          prenom = prenom || parts[0] || '';
          nom = nom || parts.slice(1).join(' ') || parts[0] || '';
        }

        setFormData((prev) => ({
          ...prev,
          email: user.email || '',
          nom: nom || '',
          prenom: prenom || '',
        }));
      } catch (error) {
        console.error('Erreur Google register:', error);
        toast.error('Une erreur est survenue lors de la vérification de votre session Google.');
        navigate('/connexion');
      } finally {
        setCheckingGoogleSession(false);
      }
    };

    loadGoogleUser();
  }, [navigate]);

  const mapSexeToDb = (value) => {
    if (value === 'Homme') return 'M';
    if (value === 'Femme') return 'F';
    return null;
  };

  const validateField = (name, value) => {
    const error = {};

    switch (name) {
      case 'nom':
        if (!value || value.trim().length < 2) error.nom = 'Le nom doit contenir au moins 2 caractères';
        break;
      case 'prenom':
        if (!value || value.trim().length < 2) error.prenom = 'Le prénom doit contenir au moins 2 caractères';
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error.email = "L'email n'est pas valide";
        }
        break;
      case 'telephone':
        if (!value || value.trim().length < 8) error.telephone = 'Téléphone invalide';
        break;
      case 'sexe':
        if (!value) error.sexe = 'Sexe requis';
        break;
      case 'ville':
        if (!value) error.ville = 'Ville requise';
        break;
      case 'codePostal':
        if (!value || !/^\d+$/.test(value)) error.codePostal = 'Code postal invalide';
        break;
      case 'description':
        // Description is now optional for artisans
        break;
      case 'metier':
        if (role === 'artisan' && !value) error.metier = 'Métier requis';
        break;
      case 'anneesExperience':
        if (
          role === 'artisan' &&
          aExperience &&
          (value === '' || Number(value) < 0 || Number(value) > 50)
        ) {
          error.anneesExperience = "Années d'expérience invalides";
        }
        break;
      case 'cin':
        if (!value || value.trim().length < 4) error.cin = 'CIN requis';
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['nom', 'prenom', 'email', 'telephone', 'sexe', 'ville', 'codePostal', 'cin'];

    if (role === 'artisan') {
      fields.push('metier');
      if (aExperience) fields.push('anneesExperience');
    }

    fields.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (Object.keys(fieldError).length > 0) Object.assign(newErrors, fieldError);
    });

    if (!role) toast.error('Veuillez choisir un rôle');

    if (role === 'particulier') {
      if (!cinRectoFile) toast.error('Ajoutez la photo recto de la CIN');
      if (!cinVersoFile) toast.error('Ajoutez la photo verso de la CIN');
    }

    setErrors(newErrors);

    const particulierCinOk =
      role !== 'particulier' || (cinRectoFile && cinVersoFile);

    return !!role && Object.keys(newErrors).length === 0 && particulierCinOk;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);

    setErrors((prev) => {
      const copy = { ...prev };
      if (Object.keys(fieldError).length > 0) copy[name] = fieldError[name];
      else delete copy[name];
      return copy;
    });
  };

  const hasError = (fieldName) => !!errors[fieldName];

  const getFieldClassName = (fieldName) =>
    hasError(fieldName)
      ? 'border-red-500'
      : 'border-transparent focus:border-brand-orange';

  // Image preview functions
  const handleImagePreview = (file, type) => {
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPreviewType(type);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewType('');
  };

  const validateStep1 = () => {
    if (!role) {
      toast.error('Veuillez choisir un rôle');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const required = ['nom', 'prenom', 'email', 'telephone', 'sexe', 'cin'];
    // Description is now optional for artisans

    const missing = required.filter((field) => {
      const value = formData[field];
      return !value || value.trim() === '';
    });

    if (missing.length > 0) {
      toast.error(`Veuillez remplir : ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const required = ['ville', 'codePostal'];
    if (role === 'artisan') required.push('metier');

    const missing = required.filter((field) => {
      const value = formData[field];
      return !value || value.trim() === '';
    });

    if (missing.length > 0) {
      toast.error(`Veuillez remplir : ${missing.join(', ')}`);
      return false;
    }

    if (role === 'particulier' && (!cinRectoFile || !cinVersoFile)) {
      toast.error('Veuillez ajouter les photos recto et verso de la CIN');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const valid = validateForm();
    if (!valid) return;

    setIsSubmitting(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData?.session) {
        throw new Error('Session Google invalide');
      }

      const currentUser = sessionData.session.user;
      const sexeDb = mapSexeToDb(formData.sexe);

      if (role === 'artisan') {
        const { error } = await supabase.from('artisan').insert([
          {
            id_artisan: currentUser.id,
            nom_artisan: formData.nom,
            prenom_artisan: formData.prenom,
            email_artisan: currentUser.email,
            telephone_artisan: formData.telephone,
            sexe: sexeDb,
            photo_profil: null,
            description: formData.description || '',
            localisation: formData.ville,
            disponibilite: true,
            ville: formData.ville,
            statut_validation: false,
            code_postale_artisan: formData.codePostal,
            annee_experience: aExperience ? Number(formData.anneesExperience || 0) : 0,
            cin: formData.cin,
            metier: formData.metier,
          },
        ]);

        if (error) throw error;

        toast.success('Compte artisan créé avec succès !');
        navigate('/artisan/dashboard');
        return;
      }

      if (role === 'particulier') {
        const { error } = await supabase.from('particulier').insert([
          {
            id_particulier: currentUser.id,
            nom_particulier: formData.nom,
            prenom_particulier: formData.prenom,
            email_particulier: currentUser.email,
            telephone_particulier: formData.telephone,
            sexe: sexeDb,
            ville: formData.ville,
            code_postale_particulier: formData.codePostal,
            cin: formData.cin,
          },
        ]);

        if (error) throw error;

        toast.success('Compte particulier créé avec succès !');
        navigate('/client/dashboard');
        return;
      }

      toast.error('Veuillez choisir un rôle');
    } catch (error) {
      console.error(error);
      const msg = error.message?.toLowerCase() || '';

      if (msg.includes('duplicate key') || msg.includes('unique constraint')) {
        if (msg.includes('cin')) {
          toast.error('Ce numéro de CIN est déjà utilisé. Veuillez vérifier vos informations.');
        } else if (msg.includes('email')) {
          toast.error('Cet email est déjà utilisé.');
        } else {
          toast.error('Certaines informations sont déjà utilisées. Veuillez vérifier vos données.');
        }
      } else {
        toast.error(error.message || "Erreur lors de l'inscription Google");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingGoogleSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
        <p className="text-lg font-semibold text-brand-dark">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-6 py-20">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/5 overflow-hidden">
        <div className="hidden lg:block lg:col-span-4 bg-brand-dark p-12 text-white">
          <div className="space-y-12">
            {[
              { id: 1, title: 'Rôle', desc: 'Choisissez votre type de compte' },
              { id: 2, title: 'Informations', desc: 'Vos coordonnées personnelles' },
              { id: 3, title: 'Disponibilité', desc: 'Votre zone de disponibilité' },
              { id: 4, title: 'Finalisation', desc: 'Terminez votre inscription' },
            ].map((s) => (
              <div
                key={s.id}
                className={`flex items-start space-x-4 transition-opacity ${
                  step >= s.id ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    step === s.id
                      ? 'bg-brand-orange text-white'
                      : step > s.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                </div>
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-40">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoApp} alt="7rayfi" className="w-16 h-16 object-contain" />
              <span className="font-bold text-xl">7rayfi</span>
            </Link>
          </div>
        </div>

        <div className="p-8 lg:p-16 lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-bold text-brand-dark mb-4">
                    Choisissez votre rôle
                  </h1>
                  <p className="text-gray-500 mb-4">
                    Sélectionnez le type de compte que vous souhaitez créer.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Les champs marqués par * sont obligatoires.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setRole('particulier')}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all group ${
                      role === 'particulier'
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-gray-50 hover:border-brand-orange/20 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <User size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Particulier</h3>
                    <p className="text-gray-500 text-sm">
                      Je cherche des artisans qualifiés pour mes travaux.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('artisan')}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all group ${
                      role === 'artisan'
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-gray-50 hover:border-brand-orange/20 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Briefcase size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Artisan</h3>
                    <p className="text-gray-500 text-sm">
                      Je propose mes services et souhaite développer mon activité.
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => validateStep1() && setStep(2)}
                  className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all flex items-center justify-center group"
                >
                  Continuer vers les informations
                  <ArrowRight size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-sm font-bold text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" /> Retour
                </button>

                <div>
                  <h1 className="text-4xl font-bold text-brand-dark mb-2">
                    Informations Personnelles
                  </h1>
                  <p className="text-gray-500">
                    Vos informations Google ont été récupérées. Complétez le reste.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Nom *</label>
                      <input
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('nom')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="Alami"
                      />
                      {hasError('nom') && <p className="text-xs text-red-500 ml-1">{errors.nom}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Prénom *</label>
                      <input
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('prenom')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="Mohammed"
                      />
                      {hasError('prenom') && <p className="text-xs text-red-500 ml-1">{errors.prenom}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-5 py-4 bg-gray-100 rounded-2xl border border-transparent opacity-70 cursor-not-allowed outline-none shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Téléphone *</label>
                      <input
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('telephone')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="06 12 34 56 78"
                      />
                      {hasError('telephone') && <p className="text-xs text-red-500 ml-1">{errors.telephone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Sexe *</label>
                      <select
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('sexe')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                      >
                        <option value="">Sélectionner</option>
                        {SEXES.map((sexe) => (
                          <option key={sexe} value={sexe}>{sexe}</option>
                        ))}
                      </select>
                      {hasError('sexe') && <p className="text-xs text-red-500 ml-1">{errors.sexe}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">CIN *</label>
                      <input
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('cin')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="AB123456"
                      />
                      {hasError('cin') && <p className="text-xs text-red-500 ml-1">{errors.cin}</p>}
                    </div>
                  </div>

                  {role === 'artisan' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">Photo de profil</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-orange file:text-white hover:file:bg-brand-orange/90"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Camera size={20} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">Description du profil</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('description')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02] resize-none`}
                          placeholder="Décrivez brièvement votre profil et vos compétences..."
                        />
                        {hasError('description') && <p className="text-xs text-red-500 ml-1">{errors.description}</p>}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => validateStep2() && setStep(3)}
                    className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 hover:shadow-2xl hover:shadow-brand-orange/30 transition-all duration-300 flex items-center justify-center group transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Continuer vers la disponibilité
                    <ArrowRight size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center text-sm font-bold text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" /> Retour
                </button>

                <div>
                  <h1 className="text-4xl font-bold text-brand-dark mb-2">Disponibilité</h1>
                  <p className="text-gray-500">
                    Indiquez votre ville et vos informations complémentaires.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Ville *</label>
                      <select
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('ville')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                      >
                        <option value="">Sélectionner une ville</option>
                        {VILLES.map((ville) => (
                          <option key={ville} value={ville}>{ville}</option>
                        ))}
                      </select>
                      {hasError('ville') && <p className="text-xs text-red-500 ml-1">{errors.ville}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Code postal *</label>
                      <input
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('codePostal')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="Ex: 20000"
                      />
                      {hasError('codePostal') && <p className="text-xs text-red-500 ml-1">{errors.codePostal}</p>}
                    </div>
                  </div>

                  {role === 'particulier' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">CIN Recto *</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCinRectoFile(e.target.files?.[0] || null)}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]"
                          />
                          {cinRectoFile && (
                            <button
                              type="button"
                              onClick={() => handleImagePreview(cinRectoFile, 'CIN Recto')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-orange hover:text-brand-orange/80 transition-colors"
                              title="Voir l'image"
                            >
                              <Eye size={20} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">CIN Verso *</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCinVersoFile(e.target.files?.[0] || null)}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]"
                          />
                          {cinVersoFile && (
                            <button
                              type="button"
                              onClick={() => handleImagePreview(cinVersoFile, 'CIN Verso')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-orange hover:text-brand-orange/80 transition-colors"
                              title="Voir l'image"
                            >
                              <Eye size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {role === 'artisan' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">Métier *</label>
                        <select
                          name="metier"
                          value={formData.metier}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('metier')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        >
                          <option value="">Sélectionner un métier</option>
                          {METIERS.map((metier) => (
                            <option key={metier} value={metier}>{metier}</option>
                          ))}
                        </select>
                        {hasError('metier') && <p className="text-xs text-red-500 ml-1">{errors.metier}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">Avez-vous de l'expérience ?</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={aExperience}
                              onChange={() => setAExperience(true)}
                              className="w-4 h-4 text-brand-orange border-gray-300 focus:ring-brand-orange"
                            />
                            <span className="text-gray-700">Oui</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={!aExperience}
                              onChange={() => {
                                setAExperience(false);
                                setFormData((prev) => ({ ...prev, anneesExperience: '' }));
                              }}
                              className="w-4 h-4 text-brand-orange border-gray-300 focus:ring-brand-orange"
                            />
                            <span className="text-gray-700">Non</span>
                          </label>
                        </div>
                      </div>

                      {aExperience && (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-dark ml-1">Nombre d'années d'expérience</label>
                          <input
                            name="anneesExperience"
                            type="number"
                            value={formData.anneesExperience}
                            onChange={handleChange}
                            min="0"
                            max="50"
                            className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('anneesExperience')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                            placeholder="Entrez le nombre d'années..."
                          />
                          {hasError('anneesExperience') && (
                            <p className="text-xs text-red-500 ml-1">{errors.anneesExperience}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => validateStep3() && setStep(4)}
                  className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 hover:shadow-2xl hover:shadow-brand-orange/30 transition-all duration-300 flex items-center justify-center group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continuer vers la finalisation
                  <ArrowRight size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center text-sm font-bold text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" /> Retour
                </button>

                <div>
                  <h1 className="text-4xl font-bold text-brand-dark mb-2">Finalisation du compte</h1>
                  <p className="text-gray-500">
                    Vérifiez vos informations et terminez votre inscription.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 hover:shadow-2xl hover:shadow-brand-orange/30 transition-all duration-300 flex items-center justify-center group transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Terminer mon inscription
                        <UserPlus size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Preview Modal */}
          <AnimatePresence>
            {previewImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={closePreview}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-brand-dark">{previewType}</h3>
                    <button
                      onClick={closePreview}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <img
                      src={previewImage}
                      alt={previewType}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-12 text-center text-gray-500 text-sm">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-brand-orange font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterGoogle;