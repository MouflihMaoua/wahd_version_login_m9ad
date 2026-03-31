-- Script pour créer la table des notifications
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer la table notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Utilisateur destinataire
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Type de notification
  type TEXT NOT NULL CHECK (type IN ('invitation_accepted', 'invitation_refused', 'devis_accepted', 'devis_refused', 'new_message', 'new_devis', 'payment_request', 'system')),
  
  -- Titre et contenu
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Données associées (IDs pour redirection)
  data JSONB DEFAULT '{}',
  
  -- Statut de lecture
  is_read BOOLEAN DEFAULT false,
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 3. RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs ne voient que leurs propres notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent marquer leurs notifications comme lues
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Politique: System can create notifications for any user
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique: Users can soft delete own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. Fonction pour marquer comme lue
CREATE OR REPLACE FUNCTION mark_notification_as_read(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = NOW()
  WHERE id = p_notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fonction pour créer une notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger pour notifier le particulier quand invitation est acceptée/refusée
CREATE OR REPLACE FUNCTION notify_on_invitation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le statut change vers 'acceptée'
  IF NEW.statut = 'acceptée' AND OLD.statut = 'en attente' THEN
    PERFORM create_notification(
      NEW.id_particulier,
      'invitation_accepted',
      'Invitation acceptée !',
      'Votre demande a été acceptée par l''artisan. Vous pouvez maintenant discuter avec lui.',
      jsonb_build_object('invitation_id', NEW.id, 'artisan_id', NEW.id_artisan)
    );
  
  -- Si le statut change vers 'refusée'
  ELSIF NEW.statut = 'refusée' AND OLD.statut = 'en attente' THEN
    PERFORM create_notification(
      NEW.id_particulier,
      'invitation_refused',
      'Invitation refusée',
      'Votre demande a été refusée par l''artisan.',
      jsonb_build_object('invitation_id', NEW.id, 'artisan_id', NEW.id_artisan)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_notify_invitation_status ON public.invitations;
CREATE TRIGGER trigger_notify_invitation_status
  AFTER UPDATE ON public.invitations
  FOR EACH ROW
  WHEN (OLD.statut IS DISTINCT FROM NEW.statut)
  EXECUTE FUNCTION notify_on_invitation_status_change();

-- 7. Permissions
GRANT ALL ON public.notifications TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_as_read TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;

-- 8. Message de confirmation
SELECT '✅ Table notifications créée avec succès !' as status;
