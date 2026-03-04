-- ==============================================================================
-- FIX ACCÈS PUBLIC : Galerie + Témoignages
-- ==============================================================================
-- Ce script s'assure que les visiteurs PEUVENT voir les images et témoignages
-- sans être connectés.
-- ==============================================================================

-- 1. GALLERY : Permettre la lecture publique
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
-- Supprimer TOUTES les politiques existantes sur gallery
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'gallery' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.gallery', pol.policyname);
    END LOOP;
END $$;
-- Créer des règles simples
CREATE POLICY "Public lecture gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admin gestion gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;


-- 2. TESTIMONIALS : Permettre la lecture publique
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'testimonials' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.testimonials', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "Public lecture testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin gestion testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;


-- 3. SUBMISSIONS : Lecture admin, insertion publique
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'submissions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submissions', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "Public insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin lecture submissions" ON public.submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update submissions" ON public.submissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete submissions" ON public.submissions FOR DELETE USING (auth.role() = 'authenticated');
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;


-- 4. APP_SETTINGS : Lecture publique
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'app_settings' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.app_settings', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "Public lecture settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin gestion settings" ON public.app_settings FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;


-- 5. PROFILES : Lecture publique (pour le fonctionnement interne)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "Public lecture profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin gestion profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- Vérification
SELECT 
    tablename, 
    policyname, 
    permissive, 
    cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
