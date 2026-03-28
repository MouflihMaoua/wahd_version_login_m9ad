# 🚀 Supabase Authentication System

Solution complète d'authentification avec React et Supabase utilisant votre nouvelle configuration.

## 📋 Configuration

### Supabase
- **URL**: `https://yybiancphbjcexvtilyd.supabase.co/`
- **Anon Key**: `sb_publishable_P6S7q_W99QYFFXiItriWFg_nn5cFxBO`

### Table `users`
```sql
CREATE TABLE public.users (
  id UUID NOT NULL,                    -- UUID de l'utilisateur (auth.users.id)
  email TEXT NOT NULL,                 -- Email de l'utilisateur
  username TEXT NOT NULL,              -- Nom d'utilisateur unique
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);
```

## 📁 Fichiers créés

### 1. `src/services/authService.js`
Service d'authentification complet avec :
- `signUp()` - Création compte + insertion dans table users
- `signIn()` - Connexion + récupération profil
- `signOut()` - Déconnexion
- `getCurrentUser()` - Utilisateur actuel

### 2. `src/pages/RegisterPage.jsx`
Page d'inscription avec :
- Formulaire username, email, password
- Validation complète
- Messages d'erreur personnalisés
- Redirection automatique après succès

### 3. `src/pages/LoginPage.jsx`
Page de connexion avec :
- Formulaire email, password
- Gestion des erreurs
- Redirection vers dashboard

### 4. `setup-users-table.sql`
Script SQL pour :
- Créer la table users
- Configurer RLS (Row Level Security)
- Définir les permissions

## 🛠️ Installation

### 1. Configurer la base de données
```sql
-- Exécuter dans Supabase SQL Editor
-- Copier le contenu de setup-users-table.sql
```

### 2. Installer les dépendances
```bash
npm install @supabase/supabase-js react-hot-toast @tanstack/react-query
```

### 3. Variables d'environnement
Déjà configurées dans `.env`:
```
VITE_SUPABASE_URL=https://yybiancphbjcexvtilyd.supabase.co/
VITE_SUPABASE_ANON_KEY=sb_publishable_P6S7q_W99QYFFXiItriWFg_nn5cFxBO
```

## 🚀 Utilisation

### Inscription
1. Allez sur `http://localhost:5179/register`
2. Remplissez le formulaire
3. Le compte est créé dans Supabase Auth
4. Le profil est inséré dans la table `users`

### Connexion
1. Allez sur `http://localhost:5179/login`
2. Entrez email et mot de passe
3. Redirection vers le dashboard

## 🎯 Flux d'inscription

1. **Formulaire soumis** → `authService.signUp()`
2. **Création utilisateur** dans `auth.users`
3. **Insertion profil** dans `public.users`
4. **Confirmation** et redirection

## 📊 Logging détaillé

Console du navigateur :
```
🔧 Création du compte pour: email@example.com
✅ Utilisateur Supabase créé: uuid-xxx
📝 Insertion dans la table users: {...}
✅ Profil créé avec succès dans la table users
🎉 Compte créé complètement dans Supabase
```

## 🔐 Sécurité

- **RLS activé** sur la table users
- **Politiques simples** pour les permissions
- **Validation frontend** complète
- **Gestion des erreurs** robuste

## 🎨 Fonctionnalités

- ✅ **Inscription complète** (Auth + Table)
- ✅ **Connexion sécurisée**
- ✅ **Validation formulaire**
- ✅ **Messages d'erreur**
- ✅ **Logging détaillé**
- ✅ **Design moderne**
- ✅ **Responsive**

## 🔄 Routes disponibles

- `/register` - Page d'inscription
- `/login` - Page de connexion
- `/dashboard` - Espace personnel

## 🚀 Démarrage

```bash
npm run dev
```

Accès: `http://localhost:5179`

---

**Prêt à utiliser !** L'authentification Supabase est complètement configurée.
