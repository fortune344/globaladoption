// components/public/CTASection.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
    return (
        <section id="cta" className="py-24 bg-gradient-to-br from-primary-500 to-primary-700 border-t-4 border-primary-600">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Commencez Votre Démarche Aujourd'hui
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Vous souhaitez adopter un enfant ? Remplissez notre formulaire de demande d'adoption
                    et notre équipe vous accompagnera tout au long du processus.
                </p>

                <Link
                    to="/demande"
                    className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                    Soumettre une demande d'adoption
                </Link>
            </div>
        </section>
    );
};

export default CTASection;
