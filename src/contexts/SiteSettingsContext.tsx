// contexts/SiteSettingsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
    bgLogin: string;
    bgSignup: string;
    bgProfile: string;
    bgAdmin: string;
    bgHero: string;
}

interface SiteSettingsContextType {
    settings: SiteSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
    updateSetting: (key: string, value: string) => Promise<void>;
}

const defaultSettings: SiteSettings = {
    bgLogin: '',
    bgSignup: '',
    bgProfile: '',
    bgAdmin: '',
    bgHero: '',
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const refreshSettings = async (retries = 3) => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*');

            if (error) throw error;

            if (data) {
                const newSettings = { ...defaultSettings };
                data.forEach((item: { key: string; value: string }) => {
                    if (item.key === 'bg_login') newSettings.bgLogin = item.value;
                    if (item.key === 'bg_signup') newSettings.bgSignup = item.value;
                    if (item.key === 'bg_profile') newSettings.bgProfile = item.value;
                    if (item.key === 'bg_admin') newSettings.bgAdmin = item.value;
                    if (item.key === 'bg_hero') newSettings.bgHero = item.value;
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error("Erreur chargement settings:", error);
            // Réessayer si échec
            if (retries > 0) {
                setTimeout(() => refreshSettings(retries - 1), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: string, value: string) => {
        // Mise à jour optimiste
        setSettings(prev => {
            const next = { ...prev };
            if (key === 'bg_login') next.bgLogin = value;
            if (key === 'bg_signup') next.bgSignup = value;
            if (key === 'bg_profile') next.bgProfile = value;
            if (key === 'bg_admin') next.bgAdmin = value;
            if (key === 'bg_hero') next.bgHero = value;
            return next;
        });

        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'key'
                });

            if (error) throw error;
        } catch (err) {
            console.error("Échec de persistance du setting", err);
            // Recharger les settings en cas d'erreur
            refreshSettings();
            throw err;
        }
    };

    useEffect(() => {
        refreshSettings();

        // Rafraîchir lors des changements d'auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            refreshSettings();
        });

        // Rafraîchir si connexion retrouvée
        const handleNetworkRecovery = () => refreshSettings(3);
        window.addEventListener('online', handleNetworkRecovery);
        window.addEventListener('focus', handleNetworkRecovery);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('online', handleNetworkRecovery);
            window.removeEventListener('focus', handleNetworkRecovery);
        };
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings, updateSetting }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    if (!context) throw new Error('useSiteSettings doit être utilisé dans SiteSettingsProvider');
    return context;
};
