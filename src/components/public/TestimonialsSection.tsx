// components/public/TestimonialsSection.tsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Testimonial {
    id: string;
    name: string;
    text: string;
    created_at: string;
}

const TestimonialsSection: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Charger les témoignages
    useEffect(() => {
        const fetchTestimonials = async () => {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) {
                console.error('Erreur chargement témoignages:', error);
                return;
            }
            if (data) setTestimonials(data);
        };

        fetchTestimonials();
    }, []);

    // Observer APRÈS que les données sont chargées
    useEffect(() => {
        if (testimonials.length === 0) return;

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

        // Observer les éléments APRÈS le rendu
        const timer = setTimeout(() => {
            if (sectionRef.current) {
                sectionRef.current.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [testimonials]); // Re-run quand les données changent

    return (
        <section id="testimonials" className="py-24 bg-white border-t-4 border-gray-200" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 reveal reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Témoignages
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Découvrez les histoires des familles que nous avons aidées.
                    </p>
                </div>

                {testimonials.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                        Aucun témoignage disponible pour le moment
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={`reveal reveal-up delay-${Math.min((index % 3) * 200 + 100, 700)} bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300`}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl mr-3">
                                        {testimonial.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(testimonial.created_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialsSection;
