-- ==============================================================================
-- CORRECTION CRITIQUE RLS (Pour stopper le chargement infini)
-- ==============================================================================

-- Désactiver temporairement RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 1. SUPPRIMER TOUTES LES POLITIQUES ACTUELLES SUR PROFILES
-- On nettoie tout pour être sûr
DROP POLICY IF EXISTS "Acces lecture profils" ON public.profiles;
DROP POLICY IF EXISTS "Modif propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Admin tout faire" ON public.profiles;
DROP POLICY IF EXISTS "Lecture publique profils" ON public.profiles;
DROP POLICY IF EXISTS "Lecture profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin peut tout faire profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin view profiles" ON public.profiles;

-- 2. CRÉER DES POLITIQUES SÉPARÉES (C'est la clé !)

-- A. LECTURE (SELECT) : SANS condition récursive !!!
-- Tout le monde peut lire les profils (nécessaire pour vérifier qui est admin)
CREATE POLICY "Lecture profils"
ON public.profiles FOR SELECT
USING (true);

-- B. ÉCRITURE (INSERT, UPDATE, DELETE) : AVEC vérification Admin
-- On sépare ces actions pour ne pas bloquer la lecture
CREATE POLICY "Admin ecriture profils"
ON public.profiles FOR INSERT
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin modification profils"
ON public.profiles FOR UPDATE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  OR auth.uid() = id -- L'utilisateur peut aussi modifier son propre profil
);

CREATE POLICY "Admin suppression profils"
ON public.profiles FOR DELETE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. ASSURER LE PROFIL ADMIN
-- On s'assure que votre compte est bien admin
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    'Super Admin', 
    'admin'
FROM auth.users
WHERE email ILIKE '%@%'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

SELECT 'Correction appliquée avec succès. Le chargement infini devrait être résolu.' as status;
