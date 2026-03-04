// components/admin/SubmissionsManager.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { sanitizeError } from '../../lib/errorUtils';

interface Submission {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    appointment_date: string | null;
    appointment_time: string | null;
    message: string;
    status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
    created_at: string;
}

const SubmissionsManager: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setToast({ message: 'Erreur lors du chargement des demandes', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: Submission['status']) => {
        try {
            const { error } = await supabase
                .from('submissions')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            const label = statusLabels[newStatus];
            setToast({ message: `Statut mis à jour : ${label} ✓`, type: 'success' });
            await fetchSubmissions();
            setSelectedSubmission(null);
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const deleteSubmission = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

        try {
            const { error } = await supabase
                .from('submissions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setToast({ message: 'Demande supprimée ✓', type: 'success' });
            await fetchSubmissions();
            setSelectedSubmission(null);
        } catch (error) {
            setToast({ message: sanitizeError(error), type: 'error' });
        }
    };

    const filteredSubmissions = submissions.filter(sub =>
        filter === 'all' || sub.status === filter
    );

    const statusColors: Record<Submission['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        contacted: 'bg-blue-100 text-blue-800',
        scheduled: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const statusLabels: Record<Submission['status'], string> = {
        pending: 'En attente',
        contacted: 'Contacté',
        scheduled: 'Rendez-vous planifié',
        completed: 'Terminé',
        cancelled: 'Annulé'
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Non spécifié';
        try {
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-800">Demandes de Rendez-vous</h1>
                    <p className="text-gray-600 mt-1">Gérez les demandes de contact</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Tous ({submissions.length})
                    </button>
                    {Object.entries(statusLabels).map(([status, label]) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === status
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {label} ({submissions.filter(s => s.status === status).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500">Aucune demande trouvée</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredSubmissions.map((sub) => (
                        <div
                            key={sub.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                            onClick={() => setSelectedSubmission(sub)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{sub.full_name}</h3>
                                    <p className="text-sm text-gray-600">{sub.email}</p>
                                    {sub.phone && <p className="text-sm text-gray-600">{sub.phone}</p>}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[sub.status]}`}>
                                    {statusLabels[sub.status]}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-3 line-clamp-2">{sub.message}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                {sub.appointment_date && (
                                    <span>RDV souhaité : {formatDate(sub.appointment_date)} {sub.appointment_time ? `à ${sub.appointment_time}` : ''}</span>
                                )}
                                <span>Reçu le : {new Date(sub.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Détails */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSubmission(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedSubmission.full_name}</h2>
                                    <p className="text-gray-600">{selectedSubmission.email}</p>
                                    {selectedSubmission.phone && <p className="text-gray-600">{selectedSubmission.phone}</p>}
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedSubmission.status]}`}>
                                {statusLabels[selectedSubmission.status]}
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedSubmission.appointment_date && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Date de RDV souhaitée</p>
                                    <p className="text-gray-800">
                                        {formatDate(selectedSubmission.appointment_date)}
                                        {selectedSubmission.appointment_time ? ` à ${selectedSubmission.appointment_time}` : ''}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Message</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{selectedSubmission.message}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Reçu le</p>
                                <p className="text-gray-800">{new Date(selectedSubmission.created_at).toLocaleString('fr-FR')}</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 space-y-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Changer le statut</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(statusLabels).map(([status, label]) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(selectedSubmission.id, status as Submission['status'])}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSubmission.status === status
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => deleteSubmission(selectedSubmission.id)}
                                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Supprimer cette demande
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsManager;
