-- Script complet pour créer les tables users et todos
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer la table users (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_email_key UNIQUE (email)
);

-- 2. Créer la table todos
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Désactiver RLS temporairement pour permettre l'insertion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;

-- 4. Donner les permissions pour la table users
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 5. Donner les permissions pour la table todos
GRANT ALL ON public.todos TO authenticated;
GRANT SELECT ON public.todos TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. Activer RLS pour la table users (sécurisé)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Politiques pour la table users
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 8. Activer RLS pour la table todos (ouvert pour le test)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 9. Politiques pour la table todos (accès complet pour le test)
CREATE POLICY "Todos are viewable by everyone" ON public.todos
  FOR SELECT USING (true);

CREATE POLICY "Todos are insertable by everyone" ON public.todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos are updateable by everyone" ON public.todos
  FOR UPDATE USING (true);

CREATE POLICY "Todos are deletable by everyone" ON public.todos
  FOR DELETE USING (true);

-- 10. Insérer des données de test pour todos
INSERT INTO public.todos (title, description, completed) VALUES
  ('Premier todo - Test connexion', 'Vérifier que la connexion Supabase fonctionne', false),
  ('Deuxième todo - Test inscription', 'Tester linscription avec le mode simulation', false),
  ('Troisième todo - Test chat', 'Vérifier que le chat en temps réel fonctionne', true);

-- 11. Insérer un utilisateur de test pour users
INSERT INTO public.users (id, email, username, created_at) VALUES
  ('00000000-0000-0000-0000-000000000000', 'test@7rayfi.com', 'testuser', NOW());

-- 12. Vérifier la création des tables
SELECT 'Table users créée avec succès' as status, COUNT(*) as count FROM public.users;
SELECT 'Table todos créée avec succès' as status, COUNT(*) as count FROM public.todos;

-- 13. Afficher les données insérées
SELECT '=== UTILISATEURS DE TEST ===' as info;
SELECT id, email, username, created_at FROM public.users;

SELECT '=== TODOS DE TEST ===' as info;
SELECT id, title, completed, created_at FROM public.todos ORDER BY created_at DESC;
