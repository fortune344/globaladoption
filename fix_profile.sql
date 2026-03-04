-- ============================================
-- SCRIPT DE DIAGNOSTIC ET RÉPARATION
-- ============================================
-- Exécutez ce script si vous rencontrez une page blanche après connexion

-- 1. Vérifier si le trigger de création de profil existe
SELECT tgname 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Vérifier votre profil (remplacez par votre email)
SELECT * FROM public.profiles WHERE email = 'VOTRE_EMAIL_ICI';

-- 3. SI LE PROFIL N'EXISTE PAS, créez-le manuellement :
-- Copiez votre ID utilisateur depuis auth.users (tableau Authentication > Users dans Supabase)
-- Puis exécutez :
/*
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'VOTRE_USER_ID_ICI',  -- Remplacez par votre ID d'utilisateur
  'votre@email.com',     -- Votre email
  'Votre Nom',           -- Votre nom
  'admin'                -- Ou 'user'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = 'admin';
*/

-- 4. Donner le rôle admin (si vous êtes administrateur)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'VOTRE_EMAIL_ICI';

-- 5. Vérifier que tout fonctionne
SELECT 
  u.email as "Email Auth",
  p.full_name as "Nom",
  p.role as "Rôle",
  p.joined_date as "Inscrit le"
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'VOTRE_EMAIL_ICI';
