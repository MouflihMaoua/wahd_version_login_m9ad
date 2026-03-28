import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-navy to-brand-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo_app.png" alt="7rayfi_logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-white">7rayfi</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-gray-300">
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      {...register('email')}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:bg-white/20 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400 ml-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center group shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Envoyer l'email
                      <Mail size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="text-center mt-6">
                <Link
                  to="/connexion"
                  className="inline-flex items-center text-brand-orange hover:text-orange-400 font-semibold transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Email envoyé !
              </h2>
              <p className="text-gray-300 mb-8">
                Nous avons envoyé un email de réinitialisation à votre adresse email. 
                Vérifiez votre boîte de réception et suivez les instructions.
              </p>
              <Link
                to="/connexion"
                className="inline-flex items-center bg-brand-orange text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all"
              >
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
