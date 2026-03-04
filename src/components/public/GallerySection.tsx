// components/public/GallerySection.tsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    category: string;
}

const GallerySection: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Charger la galerie
    useEffect(() => {
        const fetchGallery = async () => {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .eq('is_visible', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erreur chargement galerie:', error);
                return;
            }
            if (data) setItems(data);
        };

        fetchGallery();
    }, []);

    // Observer APRÈS que les données sont chargées
    useEffect(() => {
        if (items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const timer = setTimeout(() => {
            if (sectionRef.current) {
                sectionRef.current.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [items]);

    return (
        <section id="gallery" className="py-24 bg-gray-50 border-t-4 border-gray-200" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 reveal reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Galerie
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Des moments précieux capturés, des sourires partagés et des familles qui
                        s'épanouissent. Chaque photo raconte une histoire d'amour et d'espoir.
                    </p>
                </div>

                {items.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                        Aucune photo disponible pour le moment
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`reveal reveal-up delay-${Math.min((index % 3) * 200 + 100, 700)} cursor-pointer group`}
                                onClick={() => setSelectedImage(item)}
                            >
                                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-square">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            // Si l'image ne charge pas, afficher un placeholder
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(item.alt || 'Image')}`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <p className="text-white p-4 font-semibold">{item.alt}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-primary-400 transition-colors"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                    <div className="max-w-5xl w-full">
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                        />
                        <p className="text-white text-center mt-4 text-lg">
                            {selectedImage.alt}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GallerySection;
