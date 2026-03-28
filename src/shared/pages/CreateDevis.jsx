import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Clock,
  DollarSign,
  Calculator,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createDevis, validateDevis } from '../../core/services/devisService';

const CreateDevis = () => {
  // État du formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Informations client
    nom_client: '',
    email_client: '',
    telephone_client: '',
    adresse_client: '',
    
    // Détails du service
    service: '',
    description: '',
    delai: '',
    
    // Tarification
    montant_ht: '',
    tva: 20, // TVA par défaut à 20%
    
    // Notes
    notes: '',
  });

  // Calcul du montant TTC
  const montantTTC = formData.montant_ht 
    ? parseFloat(formData.montant_ht) + (parseFloat(formData.montant_ht) * parseFloat(formData.tva) / 100)
    : 0;

  // Services disponibles
  const services = [
    'Plomberie',
    'Électricité',
    'Climatisation',
    'Menuiserie',
    'Maçonnerie',
    'Peinture',
    'Jardinage',
    'Ménage',
    'Couverte',
    'Carrelage',
    'Autre'
  ];

  // Validation du formulaire
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Validation informations client
      if (!formData.nom_client.trim()) newErrors.nom_client = 'Le nom du client est requis';
      if (!formData.email_client.trim()) newErrors.email_client = 'L\'email est requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_client)) {
        newErrors.email_client = 'L\'email n\'est pas valide';
      }
      if (!formData.telephone_client.trim()) newErrors.telephone_client = 'Le téléphone est requis';
      else if (!/^0[5-7]\d{8}$/.test(formData.telephone_client.replace(/\s/g, ''))) {
        newErrors.telephone_client = 'Le téléphone n\'est pas valide';
      }
      if (!formData.adresse_client.trim()) newErrors.adresse_client = 'L\'adresse est requise';
    }
    
    if (step === 2) {
      // Validation détails du service
      if (!formData.service) newErrors.service = 'Le service est requis';
      if (!formData.description.trim()) newErrors.description = 'La description est requise';
      if (!formData.delai.trim()) newErrors.delai = 'Le délai est requis';
    }
    
    if (step === 3) {
      // Validation tarification
      if (!formData.montant_ht || parseFloat(formData.montant_ht) <= 0) {
        newErrors.montant_ht = 'Le montant HT est requis et doit être supérieur à 0';
      }
      if (!formData.tva || parseFloat(formData.tva) < 0 || parseFloat(formData.tva) > 100) {
        newErrors.tva = 'La TVA doit être entre 0 et 100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Navigation entre étapes
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Veuillez corriger les erreurs');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider toutes les étapes
    const allErrors = {};
    for (let step = 1; step <= 3; step++) {
      const stepValidation = validateStep(step);
      if (!stepValidation) {
        // Récupérer les erreurs de cette étape
        Object.assign(allErrors, errors);
      }
    }
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Veuillez corriger toutes les erreurs');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour le service
      const devisData = {
        ...formData,
        montant_ttc: montantTTC,
      };
      
      // Utiliser le service pour créer le devis
      const result = await createDevis(devisData);
      
      if (result.success) {
        toast.success('🎉 Devis créé avec succès!');
        console.log('Devis créé:', result.data);
        
        // Réinitialiser le formulaire
        setFormData({
          nom_client: '',
          email_client: '',
          telephone_client: '',
          adresse_client: '',
          service: '',
          description: '',
          delai: '',
          montant_ht: '',
          tva: 20,
          notes: '',
        });
        setCurrentStep(1);
        setErrors({});
        
        // Optionnel: Rediriger vers la liste des devis
        // navigate('/devis');
        
      } else {
        toast.error(result.error || 'Erreur lors de la création du devis');
      }
      
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      toast.error('Erreur lors de la création du devis');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Création de Devis
              </h1>
              <p className="text-gray-600">
                Créez un devis professionnel en quelques étapes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-brand-orange" />
            </div>
          </div>
        </motion.div>

        {/* Indicateur d'étapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step
                      ? 'bg-brand-orange text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step < 4 ? step : <CheckCircle size={20} />}
                </motion.div>
                {step < 4 && (
                  <motion.div
                    className={`h-1 w-16 md:w-24 mx-2 rounded-full transition-all ${
                      currentStep > step ? 'bg-brand-orange' : 'bg-gray-200'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > step ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-3xl mx-auto mt-2">
            <span className="text-xs text-gray-600">Client</span>
            <span className="text-xs text-gray-600">Service</span>
            <span className="text-xs text-gray-600">Tarification</span>
            <span className="text-xs text-gray-600">Résumé</span>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Étape 1: Informations Client */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Informations Client</h2>
                        <p className="text-sm text-gray-600">Détails sur le client</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nom du client *
                          </label>
                          <input
                            type="text"
                            name="nom_client"
                            value={formData.nom_client}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              errors.nom_client
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                            }`}
                            placeholder="Jean Dupont"
                          />
                          {errors.nom_client && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.nom_client}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Téléphone *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="telephone_client"
                              value={formData.telephone_client}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                                errors.telephone_client
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                              }`}
                              placeholder="06 12 34 56 78"
                            />
                          </div>
                          {errors.telephone_client && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.telephone_client}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email_client"
                            value={formData.email_client}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                              errors.email_client
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                            }`}
                            placeholder="email@exemple.com"
                          />
                        </div>
                        {errors.email_client && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.email_client}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Adresse *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="adresse_client"
                            value={formData.adresse_client}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                              errors.adresse_client
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                            }`}
                            placeholder="123 Rue Example, 75000 Paris"
                          />
                        </div>
                        {errors.adresse_client && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.adresse_client}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Étape 2: Détails du Service */}
            <AnimatePresence mode="wait">
              {currentStep === 2 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Détails du Service</h2>
                        <p className="text-sm text-gray-600">Description du travail à effectuer</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Service *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            errors.service
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                          }`}
                        >
                          <option value="">Sélectionnez un service</option>
                          {services.map(service => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        {errors.service && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.service}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                            errors.description
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                          }`}
                          placeholder="Décrivez en détail le travail à effectuer..."
                        />
                        {errors.description && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.description}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Délai *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="delai"
                            value={formData.delai}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                              errors.delai
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                            }`}
                            placeholder="2 semaines, 1 mois, etc."
                          />
                        </div>
                        {errors.delai && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.delai}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Notes (optionnel)
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5 transition-all resize-none"
                          placeholder="Informations complémentaires..."
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Étape 3: Tarification */}
            <AnimatePresence mode="wait">
              {currentStep === 3 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Tarification</h2>
                        <p className="text-sm text-gray-600">Définissez les prix du devis</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Montant HT (€) *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              name="montant_ht"
                              value={formData.montant_ht}
                              onChange={handleChange}
                              step="0.01"
                              min="0"
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                                errors.montant_ht
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                              }`}
                              placeholder="1000.00"
                            />
                          </div>
                          {errors.montant_ht && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.montant_ht}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            TVA (%)
                          </label>
                          <div className="relative">
                            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              name="tva"
                              value={formData.tva}
                              onChange={handleChange}
                              step="0.1"
                              min="0"
                              max="100"
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                                errors.tva
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 focus:border-brand-orange focus:bg-brand-orange/5'
                              }`}
                              placeholder="20"
                            />
                          </div>
                          {errors.tva && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.tva}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Calcul automatique */}
                      <motion.div
                        className="bg-gradient-to-r from-brand-orange/10 to-purple-100 rounded-2xl p-4 border border-brand-orange/20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Montant TTC calculé:</span>
                          <motion.div
                            key={montantTTC}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl font-bold text-brand-orange"
                          >
                            {montantTTC.toFixed(2)} €
                          </motion.div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          HT: {formData.montant_ht || '0.00'} € + TVA ({formData.tva}%): {((formData.montant_ht || 0) * formData.tva / 100).toFixed(2)} €
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Étape 4: Résumé */}
            <AnimatePresence mode="wait">
              {currentStep === 4 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Résumé du Devis</h2>
                        <p className="text-sm text-gray-600">Vérifiez avant de créer</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Informations client */}
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Nom:</span> {formData.nom_client}</p>
                          <p><span className="text-gray-600">Email:</span> {formData.email_client}</p>
                          <p><span className="text-gray-600">Téléphone:</span> {formData.telephone_client}</p>
                          <p><span className="text-gray-600">Adresse:</span> {formData.adresse_client}</p>
                        </div>
                      </div>

                      {/* Service */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Service</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Type:</span> {formData.service}</p>
                          <p><span className="text-gray-600">Description:</span> {formData.description}</p>
                          <p><span className="text-gray-600">Délai:</span> {formData.delai}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      {formData.notes && (
                        <div className="border-l-4 border-gray-500 pl-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                          <p className="text-sm text-gray-600">{formData.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boutons de navigation */}
            <motion.div
              variants={cardVariants}
              className="flex justify-between gap-4"
            >
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Précédent
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-orange-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 ml-auto"
                >
                  Suivant
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-orange-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Créer le devis
                    </>
                  )}
                </button>
              )}
            </motion.div>
          </div>

          {/* Résumé du devis (sidebar) */}
          <div className="lg:col-span-1">
            <motion.div
              variants={cardVariants}
              className="sticky top-6"
            >
              <div className="bg-gradient-to-br from-brand-orange to-orange-600 rounded-3xl shadow-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Résumé du Devis</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-white/80">Montant HT</span>
                    <motion.span
                      key={formData.montant_ht}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-semibold"
                    >
                      {formData.montant_ht || '0.00'} €
                    </motion.span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-white/80">TVA ({formData.tva}%)</span>
                    <motion.span
                      key={formData.tva}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-semibold"
                    >
                      {((formData.montant_ht || 0) * formData.tva / 100).toFixed(2)} €
                    </motion.span>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-bold">Montant TTC</span>
                    <motion.div
                      key={montantTTC}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-white/20 px-3 py-1 rounded-xl"
                    >
                      {montantTTC.toFixed(2)} €
                    </motion.div>
                  </div>
                </div>

                {/* Statut */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Statut</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      Brouillon
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <motion.div
                variants={cardVariants}
                className="mt-6 bg-white rounded-3xl shadow-xl p-6"
              >
                <h4 className="font-semibold text-gray-900 mb-4">Informations</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Calcul automatique TTC</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Validation en temps réel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Sauvegarde automatique</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDevis;
