-- ============================================
-- FIX: Politiques RLS pour lecture des données admin
-- ============================================

-- 1. Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'administrateur';

-- 2. Supprimer les anciennes politiques problématiques
DROP POLICY IF EXISTS "Allow authenticated select on administrateur" ON public.administrateur;
DROP POLICY IF EXISTS "Allow admin full access on administrateur" ON public.administrateur;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.administrateur;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.administrateur;

-- 3. Créer des politiques permissives pour l'admin
-- Politique SELECT : permettre à tous les utilisateurs authentifiés de lire
CREATE POLICY "Allow authenticated select on administrateur"
  ON public.administrateur
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique INSERT : permettre à tous les utilisateurs authentifiés d'insérer
CREATE POLICY "Allow authenticated insert on administrateur"
  ON public.administrateur
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Vérifier que l'administrateur existe bien
SELECT * FROM public.administrateur WHERE id_admin = '8cddfb6c-8590-4db5-bfa6-5a34bb3bb68a';

-- 5. Si l'administrateur n'apparaît pas, le créer avec le bon UUID
INSERT INTO public.administrateur (id_admin, nom, prenom, telephone, created_at)
VALUES ('8cddfb6c-8590-4db5-bfa6-5a34bb3bb68a', 'Admin', 'User', NULL, NOW())
ON CONFLICT (id_admin) DO UPDATE SET 
  nom = EXCLUDED.nom, 
  prenom = EXCLUDED.prenom,
  created_at = EXCLUDED.created_at;
