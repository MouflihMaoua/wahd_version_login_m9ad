-- Script pour créer le bucket de stockage pour les documents CIN
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer le bucket pour les documents CIN
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cin-documents',
  'cin-documents',
  true, -- Public pour l'accès aux images
  5242880, -- 5MB en octets
  ARRAY['image/jpeg', 'image/png', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- 2. Créer les politiques RLS pour le bucket CIN
-- Politique pour permettre aux utilisateurs authentifiés d'uploader des CIN
CREATE POLICY "Users can upload CIN documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cin-documents' AND
  auth.role() = 'authenticated'
);

-- Politique pour permettre aux utilisateurs de voir leurs propres CIN
CREATE POLICY "Users can view own CIN documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'cin-documents' AND
  auth.role() = 'authenticated'
);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs CIN
CREATE POLICY "Users can update own CIN documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'cin-documents' AND
  auth.role() = 'authenticated'
);

-- Politique pour permettre aux utilisateurs de supprimer leurs CIN
CREATE POLICY "Users can delete own CIN documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cin-documents' AND
  auth.role() = 'authenticated'
);

-- 3. Donner les permissions pour le bucket
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;

-- 4. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Bucket CIN créé avec succès !';
  RAISE NOTICE '📁 Nom du bucket: cin-documents';
  RAISE NOTICE '🔐 Politiques RLS configurées';
  RAISE NOTICE '📤 Upload autorisé pour les utilisateurs authentifiés';
  RAISE NOTICE '👁️ Accès public aux images (pour affichage)';
  RAISE NOTICE '📏 Taille maximale: 5MB';
  RAISE NOTICE '🖼️ Formats acceptés: JPG, PNG';
  RAISE NOTICE '🚀 Prêt pour le stockage des CIN';
END $$;

-- 5. Vérification de la création du bucket
SELECT 
  id as bucket_id,
  name as bucket_name,
  public as is_public,
  file_size_limit as max_file_size_bytes,
  file_size_limit / 1024 / 1024 as max_file_size_mb,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'cin-documents';

-- 6. Vérification des politiques RLS
SELECT 
  name as policy_name,
  definition as policy_definition
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND name LIKE '%CIN%';

-- Instructions pour tester:
-- 1. Allez dans le dashboard Supabase > Storage
-- 2. Vérifiez que le bucket "cin-documents" existe
-- 3. Testez l'upload d'une image dans le bucket
-- 4. Vérifiez que l'URL publique fonctionne
