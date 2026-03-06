import React from 'react';
import { Link } from 'react-router-dom';

const MentionsLegales: React.FC = () => {
    return (
        <section className="py-12 md:py-20 bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    Mentions Légales
                </h1>

                {/* Identité */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        1. Identité de l'organisme
                    </h2>
                    <div className="space-y-2 text-gray-600">
                        <p><strong>Nom officiel :</strong> GLOBAL ADOPTION</p>
                        <p><strong>Statut :</strong> Organisme autorisé pour l'adoption (OAA)</p>
                        <p><strong>Numéro d'agrément :</strong> ADOP/FR/075/2022/018</p>
                        <p><strong>Pays d'enregistrement :</strong> France</p>
                    </div>
                </div>

                {/* Coordonnées */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        2. Coordonnées
                    </h2>
                    <div className="space-y-2 text-gray-600">
                        <p><strong>Adresse :</strong> 12 rue de la République, 10000 Troyes – France</p>
                        <p>
                            <strong>Téléphone :</strong>{' '}
                            <a href="https://wa.me/33644714318" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                +33 6 44 71 43 18 (WhatsApp)
                            </a>
                        </p>
                        <p>
                            <strong>Email :</strong>{' '}
                            <a href="mailto:contact@global-adoption.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                contact@global-adoption.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Cadre juridique */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        3. Cadre juridique
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            GLOBAL ADOPTION exerce ses activités dans le cadre légal suivant :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong>Code de l'action sociale et des familles (CASF)</strong> –
                                Articles L.225-1 et suivants : réglementation des organismes autorisés
                                pour l'adoption.
                            </li>
                            <li>
                                <strong>Code civil</strong> – Articles 343 et suivants : conditions et
                                effets de l'adoption (adoption plénière et adoption simple).
                            </li>
                            <li>
                                <strong>Convention de La Haye du 29 mai 1993</strong> sur la protection
                                des enfants et la coopération en matière d'adoption.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Hébergement */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        4. Hébergement
                    </h2>
                    <div className="space-y-2 text-gray-600">
                        <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                        <p>440 N Barranca Avenue #4133, Covina, CA 91723, USA</p>
                        <p>
                            Site web :{' '}
                            <a href="https://vercel.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                vercel.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Propriété intellectuelle */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        5. Propriété intellectuelle
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes)
                            est la propriété exclusive de GLOBAL ADOPTION, sauf mention contraire.
                            Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu
                            de ce site est interdite sans l'autorisation préalable de GLOBAL ADOPTION.
                        </p>
                    </div>
                </div>

                {/* Responsabilité */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        6. Limitation de responsabilité
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            GLOBAL ADOPTION s'efforce de fournir sur ce site des informations aussi
                            précises que possible. Toutefois, l'organisme ne pourra être tenu responsable
                            des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles
                            soient de son fait ou du fait des tiers partenaires qui lui fournissent ces
                            informations.
                        </p>
                    </div>
                </div>

                {/* Retour */}
                <div className="pt-6 border-t border-gray-200">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MentionsLegales;
