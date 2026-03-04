// components/public/Hero.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const Hero: React.FC = () => {
    const { settings } = useSiteSettings();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Démarrer les animations après le montage
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const navigate = useNavigate();

    const handleAppointmentClick = () => {
        navigate('/demande');
    };

    const scrollToGallery = () => {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-900"
            style={{
                backgroundImage: `url(${settings.bgHero})`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Contenu */}
            <div className="relative z-10 text-center text-white px-6 max-w-5xl mt-16">
                <h1
                    className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    Donnez un{' '}
                    <span className="typewriter-text text-primary-400">
                        foyer à un enfant
                    </span>
                </h1>

                <p
                    className={`text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto reveal reveal-up delay-300 ${isVisible ? 'active' : ''
                        }`}
                >
                    Découvrez notre processus d'accompagnement et commencez votre parcours
                    d'adoption dans un environnement professionnel et sécurisé.
                </p>

                <div
                    className={`flex flex-col sm:flex-row gap-4 justify-center reveal reveal-up delay-500 ${isVisible ? 'active' : ''
                        }`}
                >
                    <button
                        onClick={handleAppointmentClick}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                        Prendre rendez-vous
                    </button>
                    <button
                        onClick={scrollToGallery}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white transition-all hover:scale-105"
                    >
                        En savoir plus
                    </button>
                </div>

                {/* Note importante */}
                <div
                    className={`mt-12 text-sm text-white/80 reveal reveal-up delay-700 ${isVisible ? 'active' : ''
                        }`}
                >
                    <p>
                        Commencez votre histoire aujourd'hui.
                    </p>
                </div>
            </div>

            {/* Indicateur de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
