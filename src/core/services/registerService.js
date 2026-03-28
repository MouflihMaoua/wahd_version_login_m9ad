import { supabase } from './supabaseClient';

function cleanFileName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.-]/g, '-');
}

async function uploadFile(bucket, folder, file) {
  if (!file) return null;

  const filePath = `${folder}/${Date.now()}-${cleanFileName(file.name)}`;
  console.log('📁 Upload filePath =', filePath);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  console.log('📁 uploadData =', uploadData);
  console.log('📁 uploadError =', uploadError);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  console.log('📁 publicUrl =', data.publicUrl);

  return data.publicUrl;
}

export async function registerUser({
  role,
  formData,
  photoFile,
  cinRectoFile,
  cinVersoFile,
  aExperience,
}) {
  console.log('🚀 registerUser role =', role);
  console.log('🚀 formData =', formData);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email.trim(),
    password: formData.password,
    options: {
      data: {
        role,
      },
    },
  });

  console.log('🔐 authData =', authData);
  console.log('🔐 authError =', authError);

  if (authError) throw authError;
  if (!authData?.user) throw new Error('Utilisateur non créé');

  const userId = authData.user.id;
  console.log('🆔 userId =', userId);

  if (role === 'particulier') {
    const cinRectoUrl = await uploadFile('profiles', `${userId}/cin`, cinRectoFile);
    const cinVersoUrl = await uploadFile('profiles', `${userId}/cin`, cinVersoFile);

    const payload = {
      id_particulier: userId,
      nom_particulier: formData.nom.trim(),
      prenom_particulier: formData.prenom.trim(),
      email_particulier: formData.email.trim(),
      telephone_particulier: formData.telephone.trim(),
      sexe: formData.sexe,
      ville: formData.ville,
      code_postale: formData.codePostal.trim(),
      cin: formData.cin.trim(),
      cin_recto_url: cinRectoUrl,
      cin_verso_url: cinVersoUrl,
    };

    console.log('👤 payload particulier =', payload);

    const { data: insertData, error } = await supabase
      .from('particulier')
      .insert([payload])
      .select();

    console.log('👤 insert particulier data =', insertData);
    console.log('👤 insert particulier error =', error);

    if (error) throw error;
  }

  if (role === 'artisan') {
    const photoUrl = await uploadFile('profiles', `${userId}/photo-profil`, photoFile);

    const payload = {
      id_artisan: userId,
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      email: formData.email.trim(),
      telephone: formData.telephone.trim(),
      sexe: formData.sexe,
      photo_profil: photoUrl,
      description: formData.description.trim(),
      localisation: formData.ville,
      disponibilite: true,
      ville: formData.ville,
      statut_validation: false,
      code_postal: formData.codePostal.trim(),
      annee_experience: aExperience ? Number(formData.anneesExperience || 0) : 0,
      cin: formData.cin.trim(),
      metier: formData.metier,
    };

    console.log('🔧 payload artisan =', payload);

    const { data: insertData, error } = await supabase
      .from('artisan')
      .insert([payload])
      .select();

    console.log('🔧 insert artisan data =', insertData);
    console.log('🔧 insert artisan error =', error);

    if (error) throw error;
  }

  return authData.user;
}