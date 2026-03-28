-- Création de la table todos pour le test de connexion Supabase
-- Exécuter ce SQL dans votre projet Supabase : 
-- https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql

-- 1. Créer la table todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activer Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 3. Créer une politique pour permettre à tout le monde de lire les todos
CREATE POLICY "Enable read access for all users" ON todos
  FOR SELECT USING (true);

-- 4. Créer une politique pour permettre à tout le monde d'insérer des todos
CREATE POLICY "Enable insert access for all users" ON todos
  FOR INSERT WITH CHECK (true);

-- 5. Créer une politique pour permettre à tout le monde de mettre à jour les todos
CREATE POLICY "Enable update access for all users" ON todos
  FOR UPDATE USING (true);

-- 6. Créer une politique pour permettre à tout le monde de supprimer les todos
CREATE POLICY "Enable delete access for all users" ON todos
  FOR DELETE USING (true);

-- 7. Insérer quelques todos de test (optionnel)
INSERT INTO todos (title, description, completed) VALUES
  ('Premier todo', 'Ceci est un todo de test', false),
  ('Deuxième todo', 'Un autre todo pour tester', false),
  ('Todo complété', 'Exemple de todo terminé', true);

-- 8. Vérifier la création
SELECT * FROM todos ORDER BY created_at DESC;
