-- ==============================================================================
-- MIGRATION : Ajouter colonne appointment_time + Corriger RLS submissions
-- ==============================================================================
-- Exécuter ce script dans Supabase SQL Editor
-- ==============================================================================

-- 1. Ajouter la colonne appointment_time si elle n'existe pas
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS appointment_time TEXT;

-- 2. S'assurer que appointment_date existe aussi
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS appointment_date TEXT;

-- 3. Recréer les politiques RLS pour SUBMISSIONS
-- Le formulaire public DOIT pouvoir insérer sans être connecté
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

-- IMPORTANT : INSERT ouvert au PUBLIC (pas besoin d'être connecté)
CREATE POLICY "Formulaire public insert" 
    ON public.submissions FOR INSERT 
    WITH CHECK (true);

-- Admin peut tout lire
CREATE POLICY "Admin lecture submissions" 
    ON public.submissions FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Admin peut modifier le statut
CREATE POLICY "Admin update submissions" 
    ON public.submissions FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Admin peut supprimer
CREATE POLICY "Admin delete submissions" 
    ON public.submissions FOR DELETE 
    USING (auth.role() = 'authenticated');

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 4. Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'submissions' 
ORDER BY ordinal_position;
