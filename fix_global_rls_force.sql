-- ==============================================================================
-- FIX GLOBAL RLS (ANTI-BOUCLE)
-- ==============================================================================
-- Ce script nettoie TOUTES les tables critiques pour être sûr à 100%
-- ==============================================================================

-- Désactiver RLS partout
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- 1. PROFILES (La base)
DROP POLICY IF EXISTS "Lecture profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin ecriture profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin modification profils" ON public.profiles;
DROP POLICY IF EXISTS "Admin suppression profils" ON public.profiles;
-- ... et tout le reste ...
DROP POLICY IF EXISTS "Acces lecture profils" ON public.profiles;
DROP POLICY IF EXISTS "Modif propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Admin tout faire" ON public.profiles;

-- Règle Simple : Tout le monde lit, Admin écrit
CREATE POLICY "Lecture profils" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin write profils" ON public.profiles FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin update profils" ON public.profiles FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR id = auth.uid());
CREATE POLICY "Admin delete profils" ON public.profiles FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- 2. APP_SETTINGS
DROP POLICY IF EXISTS "Lecture publique settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admin modifie settings" ON public.app_settings;

CREATE POLICY "Lecture settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON public.app_settings FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- 3. GALLERY
DROP POLICY IF EXISTS "Lecture publique gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin gère gallery" ON public.gallery;

CREATE POLICY "Lecture gallery" ON public.gallery FOR SELECT USING (true); -- Simplifié : tout visible (ou filtrer côté client si needed, mais pour admin panel on veut tout voir)
CREATE POLICY "Admin write gallery" ON public.gallery FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- 4. TESTIMONIALS
DROP POLICY IF EXISTS "Lecture publique témoignages" ON public.testimonials;
DROP POLICY IF EXISTS "Admin gère témoignages" ON public.testimonials;

CREATE POLICY "Lecture testimonials" ON public.testimonials FOR SELECT USING (true); 
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- 5. SUBMISSIONS
DROP POLICY IF EXISTS "Public creation demande" ON public.submissions;
DROP POLICY IF EXISTS "Admin gestion demandes" ON public.submissions;

CREATE POLICY "Insert public submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage submissions" ON public.submissions FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

SELECT 'RLS GLOBALEMENT CORRIGÉ' as status;
