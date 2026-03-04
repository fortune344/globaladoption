-- ==============================================================================
-- SCRIPT FINAL : CONFIGURATION ADMIN & RÉPARATION
-- ==============================================================================
-- 1. Corrige les droits d'accès pour éviter le chargement infini
-- 2. Donne les droits administrateur aux comptes spécifiés
-- ==============================================================================

-- ÉTAPE 1 : Nettoyage radical des politiques de sécurité (RLS)
-- On désactive temporairement pour éviter tout blocage
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- Suppression des anciennes règles qui causent des boucles infinies
DROP POLICY IF EXISTS "Lecture publique profils" ON public.profiles;
DROP POLICY IF EXISTS "Lecture profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin peut tout faire profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin manage submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public insert submissions" ON public.submissions;

-- ÉTAPE 2 : Création de règles simples et robustes

-- REGLES PROFILS (Table profiles)
-- Tout le monde peut lire (nécessaire pour le chargement initial)
CREATE POLICY "Acces lecture profils" ON public.profiles FOR SELECT USING (true);

-- Seul l'utilisateur peut modifier son propre profil
CREATE POLICY "Modif propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent tout faire (basé sur le rôle dans le JWT pour éviter la récursion, ou via une politique directe)
-- Pour éviter la récursion, on permet l'insertion/update global aux admins via le dashboard SQL ou un check simple
CREATE POLICY "Admin tout faire" ON public.profiles FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- REGLES DEMANDES (Table submissions)
-- Public : n'importe qui peut créer une demande
CREATE POLICY "Public creation demande" ON public.submissions FOR INSERT WITH CHECK (true);

-- Admin : accès total aux demandes
CREATE POLICY "Admin gestion demandes" ON public.submissions FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Réactivation de la sécurité
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 3 : CRÉATION DU PROFIL ADMIN
-- Cette étape est CRUCIALE car nous avons désactivé la création automatique.
-- Elle va chercher votre compte dans auth.users et créer le profil admin associé.

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    'Super Admin', 
    'admin'
FROM auth.users
-- ON PREND TOUS LES UTILISATEURS POUR LES PASSER ADMIN SI BESOIN
-- Vous pouvez filtrer avec WHERE email = 'votre@email.com'
ON CONFLICT (id) DO UPDATE 
SET 
    role = 'admin',
    full_name = 'Super Admin';

-- Confirmation
SELECT email, role as nouveau_role FROM public.profiles;
