// components/AdminApp.tsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../contexts/AdminAuthContext';
import { SiteSettingsProvider, useSiteSettings } from '../contexts/SiteSettingsContext';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import SubmissionsManager from './admin/SubmissionsManager';
import GalleryManager from './admin/GalleryManager';
import TestimonialsManager from './admin/TestimonialsManager';
import SettingsManager from './admin/SettingsManager';

// Formulaire de login admin intégré + sécurité + arrière-plan
const AdminLoginForm: React.FC = () => {
    const { signIn, loginLocked, lockoutRemainingMs } = useAdminAuth();
    const { settings } = useSiteSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const lockoutMinutes = Math.ceil(lockoutRemainingMs / 60000);
    const isDisabled = loading || loginLocked;

    // Utiliser bg_admin ou bg_login comme arrière-plan
    const bgImage = settings.bgAdmin || settings.bgLogin || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (err: any) {
            setError(err.message || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-cover bg-center bg-no-repeat relative"
            style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">GLOBAL ADOPTION</h1>
                    <p className="text-gray-500 text-sm mt-1">Panneau Administrateur</p>
                </div>

                {/* 🛡️ Alerte de verrouillage */}
                {loginLocked && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Compte verrouillé. Réessayez dans {lockoutMinutes} minute(s).
                    </div>
                )}

                {error && !loginLocked && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80"
                            placeholder="admin@globaladoption.fr"
                            required
                            disabled={isDisabled}
                            maxLength={100}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80"
                            placeholder="••••••••"
                            required
                            disabled={isDisabled}
                            maxLength={128}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        {loginLocked ? `Verrouillé (${lockoutMinutes} min)` : loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Accès réservé aux administrateurs
                </p>
            </div>
        </div>
    );
};

// AdminGuard: Simple — connecté = accès
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdmin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <AdminLoginForm />;
    }

    return <>{children}</>;
};

// Layout Admin avec Sidebar
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { settings } = useSiteSettings();

    return (
        <div
            className="relative flex min-h-screen bg-gray-100 bg-cover bg-center bg-fixed"
            style={settings.bgAdmin ? { backgroundImage: `url(${settings.bgAdmin})` } : undefined}
        >
            {/* Overlay pour lisibilité */}
            {settings.bgAdmin && <div className="absolute inset-0 bg-black/30 z-0"></div>}
            <AdminSidebar />
            <main className="flex-1 overflow-x-hidden relative z-10">
                {children}
            </main>
        </div>
    );
};

// Contenu de l'app Admin
const AdminAppContent: React.FC = () => {
    return (
        <AdminGuard>
            <AdminLayout>
                <Routes>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/submissions" element={<SubmissionsManager />} />
                    <Route path="/admin/gallery" element={<GalleryManager />} />
                    <Route path="/admin/testimonials" element={<TestimonialsManager />} />
                    <Route path="/admin/settings" element={<SettingsManager />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
            </AdminLayout>
        </AdminGuard>
    );
};

// App Admin principale avec providers
const AdminApp: React.FC = () => {
    return (
        <AdminAuthProvider>
            <SiteSettingsProvider>
                <AdminAppContent />
            </SiteSettingsProvider>
        </AdminAuthProvider>
    );
};

export default AdminApp;
