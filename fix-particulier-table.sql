-- Script pour mettre à jour la table particulier avec les colonnes manquantes
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Désactiver RLS temporairement pour la modification
ALTER TABLE public.particulier DISABLE ROW LEVEL SECURITY;

-- 2. Ajouter les colonnes manquantes si elles n'existent pas déjà
ALTER TABLE public.particulier 
ADD COLUMN IF NOT EXISTS nom_particulier TEXT,
ADD COLUMN IF NOT EXISTS prenom_particulier TEXT,
ADD COLUMN IF NOT EXISTS email_particulier TEXT,
ADD COLUMN IF NOT EXISTS telephone_particulier TEXT,
ADD COLUMN IF NOT EXISTS sexe TEXT,
ADD COLUMN IF NOT EXISTS ville TEXT,
ADD COLUMN IF NOT EXISTS code_postale_particulier TEXT,
ADD COLUMN IF NOT EXISTS cin TEXT,
ADD COLUMN IF NOT EXISTS cin_recto_url TEXT,
ADD COLUMN IF NOT EXISTS cin_verso_url TEXT;

-- 3. Mettre à jour les colonnes existantes avec les nouvelles valeurs
-- Si les anciennes colonnes existent, copier les données vers les nouvelles
UPDATE public.particulier 
SET 
  nom_particulier = COALESCE(nom_particulier, nom),
  prenom_particulier = COALESCE(prenom_particulier, prenom),
  email_particulier = COALESCE(email_particulier, email),
  telephone_particulier = COALESCE(telephone_particulier, telephone);

-- 4. Ajouter des contraintes si elles n'existent pas
ALTER TABLE public.particulier 
ADD CONSTRAINT IF NOT EXISTS particulier_email_particulier_unique UNIQUE (email_particulier),
ADD CONSTRAINT IF NOT EXISTS particulier_cin_unique UNIQUE (cin);

-- 5. Ajouter des indexes pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_particulier_nom_particulier ON public.particulier(nom_particulier);
CREATE INDEX IF NOT EXISTS idx_particulier_email_particulier ON public.particulier(email_particulier);
CREATE INDEX IF NOT EXISTS idx_particulier_ville ON public.particulier(ville);
CREATE INDEX IF NOT EXISTS idx_particulier_cin ON public.particulier(cin);

-- 6. Réactiver RLS
ALTER TABLE public.particulier ENABLE ROW LEVEL SECURITY;

-- 7. Mettre à jour les politiques RLS pour inclure les nouvelles colonnes
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own particulier profile" ON public.particulier;
DROP POLICY IF EXISTS "Users can insert their own particulier profile" ON public.particulier;
DROP POLICY IF EXISTS "Users can update their own particulier profile" ON public.particulier;

-- Créer les nouvelles politiques RLS
CREATE POLICY "Users can view their own particulier profile"
  ON public.particulier FOR SELECT
  USING (auth.uid() = id_particulier);

CREATE POLICY "Users can insert their own particulier profile"
  ON public.particulier FOR INSERT
  WITH CHECK (auth.uid() = id_particulier);

CREATE POLICY "Users can update their own particulier profile"
  ON public.particulier FOR UPDATE
  USING (auth.uid() = id_particulier)
  WITH CHECK (auth.uid() = id_particulier);

-- 8. Donner les permissions nécessaires
GRANT ALL ON public.particulier TO authenticated;
GRANT SELECT ON public.particulier TO anon;

-- 9. Validation de la structure
-- Afficher la structure finale de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'particulier' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Table particulier mise à jour avec succès !';
  RAISE NOTICE 'Colonnes ajoutées: nom_particulier, prenom_particulier, email_particulier, telephone_particulier, sexe, ville, code_postale_particulier, cin, cin_recto_url, cin_verso_url';
  RAISE NOTICE 'RLS policies mises à jour';
  RAISE NOTICE 'Indexes créés pour optimisation';
END $$;
