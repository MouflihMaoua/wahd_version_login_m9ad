-- SQL pour ajouter les politiques RLS à la table message_chat
-- Exécutez ce script dans le SQL Editor de Supabase

-- ============================================
-- RLS POLICIES FOR message_chat TABLE
-- ============================================

-- Enable RLS
ALTER TABLE public.message_chat ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow artisans to insert their own messages" ON public.message_chat;
DROP POLICY IF EXISTS "Allow particuliers to insert their own messages" ON public.message_chat;
DROP POLICY IF EXISTS "Allow artisans to read messages they're involved in" ON public.message_chat;
DROP POLICY IF EXISTS "Allow particuliers to read messages they're involved in" ON public.message_chat;
DROP POLICY IF EXISTS "Allow artisans to update messages they're involved in" ON public.message_chat;
DROP POLICY IF EXISTS "Allow particuliers to update messages they're involved in" ON public.message_chat;

-- Policy: Artisans can insert messages where they are the sender
CREATE POLICY "Allow artisans to insert their own messages"
  ON public.message_chat
  FOR INSERT
  TO authenticated
  WITH CHECK (
    envoye_par = 'artisan' AND 
    id_artisan = auth.uid()
  );

-- Policy: Particuliers can insert messages where they are the sender
CREATE POLICY "Allow particuliers to insert their own messages"
  ON public.message_chat
  FOR INSERT
  TO authenticated
  WITH CHECK (
    envoye_par = 'particulier' AND 
    id_particulier = auth.uid()
  );

-- Policy: Artisans can read messages where they are involved
CREATE POLICY "Allow artisans to read messages they're involved in"
  ON public.message_chat
  FOR SELECT
  TO authenticated
  USING (
    id_artisan = auth.uid()
  );

-- Policy: Particuliers can read messages where they are involved
CREATE POLICY "Allow particuliers to read messages they're involved in"
  ON public.message_chat
  FOR SELECT
  TO authenticated
  USING (
    id_particulier = auth.uid()
  );

-- Policy: Artisans can update messages where they are involved (mark as read)
CREATE POLICY "Allow artisans to update messages they're involved in"
  ON public.message_chat
  FOR UPDATE
  TO authenticated
  USING (
    id_artisan = auth.uid()
  )
  WITH CHECK (
    id_artisan = auth.uid()
  );

-- Policy: Particuliers can update messages where they are involved (mark as read)
CREATE POLICY "Allow particuliers to update messages they're involved in"
  ON public.message_chat
  FOR UPDATE
  TO authenticated
  USING (
    id_particulier = auth.uid()
  )
  WITH CHECK (
    id_particulier = auth.uid()
  );

-- ============================================
-- NOTES
-- ============================================
-- Ces politiques permettent:
-- 1. L'artisan d'envoyer des messages (envoye_par = 'artisan', id_artisan = user.id)
-- 2. Le particulier d'envoyer des messages (envoye_par = 'particulier', id_particulier = user.id)
-- 3. L'artisan de lire les messages où il est impliqué (id_artisan = user.id)
-- 4. Le particulier de lire les messages où il est impliqué (id_particulier = user.id)
-- 5. L'artisan de marquer les messages comme lus
-- 6. Le particulier de marquer les messages comme lus
