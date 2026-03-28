-- ═══════════════════════════════════════════════════════════════════════════
-- 7rayfi — Admin dashboard: platform admins, RLS policies, moderation, avis
-- Run this in Supabase SQL Editor (once per project).
-- After running: INSERT your admin auth user id:
--   INSERT INTO public.platform_admins (user_id) VALUES ('YOUR-UUID-FROM-auth.users');
-- ═══════════════════════════════════════════════════════════════════════════

-- 1) Registry of platform administrators (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.platform_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  label TEXT
);

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- Admins can see that they are admins (optional UI)
DROP POLICY IF EXISTS "platform_admins_self_read" ON public.platform_admins;
CREATE POLICY "platform_admins_self_read" ON public.platform_admins
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2) Helper: stable check usable in RLS
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins p
    WHERE p.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- 3) Particulier — optional suspension flag for admin moderation
ALTER TABLE public.particulier
  ADD COLUMN IF NOT EXISTS compte_suspendu BOOLEAN NOT NULL DEFAULT false;

-- 4) Table avis (if you use reviews; safe if already exists — skip errors manually)
CREATE TABLE IF NOT EXISTS public.avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_artisan UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  id_particulier UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  nom_client TEXT,
  note INTEGER CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  service_type TEXT,
  date_avis TIMESTAMPTZ NOT NULL DEFAULT now(),
  reponse_artisan TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avis_artisan ON public.avis (id_artisan);
CREATE INDEX IF NOT EXISTS idx_avis_date ON public.avis (date_avis DESC);

ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Public read for authenticated users (adjust if you want stricter rules)
DROP POLICY IF EXISTS "avis_authenticated_select" ON public.avis;
CREATE POLICY "avis_authenticated_select" ON public.avis
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "avis_particulier_insert" ON public.avis;
CREATE POLICY "avis_particulier_insert" ON public.avis
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id_particulier OR auth.uid() = id_artisan);

-- Artisan can respond
DROP POLICY IF EXISTS "avis_artisan_update_own" ON public.avis;
CREATE POLICY "avis_artisan_update_own" ON public.avis
  FOR UPDATE TO authenticated
  USING (auth.uid() = id_artisan)
  WITH CHECK (auth.uid() = id_artisan);

-- 5) Moderation reports
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user','avis','invitation','devis','other')),
  target_id UUID,
  reason TEXT NOT NULL,
  details TEXT,
  statut TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert','examiné','fermé')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_statut ON public.content_reports (statut);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_reports_insert_auth" ON public.content_reports;
CREATE POLICY "content_reports_insert_auth" ON public.content_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

DROP POLICY IF EXISTS "content_reports_select_own" ON public.content_reports;
CREATE POLICY "content_reports_select_own" ON public.content_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.is_platform_admin());

-- 6) Admin policies — additive (OR with your existing policies)

-- artisan
DROP POLICY IF EXISTS "platform_admin_all_artisan" ON public.artisan;
CREATE POLICY "platform_admin_all_artisan" ON public.artisan
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- particulier
DROP POLICY IF EXISTS "platform_admin_all_particulier" ON public.particulier;
CREATE POLICY "platform_admin_all_particulier" ON public.particulier
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- invitations (demandes)
DROP POLICY IF EXISTS "platform_admin_all_invitations" ON public.invitations;
CREATE POLICY "platform_admin_all_invitations" ON public.invitations
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- devis
DROP POLICY IF EXISTS "platform_admin_all_devis" ON public.devis;
CREATE POLICY "platform_admin_all_devis" ON public.devis
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- avis — admin delete / update for moderation
DROP POLICY IF EXISTS "platform_admin_all_avis" ON public.avis;
CREATE POLICY "platform_admin_all_avis" ON public.avis
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- content_reports — admin update status
DROP POLICY IF EXISTS "platform_admin_all_reports" ON public.content_reports;
CREATE POLICY "platform_admin_all_reports" ON public.content_reports
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- ═══════════════════════════════════════════════════════════════════════════
-- Done. Remember:
-- INSERT INTO public.platform_admins (user_id, label) VALUES ('...uuid...', 'principal');
-- ═══════════════════════════════════════════════════════════════════════════
