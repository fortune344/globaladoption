// components/public/TimelineSection.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TimelineSection: React.FC = () => {
    useEffect(() => {
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

        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        }, 100);

        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            number: '1',
            title: 'Prise de Contact',
            description: "Contactez-nous via notre formulaire pour exposer votre projet. Un conseiller étudiera votre demande.",
            position: 'left'
        },
        {
            number: '2',
            title: 'Accompagnement',
            description: "Nos spécialistes vous assistent dans la constitution de votre dossier administratif et juridique.",
            position: 'right'
        },
        {
            number: '3',
            title: 'La Rencontre',
            description: "Organisation des premières rencontres avec l'enfant dans un cadre préparé et sécurisé par nos équipes.",
            position: 'left'
        },
        {
            number: '4',
            title: 'Une Nouvelle Vie',
            description: "Finalisation des démarches d'adoption. Nous vous accompagnons durant les premiers mois d'intégration.",
            position: 'right'
        }
    ];

    return (
        <section className="py-24 bg-white border-t-4 border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
                {/* Titre */}
                <div className="text-center mb-20 reveal reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Les étapes de l'adoption
                    </h2>
                    <p className="text-lg text-gray-600">
                        Quatre grandes étapes pour mener à bien votre projet d'adoption professionnelle.
                    </p>
                </div>

                {/* Timeline verticale */}
                <div className="relative">
                    {/* Ligne verticale centrale */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200 hidden md:block"></div>

                    {/* Étapes */}
                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className={`relative reveal ${step.position === 'left' ? 'reveal-left' : 'reveal-right'} delay-${(index + 1) * 100}`}
                            >
                                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                                    {/* Contenu à gauche pour les étapes impaires */}
                                    {step.position === 'left' && (
                                        <>
                                            <div className="md:text-right mb-8 md:mb-0">
                                                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 inline-block md:block border-l-4 border-primary-500">
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="hidden md:block"></div>
                                        </>
                                    )}

                                    {/* Contenu à droite pour les étapes paires */}
                                    {step.position === 'right' && (
                                        <>
                                            <div className="hidden md:block"></div>
                                            <div className="mb-8 md:mb-0">
                                                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-primary-500">
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Numéro au centre */}
                                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 md:translate-y-0 z-10">
                                    <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white">
                                        {step.number}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA final */}
                <div className="text-center mt-20 reveal reveal-up delay-500">
                    <p className="text-gray-600 mb-6 text-lg">
                        Vous souhaitez initier une démarche ?
                    </p>
                    <Link
                        to="/demande"
                        className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                        Démarrer mon projet d'adoption
                    </Link>
                </div>
            </div>
        </section >
    );
};

export default TimelineSection;
