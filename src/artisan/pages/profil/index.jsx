import { useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Camera,
  Edit2,
  Save,
  X,
  Star,
  Briefcase,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '../../../core/services/supabaseClient';

// ─────────────────────────────────────────────────────────────
// UploadPhotoModal — upload réel vers Supabase Storage
// ─────────────────────────────────────────────────────────────
function UploadPhotoModal({
  onUploadSuccess,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024,
  bucket = 'profiles',   // ← mets le nom de ton bucket Supabase
  folder = 'uploads',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!acceptedFileTypes.includes(file.type)) {
      setError('Type de fichier non supporté');
      return;
    }
    if (file.size > maxFileSize) {
      setError(`Fichier trop volumineux (max ${Math.round(maxFileSize / 1024 / 1024)} MB)`);
      return;
    }

    setError('');
    setUploading(true);
    setDone(false);

    try {
      const ext      = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error("Impossible de récupérer l'URL du fichier.");

      setDone(true);
      setTimeout(() => onUploadSuccess(publicUrl), 300);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleInput     = (e) => handleFileSelect(e.target.files[0]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50'  :
        done       ? 'border-green-400 bg-green-50' :
        uploading  ? 'border-gray-300 bg-gray-50'   :
        error      ? 'border-red-300 bg-red-50'     :
                     'border-gray-300 hover:border-blue-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !uploading && !done && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleInput}
        className="hidden"
      />

      {done ? (
        <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
      ) : (
        <UploadCloud className={`mx-auto h-10 w-10 mb-2 ${uploading ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
      )}

      {done && (
        <p className="text-green-600 font-medium text-sm">Fichier uploadé ✓</p>
      )}

      {uploading && (
        <div>
          <p className="text-gray-600 text-sm mb-2">Upload en cours...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {!uploading && !done && (
        <>
          <p className="text-gray-600 text-sm mb-1">
            Glissez-déposez ou{' '}
            <span className="text-blue-600 font-medium">parcourez</span>
          </p>
          <p className="text-xs text-gray-400">
            {acceptedFileTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
            {' · '}Max {Math.round(maxFileSize / 1024 / 1024)} MB
          </p>
        </>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const emptyProfile = {
  id_artisan:       '',
  nom:              '',
  prenom:           '',
  metier:           '',
  email:            '',
  telephone:        '',
  adresse:          '',
  bio:              '',
  tarifHoraire:      0,
  experiences:      [],
  photoProfil:      '',
  ville:            '',
  localisation:      '',
  description:      '',
  anneeExperience:  '',
  sexe:             '',
  note:             0,
  nombreAvis:       0,
};

function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
}

// ─────────────────────────────────────────────────────────────
// ProfilPage
// ─────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const [isEditing,     setIsEditing]     = useState(false);
  const [showPhotoModal,setShowPhotoModal] = useState(false);
  const [profile,       setProfile]       = useState(emptyProfile);
  const [initialProfile,setInitialProfile] = useState(emptyProfile);
  const [newZone,       setNewZone]       = useState('');
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');

  // ── Chargement ──
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session?.user) {
          setError('Utilisateur non connecté.');
          return;
        }

        const user = sessionData.session.user;

        const { data, error: artisanError } = await supabase
          .from('artisan')
          .select('*')
          .eq('id_artisan', user.id)
          .maybeSingle();

        if (artisanError) throw artisanError;
        if (!data) { setError("Aucun profil artisan n'a été trouvé."); return; }

        const normalizedProfile = {
          id_artisan:       data.id_artisan ?? '',
          nom:              data.nom_artisan || '',
          prenom:           data.prenom_artisan || '',
          metier:           data.metier || '',
          email:            data.email_artisan || '',
          telephone:        data.telephone_artisan || '',
          adresse:          data.localisation ?? '',
          bio:              data.description ?? '',
          tarifHoraire:      data.tarif_horaire ?? 0,
          experiences:      safeArray(data.experiences),
          photoProfil:      data.photo_profil ?? '',
          ville:            data.ville ?? '',
          localisation:      data.localisation ?? '',
          description:      data.description ?? '',
          anneeExperience:  data.annee_experience ?? '',
          sexe:             data.sexe ?? '',
          note:             Number(data.note_moyenne ?? 0),
          nombreAvis:       Number(data.nombre_avis ?? 0),
        };

        setProfile(normalizedProfile);
        setInitialProfile(normalizedProfile);
      } catch (err) {
        console.error('Erreur chargement profil:', err);
        setError(err.message || 'Erreur lors du chargement du profil.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // ── Zones ──
  const handleAddZone = () => {
    if (newZone && !profile.zoneIntervention?.includes(newZone)) {
      setProfile(prev => ({ ...prev, zoneIntervention: [...(prev.zoneIntervention || []), newZone] }));
      setNewZone('');
    }
  };

  const handleRemoveZone = (zone) => {
    setProfile(prev => ({ ...prev, zoneIntervention: (prev.zoneIntervention || []).filter(z => z !== zone) }));
  };

  // ── Uploads ──
  const handlePhotoSuccess = useCallback((publicUrl) => {
    setProfile(prev => ({ ...prev, photoProfil: publicUrl }));
    setShowPhotoModal(false);
  }, []);

  // ── Sauvegarde ──
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const [prenom = '', ...rest] = (profile.nom || '').trim().split(' ');
      const nomFamille = rest.join(' ');

      const payload = {
        nom_artisan:        nomFamille || prenom || '',
        prenom_artisan:     nomFamille ? prenom : '',
        metier:             profile.metier,
        email_artisan:      profile.email,
        telephone_artisan:  profile.telephone,
        localisation:       profile.adresse,
        description:        profile.bio,
        tarif_horaire:      profile.tarifHoraire,
        experiences:        profile.experiences,
        photo_profil:       profile.photoProfil    || null,
        ville:              profile.ville,
        code_postale_artisan: profile.codePostal,
        disponibilite:      profile.disponibilite,
        annee_experience:   profile.anneeExperience === '' ? null : Number(profile.anneeExperience),
        sexe:               profile.sexe,
      };

      const { error: updateError } = await supabase
        .from('artisan')
        .update(payload)
        .eq('id_artisan', profile.id_artisan);

      if (updateError) throw updateError;

      setInitialProfile(profile);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur sauvegarde profil:', err);
      setError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setError('');
  };

  // ── États ──
  if (loading) return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );

  if (error && !profile.id_artisan) return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 border border-red-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil professionnel</h1>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  // ── Rendu ──
  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil professionnel</h1>
          <p className="text-gray-600">Gérez votre profil et votre vitrine</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4" />
            <span>Modifier le profil</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne gauche ── */}
        <div className="space-y-6">

          {/* Photo de profil */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="relative inline-block">
              {profile.photoProfil ? (
                <img
                  src={profile.photoProfil}
                  alt={profile.nom || 'Profil'}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-4 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 text-left">
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nom complet"
                />
                <input
                  type="text"
                  value={profile.metier}
                  onChange={(e) => setProfile(prev => ({ ...prev, metier: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Métier"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">{profile.nom || 'Non renseigné'}</h2>
                <p className="text-gray-600">{profile.metier || 'Non renseigné'}</p>
              </>
            )}

            <div className="flex items-center justify-center space-x-1 mt-3">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{profile.note || 0}</span>
              <span className="text-sm text-gray-500">({profile.nombreAvis || 0} avis)</span>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Coordonnées</h3>
            {isEditing ? (
              <div className="space-y-3">
                <input type="text"  value={profile.telephone} onChange={(e) => setProfile(p => ({ ...p, telephone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Téléphone" />
                <input type="email" value={profile.email}     onChange={(e) => setProfile(p => ({ ...p, email:     e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Email" />
                <input type="text"  value={profile.adresse}   onChange={(e) => setProfile(p => ({ ...p, adresse:   e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Adresse / localisation" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600"><Phone  className="h-4 w-4" /><span className="text-sm">{profile.telephone || 'Non renseigné'}</span></div>
                <div className="flex items-center space-x-3 text-gray-600"><Mail   className="h-4 w-4" /><span className="text-sm">{profile.email     || 'Non renseigné'}</span></div>
                <div className="flex items-center space-x-3 text-gray-600"><MapPin className="h-4 w-4" /><span className="text-sm">{profile.adresse   || 'Non renseigné'}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Bio */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">À propos</h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-3"
                rows="4"
              />
            ) : (
              <p className="text-gray-700">{profile.bio || 'Aucune description renseignée.'}</p>
            )}
          </div>

        

          {/* Expérience */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Expérience professionnelle</h3>
            {isEditing ? (
              <div className="space-y-4">
                {profile.experiences.map((exp, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">Expérience {i + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newExperiences = profile.experiences.filter((_, index) => index !== i);
                          setProfile(p => ({ ...p, experiences: newExperiences }));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.poste || ''}
                        onChange={(e) => {
                          const newExperiences = [...profile.experiences];
                          newExperiences[i] = { ...newExperiences[i], poste: e.target.value };
                          setProfile(p => ({ ...p, experiences: newExperiences }));
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Poste (ex: Plombier)"
                      />
                      <input
                        type="text"
                        value={exp.annee || ''}
                        onChange={(e) => {
                          const newExperiences = [...profile.experiences];
                          newExperiences[i] = { ...newExperiences[i], annee: e.target.value };
                          setProfile(p => ({ ...p, experiences: newExperiences }));
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Période (ex: 2020-2024)"
                      />
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => {
                          const newExperiences = [...profile.experiences];
                          newExperiences[i] = { ...newExperiences[i], description: e.target.value };
                          setProfile(p => ({ ...p, experiences: newExperiences }));
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows="3"
                        placeholder="Description de vos missions et réalisations..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setProfile(p => ({ 
                      ...p, 
                      experiences: [...p.experiences, { poste: '', annee: '', description: '' }] 
                    }));
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Ajouter une expérience
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.experiences.length > 0 ? (
                  profile.experiences.map((exp, i) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-4">
                      <p className="font-medium text-gray-900">{exp.poste || 'Sans titre'}</p>
                      <p className="text-sm text-gray-500">{exp.annee || ''}</p>
                      <p className="text-sm text-gray-600 mt-1">{exp.description || ''}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune expérience renseignée</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal photo de profil */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Uploader une photo de profil</h3>
            <UploadPhotoModal
              onUploadSuccess={handlePhotoSuccess}
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFileSize={2 * 1024 * 1024}
              bucket="profiles"
              folder="profil"
            />
            <button
              onClick={() => setShowPhotoModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

    </div>
  );
}