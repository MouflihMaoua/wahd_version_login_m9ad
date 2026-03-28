import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileImage,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import logoApp from '/assets/logo_app.png';
import { createArtisanSecurely } from '../../core/services/artisanService';
import { validatePassword } from '../../core/utils/passwordUtils';

const RegisterArtisan = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cinRectoFile, setCinRectoFile] = useState(null);
  const [cinVersoFile, setCinVersoFile] = useState(null);
  const [previewImages, setPreviewImages] = useState({ recto: null, verso: null });
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    password: '',
    confirmPassword: '',
    specialite: '',
    experience: '',
  });
  
  const [errors, setErrors] = useState({});

  const VILLES = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
    'Meknès', 'Oujda', 'Kénitra', 'Tétouan'
  ];

  const SPECIALITES = [
    'Plombier', 'Électricien', 'Ménage', 'Peintre', 'Climatisation',
    'Menuiserie', 'Maçonnerie', 'Couvreur', 'Carreleur', 'Jardinier'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (file, type) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide (JPG, PNG)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImages(prev => ({
        ...prev,
        [type]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
    
    // Set file
    if (type === 'recto') {
      setCinRectoFile(file);
    } else {
      setCinVersoFile(file);
    }
  };

  const removeFile = (type) => {
    if (type === 'recto') {
      setCinRectoFile(null);
    } else {
      setCinVersoFile(null);
    }
    setPreviewImages(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.cin.trim()) newErrors.cin = 'Le numéro CIN est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    
    // CIN validation
    if (formData.cin && formData.cin.trim().length < 4) {
      newErrors.cin = 'Le CIN doit contenir au moins 4 caractères';
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    
    // Password validation
    if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }
    
    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Phone validation
    if (formData.telephone && !/^0[5-7]\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone n\'est pas valide';
    }
    
    // CIN files validation
    if (!cinRectoFile) {
      newErrors.cinRecto = 'La photo recto de la CIN est requise';
    }
    
    if (!cinVersoFile) {
      newErrors.cinVerso = 'La photo verso de la CIN est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await createArtisanSecurely({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        cin: formData.cin,
        password: formData.password,
        specialite: formData.specialite,
        experience: parseInt(formData.experience) || 0,
        cinRectoFile: cinRectoFile,
        cinVersoFile: cinVersoFile
      });
      
      if (result.success) {
        toast.success('🎉 Compte artisan créé avec succès!');
        
        // Redirect to login
        setTimeout(() => {
          navigate('/connexion', { 
            state: { 
              message: 'Compte créé! Vous pouvez maintenant vous connecter.',
              email: formData.email 
            } 
          });
        }, 1500);
      } else {
        toast.error(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName) => errors[fieldName] || '';
  const hasError = (fieldName) => !!errors[fieldName];

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/10 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Header */}
            <div className="bg-brand-dark text-white p-12 lg:w-1/3">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <img src={logoApp} alt="7rayfi_logo" className="w-16 h-16 object-contain" />
              </Link>
              
              <h2 className="text-2xl font-bold mb-4">
                Rejoignez notre réseau
              </h2>
              <p className="text-gray-300 mb-8">
                Devenez un artisan certifié et accédez à des milliers de clients
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm">Profils vérifiés</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm">Sécurité renforcée</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm">Support dédié</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-12 lg:w-2/3">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark mb-2">
                  Inscription Artisan
                </h1>
                <p className="text-gray-600">
                  Créez votre compte professionnel en quelques minutes
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${
                        hasError('nom') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                      } focus:bg-white outline-none transition-all`}
                      placeholder="Votre nom"
                      disabled={isLoading}
                    />
                    {hasError('nom') && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('nom')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${
                        hasError('prenom') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                      } focus:bg-white outline-none transition-all`}
                      placeholder="Votre prénom"
                      disabled={isLoading}
                    />
                    {hasError('prenom') && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('prenom')}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Email Professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border ${
                        hasError('email') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                      } focus:bg-white outline-none transition-all`}
                      placeholder="email@exemple.com"
                      disabled={isLoading}
                    />
                  </div>
                  {hasError('email') && (
                    <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('email')}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border ${
                        hasError('telephone') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                      } focus:bg-white outline-none transition-all`}
                      placeholder="06 12 34 56 78"
                      disabled={isLoading}
                    />
                  </div>
                  {hasError('telephone') && (
                    <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('telephone')}</p>
                  )}
                </div>

                {/* CIN */}
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Numéro CIN *
                  </label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${
                      hasError('cin') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                    } focus:bg-white outline-none transition-all`}
                    placeholder="AB123456"
                    disabled={isLoading}
                  />
                  {hasError('cin') && (
                    <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('cin')}</p>
                  )}
                </div>

                {/* Speciality */}
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Spécialité
                  </label>
                  <select
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all"
                    disabled={isLoading}
                  >
                    <option value="">Sélectionnez une spécialité</option>
                    {SPECIALITES.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Années d'expérience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all"
                    placeholder="0"
                    min="0"
                    max="50"
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl border ${
                          hasError('password') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                        } focus:bg-white outline-none transition-all`}
                        placeholder="••••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {hasError('password') && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('password')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl border ${
                          hasError('confirmPassword') ? 'border-red-500' : 'border-transparent focus:border-brand-orange'
                        } focus:bg-white outline-none transition-all`}
                        placeholder="••••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {hasError('confirmPassword') && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('confirmPassword')}</p>
                    )}
                  </div>
                </div>

                {/* CIN File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <FileImage size={20} />
                    Photos de la CIN *
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CIN Recto */}
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">
                        CIN Recto *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'recto')}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600"
                          disabled={isLoading}
                        />
                        {previewImages.recto && (
                          <button
                            type="button"
                            onClick={() => removeFile('recto')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                            title="Supprimer l'image"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                      {hasError('cinRecto') && (
                        <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('cinRecto')}</p>
                      )}
                      {previewImages.recto && (
                        <div className="mt-2 relative">
                          <img
                            src={previewImages.recto}
                            alt="CIN Recto"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CIN Verso */}
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">
                        CIN Verso *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'verso')}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600"
                          disabled={isLoading}
                        />
                        {previewImages.verso && (
                          <button
                            type="button"
                            onClick={() => removeFile('verso')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                            title="Supprimer l'image"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                      {hasError('cinVerso') && (
                        <p className="text-xs text-red-500 mt-1 ml-2">{getFieldError('cinVerso')}</p>
                      )}
                      {previewImages.verso && (
                        <div className="mt-2 relative">
                          <img
                            src={previewImages.verso}
                            alt="CIN Verso"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <Upload size={14} className="inline mr-1" />
                    Formats acceptés: JPG, PNG. Taille maximale: 5MB
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center group shadow-xl shadow-brand-orange/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon compte artisan
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center mt-6">
                  <span className="text-gray-600">Déjà un compte ? </span>
                  <Link
                    to="/connexion"
                    className="text-brand-orange font-bold hover:underline transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterArtisan;
