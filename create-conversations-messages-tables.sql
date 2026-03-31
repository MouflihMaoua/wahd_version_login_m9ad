-- Script pour créer les tables conversations et messages
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- ============================================
-- TABLE: conversations
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Lien avec l'invitation qui a déclenché la conversation
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE SET NULL,
  
  -- Participants (artisan et particulier)
  artisan_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  particulier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Métadonnées
  service TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  
  -- Compteurs
  unread_count_artisan INTEGER DEFAULT 0,
  unread_count_particulier INTEGER DEFAULT 0,
  
  -- Dernier message (pour preview)
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_sender_id UUID,
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte unique: une conversation par invitation
  CONSTRAINT unique_conversation_per_invitation UNIQUE (invitation_id)
);

-- Index conversations
CREATE INDEX IF NOT EXISTS idx_conversations_artisan ON public.conversations(artisan_id);
CREATE INDEX IF NOT EXISTS idx_conversations_particulier ON public.conversations(particulier_id);
CREATE INDEX IF NOT EXISTS idx_conversations_invitation ON public.conversations(invitation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- ============================================
-- TABLE: messages
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Lien avec la conversation
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  
  -- Expéditeur
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('artisan', 'particulier')),
  
  -- Contenu
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'devis')),
  
  -- Pour les messages de type devis
  devis_id UUID REFERENCES public.devis(id) ON DELETE SET NULL,
  
  -- Statut
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = false;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (artisan_id = auth.uid() OR particulier_id = auth.uid());

CREATE POLICY "System can create conversations"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Participants can update conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (artisan_id = auth.uid() OR particulier_id = auth.uid())
  WITH CHECK (artisan_id = auth.uid() OR particulier_id = auth.uid());

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.artisan_id = auth.uid() OR c.particulier_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.artisan_id = auth.uid() OR c.particulier_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update message read status"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.artisan_id = auth.uid() OR c.particulier_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.artisan_id = auth.uid() OR c.particulier_id = auth.uid())
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Fonction pour créer une conversation automatiquement
CREATE OR REPLACE FUNCTION create_conversation_on_invitation_accept()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'invitation est acceptée
  IF NEW.statut = 'acceptée' AND OLD.statut = 'en attente' THEN
    -- Vérifier si une conversation existe déjà
    IF NOT EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE invitation_id = NEW.id
    ) THEN
      -- Créer la conversation
      INSERT INTO public.conversations (
        invitation_id,
        artisan_id,
        particulier_id,
        service,
        last_message
      ) VALUES (
        NEW.id,
        NEW.id_artisan,
        NEW.id_particulier,
        NEW.service,
        'Conversation ouverte - Invitation acceptée'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_create_conversation_on_accept ON public.invitations;
CREATE TRIGGER trigger_create_conversation_on_accept
  AFTER UPDATE ON public.invitations
  FOR EACH ROW
  WHEN (OLD.statut IS DISTINCT FROM NEW.statut)
  EXECUTE FUNCTION create_conversation_on_invitation_accept();

-- Fonction pour mettre à jour les compteurs de messages non lus
CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_artisan_id UUID;
  v_particulier_id UUID;
BEGIN
  -- Récupérer les IDs des participants
  SELECT artisan_id, particulier_id 
  INTO v_artisan_id, v_particulier_id
  FROM public.conversations 
  WHERE id = NEW.conversation_id;
  
  -- Mettre à jour la conversation
  UPDATE public.conversations
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    last_message_sender_id = NEW.sender_id,
    unread_count_artisan = CASE 
      WHEN NEW.sender_id != v_artisan_id THEN unread_count_artisan + 1 
      ELSE unread_count_artisan 
    END,
    unread_count_particulier = CASE 
      WHEN NEW.sender_id != v_particulier_id THEN unread_count_particulier + 1 
      ELSE unread_count_particulier 
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_new_message();

-- Fonction pour marquer les messages comme lus
CREATE OR REPLACE FUNCTION mark_conversation_messages_as_read(p_conversation_id UUID)
RETURNS void AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_artisan_id UUID;
  v_particulier_id UUID;
BEGIN
  -- Récupérer les IDs des participants
  SELECT artisan_id, particulier_id 
  INTO v_artisan_id, v_particulier_id
  FROM public.conversations 
  WHERE id = p_conversation_id;
  
  -- Marquer les messages comme lus
  UPDATE public.messages
  SET is_read = true, read_at = NOW()
  WHERE conversation_id = p_conversation_id
  AND sender_id != v_user_id
  AND is_read = false;
  
  -- Réinitialiser le compteur
  IF v_user_id = v_artisan_id THEN
    UPDATE public.conversations
    SET unread_count_artisan = 0
    WHERE id = p_conversation_id;
  ELSIF v_user_id = v_particulier_id THEN
    UPDATE public.conversations
    SET unread_count_particulier = 0
    WHERE id = p_conversation_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PERMISSIONS
-- ============================================
GRANT ALL ON public.conversations TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_messages_as_read TO authenticated;

-- Message de confirmation
SELECT '✅ Tables conversations et messages créées avec succès !' as status;
