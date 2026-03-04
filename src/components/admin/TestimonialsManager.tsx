// components/admin/TestimonialsManager.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { sanitizeError } from '../../lib/errorUtils';

interface Testimonial {
    id: string;
    name: string;
    text: string;
    is_approved: boolean;
    created_at: string;
}

const TestimonialsManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [newTestimonial, setNewTestimonial] = useState({ name: '', text: '' });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setToast({ message: 'Erreur lors du chargement des témoignages', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const addTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTestimonial.name.trim() || !newTestimonial.text.trim()) {
            setToast({ message: 'Le nom et le texte sont requis', type: 'error' });
            return;
        }

        try {
            const { error } = await supabase.from('testimonials').insert([
                {
                    name: newTestimonial.name.trim(),
                    text: newTestimonial.text.trim(),
                    is_approved: true
                }
            ]);

            if (error) throw error;

            setNewTestimonial({ name: '', text: '' });
            setShowAddModal(false);
            setToast({ message: 'Témoignage ajouté avec succès ✓', type: 'success' });
            await fetchTestimonials();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_approved: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            setToast({ message: currentStatus ? 'Témoignage masqué ✓' : 'Témoignage approuvé ✓', type: 'success' });
            await fetchTestimonials();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setToast({ message: 'Témoignage supprimé ✓', type: 'success' });
            await fetchTestimonials();
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'approved') return t.is_approved;
        if (filter === 'pending') return !t.is_approved;
        return true;
    });

    return (
        <div className="p-8">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-up ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Témoignages</h1>
                    <p className="text-gray-600 mt-1">Gérez et ajoutez des témoignages</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Ajouter un témoignage</span>
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Tous ({testimonials.length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'approved'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Approuvés ({testimonials.filter(t => t.is_approved).length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'pending'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        En attente ({testimonials.filter(t => !t.is_approved).length})
                    </button>
                </div>
            </div>

            {/* Liste */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 mb-4">Aucun témoignage trouvé</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-primary-500 hover:text-primary-600 font-semibold"
                    >
                        Ajouter le premier témoignage
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                                        {testimonial.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${testimonial.is_approved
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {testimonial.is_approved ? 'Approuvé' : 'En attente'}
                                </span>
                            </div>

                            <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleApproval(testimonial.id, testimonial.is_approved)}
                                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${testimonial.is_approved
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                >
                                    {testimonial.is_approved ? 'Retirer l\'approbation' : 'Approuver'}
                                </button>
                                <button
                                    onClick={() => deleteTestimonial(testimonial.id)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Ajout Témoignage */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Ajouter un Témoignage</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <form onSubmit={addTestimonial} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de la personne *
                                </label>
                                <input
                                    type="text"
                                    value={newTestimonial.name}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Marie Dupont"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Témoignage *
                                </label>
                                <textarea
                                    value={newTestimonial.text}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Grâce à Global Adoption, notre rêve d'agrandir notre famille est devenu réalité..."
                                    required
                                />
                            </div>

                            <p className="text-xs text-gray-500">
                                Le témoignage sera automatiquement approuvé et visible sur le site.
                            </p>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold"
                                >
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
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

export default TestimonialsManager;
