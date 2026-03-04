// components/public/DemandeAdoption.tsx
// Page de prise de contact / rendez-vous avec validations complètes + sécurité
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { sanitizeError, isValidEmail } from '../../lib/errorUtils';
import {
    sanitizeHTML,
    rateLimiter,
    RATE_LIMITS,
    generateCsrfToken,
    validateCsrfToken,
    isHoneypotTriggered,
    containsSuspiciousContent,
    logSecurityEvent
} from '../../lib/security';

import { SORTED_COUNTRIES } from '../../lib/countries';
import type { CountryInfo } from '../../lib/countries';

const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const capitalizeWords = (str: string): string => {
    return str.split(/[\s-]+/).map(word => capitalizeFirstLetter(word)).join(
        str.includes('-') ? '-' : ' '
    );
};

const DemandeAdoption: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+33',
        countryName: 'France',
        phone: '',
        appointmentDate: '',
        appointmentTime: '',
        motivation: ''
    });
    const [honeypot, setHoneypot] = useState(''); // Champ invisible anti-bot
    const [csrfToken, setCsrfToken] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dropdown state
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Générer le CSRF token au montage
    useEffect(() => {
        setCsrfToken(generateCsrfToken());
    }, []);

    // Date minimum = aujourd'hui
    const today = new Date().toISOString().split('T')[0];

    const getSelectedCountry = (): CountryInfo => {
        return SORTED_COUNTRIES.find(c => c.code === formData.countryCode && c.name === formData.countryName) || SORTED_COUNTRIES[0];
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Prénom
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Prénom requis';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Prénom trop court';
        }

        // Nom
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nom requis';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Nom trop court';
        }

        // Détection d'injection dans les noms
        if (containsSuspiciousContent(formData.firstName) || containsSuspiciousContent(formData.lastName)) {
            newErrors.firstName = 'Caractères non autorisés détectés';
            logSecurityEvent('xss_attempt', `Input suspect dans nom: ${formData.firstName} ${formData.lastName}`);
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Format d\'email invalide (ex: nom@domaine.com)';
        }

        // Téléphone
        if (formData.phone) {
            const digitsOnly = formData.phone.replace(/[\s\-\(\)]/g, '');
            const country = getSelectedCountry();

            if (!/^\d+$/.test(digitsOnly)) {
                newErrors.phone = 'Le numéro ne doit contenir que des chiffres';
            } else if (digitsOnly.length !== country.digits) {
                newErrors.phone = `${country.name} : ${country.digits} chiffres requis (sans indicatif)`;
            }
        }

        // Date de rendez-vous
        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Veuillez choisir une date de rendez-vous';
        } else {
            const selectedDate = new Date(formData.appointmentDate);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            if (selectedDate < todayDate) {
                newErrors.appointmentDate = 'La date doit être dans le futur';
            }
        }

        // Heure
        if (!formData.appointmentTime) {
            newErrors.appointmentTime = 'Veuillez choisir une heure';
        }

        // Message
        if (!formData.motivation.trim()) {
            newErrors.motivation = 'Message requis';
        } else if (formData.motivation.trim().length < 10) {
            newErrors.motivation = 'Votre message est un peu court (min. 10 caractères)';
        }

        // Détection d'injection dans le message
        if (containsSuspiciousContent(formData.motivation)) {
            newErrors.motivation = 'Votre message contient des caractères non autorisés';
            logSecurityEvent('xss_attempt', `Input suspect dans motivation`);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
        const capitalized = capitalizeWords(value);
        setFormData({ ...formData, [field]: capitalized });
    };

    const handlePhoneChange = (value: string) => {
        const cleaned = value.replace(/[^\d\s]/g, '');
        setFormData({ ...formData, phone: cleaned });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError('');
        setSuccess(false);

        // 🛡️ HONEYPOT : si rempli = bot
        if (isHoneypotTriggered(honeypot)) {
            logSecurityEvent('suspicious_input', 'Honeypot déclenché');
            // Simuler un succès pour ne pas alerter le bot
            setSuccess(true);
            return;
        }

        // 🛡️ CSRF : vérifier le token
        if (!validateCsrfToken(csrfToken)) {
            logSecurityEvent('csrf_violation', 'Token CSRF invalide');
            setGlobalError('Erreur de sécurité. Veuillez rafraîchir la page et réessayer.');
            return;
        }

        // 🛡️ RATE LIMITING : max 5 soumissions par minute
        const rateCheck = rateLimiter.check(
            'form_submit',
            RATE_LIMITS.FORM_SUBMIT.maxAttempts,
            RATE_LIMITS.FORM_SUBMIT.windowMs
        );
        if (!rateCheck.allowed) {
            const waitSeconds = Math.ceil(rateCheck.remainingMs / 1000);
            logSecurityEvent('rate_limit_hit', 'Formulaire soumis trop rapidement');
            setGlobalError(`Trop de tentatives. Veuillez patienter ${waitSeconds} secondes.`);
            return;
        }

        if (!validate()) return;

        setLoading(true);
        try {
            const phoneNumber = formData.phone
                ? `${formData.countryCode} ${formData.phone.replace(/[\s\-\(\)]/g, '')}`
                : null;

            // 🛡️ SANITIZE tous les inputs avant envoi
            const { error } = await supabase.from('submissions').insert([
                {
                    full_name: sanitizeHTML(`${formData.firstName.trim()} ${formData.lastName.trim()}`),
                    email: sanitizeHTML(formData.email.trim().toLowerCase()),
                    phone: phoneNumber ? sanitizeHTML(phoneNumber) : null,
                    appointment_date: formData.appointmentDate,
                    appointment_time: formData.appointmentTime,
                    message: sanitizeHTML(formData.motivation.trim()),
                    status: 'pending'
                }
            ]);

            if (error) throw error;

            setSuccess(true);
            setFormData({
                firstName: '', lastName: '', email: '',
                countryCode: '+33', countryName: 'France', phone: '',
                appointmentDate: '', appointmentTime: '',
                motivation: ''
            });
            // Regénérer le CSRF token après soumission
            setCsrfToken(generateCsrfToken());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setGlobalError(sanitizeError(error));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full px-4 py-3 bg-white/50 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none ${errors[field] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-primary-300'}`;

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 to-primary-50 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto px-6">

                {/* En-tête */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 tracking-wide uppercase">
                        Première Étape
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-display">
                        Parlons de <span className="text-primary-600">votre projet</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Remplissez ce formulaire pour prendre rendez-vous avec l'un de nos conseillers.
                        Nous examinerons votre dossier pour vous guider dans vos démarches.
                    </p>
                </div>

                {/* Carte Formulaire */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-12 relative overflow-hidden">

                    {/* Décoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl -z-10"></div>

                    {success ? (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Demande envoyée avec succès !</h2>
                            <p className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed">
                                Merci de votre confiance.
                                <br />
                                Notre équipe a bien reçu votre demande de rendez-vous. Nous reviendrons vers vous très prochainement pour confirmer la date et l'heure.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="mt-8 text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
                            >
                                Envoyer une autre demande
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                            {/* 🛡️ CSRF token caché */}
                            <input type="hidden" name="_csrf" value={csrfToken} />

                            {/* 🛡️ HONEYPOT — invisible pour les humains, les bots le remplissent */}
                            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                                <label htmlFor="website_url">Ne pas remplir</label>
                                <input
                                    type="text"
                                    id="website_url"
                                    name="website_url"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                />
                            </div>

                            {globalError && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {globalError}
                                </div>
                            )}

                            {/* Bloc Identité */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    Vos informations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Prénom *</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleNameChange('firstName', e.target.value)}
                                            className={inputClass('firstName')}
                                            placeholder="Votre prénom"
                                            disabled={loading}
                                            maxLength={50}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nom *</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleNameChange('lastName', e.target.value)}
                                            className={inputClass('lastName')}
                                            placeholder="Votre nom"
                                            disabled={loading}
                                            maxLength={50}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Bloc Contact */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    Contact
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={inputClass('email')}
                                            placeholder="contact@exemple.com"
                                            disabled={loading}
                                            maxLength={100}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                            Téléphone <span className="text-gray-400 font-normal text-xs">(Optionnel)</span>
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-2 relative" ref={dropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => !loading && setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                className="flex items-center gap-2 px-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none text-sm w-full sm:w-48 justify-between disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    {getSelectedCountry().iso ? (
                                                        <img src={`https://flagcdn.com/w20/${getSelectedCountry().iso}.png`} alt={getSelectedCountry().name} className="w-5 h-auto object-cover rounded-sm shadow-sm" />
                                                    ) : (
                                                        <span>{getSelectedCountry().flag}</span>
                                                    )}
                                                    <span className="truncate">{getSelectedCountry().code}</span>
                                                </span>
                                                <svg className={`flex-shrink-0 w-4 h-4 text-gray-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>

                                            {isCountryDropdownOpen && (
                                                <div className="absolute z-50 top-[110%] left-0 w-full sm:w-80 max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-xl py-1">
                                                    {SORTED_COUNTRIES.map((c, idx) => (
                                                        <button
                                                            key={`${c.code}-${c.name}-${idx}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, countryCode: c.code, countryName: c.name });
                                                                setIsCountryDropdownOpen(false);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-primary-50 flex items-center gap-3 transition-colors text-sm"
                                                        >
                                                            {c.iso ? (
                                                                <img src={`https://flagcdn.com/w20/${c.iso}.png`} alt={c.name} className="w-5 h-auto object-cover rounded-sm shadow-sm flex-shrink-0" />
                                                            ) : (
                                                                <span className="flex-shrink-0">{c.flag}</span>
                                                            )}
                                                            <span className="text-gray-800 truncate">{c.name}</span>
                                                            <span className="text-gray-400 ml-auto flex-shrink-0">{c.code}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                className={`flex-1 ${inputClass('phone')} min-w-0`}
                                                placeholder={`${getSelectedCountry().digits} chiffres`}
                                                disabled={loading}
                                                maxLength={15}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Bloc Rendez-vous */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    Date et heure souhaitées
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Date *</label>
                                        <input
                                            type="date"
                                            value={formData.appointmentDate}
                                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                            min={today}
                                            className={inputClass('appointmentDate')}
                                            disabled={loading}
                                        />
                                        {errors.appointmentDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.appointmentDate}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Heure *</label>
                                        <input
                                            type="time"
                                            value={formData.appointmentTime}
                                            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                            min="08:00"
                                            max="18:00"
                                            className={inputClass('appointmentTime')}
                                            disabled={loading}
                                        />
                                        <p className="text-gray-400 text-xs mt-1 ml-1">Horaires : 08h00 - 18h00</p>
                                        {errors.appointmentTime && <p className="text-red-500 text-xs mt-1 ml-1">{errors.appointmentTime}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Bloc Message */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    Votre message
                                </h3>
                                <textarea
                                    value={formData.motivation}
                                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                    rows={5}
                                    className={`${inputClass('motivation')} resize-none`}
                                    placeholder="Ce qui vous motive, vos questions, ou simplement quelques mots sur votre projet d'adoption..."
                                    disabled={loading}
                                    maxLength={2000}
                                />
                                {errors.motivation && <p className="text-red-500 text-xs mt-1 ml-1">{errors.motivation}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none"
                            >
                                {loading ? 'Envoi en cours...' : 'Prendre Rendez-vous'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DemandeAdoption;
