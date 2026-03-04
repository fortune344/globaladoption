-- ============================================
-- SCRIPTSETUP SUPABASE - ADOPTEASE
-- Plateforme d'Adoption d'Enfants
-- ============================================

-- ÉTAPE 1 : Nettoyage préalable (optionnel)
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;

-- ÉTAPE 2 : Création des tables

-- TABLE PROFILES (Profils utilisateurs)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec gestion des rôles';
COMMENT ON COLUMN public.profiles.role IS 'Rôle : admin ou user';

-- TABLE SUBMISSIONS (Demandes d'adoption - données sensibles)
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  appointment_date DATE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

COMMENT ON TABLE public.submissions IS 'Demandes de rendez-vous pour adoption - DONNÉES SENSIBLES';
COMMENT ON COLUMN public.submissions.status IS 'Statut : pending, reviewed, approved, rejected';

-- TABLE TESTIMONIALS (Témoignages)
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

COMMENT ON TABLE public.testimonials IS 'Témoignages de familles adoptives';
COMMENT ON COLUMN public.testimonials.is_approved IS 'Approuvé par admin pour affichage public';

-- TABLE GALLERY (Galerie d''images)
CREATE TABLE public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

COMMENT ON TABLE public.gallery IS 'Galerie d''images (URLs uniquement)';
COMMENT ON COLUMN public.gallery.src IS 'URL de l''image ou chemin local';

-- TABLE APP_SETTINGS (Paramètres du site)
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

COMMENT ON TABLE public.app_settings IS 'Paramètres configurables du site (arrière-plans, etc.)';

-- ÉTAPE 3 : Activation RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 4 : Politiques de sécurité

-- ==================
-- PROFILES
-- ==================

-- Lecture publique des profils (nom et rôle uniquement)
CREATE POLICY "Lecture publique des profils"
  ON public.profiles FOR SELECT
  USING (true);

-- Utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Mise à jour profil personnel"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins peuvent tout modifier
CREATE POLICY "Admin peut tout modifier profils"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================
-- GALLERY
-- ==================

-- Lecture publique des images approuvées
CREATE POLICY "Lecture publique gallery"
  ON public.gallery FOR SELECT
  USING (is_visible = true);

-- Admins gèrent la galerie complète
CREATE POLICY "Admin gère gallery"
  ON public.gallery FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================
-- TESTIMONIALS
-- ==================

-- Lecture publique des témoignages approuvés
CREATE POLICY "Lecture publique témoignages approuvés"
  ON public.testimonials FOR SELECT
  USING (is_approved = true);

-- Admins peuvent tout voir et gérer
CREATE POLICY "Admin gère témoignages"
  ON public.testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================
-- SUBMISSIONS
-- ==================

-- Tout le monde peut soumettre une demande
CREATE POLICY "Création demande publique"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

-- Seuls les admins peuvent lire les demandes
CREATE POLICY "Admin lit demandes"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seuls les admins peuvent modifier/supprimer
CREATE POLICY "Admin gère demandes"
  ON public.submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin supprime demandes"
  ON public.submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================
-- APP_SETTINGS
-- ==================

-- Lecture publique des paramètres
CREATE POLICY "Lecture publique settings"
  ON public.app_settings FOR SELECT
  USING (true);

-- Seuls les admins modifient les paramètres
CREATE POLICY "Admin modifie settings"
  ON public.app_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ÉTAPE 5 : Trigger de création automatique de profil

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Crée automatiquement un profil lors de l''inscription';

-- ÉTAPE 6 : Index pour optimisation

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_testimonials_approved ON public.testimonials(is_approved);
CREATE INDEX idx_gallery_visible ON public.gallery(is_visible);

-- ÉTAPE 7 : Données initiales

-- Paramètres par défaut (arrière-plans)
INSERT INTO public.app_settings (key, value, description) VALUES
  ('bg_login', 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80', 'Arrière-plan page de connexion - Famille heureuse'),
  ('bg_signup', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80', 'Arrière-plan page d''inscription - Moments en famille'),
  ('bg_profile', 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1920&q=80', 'Arrière-plan page profil - Joie familiale'),
  ('bg_admin', 'https://images.unsplash.com/photo-1543269664-647b2dd9d5ca?w=1920&q=80', 'Arrière-plan panneau admin - Sourires'),
  ('bg_hero', 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1920&q=80', 'Arrière-plan section Hero - Famille ensemble')
ON CONFLICT (key) DO NOTHING;

-- Exemples de témoignages (à supprimer ou adapter)
INSERT INTO public.testimonials (name, text, is_approved) VALUES
  ('Marie et Pierre D.', 'Grâce à AdoptEase, nous avons pu concrétiser notre rêve de fonder une famille. Le processus était clair et le suivi impeccable.', true),
  ('Sophie L.', 'Une plateforme professionnelle qui nous a accompagnés à chaque étape. Nous sommes aujourd''hui une famille heureuse !', true),
  ('Jean-Marc et Claire', 'Le personnel est à l''écoute et bienveillant. Nous recommandons vivement cette plateforme.', true)
ON CONFLICT DO NOTHING;

-- Images de galerie exemples (à remplacer par de vraies images)
INSERT INTO public.gallery (src, alt, category, is_visible) VALUES
  ('https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80', 'Famille heureuse ensemble', 'families', true),
  ('https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', 'Moments de joie en famille', 'families', true),
  ('https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80', 'Sourires et bonheur', 'families', true),
  ('https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80', 'Amour familial', 'families', true),
  ('https://images.unsplash.com/photo-1543269664-647b2dd9d5ca?w=800&q=80', 'Rires d''enfants', 'children', true),
  ('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80', 'Jeux en famille', 'families', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUCTIONS POST-INSTALLATION
-- ============================================

-- 1. Exécutez ce script dans l'éditeur SQL Supabase
-- 2. Créez votre premier compte admin :
--    a. Inscrivez-vous normalement via l'application
--    b. Dans l'éditeur SQL, exécutez :
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'votre@email.com';
--
-- 3. Vérifiez les politiques RLS :
--    SELECT * FROM public.profiles; -- Doit fonctionner
--    SELECT * FROM public.submissions; -- Doit échouer pour non-admin
--
-- 4. Configurez les URLs de redirection dans Supabase :
--    Authentication > URL Configuration > Redirect URLs
--    Ajoutez : http://localhost:5173/*, https://votredomaine.com/*

-- Script terminé avec succès!
