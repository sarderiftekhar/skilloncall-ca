import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';
import { TermsModal } from '@/components/terms-modal';
import { ContactModal } from '@/components/contact-modal';
import { FeedbackModal } from '@/components/feedback-modal';
import {
    UserPlus,
    Briefcase,
    Users,
    MessageSquare,
    CheckCircle,
    Star,
    Search,
    FileText,
    Clock,
    DollarSign,
    Award,
    MapPin,
    Shield,
    TrendingUp,
    ArrowRight,
} from 'react-feather';

export default function HowItWorks() {
    const { auth } = usePage<SharedData>().props as any;
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';
    const queryLang = `?lang=${locale}`;
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterModalData, setNewsletterModalData] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);

    const platformDescription = isFrench
        ? 'La principale plateforme canadienne pour relier des talents qualifiés à des entreprises locales. Créée par des Canadiens, pour des Canadiens.'
        : "Canada's premier platform for connecting skilled employees with local businesses. Built for Canadians, by Canadians.";

    const newsletterCopy = {
        emailRequired: isFrench ? 'Veuillez entrer votre adresse courriel.' : 'Please enter your email address.',
        success: isFrench
            ? 'Merci de vous être abonné(e) à notre infolettre !\n\nVous recevrez des nouvelles sur les offres d\'emploi et les fonctionnalités de la plateforme.'
            : 'Thank you for subscribing to our newsletter!\n\nYou\'ll receive updates about new job opportunities and platform features.',
        failure: isFrench ? 'Échec de l\'abonnement. Veuillez réessayer.' : 'Failed to subscribe. Please try again.',
        payload: {
            name: isFrench ? 'Abonné(e) à l\'infolettre' : 'Newsletter Subscriber',
            message: isFrench
                ? 'Demande d\'abonnement à l\'infolettre — Merci de m\'ajouter à l\'infolettre de SkillOnCall.ca afin de recevoir des mises à jour sur les nouvelles offres d\'emploi, les fonctionnalités de la plateforme et l\'actualité du secteur.'
                : 'Newsletter Subscription Request - Please add me to the SkillOnCall.ca newsletter to receive updates about new job opportunities, platform features, and industry news.',
        },
    };

    const footerEmployerLinks = [
        { label: isFrench ? 'Publier des offres' : 'Post Jobs', href: `/register${queryLang}` },
        { label: isFrench ? 'Trouver des employés' : 'Find Employees', href: `/register${queryLang}` },
        {
            label: isFrench ? 'Voir les forfaits' : 'Subscription Plans',
            href: `/subscriptions${queryLang}`,
            highlight: true,
            prefix: '💎 ',
        },
        { label: isFrench ? 'Histoires de réussite' : 'Success Stories', href: '#' },
    ];

    const footerEmployeeLinks = [
        { label: isFrench ? 'Créer un profil' : 'Create Profile', href: `/register${queryLang}` },
        { label: isFrench ? 'Explorer les offres' : 'Browse Jobs', href: `/register${queryLang}` },
        {
            label: isFrench ? 'Plans Pro' : 'Pro Plans',
            href: `/subscriptions${queryLang}`,
            highlight: true,
        },
        { label: isFrench ? 'Centre d\'aide' : 'Help Center', href: `/how-it-works${queryLang}` },
    ];

    const handleNewsletterSubscribe = async () => {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setNewsletterModalData({
                type: 'error',
                title: isFrench ? 'Erreur' : 'Error',
                message: newsletterCopy.emailRequired
            });
            setShowNewsletterModal(true);
            return;
        }

        if (!emailRegex.test(email.trim())) {
            setNewsletterModalData({
                type: 'error',
                title: isFrench ? 'Erreur' : 'Error',
                message: isFrench ? 'Veuillez entrer une adresse courriel valide.' : 'Please enter a valid email address.'
            });
            setShowNewsletterModal(true);
            return;
        }

        setIsSubscribing(true);
        
        try {
            // Send newsletter subscription
            const response = await fetch('/newsletter/subscribe', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    name: newsletterCopy.payload.name,
                    source: 'how_it_works_page',
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setNewsletterModalData({
                    type: 'success',
                    title: isFrench ? 'Abonnement réussi!' : 'Subscription Successful!',
                    message: result.message || newsletterCopy.success
                });
                setEmail('');
            } else {
                setNewsletterModalData({
                    type: 'error',
                    title: isFrench ? 'Erreur' : 'Error',
                    message: result.message || newsletterCopy.failure
                });
            }
            setShowNewsletterModal(true);
        } catch (error) {
            setNewsletterModalData({
                type: 'error',
                title: isFrench ? 'Erreur' : 'Error',
                message: newsletterCopy.failure
            });
            setShowNewsletterModal(true);
        } finally {
            setIsSubscribing(false);
        }
    };

    // Get how-it-works translations using the translation hook
    // Translations are merged at top level, so access directly
    const t_how = (key: string, fallback?: string) => {
        return t(key, fallback || key);
    };

    // Employer steps
    const employerSteps = [
        {
            number: 1,
            icon: UserPlus,
            title: t_how('employers.step_1.title', 'Sign Up & Complete Profile'),
            description: t_how('employers.step_1.description', 'Create your free account and complete your business profile in just 2 simple steps.'),
        },
        {
            number: 2,
            icon: Briefcase,
            title: t_how('employers.step_2.title', 'Post a Job'),
            description: t_how('employers.step_2.description', 'Describe your job requirements, needed skills, location, and budget.'),
        },
        {
            number: 3,
            icon: Users,
            title: t_how('employers.step_3.title', 'Review Applications'),
            description: t_how('employers.step_3.description', 'Workers express interest in your job posting. Review their profiles and skills.'),
        },
        {
            number: 4,
            icon: MessageSquare,
            title: t_how('employers.step_4.title', 'Message & Connect'),
            description: t_how('employers.step_4.description', 'Use our built-in messaging system to communicate with interested workers.'),
        },
        {
            number: 5,
            icon: CheckCircle,
            title: t_how('employers.step_5.title', 'Hire & Work'),
            description: t_how('employers.step_5.description', 'Select the best worker for your job. Once hired, they can start working.'),
        },
        {
            number: 6,
            icon: Star,
            title: t_how('employers.step_6.title', 'Rate & Review'),
            description: t_how('employers.step_6.description', 'After the job is complete, leave a review and rating.'),
        },
    ];

    // Worker steps
    const workerSteps = [
        {
            number: 1,
            icon: UserPlus,
            title: t_how('workers.step_1.title', 'Sign Up & Complete Profile'),
            description: t_how('workers.step_1.description', 'Create your free account and complete your profile in 5 easy steps.'),
        },
        {
            number: 2,
            icon: Clock,
            title: t_how('workers.step_2.title', 'Set Availability & Skills'),
            description: t_how('workers.step_2.description', 'Customize your profile with your skills, certifications, and weekly availability.'),
        },
        {
            number: 3,
            icon: Search,
            title: t_how('workers.step_3.title', 'Browse Jobs'),
            description: t_how('workers.step_3.description', 'Search for jobs by location, skills, pay rate, and job type.'),
        },
        {
            number: 4,
            icon: FileText,
            title: t_how('workers.step_4.title', 'Apply to Jobs'),
            description: t_how('workers.step_4.description', 'Express interest in jobs that match your skills and availability.'),
        },
        {
            number: 5,
            icon: CheckCircle,
            title: t_how('workers.step_5.title', 'Get Hired'),
            description: t_how('workers.step_5.description', 'When an employer selects you, you\'ll receive a notification.'),
        },
        {
            number: 6,
            icon: DollarSign,
            title: t_how('workers.step_6.title', 'Complete Work & Get Paid'),
            description: t_how('workers.step_6.description', 'Complete the work as agreed. Payment arrangements are handled directly.'),
        },
        {
            number: 7,
            icon: Award,
            title: t_how('workers.step_7.title', 'Build Your Reputation'),
            description: t_how('workers.step_7.description', 'Receive reviews and ratings from employers. Build your reputation.'),
        },
    ];

    // Platform features
    const platformFeatures = [
        {
            icon: MapPin,
            title: t_how('platform_features.canadian_focused.title', 'Canadian-Focused'),
            description: t_how('platform_features.canadian_focused.description', 'Built for Canadian businesses and workers.'),
        },
        {
            icon: Search,
            title: t_how('platform_features.location_based.title', 'Location-Based Matching'),
            description: t_how('platform_features.location_based.description', 'Find workers and jobs in your area using Canadian postal codes.'),
        },
        {
            icon: TrendingUp,
            title: t_how('platform_features.skill_based.title', 'Skill-Based Filtering'),
            description: t_how('platform_features.skill_based.description', 'Filter by skills, certifications, experience level, and more.'),
        },
        {
            icon: MessageSquare,
            title: t_how('platform_features.messaging.title', 'Built-in Messaging'),
            description: t_how('platform_features.messaging.description', 'Communicate directly through our platform.'),
        },
        {
            icon: Star,
            title: t_how('platform_features.ratings.title', 'Rating & Review System'),
            description: t_how('platform_features.ratings.description', 'Build trust with our bilateral rating system.'),
        },
        {
            icon: Shield,
            title: t_how('platform_features.subscriptions.title', 'Flexible Subscriptions'),
            description: t_how('platform_features.subscriptions.description', 'Choose from free or premium plans that fit your needs.'),
        },
    ];

    // FAQ items - all 15 questions
    const faqItems = [
        {
            id: 'q1',
            question: t_how('faq.q1.question', 'Is SkillOnCall.ca free to use?'),
            answer: t_how('faq.q1.answer', 'Yes! Both employers and workers can sign up for free.'),
        },
        {
            id: 'q2',
            question: t_how('faq.q2.question', 'How do payments work?'),
            answer: t_how('faq.q2.answer', 'Payment arrangements are handled directly between employers and workers.'),
        },
        {
            id: 'q3',
            question: t_how('faq.q3.question', 'How quickly can I find a worker or get hired?'),
            answer: t_how('faq.q3.answer', 'It depends on your location and requirements, but many employers find workers within hours.'),
        },
        {
            id: 'q4',
            question: t_how('faq.q4.question', 'Do I need to complete my profile to use the platform?'),
            answer: t_how('faq.q4.answer', 'Yes, completing your profile is required to ensure quality matches.'),
        },
        {
            id: 'q5',
            question: t_how('faq.q5.question', 'Is SkillOnCall.ca available across all of Canada?'),
            answer: t_how('faq.q5.answer', 'Yes! SkillOnCall.ca is available throughout Canada.'),
        },
        {
            id: 'q6',
            question: t_how('faq.q6.question', 'What types of jobs can I post as an employer?'),
            answer: t_how('faq.q6.answer', 'You can post various service industry and low-skill work positions.'),
        },
        {
            id: 'q7',
            question: t_how('faq.q7.question', 'How do I verify worker credentials and certifications?'),
            answer: t_how('faq.q7.answer', 'Workers can upload their certifications and credentials in their profiles.'),
        },
        {
            id: 'q8',
            question: t_how('faq.q8.question', 'Can I save workers for future job postings?'),
            answer: t_how('faq.q8.answer', 'Yes! Employers can save favorite workers to quickly contact them.'),
        },
        {
            id: 'q9',
            question: t_how('faq.q9.question', 'What happens if a worker doesn\'t show up?'),
            answer: t_how('faq.q9.answer', 'SkillOnCall.ca provides a rating and review system for feedback.'),
        },
        {
            id: 'q10',
            question: t_how('faq.q10.question', 'How do I cancel or modify a job posting?'),
            answer: t_how('faq.q10.answer', 'You can edit or close your job postings at any time from your dashboard.'),
        },
        {
            id: 'q11',
            question: t_how('faq.q11.question', 'What information do I need to create a worker profile?'),
            answer: t_how('faq.q11.answer', 'You\'ll need personal information, work authorization, skills, and availability.'),
        },
        {
            id: 'q12',
            question: t_how('faq.q12.question', 'How do I set my hourly rate?'),
            answer: t_how('faq.q12.answer', 'During profile setup, you can set your preferred hourly rate range.'),
        },
        {
            id: 'q13',
            question: t_how('faq.q13.question', 'Can I work for multiple employers?'),
            answer: t_how('faq.q13.answer', 'Yes! SkillOnCall.ca is designed for flexible work with multiple employers.'),
        },
        {
            id: 'q14',
            question: t_how('faq.q14.question', 'How do I improve my profile visibility?'),
            answer: t_how('faq.q14.answer', 'Complete your profile fully, add certifications, and consider upgrading to Pro or Premium.'),
        },
        {
            id: 'q15',
            question: t_how('faq.q15.question', 'What if I need to cancel an accepted job?'),
            answer: t_how('faq.q15.answer', 'You can withdraw from a job application before being hired.'),
        },
    ];

    const switchLang = (lang: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.location.href = url.toString();
    };

    return (
        <>
            <Head title={t_how('meta.title', 'How It Works - SkillOnCall.ca')}>
                <meta name="description" content={t_how('meta.description', 'Learn how SkillOnCall.ca connects Canadian employers with skilled workers.')} />
            </Head>

            <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
                {/* Header */}
                <header style={{ backgroundColor: '#192341' }} className="shadow-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <Link href={`/${queryLang}`} className="flex-shrink-0 flex items-center cursor-pointer">
                                    <img
                                        src="/logo-white.png"
                                        alt="SkillOnCall Logo"
                                        className="w-8 h-8 mr-3"
                                    />
                                    <span className="text-xl font-bold text-white">SkillOnCall</span>
                                    <span className="ml-1" style={{ color: '#10B3D6' }}>
                                        .ca
                                    </span>
                                </Link>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                                    {t('nav.find_employees', 'Find Employees')}
                                </Link>
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                                    {t('nav.post_jobs', 'Post Jobs')}
                                </Link>
                                <Link href={`/how-it-works${queryLang}`} className="text-white font-semibold cursor-pointer transition-colors">
                                    {t('nav.how_it_works', 'How it Works')}
                                </Link>
                                <Link href={`/pricing${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                                    {t('nav.pricing', 'Pricing')}
                                </Link>
                            </nav>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {/* Language Switcher */}
                                <div className="flex items-center space-x-1 border border-gray-600 rounded-md overflow-hidden">
                                    <button
                                        onClick={() => switchLang('en')}
                                        className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                                            locale === 'en'
                                                ? 'bg-white text-gray-900'
                                                : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => switchLang('fr')}
                                        className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                                            locale === 'fr'
                                                ? 'bg-white text-gray-900'
                                                : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        FR
                                    </button>
                                </div>

                                {auth?.user ? (
                                    <Link href={`/dashboard${queryLang}`}>
                                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">
                                            {t('auth.dashboard', 'Dashboard')}
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href={`/login${queryLang}`}>
                                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                                {t('auth.sign_in', 'Sign In')}
                                            </Button>
                                        </Link>
                                        <Link href={`/register${queryLang}`}>
                                            <Button size="sm" style={{ backgroundColor: '#10B3D6' }} className="hover:opacity-90 text-white">
                                                {t('auth.get_started', 'Get Started')}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-16 pb-12 md:pt-24 md:pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#192341' }}>
                                {t_how('hero.title', 'How SkillOnCall.ca Works')}
                            </h1>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                {t_how('hero.subtitle', 'Connecting Canadian businesses with skilled workers in just a few simple steps')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* For Employers Section */}
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#10B3D6' }}>
                                {t_how('employers.title', 'For Employers')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t_how('employers.subtitle', 'Find qualified workers quickly and easily')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {employerSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <Card key={index} className="relative" style={{ borderRadius: '0.625rem' }}>
                                        <CardHeader>
                                            <div className="flex items-center mb-4">
                                                <div
                                                    className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg mr-4"
                                                    style={{ backgroundColor: '#10B3D6' }}
                                                >
                                                    {step.number}
                                                </div>
                                                <Icon className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                            </div>
                                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                                {step.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600">{step.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Employer CTA */}
                        <div className="text-center">
                            <Card className="max-w-2xl mx-auto" style={{ backgroundColor: '#FCF2F0', borderRadius: '0.625rem' }}>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-bold mb-2" style={{ color: '#192341' }}>
                                        {t_how('employers.cta.title', 'Ready to Find Workers?')}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t_how('employers.cta.description', 'Join thousands of Canadian businesses using SkillOnCall.ca')}
                                    </p>
                                    <Link href={`/register${queryLang}`}>
                                        <Button
                                            size="lg"
                                            style={{ backgroundColor: '#10B3D6' }}
                                            className="hover:opacity-90 text-white cursor-pointer"
                                        >
                                            {t_how('employers.cta.button', 'Get Started Free')}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* For Workers Section */}
                <section className="py-12 md:py-16" style={{ backgroundColor: '#FCF2F0' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#10B3D6' }}>
                                {t_how('workers.title', 'For Workers')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t_how('workers.subtitle', 'Find flexible work opportunities near you')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {workerSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <Card key={index} className="relative" style={{ borderRadius: '0.625rem' }}>
                                        <CardHeader>
                                            <div className="flex items-center mb-4">
                                                <div
                                                    className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg mr-4"
                                                    style={{ backgroundColor: '#10B3D6' }}
                                                >
                                                    {step.number}
                                                </div>
                                                <Icon className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                            </div>
                                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                                {step.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600">{step.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Worker CTA */}
                        <div className="text-center">
                            <Card className="max-w-2xl mx-auto" style={{ backgroundColor: '#FFFFFF', borderRadius: '0.625rem' }}>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-bold mb-2" style={{ color: '#192341' }}>
                                        {t_how('workers.cta.title', 'Ready to Find Work?')}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t_how('workers.cta.description', 'Join thousands of skilled workers across Canada')}
                                    </p>
                                    <Link href={`/register${queryLang}`}>
                                        <Button
                                            size="lg"
                                            style={{ backgroundColor: '#10B3D6' }}
                                            className="hover:opacity-90 text-white cursor-pointer"
                                        >
                                            {t_how('workers.cta.button', 'Get Started Free')}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Platform Features Section */}
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#192341' }}>
                                {t_how('platform_features.title', 'Platform Features')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platformFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card key={index} style={{ borderRadius: '0.625rem' }}>
                                        <CardHeader>
                                            <div className="flex items-center mb-4">
                                                <Icon className="h-8 w-8 mr-3" style={{ color: '#10B3D6' }} />
                                                <CardTitle className="text-lg" style={{ color: '#192341' }}>
                                                    {feature.title}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-12 md:py-16" style={{ backgroundColor: '#FCF2F0' }}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#192341' }}>
                                {t_how('faq.title', 'Frequently Asked Questions')}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {t_how('faq.subtitle', 'Find answers to common questions about SkillOnCall.ca')}
                            </p>
                        </div>

                        <Card className="shadow-lg" style={{ borderRadius: '0.625rem', backgroundColor: '#FFFFFF' }}>
                            <CardContent className="pt-6 pb-2">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqItems.map((faq, index) => (
                                        <AccordionItem 
                                            key={faq.id} 
                                            value={faq.id} 
                                            className="transition-all duration-200"
                                        >
                                            <AccordionTrigger 
                                                className="text-left" 
                                                style={{ color: '#192341' }}
                                            >
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p>{faq.answer}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="text-center" style={{ backgroundColor: '#192341', borderRadius: '0.625rem' }}>
                            <CardContent className="pt-12 pb-12">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                    {t_how('cta_section.title', 'Ready to Get Started?')}
                                </h2>
                                <p className="text-lg text-gray-300 mb-8">
                                    {t_how('cta_section.description', 'Join SkillOnCall.ca today and connect with skilled workers or find flexible work opportunities.')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href={`/register${queryLang}`}>
                                        <Button
                                            size="lg"
                                            style={{ backgroundColor: '#10B3D6' }}
                                            className="hover:opacity-90 text-white cursor-pointer"
                                        >
                                            {t_how('cta_section.button_employer', 'Post Jobs Free')}
                                        </Button>
                                    </Link>
                                    <Link href={`/register${queryLang}`}>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-white text-black bg-white hover:bg-gray-100 hover:text-black cursor-pointer"
                                        >
                                            {t_how('cta_section.button_worker', 'Find Jobs Free')}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-white py-12" style={{backgroundColor: '#10B3D6'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 flex items-center">
                                        <img 
                                            src="/logo-white.png" 
                                            alt="SkillOnCall Logo" 
                                            className="w-8 h-8 mr-3"
                                        />
                                        <span className="text-xl font-bold text-white">SkillOnCall</span>
                                        <span className="ml-1" style={{color: '#FCF2F0'}}>.ca</span>
                                    </div>
                                </div>
                                <p className="text-gray-100 mb-6 max-w-md">
                                    {platformDescription}
                                </p>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">📧 {t('footer.newsletter', 'Newsletter Signup')}</h3>
                                    <p className="text-gray-200 text-sm mb-3">{t('footer.newsletter_hint', 'Get updates on new jobs, platform features, and industry news')}</p>
                                    <div className="flex space-x-3">
                                        <Input 
                                            type="email" 
                                            placeholder={t('footer.enter_email', 'Enter your email')} 
                                            className="flex-1 text-gray-900" 
                                            style={{backgroundColor: '#FFFFFF', borderColor: '#F6FBFD'}}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
                                        />
                                        <Button 
                                            className="text-white hover:opacity-90 cursor-pointer" 
                                            style={{backgroundColor: '#FCF2F0', color: '#10B3D6'}}
                                            onClick={handleNewsletterSubscribe}
                                            disabled={isSubscribing}
                                        >
                                            {isSubscribing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                                    {t('footer.subscribing', 'Subscribing...')}
                                                </>
                                            ) : (
                                                t('footer.subscribe', 'Subscribe')
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('footer.for_employers', 'For Employers')}</h3>
                                <ul className="space-y-2 text-gray-100">
                                    {footerEmployerLinks.map((item, index) => {
                                        const commonClasses = `hover:text-white cursor-pointer${item.highlight ? ' font-semibold text-yellow-300' : ''}`;
                                        const label = `${item.prefix ?? ''}${item.label}`;

                                        return (
                                            <li key={index}>
                                                {item.href.startsWith('/') ? (
                                                    <Link href={item.href} className={commonClasses}>
                                                        {label}
                                                    </Link>
                                                ) : (
                                                    <a href={item.href} className={commonClasses}>
                                                        {label}
                                                    </a>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('footer.for_employees', 'For Employees')}</h3>
                                <ul className="space-y-2 text-gray-100">
                                    {footerEmployeeLinks.map((item, index) => {
                                        const commonClasses = `hover:text-white cursor-pointer${item.highlight ? ' font-semibold text-yellow-300' : ''}`;

                                        return (
                                            <li key={index}>
                                                {item.href.startsWith('/') ? (
                                                    <Link href={item.href} className={commonClasses}>
                                                        {item.label}
                                                    </Link>
                                                ) : (
                                                    <a href={item.href} className={commonClasses}>
                                                        {item.label}
                                                    </a>
                                                )}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        </div>

                        <div className="mt-8 pt-8" style={{borderTop: '1px solid #FFFFFF'}}>
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-gray-100 text-sm">
                                    © 2025 SkillOnCall.ca. {t('footer.copyright', 'All rights reserved. Made with 🍁 in Canada.')}
                                </p>
                                <div className="flex space-x-6 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => setShowContactModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.contact', 'Contact')}
                                    </button>
                                    <button 
                                        onClick={() => setShowPrivacyModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.privacy', 'Privacy')}
                                    </button>
                                    <button 
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.terms', 'Terms')}
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
                </footer>

                {/* Privacy Policy Modal */}
                <PrivacyPolicyModal 
                    isOpen={showPrivacyModal} 
                    onClose={() => setShowPrivacyModal(false)} 
                />

                {/* Terms of Service Modal */}
                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />

                {/* Contact Modal */}
                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                />

                {/* Newsletter Subscription Modal */}
                {newsletterModalData && (
                    <FeedbackModal
                        isOpen={showNewsletterModal}
                        onClose={() => {
                            setShowNewsletterModal(false);
                            setNewsletterModalData(null);
                        }}
                        title={newsletterModalData.title}
                        message={newsletterModalData.message}
                        type={newsletterModalData.type}
                    />
                )}
            </div>
        </>
    );
}

