import React, { useState } from 'react';
import { Save, Settings, Shield, Bell, Mail, Globe, CreditCard, Users, Wrench, FileText, AlertTriangle, CheckCircle, Eye, Edit, Trash2, Plus, X } from 'lucide-react';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: '7rayfi',
      siteDescription: 'La plateforme de mise en relation entre artisans et clients',
      contactEmail: 'contact@7rayfi.ma',
      supportPhone: '+212 5 22 00 00 00',
      address: 'Casablanca, Maroc',
      maintenanceMode: false,
      debugMode: false
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: true,
      ipWhitelist: [],
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      maxFileSize: 5
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newRegistrationAlert: true,
      missionCompletedAlert: true,
      paymentReceivedAlert: true,
      systemErrorAlert: true
    },
    payments: {
      commissionRate: 10,
      minimumPayout: 50,
      paymentMethods: ['card', 'paypal', 'bank_transfer'],
      autoPayout: false,
      payoutFrequency: 'monthly',
      taxRate: 20
    },
    users: {
      autoValidateArtisans: false,
      requireIdentityVerification: true,
      requireInsuranceVerification: true,
      allowUserDeletion: true,
      dataRetentionPeriod: 365,
      gdprCompliance: true
    },
    system: {
      backupFrequency: 'daily',
      logRetentionDays: 90,
      maxConcurrentUsers: 1000,
      cacheTimeout: 3600,
      apiRateLimit: 1000,
      enableMonitoring: true
    }
  });

  const [newEmailTemplate, setNewEmailTemplate] = useState({
    name: '',
    subject: '',
    content: ''
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin',
    permissions: []
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'system', label: 'Système', icon: FileText }
  ];

  const admins = [
    { id: 1, name: 'Admin Principal', email: 'admin@7rayfi.ma', role: 'super_admin', lastLogin: '2024-03-01 14:30', status: 'active' },
    { id: 2, name: 'Marie Admin', email: 'marie@7rayfi.ma', role: 'admin', lastLogin: '2024-03-01 10:15', status: 'active' },
    { id: 3, name: 'Jean Support', email: 'jean@7rayfi.ma', role: 'moderator', lastLogin: '2024-02-28 16:45', status: 'inactive' }
  ];

  const emailTemplates = [
    { id: 1, name: 'Bienvenue utilisateur', subject: 'Bienvenue sur 7rayfi', lastModified: '2024-02-15' },
    { id: 2, name: 'Confirmation mission', subject: 'Votre mission a été confirmée', lastModified: '2024-02-20' },
    { id: 3, name: 'Paiement reçu', subject: 'Paiement reçu avec succès', lastModified: '2024-02-25' }
  ];

  const handleSaveSettings = (category) => {
    // Simuler la sauvegarde
    console.log(`Saving ${category} settings:`, settings[category]);
    // Afficher une notification de succès
    alert('Paramètres sauvegardés avec succès !');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => setSettings({...settings, general: {...settings.general, siteName: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
            <input
              type="email"
              value={settings.general.contactEmail}
              onChange={(e) => setSettings({...settings, general: {...settings.general, contactEmail: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone support</label>
            <input
              type="tel"
              value={settings.general.supportPhone}
              onChange={(e) => setSettings({...settings, general: {...settings.general, supportPhone: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={settings.general.address}
              onChange={(e) => setSettings({...settings, general: {...settings.general, address: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => setSettings({...settings, general: {...settings.general, siteDescription: e.target.value}})}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode maintenance</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => setSettings({...settings, general: {...settings.general, maintenanceMode: e.target.checked}})}
              className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-sm font-medium text-gray-700">Activer le mode maintenance</span>
          </label>
          <p className="text-sm text-gray-500">
            Lorsque le mode maintenance est activé, seul le personnel administrateur peut accéder au site.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('general')}
          className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de mots de passe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longueur minimale</label>
            <input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => setSettings({...settings, security: {...settings.security, passwordMinLength: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tentatives de connexion max</label>
            <input
              type="number"
              value={settings.security.maxLoginAttempts}
              onChange={(e) => setSettings({...settings, security: {...settings.security, maxLoginAttempts: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentification</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => setSettings({...settings, security: {...settings.security, twoFactorAuth: e.target.checked}})}
              className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-sm font-medium text-gray-700">Authentification à deux facteurs</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'expiration de session (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings({...settings, security: {...settings.security, sessionTimeout: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('security')}
          className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );

  const renderAdminManagement = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Administrateurs</h3>
          <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un admin
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-lg bg-purple-100 text-purple-800">
                      {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : 'Modérateur'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(admin.lastLogin).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                      admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-brand-orange hover:text-brand-orange/80">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Modèles d'email</h3>
          <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-orange/90 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Nouveau modèle
          </button>
        </div>
        <div className="space-y-3">
          {emailTemplates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.subject}</p>
                <p className="text-xs text-gray-500 mt-1">Modifié le {new Date(template.lastModified).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-brand-orange hover:text-brand-orange/80">
                  <Eye size={16} />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'admin':
        return renderAdminManagement();
      default:
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600">Paramètres {activeTab} en cours de développement...</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Paramètres Administration</h1>
          <p className="text-gray-600 mt-1">Configurez les paramètres de la plateforme</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default SettingsManagement;
