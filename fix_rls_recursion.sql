-- ============================================
-- CORRECTION FORCÉE : Suppression et Recréation RLS
-- ============================================
-- Exécutez ce script pour forcer la correction

-- ÉTAPE 1 : Désactiver temporairement RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 2 : Supprimer TOUTES les politiques existantes (ignorez les erreurs)
DO $$ 
BEGIN
    -- Profiles
    DROP POLICY IF EXISTS "Lecture publique des profils" ON public.profiles;
    DROP POLICY IF EXISTS "Lecture publique profils" ON public.profiles;
    DROP POLICY IF EXISTS "Mise à jour profil personnel" ON public.profiles;
    DROP POLICY IF EXISTS "Modification profil personnel" ON public.profiles;
    DROP POLICY IF EXISTS "Admin peut tout modifier profils" ON public.profiles;
    DROP POLICY IF EXISTS "Insertion profil" ON public.profiles;
    
    -- Gallery
    DROP POLICY IF EXISTS "Lecture publique gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Admin gère gallery" ON public.gallery;
    
    -- Testimonials
    DROP POLICY IF EXISTS "Lecture publique témoignages approuvés" ON public.testimonials;
    DROP POLICY IF EXISTS "Lecture publique témoignages" ON public.testimonials;
    DROP POLICY IF EXISTS "Admin gère témoignages" ON public.testimonials;
    DROP POLICY IF EXISTS "Insertion publique témoignages" ON public.testimonials;
    
    -- Submissions
    DROP POLICY IF EXISTS "Création demande publique" ON public.submissions;
    DROP POLICY IF EXISTS "Admin lit demandes" ON public.submissions;
    DROP POLICY IF EXISTS "Admin gère demandes" ON public.submissions;
    DROP POLICY IF EXISTS "Admin modifie demandes" ON public.submissions;
    DROP POLICY IF EXISTS "Admin supprime demandes" ON public.submissions;
    
    -- App Settings
    DROP POLICY IF EXISTS "Lecture publique settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Admin modifie settings" ON public.app_settings;
END $$;

-- ÉTAPE 3 : Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 4 : Créer les nouvelles politiques SANS RÉCURSION

-- ==================
-- PROFILES
-- ==================
CREATE POLICY "Lecture publique profils"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Modification profil personnel"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Insertion profil"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- ==================
-- APP_SETTINGS
-- ==================
CREATE POLICY "Lecture publique settings"
  ON public.app_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin modifie settings"
  ON public.app_settings FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- ==================
-- GALLERY
-- ==================
CREATE POLICY "Lecture publique gallery"
  ON public.gallery FOR SELECT
  USING (is_visible = true OR (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin');

CREATE POLICY "Admin gère gallery"
  ON public.gallery FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- ==================
-- TESTIMONIALS
-- ==================
CREATE POLICY "Lecture publique témoignages"
  ON public.testimonials FOR SELECT
  USING (is_approved = true OR (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin');

CREATE POLICY "Admin gère témoignages"
  ON public.testimonials FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Insertion publique témoignages"
  ON public.testimonials FOR INSERT
  WITH CHECK (true);

-- ==================
-- SUBMISSIONS
-- ==================
CREATE POLICY "Création demande publique"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin lit demandes"
  ON public.submissions FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admin modifie demandes"
  ON public.submissions FOR UPDATE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admin supprime demandes"
  ON public.submissions FOR DELETE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================
SELECT 'Politiques RLS corrigées avec succès !' as status;

-- Testez :
SELECT * FROM public.profiles LIMIT 1;
SELECT * FROM public.app_settings LIMIT 1;
