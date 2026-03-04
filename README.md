# Global Adoption

Plateforme web officielle de **Global Adoption**, organisme autorisé pour l'adoption internationale. Le site permet aux familles de découvrir nos services, de soumettre une demande d'adoption et de prendre rendez-vous directement en ligne.

## Fonctionnalités

### Site public
- Présentation de l'organisme, des étapes de l'adoption et des témoignages
- Formulaire de demande d'adoption sécurisé avec sélection de pays et prise de rendez-vous
- Galerie photo avec lightbox
- Navigation responsive et optimisée pour mobile

### Panel d'administration
- Tableau de bord avec statistiques en temps réel
- Gestion des demandes reçues (statuts, filtres, détails)
- Gestion des témoignages (approbation, suppression)
- Gestion des administrateurs
- Journal de sécurité avec historique des connexions

## Stack technique

| Couche       | Technologie                        |
|-------------|------------------------------------|
| Frontend    | React 18, TypeScript, Vite         |
| Styling     | TailwindCSS, animations CSS custom |
| Backend     | Supabase (PostgreSQL, Auth, RLS)   |
| Hébergement | Vercel (CDN mondial)               |
| Domaine     | global-adoption.com                |

## Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/FORTUNE45/globaladoption.git
cd globaladoption

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer le serveur de développement
npm run dev
```

## Sécurité

- Row Level Security (RLS) activée sur toutes les tables Supabase
- Authentification admin par email/mot de passe avec verrouillage après tentatives échouées
- Déconnexion automatique après inactivité
- Sanitisation de toutes les entrées utilisateur
- Protection CSRF sur les formulaires
- Journal de sécurité traçant les connexions et événements

## Licence

Tous droits réservés — Global Adoption.
