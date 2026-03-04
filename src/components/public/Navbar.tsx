// components/public/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Accueil', href: '#hero' },
        { label: 'Galerie', href: '#gallery' },
        { label: 'Témoignages', href: '#testimonials' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">G</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">GLOBAL ADOPTION</span>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (location.pathname !== '/') {
                                        navigate(`/${link.href}`);
                                    } else {
                                        const el = document.querySelector(link.href);
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/demande"
                            className="bg-primary-500 hover:bg-primary-600 px-5 py-2 rounded-lg text-white font-semibold transition-colors"
                        >
                            Faire une demande
                        </Link>
                    </div>

                    {/* Menu Mobile Hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-primary-600 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsMenuOpen(false);
                                    if (location.pathname !== '/') {
                                        navigate(`/${link.href}`);
                                    } else {
                                        const el = document.querySelector(link.href);
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="block text-gray-700 hover:text-primary-600 font-medium py-2 cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}

                        <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
                            <Link
                                to="/demande"
                                onClick={() => setIsMenuOpen(false)}
                                className="block bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg text-white font-semibold text-center"
                            >
                                Faire une demande
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
