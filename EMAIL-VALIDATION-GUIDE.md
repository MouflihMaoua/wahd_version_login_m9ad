# 📧 Guide des Emails Valides pour Supabase

## ❌ Emails à éviter (invalides selon Supabase)

### Formats problématiques :
- `123@gmail.com` - Commence par des chiffres
- `abc@gmail.com` - Trop simple (lettres seules)
- `test@domain.com` - Mots génériques bloqués
- `admin@domain.com` - Rôles génériques bloqués

### Exemples invalides :
```
❌ 123@gmail.com
❌ abc@gmail.com  
❌ test@yahoo.com
❌ admin@outlook.com
❌ user@domain.com
❌ info@company.com
```

## ✅ Emails recommandés (valides)

### Formats acceptés :
- `prenom.nom@domaine.com`
- `prenom123@domaine.com`
- `user.name@domaine.com`
- `contact@domaine.com`

### Exemples valides :
```
✅ mohammed.alami@gmail.com
✅ contact@7rayfi.com
✅ user2024@domaine.com
✅ jean.dupont@yahoo.fr
✅ support@entreprise.com
```

## 🎯 Règles de validation

### 1. Format général
- Doit contenir `@` et un domaine
- Pas d'espaces
- Caractères spéciaux limités

### 2. Parties de l'email
- **Local-part** (avant @) : Éviter chiffres seuls ou lettres seules
- **Domaine** (après @) : Doit être un domaine réel

### 3. Bonnes pratiques
- Utiliser votre vrai email
- Éviter les emails temporaires
- Préférer les emails professionnels

## 📱 Services email recommandés

### Services populaires (valides) :
- Gmail : `prenom.nom@gmail.com`
- Outlook : `prenom.nom@outlook.com`
- Yahoo : `prenom.nom@yahoo.com`
- Pro : `contact@entreprise.com`

## 🚀 Exemples pour tester

### Pour les tests d'inscription :
```
✅ mohammed.test.2024@gmail.com
✅ contact.7rayfi@gmail.com
✅ user.demo.2024@outlook.com
✅ jean.dupont@yahoo.fr
✅ support.test@company.com
```

### Pour le développement :
```
✅ dev.user.2024@gmail.com
✅ test.app.7rayfi@gmail.com
✅ demo.account@outlook.com
```

## ⚠️ Erreurs courantes et solutions

### Erreur : "Email address is invalid"
**Cause** : Format non accepté par Supabase
**Solution** : Utiliser un format email standard

### Erreur : "User already registered"
**Cause** : Email déjà utilisé
**Solution** : Utiliser un autre email ou se connecter

### Erreur : "Invalid email format"
**Cause** : Regex de validation trop stricte
**Solution** : Vérifier le format email@domaine.com

---

## 🎯 Conseils finaux

1. **Utilisez un email réel** pour éviter les blocages
2. **Évitez les formats simples** comme `test@domain.com`
3. **Préférez les emails avec nom complet**
4. **Testez avec des emails différents** si nécessaire

**Les emails comme `mohammed.alami@gmail.com` fonctionnent parfaitement !** ✅
