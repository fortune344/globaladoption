-- ==============================================================================
-- DIAGNOSTIC & CORRECTION : Contraintes table submissions
-- ==============================================================================

-- 1. Voir les contraintes existantes
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.submissions'::regclass;

-- 2. Voir la définition de la colonne status
SELECT column_name, data_type, udt_name, is_nullable
FROM information_schema.columns 
WHERE table_name = 'submissions' AND column_name = 'status';

-- 3. CORRECTION PRÉVENTIVE
-- Si c'est une contrainte de longueur ou autre, on la relâche un peu.
-- Si c'est un CHECK constraint sur le status qui est trop restrictif, on le remplace.

ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_status_check;

ALTER TABLE public.submissions 
ADD CONSTRAINT submissions_status_check 
CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled'));

-- 4. Vérifier que email n'est pas trop strict (juste au cas où)
-- Parfois des vieux constraints bloquent les updates même sur d'autres colonnes
-- (Rien à faire ici sauf si on voit une erreur spécifique)
