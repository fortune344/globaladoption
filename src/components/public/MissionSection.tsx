// components/public/MissionSection.tsx
import React, { useEffect } from 'react';

const MissionSection: React.FC = () => {
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

    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white border-t-4 border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                {/* Titre principal */}
                <div className="text-center mb-20 reveal reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        L'adoption est un projet concret,
                        <br />
                        <span className="text-primary-600">nous vous aidons à le réaliser.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                        Les démarches d'adoption peuvent paraître longues et complexes de l'extérieur.
                        Chez Global Adoption, nous mettons notre expertise au service de votre projet
                        pour simplifier et sécuriser chaque étape judiciaire et administrative.
                    </p>
                </div>

                {/* Layout: Conviction à gauche, Piliers à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Gauche : Notre conviction */}
                    <div className="reveal reveal-left delay-200">
                        <div className="bg-primary-50 border-l-4 border-primary-500 p-8 rounded-r-xl lg:sticky lg:top-24">
                            <h3 className="text-2xl font-bold text-primary-700 mb-4">
                                Notre Conviction
                            </h3>
                            <p className="text-lg text-gray-800 leading-relaxed mb-4">
                                Il existe un enfant qui a besoin d'amour, et il existe une famille prête à lui en donner.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Notre travail est de faire tomber les barrières administratives et psychologiques
                                qui les séparent. Nous ne vendons pas du rêve, nous construisons des réalités
                                familiales solides, basées sur la légalité, l'éthique et la transparence.
                            </p>
                        </div>
                    </div>

                    {/* Droite : Les 3 piliers */}
                    <div className="space-y-8">
                        {/* Pilier 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 reveal reveal-right delay-300">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Cadre Légal Sécurisé
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Nous collaborons étroitement avec les institutions pour garantir que chaque
                                        dossier respecte scrupuleusement les lois nationales et internationales.
                                        <strong className="text-gray-800"> Zéro zone d'ombre.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pilier 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 reveal reveal-right delay-400">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Humain avant tout
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Derrière chaque dossier, il y a des cœurs qui battent. Nous offrons un
                                        soutien psychologique continu pour préparer les parents et accueillir
                                        l'enfant dans la douceur.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pilier 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 reveal reveal-right delay-500">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Transparence Totale
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Délais, coûts, démarches : nous vous disons tout dès le premier jour.
                                        Pas de fausses promesses, juste un accompagnement honnête et expert.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
