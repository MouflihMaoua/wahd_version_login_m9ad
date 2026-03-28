-- Script pour créer et configurer la table users
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 2. Activer RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- 4. Créer les politiques RLS
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 5. Donner les permissions
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- 6. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Table users configurée avec succès !';
  RAISE NOTICE '🔐 RLS activé avec politiques simples';
  RAISE NOTICE '📝 Permissions accordées';
  RAISE NOTICE '🚀 Prêt pour les insertions';
END $$;

-- 7. Pour vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 8. Pour tester l'insertion (décommentez pour tester)
/*
INSERT INTO public.users (id, email, username, created_at)
VALUES (
  gen_random_uuid(), 
  'test@example.com', 
  'testuser', 
  NOW()
);
*/

-- 9. Pour vérifier les données existantes
-- SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
