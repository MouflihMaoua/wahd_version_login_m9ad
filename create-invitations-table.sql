-- Script pour créer la table des invitations
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer la table invitations
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_particulier UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  id_artisan UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Détails de l'invitation
  service TEXT NOT NULL,
  message TEXT,
  description TEXT,
  
  -- Statut de l'invitation
  statut TEXT NOT NULL DEFAULT 'en attente' CHECK (
    statut IN ('en attente', 'acceptée', 'refusée')
  ),
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID,
  
  -- Contraintes
  CONSTRAINT invitations_unique_pending UNIQUE (id_particulier, id_artisan, statut) 
    DEFERRABLE INITIALLY DEFERRED
);

-- 2. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_invitations_particulier ON public.invitations(id_particulier);
CREATE INDEX IF NOT EXISTS idx_invitations_artisan ON public.invitations(id_artisan);
CREATE INDEX IF NOT EXISTS idx_invitations_statut ON public.invitations(statut);
CREATE INDEX IF NOT EXISTS idx_invitations_created_at ON public.invitations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_deleted_at ON public.invitations(deleted_at);

-- 3. Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invitations_updated_at 
  BEFORE UPDATE ON public.invitations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_invitations_updated_at();

-- 4. RLS Policies pour la sécurité
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Politique pour que les particuliers voient leurs invitations envoyées
CREATE POLICY "Les particuliers peuvent voir leurs invitations envoyées"
  ON public.invitations
  FOR SELECT
  USING (
    auth.uid() = id_particulier
  );

-- Politique pour que les artisans voient les invitations qu'ils ont reçues
CREATE POLICY "Les artisans peuvent voir les invitations reçues"
  ON public.invitations
  FOR SELECT
  USING (
    auth.uid() = id_artisan
  );

-- Politique pour que les particuliers puissent créer des invitations
CREATE POLICY "Les particuliers peuvent créer des invitations"
  ON public.invitations
  FOR INSERT
  WITH CHECK (
    auth.uid() = id_particulier
  );

-- Politique pour que les artisans puissent mettre à jour le statut
CREATE POLICY "Les artisans peuvent mettre à jour le statut des invitations"
  ON public.invitations
  FOR UPDATE
  USING (
    auth.uid() = id_artisan
  )
  WITH CHECK (
    auth.uid() = id_artisan
  );

-- Politique pour le soft delete
CREATE POLICY "Les utilisateurs peuvent supprimer leurs invitations"
  ON public.invitations
  FOR UPDATE
  USING (
    auth.uid() = id_particulier OR auth.uid() = id_artisan
  )
  WITH CHECK (
    auth.uid() = id_particulier OR auth.uid() = id_artisan
  );

-- 5. Fonctions utilitaires
-- Fonction pour vérifier si une invitation existe déjà
CREATE OR REPLACE FUNCTION invitation_exists(
  p_id_particulier UUID,
  p_id_artisan UUID,
  p_statut TEXT DEFAULT 'en attente'
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.invitations 
    WHERE id_particulier = p_id_particulier 
      AND id_artisan = p_id_artisan 
      AND statut = p_statut
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- 6. Vue pour les statistiques des invitations
CREATE OR REPLACE VIEW invitation_stats AS
SELECT 
  COUNT(*) as total_invitations,
  COUNT(CASE WHEN statut = 'en attente' THEN 1 END) as en_attente,
  COUNT(CASE WHEN statut = 'acceptée' THEN 1 END) as acceptees,
  COUNT(CASE WHEN statut = 'refusée' THEN 1 END) as refusees,
  DATE_TRUNC('day', created_at) as date_stat
FROM public.invitations 
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date_stat DESC;

-- 7. Permissions pour la vue
GRANT SELECT ON invitation_stats TO authenticated;
GRANT SELECT ON public.invitations TO authenticated;
GRANT INSERT ON public.invitations TO authenticated;
GRANT UPDATE ON public.invitations TO authenticated;
GRANT DELETE ON public.invitations TO authenticated;

-- 8. Commentaires pour la documentation
COMMENT ON TABLE public.invitations IS 'Table pour gérer les invitations entre particuliers et artisans';
COMMENT ON COLUMN public.invitations.id_particulier IS 'ID du particulier qui envoie l''invitation';
COMMENT ON COLUMN public.invitations.id_artisan IS 'ID de l''artisan qui reçoit l''invitation';
COMMENT ON COLUMN public.invitations.service IS 'Type de service demandé';
COMMENT ON COLUMN public.invitations.message IS 'Message personnalisé du particulier';
COMMENT ON COLUMN public.invitations.statut IS 'Statut: en attente, acceptée, refusée';
