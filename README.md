# 📝 README - AdoptEase

## 🌟 À Propos

**AdoptEase** est une plateforme web professionnelle dédiée à l'adoption d'enfants. Elle offre une interface publique pour les familles souhaitant adopter et un panneau d'administration sécurisé pour la gestion des demandes et du contenu.

## 🏗️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : TailwindCSS + CSS Animations custom
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **Routing** : React Router v6 (avec sous-domaines)
- **Authentification** : Email/Password + Google OAuth

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Compte Supabase (gratuit)

### Installation

1. **Cloner/naviguer vers le projet** :
   ```bash
   cd C:\Users\FORTUNE ASSOUAN\.gemini\antigravity\scratch\adoptease
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer Supabase** :
   - Créez un projet sur [supabase.com](https://supabase.com)
   - Exécutez `master_setup.sql` dans le SQL Editor
   - Créez un fichier `.env` :
     ```env
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=votre_anon_key
     ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

5. **Créer un admin** :
   - Inscrivez-vous via l'app
   - Dans Supabase SQL Editor :
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
     ```

## 📂 Structure

```
src/
├── components/
│   ├── public/          # Site public
│   │   ├── auth/        # Authentification
│   │   └── ...
│   ├── PublicApp.tsx    # App publique
│   └── AdminApp.tsx     # App admin
├── contexts/            # Contextes React
├── lib/                 # Utilitaires
└── App.tsx              # Point d'entrée
```

## 🔐 Sécurité

- **RLS (Row Level Security)** activée sur toutes les tables
- **Sanitisation des erreurs** pour protéger les détails techniques
- **Validations strictes** sur tous les formulaires
- **Rôles utilisateurs** (admin/user)

## 🎨 Fonctionnalités

### Site Public
- ✅ Hero avec animation typewriter
- ✅ Galerie avec lightbox
- ✅ Témoignages
- ✅ Formulaire de contact validé
- ✅ Navigation responsive

### Authentification
- ✅ Inscription/Connexion
- ✅ Google OAuth
- ✅ Gestion de profil

### Admin (Base)
- ✅ Détection de sous-domaine
- ✅ Protection par rôle
- 🚧 CRUD complet (à développer)

## 📜 Licence

Projet créé pour AdoptEase - Tous droits réservés.

## 🆘 Support

Pour toute question, consultez [walkthrough.md](./walkthrough.md) pour un guide complet.
