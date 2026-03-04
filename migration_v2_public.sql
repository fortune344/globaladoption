-- MIGRATION V2 - PUBLIC ACCESS
-- Passage du site en mode 100% public + Admin Panel

-- 1. ADAPTER LA TABLE SUBMISSIONS
-- Rendre user_id optionnel (nullable) car les demandes sont maintenant publiques
ALTER TABLE public.submissions ALTER COLUMN user_id DROP NOT NULL;

-- 2. METTRE À JOUR LES POLITIQUES RLS POUR SUBMISSIONS

-- Supprimer les anciennes politiques conflictuelles ou restrictives
DROP POLICY IF EXISTS "Création demande publique" ON public.submissions;
DROP POLICY IF EXISTS "Admin lit demandes" ON public.submissions;
DROP POLICY IF EXISTS "Admin gère demandes" ON public.submissions;
DROP POLICY IF EXISTS "Admin supprime demandes" ON public.submissions;
DROP POLICY IF EXISTS "Lecture demandes" ON public.submissions;

-- Nouvelle politique : Tout le monde peut insérer une demande (public)
CREATE POLICY "Public insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

-- Nouvelle politique : Seuls les admins peuvent voir/modifier/supprimer
CREATE POLICY "Admin manage submissions"
  ON public.submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. NETTOYAGE (Optionnel mais recommandé)
-- Supprimer le trigger de création de profil automatique (plus d'inscription publique)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Supprimer les settings d'images devenus inutiles (login/signup/profile)
DELETE FROM public.app_settings WHERE key IN ('bg_login', 'bg_signup', 'bg_profile');

-- 4. VÉRIFICATION
-- On s'assure que la table submissions est bien sécurisée (RLS active)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
