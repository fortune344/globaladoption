// lib/security.ts
// Module central de sécurité — Global Adoption

// ============================================================
// 1. XSS SANITIZATION (sans dépendance externe)
// ============================================================

/**
 * Supprime toutes les balises HTML et attributs dangereux d'une chaîne.
 * Équivalent léger de DOMPurify({ ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
 */
export const sanitizeHTML = (input: string): string => {
    if (!input) return '';

    return input
        // Supprimer toutes les balises HTML
        .replace(/<[^>]*>/g, '')
        // Supprimer les attributs d'événements (onclick, onerror, etc.)
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Supprimer javascript: / data: dans les URLs
        .replace(/(?:javascript|data|vbscript):/gi, '')
        // Supprimer les expressions CSS dangereuses
        .replace(/expression\s*\(/gi, '')
        .trim();
};

/**
 * Sanitize un objet complet (tous les champs string)
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            (sanitized as Record<string, unknown>)[key] = sanitizeHTML(sanitized[key] as string);
        }
    }
    return sanitized;
};


// ============================================================
// 2. RATE LIMITER
// ============================================================

interface RateLimitEntry {
    timestamps: number[];
}

class RateLimiterClass {
    private store: Map<string, RateLimitEntry> = new Map();

    /**
     * Vérifie si une action est autorisée
     * @param key - Identifiant unique (ex: 'form_submit', 'login_attempt')
     * @param maxAttempts - Nombre max d'actions autorisées
     * @param windowMs - Fenêtre de temps en millisecondes
     * @returns { allowed: boolean, remainingMs: number }
     */
    check(key: string, maxAttempts: number, windowMs: number): {
        allowed: boolean;
        remainingMs: number;
        attemptsLeft: number;
    } {
        const now = Date.now();
        const entry = this.store.get(key) || { timestamps: [] };

        // Nettoyer les anciennes entrées
        entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);

        if (entry.timestamps.length >= maxAttempts) {
            const oldestInWindow = entry.timestamps[0];
            const remainingMs = windowMs - (now - oldestInWindow);
            return {
                allowed: false,
                remainingMs,
                attemptsLeft: 0
            };
        }

        // Enregistrer cette tentative
        entry.timestamps.push(now);
        this.store.set(key, entry);

        return {
            allowed: true,
            remainingMs: 0,
            attemptsLeft: maxAttempts - entry.timestamps.length
        };
    }

    /**
     * Réinitialiser le compteur pour une clé
     */
    reset(key: string): void {
        this.store.delete(key);
    }
}

// Instance singleton
export const rateLimiter = new RateLimiterClass();

// Constantes de rate limiting
export const RATE_LIMITS = {
    FORM_SUBMIT: { maxAttempts: 5, windowMs: 60 * 1000 },       // 5 soumissions / min
    LOGIN_ATTEMPT: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 tentatives / 15 min
} as const;


// ============================================================
// 3. CSRF TOKEN
// ============================================================

let currentCsrfToken: string | null = null;

/**
 * Génère un token CSRF unique et le stocke dans sessionStorage
 */
export const generateCsrfToken = (): string => {
    const token = crypto.randomUUID();
    currentCsrfToken = token;
    try {
        sessionStorage.setItem('csrf_token', token);
    } catch {
        // sessionStorage peut échouer en mode privé
    }
    return token;
};

/**
 * Valide un token CSRF
 */
export const validateCsrfToken = (token: string): boolean => {
    const storedToken = currentCsrfToken || sessionStorage.getItem('csrf_token');
    if (!storedToken || !token) return false;
    return storedToken === token;
};


// ============================================================
// 4. INACTIVITY TIMEOUT (Auto-déconnexion admin)
// ============================================================

type LogoutCallback = () => void;

class InactivityWatcher {
    private timer: ReturnType<typeof setTimeout> | null = null;
    private timeoutMs: number;
    private onTimeout: LogoutCallback | null = null;
    private events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    private boundReset: () => void;

