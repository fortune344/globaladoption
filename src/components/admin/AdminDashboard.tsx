// components/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminDashboard: React.FC = () => {
    const { user } = useAdminAuth();
    const [stats, setStats] = useState({
        pendingSubmissions: 0,
        totalSubmissions: 0,
        pendingTestimonials: 0,
        totalGallery: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [submissions, testimonials, gallery] = await Promise.all([
                    supabase.from('submissions').select('id, status', { count: 'exact' }),
                    supabase.from('testimonials').select('id, is_approved', { count: 'exact' }),
                    supabase.from('gallery').select('id', { count: 'exact' })
                ]);

                setStats({
                    totalSubmissions: submissions.count || 0,
                    pendingSubmissions: submissions.data?.filter(s => s.status === 'pending').length || 0,
                    pendingTestimonials: testimonials.data?.filter(t => !t.is_approved).length || 0,
                    totalGallery: gallery.count || 0
                });
            } catch (error) {
                console.error('Erreur stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Demandes en attente',
            value: stats.pendingSubmissions,
            total: stats.totalSubmissions,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-blue-500',
            link: '/admin/submissions'
        },
        {
            title: 'Témoignages à valider',
            value: stats.pendingTestimonials,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            color: 'bg-primary-500',
            link: '/admin/testimonials'
        },
        {
            title: 'Photos en galerie',
            value: stats.totalGallery,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-green-500',
            link: '/admin/gallery'
        }
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Tableau de Bord
                </h1>
                <p className="text-gray-600">
                    Bienvenue, <strong>Administrateur</strong>
                </p>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    <p className="text-gray-600 mt-4">Chargement des statistiques...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.link}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${card.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-800">
                                {card.value}
                                {card.total !== undefined && (
                                    <span className="text-lg text-gray-400 ml-2">/ {card.total}</span>
                                )}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/admin/gallery"
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <div>
                            <p className="font-semibold text-gray-800">Ajouter une photo</p>
                            <p className="text-sm text-gray-600">Enrichir la galerie</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/settings"
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-gray-800">Modifier les arrière-plans</p>
                            <p className="text-sm text-gray-600">Personnaliser le site</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/submissions"
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <div>
                            <p className="font-semibold text-gray-800">Gérer les demandes</p>
                            <p className="text-sm text-gray-600">Traiter les rendez-vous</p>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-gray-800">Voir le site public</p>
                            <p className="text-sm text-gray-600">Prévisualiser les changements</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
