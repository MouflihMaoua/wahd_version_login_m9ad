-- ============================================
-- FIX: Politiques RLS pour table administrateur
-- ============================================

-- 1. Activer RLS sur la table administrateur
ALTER TABLE public.administrateur ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques s'il en existe
DROP POLICY IF EXISTS "Allow authenticated select on administrateur" ON public.administrateur;
DROP POLICY IF EXISTS "Allow authenticated insert on administrateur" ON public.administrateur;
DROP POLICY IF EXISTS "Allow admin full access on administrateur" ON public.administrateur;

-- 3. Politique pour permettre SELECT (vérifier si on est admin)
CREATE POLICY "Allow authenticated select on administrateur"
  ON public.administrateur
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Politique pour permettre INSERT (s'ajouter soi-même comme admin)
CREATE POLICY "Allow authenticated insert on administrateur"
  ON public.administrateur
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Politique pour permettre UPDATE/DELETE (seulement pour les admins existants)
CREATE POLICY "Allow admin full access on administrateur"
  ON public.administrateur
  FOR ALL
  TO authenticated
  USING (id_admin = auth.uid())
  WITH CHECK (id_admin = auth.uid());

-- ============================================
-- AJOUTER L'UTILISATEUR ACTUEL COMME ADMIN
-- ============================================

-- Remplacer par votre UUID réel (visible dans la page Paramètres)
-- L'UUID actuel: 8cdf66c-8590-4db5-bfa6-5a340b3bb68a

INSERT INTO public.administrateur (id_admin, nom, prenom, telephone)
VALUES ('8cdf66c-8590-4db5-bfa6-5a340b3bb68a', 'Admin', 'User', NULL)
ON CONFLICT (id_admin) DO NOTHING;

-- ============================================
-- VÉRIFICATION
-- ============================================

SELECT * FROM public.administrateur;