    constructor(timeoutMinutes: number = 15) {
        this.timeoutMs = timeoutMinutes * 60 * 1000;
        this.boundReset = this.resetTimer.bind(this);
    }

    start(onTimeout: LogoutCallback): void {
        this.onTimeout = onTimeout;
        this.events.forEach(event =>
            window.addEventListener(event, this.boundReset, { passive: true })
        );
        this.resetTimer();
    }

    stop(): void {
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        this.events.forEach(event =>
            window.removeEventListener(event, this.boundReset)
        );
    }

    private resetTimer(): void {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.onTimeout) this.onTimeout();
        }, this.timeoutMs);
    }
}

export const inactivityWatcher = new InactivityWatcher(15); // 15 minutes


// ============================================================
// 5. SECURITY LOGGER
// ============================================================

import { supabase } from './supabase';

export type SecurityEventType =
    | 'login_success'
    | 'login_failed'
    | 'login_locked'
    | 'logout'
    | 'inactivity_logout'
    | 'csrf_violation'
    | 'rate_limit_hit'
    | 'xss_attempt'
    | 'suspicious_input';

/**
 * Enregistre un événement de sécurité dans la table security_logs
 * Échoue silencieusement si la table n'existe pas encore
 */
export const logSecurityEvent = async (
    eventType: SecurityEventType,
    details?: string
): Promise<void> => {
    try {
        await supabase.from('security_logs').insert({
            event_type: eventType,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: details || null,
            page_url: window.location.pathname
        });
    } catch {
        // Silencieux — ne pas faire planter l'app si la table n'existe pas
        console.warn('[Security] Impossible de logger l\'événement:', eventType);
    }
};


// ============================================================
// 6. HTTPS ENFORCER
// ============================================================

/**
 * Redirige vers HTTPS en production
 */
export const enforceHTTPS = (): void => {
    if (
        typeof window !== 'undefined' &&
        window.location.protocol === 'http:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
    ) {
        window.location.href = window.location.href.replace('http:', 'https:');
    }
};


// ============================================================
// 7. INPUT VALIDATORS RENFORCÉS
// ============================================================

/**
 * Vérifie si un input contient des tentatives d'injection
 */
export const containsSuspiciousContent = (input: string): boolean => {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,           // onclick=, onerror=, etc.
        /data:\s*text\/html/i,
        /\beval\s*\(/i,
        /\bdocument\s*\./i,
        /\bwindow\s*\./i,
        /\balert\s*\(/i,
        /\bfetch\s*\(/i,
        /DROP\s+TABLE/i,
        /DELETE\s+FROM/i,
        /INSERT\s+INTO/i,
        /UPDATE\s+.*SET/i,
        /UNION\s+SELECT/i,
        /;\s*--/,               // SQL comment injection
        /'\s*OR\s+'1/i,         // Classic SQL injection
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Valide la force d'un mot de passe (admin renforcé)
 */
export const validateStrongPassword = (password: string): {
    isValid: boolean;
    message: string;
    score: number; // 0-5
} => {
    let score = 0;
    const issues: string[] = [];

    if (password.length >= 12) score++;
    else issues.push('12 caractères minimum');

    if (/[a-z]/.test(password)) score++;
    else issues.push('une minuscule');

    if (/[A-Z]/.test(password)) score++;
    else issues.push('une majuscule');

    if (/\d/.test(password)) score++;
    else issues.push('un chiffre');

    if (/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/~`]/.test(password)) score++;
    else issues.push('un caractère spécial (@$!%*?&...)');

    return {
        isValid: score >= 5,
        message: issues.length > 0
            ? `Requis : ${issues.join(', ')}`
            : '',
        score
    };
};


// ============================================================
// 8. HONEYPOT (anti-bot)
// ============================================================

/**
 * Vérifie que le champ honeypot est vide (les bots le remplissent automatiquement)
 */
export const isHoneypotTriggered = (value: string): boolean => {
    return value.length > 0;
};
