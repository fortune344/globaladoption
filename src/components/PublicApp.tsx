// components/PublicApp.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SiteSettingsProvider } from '../contexts/SiteSettingsContext';
import Navbar from './public/Navbar';
import Hero from './public/Hero';
import MissionSection from './public/MissionSection';
import TimelineSection from './public/TimelineSection';
import GallerySection from './public/GallerySection';
import TestimonialsSection from './public/TestimonialsSection';
import CTASection from './public/CTASection';
import Footer from './public/Footer';
import MentionsLegales from './public/MentionsLegales';
import DemandeAdoption from './public/DemandeAdoption';

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <MissionSection />
            <TimelineSection />
            <GallerySection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </>
    );
};

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
};

const PublicAppContent: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demande" element={
                <PageLayout>
                    <DemandeAdoption />
                </PageLayout>
            } />
            <Route path="/mentions-legales" element={
                <PageLayout>
                    <MentionsLegales />
                </PageLayout>
            } />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const PublicApp: React.FC = () => {
    return (
        <SiteSettingsProvider>
            <PublicAppContent />
        </SiteSettingsProvider>
    );
};

export default PublicApp;
