-- Script simple et direct pour créer la table users
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Supprimer la table si elle existe (pour repartir de zéro)
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Créer la table users
CREATE TABLE public.users (
  id UUID NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 3. Désactiver RLS temporairement pour permettre l'insertion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. Donner les permissions
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 5. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Table users créée avec succès !';
  RAISE NOTICE '🔓 RLS temporairement désactivé pour les tests';
  RAISE NOTICE '📝 Permissions accordées';
  RAISE NOTICE '🚀 Prêt pour les insertions';
END $$;

-- 6. Pour vérifier la création
SELECT 'Table users créée' as status, COUNT(*) as count FROM public.users;
