-- Script de diagnostic pour la table users
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Vérifier si la table users existe
SELECT 
  table_name, 
  table_schema,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- 2. Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 4. Vérifier si RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- 5. Donner les permissions de base (si nécessaire)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- 6. Message de diagnostic
DO $$
BEGIN
  RAISE NOTICE '🔍 Diagnostic table users terminé';
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    RAISE NOTICE '✅ Table users existe';
  ELSE
    RAISE NOTICE '❌ Table users n\'existe pas - création nécessaire';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users' AND rowsecurity = true) THEN
    RAISE NOTICE '✅ RLS est activé';
  ELSE
    RAISE NOTICE '❌ RLS n\'est pas activé';
  END IF;
END $$;
