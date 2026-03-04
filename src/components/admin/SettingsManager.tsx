// components/admin/SettingsManager.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { sanitizeError } from '../../lib/errorUtils';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { validateStrongPassword } from '../../lib/security';

// ─── Types ──────────────────────────────────────────────
interface Setting {
    key: string;
    value: string;
    description: string;
}

interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    is_active: boolean;
}

interface SecurityLog {
    id: string;
    event_type: string;
    details: string;
    timestamp: string;
    page_url: string;
}

type TabKey = 'admins' | 'images' | 'security';

// ─── Composant Principal ─────────────────────────────────
const SettingsManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('admins');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        {
            key: 'admins',
            label: 'Administrateurs',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            key: 'images',
            label: 'Images',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            key: 'security',
            label: 'Sécurité',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="p-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-up ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
                <p className="text-gray-600 mt-1">Gérez les administrateurs, les images et la sécurité</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.key
                                    ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'admins' && <AdminsTab showToast={showToast} />}
                    {activeTab === 'images' && <ImagesTab showToast={showToast} />}
                    {activeTab === 'security' && <SecurityTab showToast={showToast} />}
                </div>
            </div>
        </div>
    );
};


// ════════════════════════════════════════════════════════════
// TAB 1 — GESTION DES ADMINISTRATEURS
// ════════════════════════════════════════════════════════════
const AdminsTab: React.FC<{ showToast: (msg: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const { user } = useAdminAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Formulaire
    const [showForm, setShowForm] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [creating, setCreating] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Validation mot de passe
    const passwordCheck = validateStrongPassword(newPassword);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAdmins(data || []);
        } catch (err) {
            console.error('Erreur chargement admins:', err);
            // Fallback : afficher l'utilisateur connecté
            if (user) {
                setAdmins([{
                    id: user.id,
                    email: user.email || '',
                    created_at: user.created_at || new Date().toISOString(),
                    is_active: true,
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordCheck.isValid) {
            showToast('Le mot de passe ne respecte pas les critères de sécurité', 'error');
            return;
        }
        setCreating(true);
        try {
            // Créer le user via Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: newEmail.trim(),
                password: newPassword,
            });

            if (error) throw error;

            // Ajouter dans la table admin_users
            if (data.user) {
                await supabase.from('admin_users').insert({
                    id: data.user.id,
                    email: newEmail.trim(),
                    is_active: true,
                });
            }

            showToast(`Admin ${newEmail} créé avec succès ✓`, 'success');
            setNewEmail('');
            setNewPassword('');
            setShowForm(false);
            fetchAdmins();
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la création', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeactivateAdmin = async (admin: AdminUser) => {
        if (admin.id === user?.id) {
            showToast('Vous ne pouvez pas vous désactiver vous-même', 'error');
            setDeleteConfirm(null);
            return;
        }
        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ is_active: false })
                .eq('id', admin.id);

            if (error) throw error;

            showToast(`Administrateur ${admin.email} désactivé ✓`, 'success');
            setDeleteConfirm(null);
            fetchAdmins();
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la désactivation', 'error');
        }
    };

    const handleReactivateAdmin = async (admin: AdminUser) => {
        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ is_active: true })
                .eq('id', admin.id);

            if (error) throw error;
            showToast(`Administrateur ${admin.email} réactivé ✓`, 'success');
            fetchAdmins();
        } catch (err: any) {
            showToast(err.message || 'Erreur', 'error');
        }
    };

    const getPasswordStrengthColor = (score: number) => {
        if (score <= 1) return 'bg-red-500';
        if (score <= 2) return 'bg-orange-500';
        if (score <= 3) return 'bg-yellow-500';
        if (score <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="space-y-6">
            {/* Header + bouton ajouter */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Comptes Administrateurs</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez qui a accès au panneau d'administration</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${showForm
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                        }`}
                >
                    {showForm ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Annuler
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Ajouter un Admin
                        </>
                    )}
                </button>
            </div>

            {/* Formulaire d'ajout */}
            {showForm && (
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-6 animate-fade-in-up">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Nouvel Administrateur
                    </h3>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                placeholder="nouvel.admin@global-adoption.com"
                                required
                                disabled={creating}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                placeholder="••••••••••••"
                                required
                                disabled={creating}
                                minLength={12}
                            />
                            {/* Barre de force */}
                            {newPassword && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= passwordCheck.score
                                                    ? getPasswordStrengthColor(passwordCheck.score)
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {passwordCheck.message && (
                                        <p className="text-xs text-red-600">{passwordCheck.message}</p>
                                    )}
                                    {passwordCheck.isValid && (
                                        <p className="text-xs text-green-600 font-medium">✓ Mot de passe sécurisé</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={creating || !passwordCheck.isValid}
                                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? 'Création en cours...' : 'Créer l\'administrateur'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setNewEmail(''); setNewPassword(''); }}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des admins */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="space-y-3">
                    {admins.map((admin) => (
                        <div
                            key={admin.id}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${admin.is_active
                                ? 'bg-white border-gray-200 hover:shadow-md'
                                : 'bg-gray-50 border-gray-200 opacity-60'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${admin.is_active ? 'bg-gradient-to-br from-primary-400 to-primary-600' : 'bg-gray-400'
                                    }`}>
                                    {admin.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                                        {admin.email}
                                        {admin.id === user?.id && (
                                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                                                Vous
                                            </span>
                                        )}
                                        {!admin.is_active && (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                Désactivé
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Créé le {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {admin.id !== user?.id && (
                                    <>
                                        {admin.is_active ? (
                                            <>
                                                {deleteConfirm === admin.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-red-600 font-medium">Confirmer ?</span>
                                                        <button
                                                            onClick={() => handleDeactivateAdmin(admin)}
                                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
                                                        >
                                                            Oui
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg font-medium transition-colors"
                                                        >
                                                            Non
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(admin.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                                        title="Désactiver cet admin"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                        Désactiver
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleReactivateAdmin(admin)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Réactiver
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {admins.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>Aucun administrateur trouvé</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// ════════════════════════════════════════════════════════════
// TAB 2 — IMAGES D'ARRIÈRE-PLAN (existant, amélioré)
// ════════════════════════════════════════════════════════════
const ImagesTab: React.FC<{ showToast: (msg: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const settingsLabels: Record<string, string> = {
        bg_login: 'Page de Connexion',
        bg_signup: 'Page d\'Inscription',
        bg_profile: 'Page Profil',
        bg_admin: 'Panneau Admin',
        bg_hero: 'Section Hero (Accueil)',
    };

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('app_settings').select('*').order('key');
            if (error) throw error;
            setSettings(data || []);
        } catch {
            showToast('Erreur lors du chargement des paramètres', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (key: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast('L\'image ne doit pas dépasser 5 Mo', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setEditingKey(key);
                setEditValue(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const updateSetting = async (key: string, newValue: string) => {
        if (!newValue.trim()) { showToast('L\'image ne peut pas être vide', 'error'); return; }
        setSaving(true);
        try {
            const { error } = await supabase.from('app_settings').update({ value: newValue.trim() }).eq('key', key);
            if (error) throw error;
            showToast('Image mise à jour avec succès ✓', 'success');
            await fetchSettings();
            setEditingKey(null);
            setEditValue('');
        } catch (error) {
            showToast(sanitizeError(error), 'error');
        } finally {
            setSaving(false);
        }
    };

    const bgSettings = settings.filter(s => s.key.startsWith('bg_'));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Images d'arrière-plan</h2>
                <p className="text-sm text-gray-500 mt-1">Personnalisez les fonds d'écran de chaque page</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bgSettings.map((setting) => (
                        <div key={setting.key} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                            <div className="flex flex-col lg:flex-row">
                                {/* Preview */}
                                <div className="lg:w-2/5 relative">
                                    <div className="aspect-video lg:aspect-square bg-gray-100 relative">
                                        <img
                                            src={editingKey === setting.key ? editValue : setting.value}
                                            alt={setting.description}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(settingsLabels[setting.key] || 'Image')}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <p className="text-white font-semibold text-lg">
                                                {settingsLabels[setting.key] || setting.key}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Action */}
                                <div className="lg:w-3/5 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {settingsLabels[setting.key] || setting.key}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
                                    {editingKey === setting.key ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateSetting(setting.key, editValue)}
                                                disabled={saving}
                                                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                                            >
                                                {saving ? 'Enregistrement...' : 'Enregistrer ✓'}
                                            </button>
                                            <button
                                                onClick={() => { setEditingKey(null); setEditValue(''); }}
                                                disabled={saving}
                                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleFileUpload(setting.key)}
                                            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Choisir une image depuis le PC
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// ════════════════════════════════════════════════════════════
// TAB 3 — SÉCURITÉ
// ════════════════════════════════════════════════════════════
const SecurityTab: React.FC<{ showToast: (msg: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const { user } = useAdminAuth();
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(true);

    // Changement de mot de passe
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changing, setChanging] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const passwordCheck = validateStrongPassword(newPassword);

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const { data, error } = await supabase
                .from('security_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(20);

            if (error) throw error;
            setLogs(data || []);
        } catch {
            console.warn('Table security_logs non disponible');
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        if (!passwordCheck.isValid) {
            showToast('Le mot de passe ne respecte pas les critères', 'error');
            return;
        }
        setChanging(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            showToast('Mot de passe modifié avec succès ✓', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: any) {
            showToast(err.message || 'Erreur lors du changement de mot de passe', 'error');
        } finally {
            setChanging(false);
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'login_success': return 'Succès';
            case 'login_failed': return 'Échec';
            case 'login_locked': return 'Verrouillé';
            case 'logout': return 'Sortie';
            case 'inactivity_logout': return 'Inactivité';
            default: return 'Info';
        }
    };

    const getEventLabel = (type: string) => {
        switch (type) {
            case 'login_success': return 'Connexion réussie';
            case 'login_failed': return 'Échec de connexion';
            case 'login_locked': return 'Compte verrouillé';
            case 'logout': return 'Déconnexion';
            case 'inactivity_logout': return 'Déconnexion auto';
            case 'csrf_violation': return 'Violation CSRF';
            case 'rate_limit_hit': return 'Rate limit';
            default: return type;
        }
    };

    const getPasswordStrengthColor = (score: number) => {
        if (score <= 1) return 'bg-red-500';
        if (score <= 2) return 'bg-orange-500';
        if (score <= 3) return 'bg-yellow-500';
        if (score <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="space-y-8">
            {/* ── Informations du compte ── */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mon Compte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                        <p className="font-semibold text-gray-800">{user?.email || '—'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Compte</p>
                        <p className="font-mono text-sm text-gray-600 truncate">{user?.id || '—'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dernière connexion</p>
                        <p className="font-semibold text-gray-800">
                            {user?.last_sign_in_at
                                ? new Date(user.last_sign_in_at).toLocaleString('fr-FR')
                                : '—'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Statut</p>
                        <p className="font-semibold text-green-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Connecté & Actif
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Changer mot de passe ── */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Mot de passe
                    </h2>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${showPasswordForm
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                    >
                        {showPasswordForm ? 'Annuler' : 'Modifier'}
                    </button>
                </div>

                {showPasswordForm && (
                    <form onSubmit={handleChangePassword} className="space-y-4 mt-4 animate-fade-in-up">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="••••••••••••"
                                required
                                minLength={12}
                            />
                            {newPassword && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= passwordCheck.score
                                                    ? getPasswordStrengthColor(passwordCheck.score)
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {passwordCheck.message && <p className="text-xs text-red-600">{passwordCheck.message}</p>}
                                    {passwordCheck.isValid && <p className="text-xs text-green-600 font-medium">✓ Sécurisé</p>}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="••••••••••••"
                                required
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
                            )}
                            {confirmPassword && newPassword === confirmPassword && passwordCheck.isValid && (
                                <p className="text-xs text-green-600 mt-1">✓ Les mots de passe correspondent</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={changing || !passwordCheck.isValid || newPassword !== confirmPassword}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {changing ? 'Modification en cours...' : 'Enregistrer le nouveau mot de passe'}
                        </button>
                    </form>
                )}
            </div>

            {/* ── Journal de sécurité ── */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Journal de sécurité
                    </h2>
                    <div className="flex items-center gap-3">
                        {logs.length > 0 && (
                            <button
                                onClick={async () => {
                                    if (!confirm('Supprimer tous les logs de sécurité ? Cette action est irréversible.')) return;
                                    try {
                                        const { error } = await supabase
                                            .from('security_logs')
                                            .delete()
                                            .neq('id', '00000000-0000-0000-0000-000000000000');
                                        if (error) throw error;
                                        setLogs([]);
                                        showToast('Logs supprimés', 'success');
                                    } catch {
                                        showToast('Erreur lors de la suppression', 'error');
                                    }
                                }}
                                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Tout supprimer
                            </button>
                        )}
                        <button
                            onClick={fetchLogs}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rafraîchir
                        </button>
                    </div>
                </div>

                {loadingLogs ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p>Aucun événement de sécurité enregistré</p>
                        <p className="text-xs text-gray-400 mt-1">Les connexions futures seront loggées ici</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-xl">{getEventIcon(log.event_type)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm">{getEventLabel(log.event_type)}</p>
                                    {log.details && (
                                        <p className="text-xs text-gray-500 truncate">{log.details}</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString('fr-FR', {
                                        day: '2-digit', month: '2-digit', year: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsManager;
