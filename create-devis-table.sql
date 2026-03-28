-- Script pour créer la table des devis avec la structure appropriée
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer la table devis
CREATE TABLE IF NOT EXISTS public.devis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_artisan UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations client (stockées en JSON)
  client_info JSONB NOT NULL,
  
  -- Détails du service
  service TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  delai TEXT NOT NULL,
  
  -- Tarification
  montant_ht DECIMAL(10,2) NOT NULL CHECK (montant_ht >= 0),
  tva DECIMAL(5,2) NOT NULL DEFAULT 20.00 CHECK (tva >= 0 AND tva <= 100),
  montant_ttc DECIMAL(10,2) NOT NULL CHECK (montant_ttc >= 0),
  
  -- Articles (JSON pour les lignes de devis)
  articles JSONB DEFAULT '[]',
  
  -- Statut et dates
  statut TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyé', 'accepté', 'refusé')),
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_envoi TIMESTAMP WITH TIME ZONE,
  date_acceptation TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  numero_devis TEXT UNIQUE,
  reference_interne TEXT,
  
  -- Indexs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_devis_artisan ON public.devis(id_artisan);
CREATE INDEX IF NOT EXISTS idx_devis_statut ON public.devis(statut);
CREATE INDEX IF NOT EXISTS idx_devis_date_creation ON public.devis(date_creation);
CREATE INDEX IF NOT EXISTS idx_devis_numero ON public.devis(numero_devis);
CREATE INDEX IF NOT EXISTS idx_devis_client_email ON public.devis USING (gin ((client_info->>'email')));

-- 3. Activer RLS (Row Level Security)
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Artisans can view own devis" ON public.devis;
DROP POLICY IF EXISTS "Artisans can create own devis" ON public.devis;
DROP POLICY IF EXISTS "Artisans can update own devis" ON public.devis;
DROP POLICY IF EXISTS "Artisans can delete own devis" ON public.devis;

-- 5. Créer les politiques RLS
CREATE POLICY "Artisans can view own devis" ON public.devis
  FOR SELECT USING (auth.uid() = id_artisan);

CREATE POLICY "Artisans can create own devis" ON public.devis
  FOR INSERT WITH CHECK (auth.uid() = id_artisan);

CREATE POLICY "Artisans can update own devis" ON public.devis
  FOR UPDATE USING (auth.uid() = id_artisan);

CREATE POLICY "Artisans can delete own devis" ON public.devis
  FOR DELETE USING (auth.uid() = id_artisan);

-- 6. Donner les permissions
GRANT ALL ON public.devis TO authenticated;
GRANT SELECT ON public.devis TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Créer une fonction pour générer automatiquement les numéros de devis
CREATE OR REPLACE FUNCTION generer_numero_devis()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  annee TEXT := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  mois TEXT := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0');
  sequence_num TEXT;
BEGIN
  -- Créer une séquence pour l'année en cours si elle n'existe pas
  BEGIN
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS devis_seq_%s', annee);
  EXCEPTION WHEN OTHERS THEN
    -- La séquence existe déjà
    NULL;
  END;
  
  -- Obtenir le prochain numéro de la séquence
  EXECUTE format('SELECT nextval(''devis_seq_%s'')', annee) INTO sequence_num;
  
  -- Formater le numéro de devis: DEV-YYYYMM-XXXX
  RETURN format('DEV-%s%s-%s', annee, mois, LPAD(sequence_num, 4, '0'));
END;
$$;

-- 8. Créer un trigger pour générer automatiquement le numéro de devis
CREATE OR REPLACE FUNCTION set_numero_devis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.numero_devis IS NULL OR NEW.numero_devis = '' THEN
    NEW.numero_devis := generer_numero_devis();
  END IF;
  RETURN NEW;
END;
$$;

-- 9. Créer le trigger
DROP TRIGGER IF EXISTS trigger_set_numero_devis ON public.devis;
CREATE TRIGGER trigger_set_numero_devis
  BEFORE INSERT ON public.devis
  FOR EACH ROW
  EXECUTE FUNCTION set_numero_devis();

-- 10. Créer une fonction pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION update_devis_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at := now();
  NEW.date_modification := now();
  RETURN NEW;
END;
$$;

-- 11. Créer le trigger pour la mise à jour automatique
DROP TRIGGER IF EXISTS trigger_update_devis_timestamp ON public.devis;
CREATE TRIGGER trigger_update_devis_timestamp
  BEFORE UPDATE ON public.devis
  FOR EACH ROW
  EXECUTE FUNCTION update_devis_timestamp();

-- 12. Créer une vue pour les statistiques des devis
CREATE OR REPLACE VIEW statistiques_devis AS
SELECT 
  id_artisan,
  COUNT(*) as total_devis,
  COUNT(*) FILTER (WHERE statut = 'brouillon') as brouillons,
  COUNT(*) FILTER (WHERE statut = 'envoyé') as envoyes,
  COUNT(*) FILTER (WHERE statut = 'accepté') as acceptes,
  COUNT(*) FILTER (WHERE statut = 'refusé') as refuses,
  SUM(montant_ttc) FILTER (WHERE statut = 'accepté') as chiffre_affaires,
  AVG(montant_ttc) as montant_moyen,
  MIN(date_creation) as premier_devis,
  MAX(date_creation) as dernier_devis
FROM public.devis
GROUP BY id_artisan;

-- 13. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Table devis créée avec succès !';
  RAISE NOTICE '📋 Structure de la table:';
  RAISE NOTICE '   - Informations client (JSONB)';
  RAISE NOTICE '   - Détails du service';
  RAISE NOTICE '   - Tarification (HT, TVA, TTC)';
  RAISE NOTICE '   - Articles (JSONB)';
  RAISE NOTICE '   - Statut et dates';
  RAISE NOTICE '🔍 Index créés pour optimisation';
  RAISE NOTICE '🛡️ RLS activé avec politiques sécurisées';
  RAISE NOTICE '🔢 Numérotation automatique des devis';
  RAISE NOTICE '📊 Vue statistiques créée';
  RAISE NOTICE '🚀 Prêt pour la création de devis !';
END $$;

-- 14. Vérification de la structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'devis'
ORDER BY ordinal_position;

-- 15. Exemple d'insertion de test (décommentez pour tester)
/*
INSERT INTO public.devis (
  id_artisan,
  client_info,
  service,
  description,
  delai,
  montant_ht,
  tva,
  montant_ttc
) VALUES (
  gen_random_uuid(),
  '{"nom": "Jean Dupont", "email": "jean@example.com", "telephone": "0612345678", "adresse": "123 Rue Example, 75000 Paris"}',
  'Plomberie',
  'Installation d\'un nouveau système de plomberie',
  '2 semaines',
  1500.00,
  20.0,
  1800.00
);
*/
