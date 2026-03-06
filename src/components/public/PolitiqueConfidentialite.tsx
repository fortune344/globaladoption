import React from 'react';
import { Link } from 'react-router-dom';

const PolitiqueConfidentialite: React.FC = () => {
    return (
        <section className="py-12 md:py-20 bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    Politique de Confidentialité
                </h1>

                {/* Introduction */}
                <div className="mb-10">
                    <p className="text-gray-600 mb-4">
                        La présente Politique de Confidentialité a pour but de vous informer sur la manière dont GLOBAL ADOPTION (« nous », « notre », ou « nos ») collecte, utilise, et protège vos données personnelles lorsque vous naviguez sur notre site internet et utilisez nos services.
                    </p>
                    <p className="text-gray-600">
                        La protection de votre vie privée est une priorité absolue pour notre organisme, particulièrement dans le cadre sensible de l'adoption internationale.
                    </p>
                </div>

                {/* Données collectées */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        1. Données personnelles collectées
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>Nous pouvons être amenés à collecter et traiter les catégories de données suivantes :</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Données d'identification :</strong> Nom, prénom, civilité, date de naissance.</li>
                            <li><strong>Données de contact :</strong> Adresse postale, adresse e-mail, numéros de téléphone.</li>
                            <li><strong>Données relatives au projet d'adoption :</strong> Situation familiale, pays envisagé, motivations (via notre formulaire de demande).</li>
                            <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées (via les cookies fonctionnels).</li>
                        </ul>
                    </div>
                </div>

                {/* Finalités du traitement */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        2. Finalités du traitement
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>Vos données sont collectées pour les finalités suivantes :</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Le traitement et le suivi de votre dossier de demande d'adoption.</li>
                            <li>La prise de contact et la planification des rendez-vous d'information.</li>
                            <li>La gestion de notre base de témoignages (avec votre accord explicite).</li>
                            <li>L'amélioration de la sécurité et du fonctionnement de notre site web.</li>
                        </ul>
                    </div>
                </div>

                {/* Base légale */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        3. Base légale du traitement
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>Nous traitons vos données personnelles selon les bases légales suivantes :</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Consentement :</strong> Lorsque vous soumettez volontairement une demande ou nous contactez.</li>
                            <li><strong>Exécution de mesures précontractuelles :</strong> Pour étudier la faisabilité de votre projet d'adoption.</li>
                            <li><strong>Respect d'obligations légales :</strong> Pour répondre aux exigences de la réglementation sur l'adoption (agrément, tenue des dossiers).</li>
                        </ul>
                    </div>
                </div>

                {/* Durée de conservation */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        4. Durée de conservation
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>
                            Vos données sont conservées uniquement pendant le temps nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, conformément aux exigences légales applicables aux Organismes Autorisés pour l'Adoption (OAA).
                        </p>
                        <p>
                            Les données issues du formulaire de contact sont généralement conservées au maximum 3 ans après notre dernier échange, sauf si un dossier d'adoption est officiellement ouvert (auquel cas les durées légales de conservation des dossiers s'appliquent).
                        </p>
                    </div>
                </div>

                {/* Vos droits */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        5. Vos droits
                    </h2>
                    <div className="space-y-3 text-gray-600">
                        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Droit d'accès à vos données.</li>
                            <li>Droit de rectification en cas de données erronées.</li>
                            <li>Droit à l'effacement (« droit à l'oubli »), sous réserve de nos obligations légales.</li>
                            <li>Droit à la limitation du traitement.</li>
                            <li>Droit à la portabilité de vos données.</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :{' '}
                            <a href="mailto:contact@global-adoption.com" className="text-primary-600 hover:underline">
                                contact@global-adoption.com
                            </a>.
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

export default PolitiqueConfidentialite;
