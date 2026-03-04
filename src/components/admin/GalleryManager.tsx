// components/admin/GalleryManager.tsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { sanitizeError } from '../../lib/errorUtils';

interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    category: string;
    is_visible: boolean;
    created_at: string;
}

const GalleryManager: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        alt: '',
        category: 'families'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setToast({ message: 'Erreur lors du chargement de la galerie', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setToast({ message: 'Veuillez sélectionner un fichier image', type: 'error' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setToast({ message: 'L\'image ne doit pas dépasser 5 Mo', type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const addImage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imagePreview) {
            setToast({ message: 'Veuillez sélectionner une image', type: 'error' });
            return;
        }
        if (!formData.alt.trim()) {
            setToast({ message: 'La description est requise', type: 'error' });
            return;
        }

        try {
            const { error } = await supabase.from('gallery').insert([
                {
                    src: imagePreview,
                    alt: formData.alt.trim(),
                    category: formData.category,
                    is_visible: true
                }
            ]);

            if (error) throw error;

            setFormData({ alt: '', category: 'families' });
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setShowAddModal(false);
            setToast({ message: 'Photo ajoutée avec succès ✓', type: 'success' });
            await fetchGallery();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const toggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            const { error } = await supabase
                .from('gallery')
                .update({ is_visible: !currentVisibility })
                .eq('id', id);

            if (error) throw error;
            setToast({ message: currentVisibility ? 'Photo masquée ✓' : 'Photo visible ✓', type: 'success' });
            await fetchGallery();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

        try {
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setToast({ message: 'Photo supprimée ✓', type: 'success' });
            await fetchGallery();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    return (
        <div className="p-8">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all animate-fade-in-up ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Galerie</h1>
                    <p className="text-gray-600 mt-1">Gérez les photos affichées sur le site</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Ajouter une photo</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 mb-4">Aucune photo dans la galerie</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-primary-500 hover:text-primary-600 font-semibold"
                    >
                        Ajouter la première photo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="aspect-square relative">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(item.alt || 'Image')}`;
                                    }}
                                />
                                {!item.is_visible && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Masquée
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => toggleVisibility(item.id, item.is_visible)}
                                        className="bg-white text-gray-700 p-2 rounded-lg shadow hover:bg-gray-100"
                                        title={item.is_visible ? 'Masquer' : 'Afficher'}
                                    >
                                        {item.is_visible ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteImage(item.id)}
                                        className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600"
                                        title="Supprimer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-800 font-medium line-clamp-2">{item.alt}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Ajout avec Upload Fichier */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); setImagePreview(null); }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Ajouter une Photo</h2>
                                <button
                                    onClick={() => { setShowAddModal(false); setImagePreview(null); }}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <form onSubmit={addImage} className="p-6 space-y-4">
                            {/* Zone d'upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image *
                                </label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Aperçu"
                                            className="w-full h-48 object-cover rounded-lg border-2 border-primary-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
                                    >
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">Cliquez pour choisir une image</p>
                                        <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP • Max 5 Mo</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <input
                                    type="text"
                                    value={formData.alt}
                                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Famille heureuse ensemble"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="families">Familles</option>
                                    <option value="children">Enfants</option>
                                    <option value="events">Événements</option>
                                    <option value="general">Général</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold"
                                >
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setImagePreview(null); }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
