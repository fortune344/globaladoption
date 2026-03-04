// components/public/Footer.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    {/* À propos */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary-400">GLOBAL ADOPTION</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Organisme autorisé pour l'adoption, nous facilitons votre parcours
                            d'adoption dans un cadre rigoureux, professionnel et sécurisé.
                        </p>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            {['Accueil', 'Galerie', 'Témoignages', 'Contact'].map((label) => {
                                const href = label === 'Accueil' ? '#hero' :
                                    label === 'Galerie' ? '#gallery' :
                                        label === 'Témoignages' ? '#testimonials' : '#contact';
                                return (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (location.pathname !== '/') {
                                                    navigate(`/${href}`);
                                                } else {
                                                    const el = document.querySelector(href);
                                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>12 rue de la République<br />10000 Troyes – France</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="https://wa.me/33644714318" className="hover:text-white transition-colors">
                                    WhatsApp : +33 6 44 71 43 18
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:contact@globaladoption.fr" className="hover:text-white transition-colors">
                                    contact@globaladoption.fr
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Informations légales */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Informations légales</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Mentions légales
                                </Link>
                            </li>
                            <li>
                                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Conditions d'utilisation
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-800 pt-8">
                    <p className="text-gray-400 text-sm text-center">
                        © {currentYear} GLOBAL ADOPTION. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
