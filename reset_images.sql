-- ==============================================================================
-- NETTOYAGE COMPLET DES IMAGES
-- ==============================================================================
-- 1. Vider la galerie
TRUNCATE TABLE public.gallery;

-- 2. Réinitialiser les paramètres d'images (Hero, Login, Admin, etc.)
-- On met des valeurs vides pour que les anciennes images disparaissent
UPDATE public.app_settings
SET value = ''
WHERE key IN ('bg_login', 'bg_signup', 'bg_profile', 'bg_admin', 'bg_hero');

-- 3. Vérification
SELECT * FROM public.app_settings WHERE key LIKE 'bg_%';
