import React, { useEffect } from 'react';

const AboutSection: React.FC = () => {
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
        <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-white border-t-4 border-gray-200">
            <div className="max-w-7xl mx-auto px-6">

                {/* En-tête : Historique et Mission Générale */}
                <div className="text-center mb-20 reveal reveal-up delay-100">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                        À propos de <span className="text-primary-600">Global Adoption</span>
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed text-justify md:text-center">
                        <p>
                            Global Adoption est une organisation spécialisée dans l'accompagnement et l'orientation des familles souhaitant accueillir un enfant au sein de leur foyer. Notre mission est de faciliter les démarches liées à l'adoption en apportant un soutien professionnel, humain et administratif aux familles tout au long du processus.
                        </p>
                        <p>
                            <strong>Fondée en septembre 2017 au Canada</strong>, notre organisation a été créée avec l'objectif d'offrir un cadre d'accompagnement sérieux et transparent aux familles engagées dans un projet d'adoption. Face à la demande croissante et afin de renforcer notre présence en Europe, Global Adoption a <strong>étendu ses activités en 2021 en France</strong>, permettant ainsi de collaborer avec différents professionnels et structures spécialisées dans le domaine de la protection de l'enfance.
                        </p>
                        <p>
                            Depuis sa création, Global Adoption œuvre pour favoriser la rencontre entre des familles responsables et des enfants ayant besoin d'un environnement stable, sécurisé et aimant. Chaque dossier est étudié avec rigueur afin de garantir un accompagnement sérieux dans le respect des principes éthiques et des procédures administratives en vigueur.
                        </p>
                    </div>
                </div>

                {/* Section Mission Détaillée & Engagements (2 colonnes) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
                    {/* Gauche : Mission */}
                    <div className="reveal reveal-left delay-200">
                        <div className="bg-primary-50 border-l-4 border-primary-500 p-8 rounded-r-xl h-full">
                            <h3 className="text-2xl font-bold text-primary-700 mb-4 flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Notre Mission Principale
                            </h3>
                            <p className="text-lg text-gray-800 leading-relaxed">
                                Contribuer à offrir à chaque enfant la possibilité de grandir dans un foyer stable et bienveillant.
                            </p>
                        </div>
                    </div>

                    {/* Droite : Liste des engagements */}
                    <div className="reveal reveal-right delay-300 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos Engagements</h3>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong>Accompagner</strong> les familles dans la compréhension et la préparation de leur projet d'adoption.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong>Orienter</strong> les familles dans les différentes démarches administratives et sociales.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong>Collaborer</strong> avec des professionnels qualifiés afin d'assurer un suivi sérieux des dossiers.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong>Promouvoir</strong> le droit fondamental de chaque enfant à vivre dans un environnement familial stable.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Valeurs (Cartes) */}
                <div className="mb-24">
                    <div className="text-center mb-12 reveal reveal-up">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">Nos Valeurs</h3>
                        <p className="text-gray-600">Notre travail quotidien repose sur ces quatre piliers fondamentaux.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Carte Transparence */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300 reveal reveal-up delay-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Transparence</h4>
                            <p className="text-gray-600 text-sm">Nous veillons à ce que chaque famille dispose d'informations claires sur les procédures et les démarches.</p>
                        </div>
                        {/* Carte Respect */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300 reveal reveal-up delay-300">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Respect de l'Enfant</h4>
                            <p className="text-gray-600 text-sm">L'intérêt supérieur de l'enfant reste toujours au cœur de toutes nos démarches.</p>
                        </div>
                        {/* Carte Accompagnement */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300 reveal reveal-up delay-400">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Sur-mesure</h4>
                            <p className="text-gray-600 text-sm">Chaque projet est unique. Nous offrons un accompagnement personnalisé et adapté à la situation de chaque famille.</p>
                        </div>
                        {/* Carte Éthique */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300 reveal reveal-up delay-500">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Responsabilité</h4>
                            <p className="text-gray-600 text-sm">Nous encourageons des démarches rigoureusement respectueuses des cadres légaux, éthiques et administratifs.</p>
                        </div>
                    </div>
                </div>

                {/* Réseau professionnel et Synthèse Finale */}
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl reveal reveal-up text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary-600/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>

                    <div className="p-8 md:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Réseau partenaires */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Notre Réseau Professionnel</h3>
                            <p className="text-gray-300 mb-6 font-light">
                                Afin d'offrir un accompagnement de qualité, Global Adoption collabore avec différents professionnels et structures spécialisés dans le domaine social et juridique :
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div> Travailleurs sociaux</li>
                                <li className="flex items-center gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div> Psychologues (accompagnement familial)</li>
                                <li className="flex items-center gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div> Conseillers administratifs</li>
                                <li className="flex items-center gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div> Juristes en droit de la famille</li>
                                <li className="flex items-center gap-2 text-sm text-gray-300 col-span-full"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div> Structures d'accueil et de protection de l'enfance</li>
                            </ul>

                            <p className="text-gray-300 font-light mb-4">
                                Nous travaillons également dans un esprit de coopération avec des organisations réputées :
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide backdrop-blur-sm">UNICEF</span>
                                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide backdrop-blur-sm">Croix-Rouge</span>
                                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide backdrop-blur-sm">SOS Villages d'Enfants</span>
                            </div>
                        </div>

                        {/* Synthèse finale */}
                        <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-700 pt-8 lg:pt-0 lg:pl-12">
                            <h3 className="text-3xl font-bold mb-6">Notre Engagement</h3>
                            <blockquote className="text-xl md:text-2xl font-light italic text-primary-100 leading-snug mb-8">
                                "Chez Global Adoption, nous croyons que chaque enfant mérite une famille capable de lui offrir amour, protection et stabilité."
                            </blockquote>
                            <p className="text-gray-300 mb-8 font-light">
                                Notre engagement est d'accompagner les familles avec sérieux, écoute et professionnalisme afin que chaque projet d'adoption puisse se construire dans les meilleures conditions possibles.
                            </p>
                            <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-md">
                                <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contact Professionnel</p>
                                <a href="mailto:contact@global-adoption.com" className="text-xl font-bold text-white hover:text-primary-400 transition-colors flex items-center gap-3">
                                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    contact@global-adoption.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;
