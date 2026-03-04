// lib/errorUtils.ts

/**
 * Sanitise les erreurs Supabase pour les afficher de manière conviviale
 * Ne jamais exposer les détails techniques aux utilisateurs
 */
export const sanitizeError = (rawError: any): string => {
    const message = (rawError?.message || rawError || '').toString().toLowerCase();

    // ERREURS D'AUTHENTIFICATION
    if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
        return 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
    }
    if (message.includes('user not found')) {
        return 'Aucun compte trouvé avec cet email.';
    }
    if (message.includes('email not confirmed')) {
        return 'Veuillez confirmer votre email avant de vous connecter.';
    }
    if (message.includes('password should be at least')) {
        return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (message.includes('user already registered') || message.includes('already registered')) {
        return 'Cet email est déjà associé à un compte existant.';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
        return 'Trop de tentatives. Veuillez patienter quelques minutes.';
    }
    if (message.includes('invalid email')) {
        return 'Format d\'email invalide.';
    }

    // ERREURS DE VALIDATION
    if (message.includes('violates check constraint')) {
        return 'Certaines données ne respectent pas les contraintes requises.';
    }
    if (message.includes('violates not-null constraint')) {
        return 'Tous les champs obligatoires doivent être remplis.';
    }

    // ERREURS SYSTÈME (masquer les détails)
    if (
        message.includes('violates row-level security') ||
        message.includes('syntax error') ||
        message.includes('constraint') ||
        message.includes('column') ||
        message.includes('relation') ||
        message.includes('permission denied')
    ) {
        console.error('[ERREUR SANITISÉE]:', rawError);
        return 'Vous n\'avez pas les autorisations nécessaires pour cette action.';
    }

    // ERREURS RÉSEAU
    if (message.includes('network') || message.includes('failed to fetch') || message.includes('fetch')) {
        return 'Problème de connexion internet. Veuillez vérifier votre connexion.';
    }

    // TIMEOUT
    if (message.includes('timeout') || message.includes('timed out')) {
        return 'L\'opération a pris trop de temps. Veuillez réessayer.';
    }

    // ERREUR GÉNÉRIQUE
    console.warn('[Erreur non gérée]:', rawError);
    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
};

/**
 * Valide un format d'email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valide la force d'un mot de passe
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    message: string;
} => {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins 8 caractères'
        };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins une minuscule'
        };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins une majuscule'
        };
    }

    if (!/(?=.*\d)/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins un chiffre'
        };
    }

    return { isValid: true, message: '' };
};
