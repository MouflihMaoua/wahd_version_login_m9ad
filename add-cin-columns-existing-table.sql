-- Script pour AJOUTER les colonnes CIN à la table artisan existante
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Ajouter les colonnes CIN à la table existante
ALTER TABLE public.artisan 
ADD COLUMN IF NOT EXISTS cin TEXT,
ADD COLUMN IF NOT EXISTS carte_cin_recto TEXT,
ADD COLUMN IF NOT EXISTS carte_cin_verso TEXT;

-- 2. Ajouter la contrainte d'unicité sur le CIN
ALTER TABLE public.artisan 
ADD CONSTRAINT artisan_cin_key UNIQUE (cin);

-- 3. Créer un index pour la recherche CIN
CREATE INDEX IF NOT EXISTS idx_artisan_cin ON public.artisan(cin);

-- 4. Mettre à jour les politiques RLS pour inclure les nouvelles colonnes
DROP POLICY IF EXISTS "Artisans can view own profile" ON public.artisan;
DROP POLICY IF EXISTS "Artisans can update own profile" ON public.artisan;
DROP POLICY IF EXISTS "Public can view artisan profiles" ON public.artisan;

-- Recréer les politiques avec les nouvelles colonnes
CREATE POLICY "Artisans can view own profile" ON public.artisan
  FOR SELECT USING (auth.uid() = id_artisan);

CREATE POLICY "Artisans can update own profile" ON public.artisan
  FOR UPDATE USING (auth.uid() = id_artisan);

CREATE POLICY "Public can view artisan profiles" ON public.artisan
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (id_artisan IS NOT NULL OR auth.uid() = id_artisan)
  );

-- 5. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Colonnes CIN ajoutées avec succès !';
  RAISE NOTICE '📋 Colonnes ajoutées:';
  RAISE NOTICE '   - cin (TEXT, UNIQUE)';
  RAISE NOTICE '   - carte_cin_recto (TEXT)';
  RAISE NOTICE '   - carte_cin_verso (TEXT)';
  RAISE NOTICE '🔍 Index créé sur la colonne cin';
  RAISE NOTICE '🛡️ Politiques RLS mises à jour';
  RAISE NOTICE '🚀 Table artisan prête pour CIN';
END $$;

-- 6. Vérification de la structure mise à jour
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'artisan'
AND column_name IN ('cin', 'carte_cin_recto', 'carte_cin_verso')
ORDER BY ordinal_position;

-- 7. Vérification des contraintes
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'artisan'
AND tc.constraint_type = 'UNIQUE'
AND kcu.column_name = 'cin';
