// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Variables d\'environnement Supabase manquantes.\n' +
        'Créez un fichier .env avec:\n' +
        'VITE_SUPABASE_URL=votre_url\n' +
        'VITE_SUPABASE_ANON_KEY=votre_cle\n' +
        'Certaines fonctionnalités ne seront pas disponibles.'
    );
}

// Utiliser des valeurs par défaut pour éviter le crash
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
);
