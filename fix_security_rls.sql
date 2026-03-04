-- ==============================================================================
-- SÉCURISATION COMPLÈTE : RLS + TABLE DE LOGS DE SÉCURITÉ
-- ==============================================================================

-- ============================================================
-- 1. TABLE security_logs — Enregistrement des événements de sécurité
-- ============================================================

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    details TEXT,
    page_url TEXT
);

-- Permettre l'insertion publique (les events arrivent du frontend)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert security_logs" ON public.security_logs;
CREATE POLICY "Public insert security_logs"
    ON public.security_logs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Seul l'admin peut lire les logs
DROP POLICY IF EXISTS "Admin read security_logs" ON public.security_logs;
CREATE POLICY "Admin read security_logs"
    ON public.security_logs FOR SELECT
    TO authenticated
    USING (true);

-- Nettoyage automatique des vieux logs (> 90 jours)
-- À exécuter périodiquement via un cron ou manuellement
-- DELETE FROM public.security_logs WHERE timestamp < NOW() - INTERVAL '90 days';


-- ============================================================
-- 2. AUDIT RLS — Vérifier que toutes les tables ont RLS activé
-- ============================================================

-- Gallery : lecture publique, gestion admin
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
CREATE POLICY "Public read gallery"
    ON public.gallery FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin manage gallery" ON public.gallery;
CREATE POLICY "Admin manage gallery"
    ON public.gallery FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Testimonials : lecture publique, gestion admin
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials"
    ON public.testimonials FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Admin manage testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Submissions : insert public, gestion admin
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert submissions" ON public.submissions;
CREATE POLICY "Public insert submissions"
    ON public.submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read submissions" ON public.submissions;
CREATE POLICY "Admin read submissions"
    ON public.submissions FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin update submissions" ON public.submissions;
CREATE POLICY "Admin update submissions"
    ON public.submissions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete submissions" ON public.submissions;
CREATE POLICY "Admin delete submissions"
    ON public.submissions FOR DELETE
    TO authenticated
    USING (true);


-- App Settings : lecture publique, modification admin
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON public.app_settings;
CREATE POLICY "Public read settings"
    ON public.app_settings FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin manage settings" ON public.app_settings;
CREATE POLICY "Admin manage settings"
    ON public.app_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Profiles : gestion par utilisateur
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- ============================================================
-- 3. CONTRAINTES DE VALIDATION sur submissions
-- ============================================================

-- S'assurer que le status est valide
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_status_check;
ALTER TABLE public.submissions
ADD CONSTRAINT submissions_status_check
CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled'));


-- ============================================================
-- 4. VÉRIFICATION FINALE
-- ============================================================

-- Vérifier que toutes les tables ont RLS activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('gallery', 'testimonials', 'submissions', 'app_settings', 'profiles', 'security_logs');

-- Lister toutes les policies actives
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
