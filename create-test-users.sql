-- Script pour créer un utilisateur de test dans Supabase
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer un utilisateur de test directement dans auth.users
-- Note: Ceci est pour le développement uniquement
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'test@artisan.com',
  now(),
  NULL,
  NULL,
  '{"name": "Artisan Test", "role": "artisan"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 2. Créer un utilisateur particulier de test
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'test@particulier.com',
  now(),
  NULL,
  NULL,
  '{"name": "Particulier Test", "role": "particulier"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 3. Créer les tables artisan et particulier si elles n'existent pas
CREATE TABLE IF NOT EXISTS public.artisan (
  id_artisan UUID PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT,
  specialite TEXT,
  experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.particulier (
  id_particulier UUID PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Désactiver RLS temporairement pour l'insertion
ALTER TABLE public.artisan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.particulier DISABLE ROW LEVEL SECURITY;

-- 5. Insérer les données de test dans les tables artisan et particulier
INSERT INTO public.artisan (id_artisan, nom, prenom, email, telephone, specialite, experience)
SELECT 
  u.id,
  'Artisan',
  'Test',
  u.email,
  '0612345678',
  'Plomberie',
  5
FROM auth.users u 
WHERE u.email = 'test@artisan.com'
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.particulier (id_particulier, nom, prenom, email, telephone)
SELECT 
  u.id,
  'Particulier',
  'Test',
  u.email,
  '0612345679'
FROM auth.users u 
WHERE u.email = 'test@particulier.com'
ON CONFLICT (email) DO NOTHING;

-- 6. Activer RLS et créer les politiques
ALTER TABLE public.artisan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.particulier ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table artisan
CREATE POLICY "Artisans can view own profile" ON public.artisan
  FOR SELECT USING (auth.uid() = id_artisan);

CREATE POLICY "Artisans can update own profile" ON public.artisan
  FOR UPDATE USING (auth.uid() = id_artisan);

-- Politiques pour la table particulier
CREATE POLICY "Particuliers can view own profile" ON public.particulier
  FOR SELECT USING (auth.uid() = id_particulier);

CREATE POLICY "Particuliers can update own profile" ON public.particulier
  FOR UPDATE USING (auth.uid() = id_particulier);

-- 7. Donner les permissions
GRANT ALL ON public.artisan TO authenticated;
GRANT SELECT ON public.artisan TO anon;
GRANT ALL ON public.particulier TO authenticated;
GRANT SELECT ON public.particulier TO anon;

-- 8. Créer les mots de passe pour les utilisateurs de test
-- Note: Les mots de passe doivent être créés via l'API Supabase ou le dashboard
-- Pour ce script, nous allons utiliser les mots de passe suivants:
-- test@artisan.com -> password123
-- test@particulier.com -> password123

-- 9. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Utilisateurs de test créés avec succès !';
  RAISE NOTICE '📧 Emails de test:';
  RAISE NOTICE '   - test@artisan.com (mot de passe: password123)';
  RAISE NOTICE '   - test@particulier.com (mot de passe: password123)';
  RAISE NOTICE '🔐 Ces comptes peuvent être utilisés pour tester la connexion';
  RAISE NOTICE '📋 Tables artisan et particulier créées/configurées';
END $$;

-- 10. Vérification des données
SELECT 'Artisan' as type, email, created_at FROM auth.users WHERE email = 'test@artisan.com'
UNION ALL
SELECT 'Particulier' as type, email, created_at FROM auth.users WHERE email = 'test@particulier.com';
