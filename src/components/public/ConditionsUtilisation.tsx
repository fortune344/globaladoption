import React from 'react';
import { Link } from 'react-router-dom';

const ConditionsUtilisation: React.FC = () => {
    return (
        <section className="py-12 md:py-20 bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    Conditions Générales d'Utilisation
                </h1>

                {/* Introduction */}
                <div className="mb-10">
                    <p className="text-gray-600 mb-4">
                        Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») régissent l'accès et l'utilisation du site internet de GLOBAL ADOPTION.
                    </p>
                    <p className="text-gray-600">
                        En naviguant sur ce site, vous reconnaissez avoir pris connaissance de ces conditions et les accepter sans réserve. Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser notre site.
                    </p>
                </div>

                {/* Accès au site */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        1. Accès au site et services
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            Le site a pour objet de fournir des informations concernant l'ensemble des activités de GLOBAL ADOPTION, notamment nos services d'accompagnement à l'adoption et nos coordonnées.
                        </p>
                        <p>
                            L'accès au site est gratuit pour tout utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès (matériel informatique, logiciels, connexion internet) sont à la charge exclusive de l'utilisateur.
                        </p>
                        <p>
                            Nous nous efforçons de maintenir le site accessible 24h/24 et 7j/7, mais nous déclinons toute responsabilité en cas d'indisponibilité, quelle qu'en soit la cause (maintenance, bugs, force majeure).
                        </p>
                    </div>
                </div>

                {/* Propriété Intellectuelle */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        2. Propriété intellectuelle
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            L'ensemble du contenu publié sur ce site (textes, images, graphismes, logos, icônes, vidéos, logiciels, etc.) est la propriété exclusive de GLOBAL ADOPTION ou de ses partenaires, et est protégé par les lois internationales sur la propriété intellectuelle.
                        </p>
                        <p>
                            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est formellement interdite sans l'autorisation écrite préalable de GLOBAL ADOPTION.
                        </p>
                    </div>
                </div>

                {/* Responsabilités de l'utilisateur */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        3. Responsabilités de l'utilisateur
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            L'utilisateur s'engage à utiliser le site et ses services (notamment le formulaire de contact) de manière responsable et licite. Il est strictement interdit :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>De transmettre des informations fausses, trompeuses ou illicites via nos formulaires.</li>
                            <li>De tenter de contourner les mesures de sécurité du site (tentatives de piratage, introduction de virus).</li>
                            <li>D'utiliser les coordonnées présentes sur le site à des fins de démarchage commercial (spam).</li>
                        </ul>
                    </div>
                </div>

                {/* Limitation de responsabilité */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        4. Limitation de responsabilité
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            Les informations fournies sur le site le sont à titre indicatif. GLOBAL ADOPTION s'efforce de garantir l'exactitude et la mise à jour des informations diffusées, mais ne peut en garantir l'exhaustivité totale.
                        </p>
                        <p>
                            L'organisme ne pourra être tenu responsable des dommages directs ou indirects, matériels ou immatériels, résultant de l'accès ou de l'utilisation du site, ou de l'incapacité d'y accéder.
                        </p>
                        <p>
                            Le site peut contenir des liens hypertextes vers d'autres sites. GLOBAL ADOPTION n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                        </p>
                    </div>
                </div>

                {/* Droit applicable */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        5. Droit applicable et juridiction
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution de ces conditions, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
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

export default ConditionsUtilisation;
