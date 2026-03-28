import React, { useState } from 'react';
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
import logoApp from '/assets/logo_app.png';
import { registerUser } from '../src/core/services/registerService';
import { validatePassword, validateCINFile, getPasswordStrength } from '../src/core/utils/validation';

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

const RegisterManual = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cinRectoFile, setCinRectoFile] = useState(null);
  const [cinVersoFile, setCinVersoFile] = useState(null);
  const [aExperience, setAExperience] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewType, setPreviewType] = useState('');
  
  // Enhanced validation states
  const [cinValidationErrors, setCinValidationErrors] = useState({
    recto: [],
    verso: []
  });
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: 'Très faible', color: 'red' });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    ville: '',
    codePostal: '',
    description: '',
    metier: '',
    anneesExperience: '',
    cin: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const error = {};

    switch (name) {
      case 'nom':
        if (!value || value.trim().length < 2) {
          error.nom = 'Le nom doit contenir au moins 2 caractères';
        }
        break;
      case 'prenom':
        if (!value || value.trim().length < 2) {
          error.prenom = 'Le prénom doit contenir au moins 2 caractères';
        }
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error.email = "L'email n'est pas valide";
        }
        break;
      case 'telephone':
        if (!value || value.trim().length < 8) {
          error.telephone = 'Téléphone invalide';
        }
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          error.password = passwordValidation.errors[0]; // Show first error
        }
        // Update password strength indicator
        setPasswordStrength(getPasswordStrength(value));
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;
      case 'sexe':
        if (!value) error.sexe = 'Sexe requis';
        break;
      case 'ville':
        if (!value) error.ville = 'Ville requise';
        break;
      case 'codePostal':
        if (!value || !/^\d+$/.test(value)) {
          error.codePostal = 'Code postal invalide';
        }
        break;
      case 'description':
        // Description is now optional for artisans
        break;
      case 'metier':
        if (role === 'artisan' && !value) {
          error.metier = 'Métier requis';
        }
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
        if (!value || value.trim().length < 4) {
          error.cin = 'CIN requis';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = [
      'nom',
      'prenom',
      'email',
      'telephone',
      'sexe',
      'ville',
      'codePostal',
      'password',
      'confirmPassword',
      'cin',
    ];

    if (role === 'artisan') {
      fields.push('metier');
      if (aExperience) fields.push('anneesExperience');
    }

    fields.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (Object.keys(fieldError).length > 0) {
        Object.assign(newErrors, fieldError);
      }
    });

    if (!role) toast.error('Veuillez choisir un rôle');

    if (role === 'particulier') {
      if (!cinRectoFile) toast.error('Ajoutez la photo recto de la CIN');
      if (!cinVersoFile) toast.error('Ajoutez la photo verso de la CIN');
    }

    setErrors(newErrors);

    const particulierCinOk =
      role !== 'particulier' || (cinRectoFile && cinVersoFile);

    return role && Object.keys(newErrors).length === 0 && particulierCinOk;
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

  // Enhanced CIN file validation handlers
  const handleCINRectoChange = (file) => {
    if (file) {
      const validation = validateCINFile(file);
      setCinValidationErrors(prev => ({
        ...prev,
        recto: validation.errors
      }));
      
      if (validation.isValid) {
        setCinRectoFile(file);
        toast.success('CIN Recto validé avec succès');
      } else {
        setCinRectoFile(null);
        validation.errors.forEach(error => toast.error(error));
      }
    } else {
      setCinRectoFile(null);
      setCinValidationErrors(prev => ({
        ...prev,
        recto: []
      }));
    }
  };

  const handleCINVersoChange = (file) => {
    if (file) {
      const validation = validateCINFile(file);
      setCinValidationErrors(prev => ({
        ...prev,
        verso: validation.errors
      }));
      
      if (validation.isValid) {
        setCinVersoFile(file);
        toast.success('CIN Verso validé avec succès');
      } else {
        setCinVersoFile(null);
        validation.errors.forEach(error => toast.error(error));
      }
    } else {
      setCinVersoFile(null);
      setCinValidationErrors(prev => ({
        ...prev,
        verso: []
      }));
    }
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
      await registerUser({
        role,
        formData,
        photoFile,
        cinRectoFile,
        cinVersoFile,
        aExperience,
      });

      toast.success('Compte créé avec succès !');
      navigate('/connexion');
    } catch (error) {
      console.error(error);
      const msg = error.message?.toLowerCase() || '';

      if (msg.includes('user already registered')) {
        toast.error('Cet email est déjà utilisé');
      } else if (msg.includes('rate limit')) {
        toast.error('Trop de tentatives. Réessayez dans quelques minutes.');
      } else if (msg.includes('duplicate key') || msg.includes('unique constraint')) {
        if (msg.includes('cin')) {
          toast.error('Ce numéro de CIN est déjà utilisé. Veuillez vérifier vos informations.');
        } else if (msg.includes('email')) {
          toast.error('Cet email est déjà utilisé.');
        } else {
          toast.error('Certaines informations sont déjà utilisées. Veuillez vérifier vos données.');
        }
      } else {
        toast.error(error.message || "Erreur lors de l'inscription");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-6 py-20">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/5 overflow-hidden">
        <div className="hidden lg:block lg:col-span-4 bg-brand-dark p-12 text-white">
          <div className="space-y-12">
            {[
              { id: 1, title: 'Rôle', desc: 'Choisissez votre type de compte' },
              { id: 2, title: 'Informations', desc: 'Vos coordonnées personnelles' },
              { id: 3, title: 'Disponibilité', desc: 'Votre zone de disponibilité' },
              { id: 4, title: 'Sécurité', desc: 'Confirmation de sécurité' },
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
                    Vos informations de base pour créer votre profil.
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
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('email')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="mohammed@example.com"
                      />
                      {hasError('email') && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
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
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleCINRectoChange(e.target.files?.[0] || null)}
                            className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${
                              cinValidationErrors.recto.length > 0 
                                ? 'border-red-500' 
                                : 'border-transparent focus:border-brand-orange'
                            } focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
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
                        {cinValidationErrors.recto.length > 0 && (
                          <div className="space-y-1">
                            {cinValidationErrors.recto.map((error, index) => (
                              <p key={index} className="text-xs text-red-500 ml-1">{error}</p>
                            ))}
                          </div>
                        )}
                        {cinRectoFile && (
                          <p className="text-xs text-green-600 ml-1">
                            ✓ Fichier sélectionné: {cinRectoFile.name} ({(cinRectoFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark ml-1">CIN Verso *</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleCINVersoChange(e.target.files?.[0] || null)}
                            className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${
                              cinValidationErrors.verso.length > 0 
                                ? 'border-red-500' 
                                : 'border-transparent focus:border-brand-orange'
                            } focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
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
                        {cinValidationErrors.verso.length > 0 && (
                          <div className="space-y-1">
                            {cinValidationErrors.verso.map((error, index) => (
                              <p key={index} className="text-xs text-red-500 ml-1">{error}</p>
                            ))}
                          </div>
                        )}
                        {cinVersoFile && (
                          <p className="text-xs text-green-600 ml-1">
                            ✓ Fichier sélectionné: {cinVersoFile.name} ({(cinVersoFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
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
                  className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all flex items-center justify-center group"
                >
                  Continuer vers la sécurité
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
                  <h1 className="text-4xl font-bold text-brand-dark mb-2">Sécurité</h1>
                  <p className="text-gray-500">
                    Définissez votre mot de passe pour sécuriser votre compte.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Mot de passe *</label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('password')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="••••••••"
                      />
                      {hasError('password') && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Force du mot de passe</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength.color === 'red' ? 'text-red-500' :
                              passwordStrength.color === 'orange' ? 'text-orange-500' :
                              passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                              passwordStrength.color === 'blue' ? 'text-blue-500' :
                              'text-green-500'
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.color === 'red' ? 'bg-red-500' :
                                passwordStrength.color === 'orange' ? 'bg-orange-500' :
                                passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                passwordStrength.color === 'blue' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark ml-1">Confirmer mot de passe *</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border ${getFieldClassName('confirmPassword')} focus:bg-white outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.02]`}
                        placeholder="••••••••"
                      />
                      {hasError('confirmPassword') && (
                        <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 hover:shadow-2xl hover:shadow-brand-orange/30 transition-all duration-300 flex items-center justify-center group transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Créer mon compte
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

export default RegisterManual;