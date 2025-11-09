import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ContactModal } from '@/components/contact-modal';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';
import { TermsModal } from '@/components/terms-modal';
import { FeedbackModal } from '@/components/feedback-modal';
import { useTranslations } from '@/hooks/useTranslations';
import { 
    Check, 
    X, 
    Star, 
    Users, 
    Briefcase,
    Shield,
    Zap,
    Award,
    Clock,
    Mail,
    MessageSquare,
    Search,
    FileText,
    BarChart,
    Download,
    Settings,
    LogOut
} from 'react-feather';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Pricing() {
    const { auth } = usePage<SharedData>().props as any;
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterModalData, setNewsletterModalData] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);
    const queryLang = `?lang=${locale}`;

    const { translations } = usePage<SharedData>().props as any;
    // Pricing translations are merged at top level, not nested
    const pricing = translations || {};
    // Safely access plans with fallback to empty object
    const employerPlans = pricing?.plans?.employer || {};
    const employeePlans = pricing?.plans?.employee || {};
    
    // If plans are empty, provide default structure to prevent errors
    const hasPlans = Object.keys(employerPlans).length > 0 || Object.keys(employeePlans).length > 0;

    const switchLang = (next: 'en' | 'fr') => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.toString();
    };

    const formatPrice = (price: number, isYearly: boolean = false) => {
        if (price === 0) return isFrench ? 'Gratuit' : 'Free';
        const interval = isYearly ? pricing?.billing?.per_year : pricing?.billing?.per_month;
        return `$${price.toFixed(2)}${interval || ''}`;
    };

    const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
        if (monthlyPrice === 0) return null;
        const monthlyTotal = monthlyPrice * 12;
        const savings = monthlyTotal - yearlyPrice;
        const percentage = Math.round((savings / monthlyTotal) * 100);
        return percentage;
    };

    const handleNewsletterSubscribe = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setNewsletterModalData({
                type: 'error',
                title: isFrench ? 'Erreur' : 'Error',
                message: isFrench ? 'Veuillez entrer votre adresse courriel.' : 'Please enter your email address.'
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
                    name: isFrench ? 'Abonné(e) à l\'infolettre' : 'Newsletter Subscriber',
                    source: 'pricing_page',
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setNewsletterModalData({
                    type: 'success',
                    title: isFrench ? 'Abonnement réussi!' : 'Subscription Successful!',
                    message: result.message || (isFrench ? 'Merci de vous être abonné(e) à notre infolettre!' : 'Thank you for subscribing to our newsletter!')
                });
                setEmail('');
            } else {
                setNewsletterModalData({
                    type: 'error',
                    title: isFrench ? 'Erreur' : 'Error',
                    message: result.message || (isFrench ? 'Échec de l\'abonnement. Veuillez réessayer.' : 'Failed to subscribe. Please try again.')
                });
            }
            setShowNewsletterModal(true);
        } catch (error) {
            setNewsletterModalData({
                type: 'error',
                title: isFrench ? 'Erreur' : 'Error',
                message: isFrench ? 'Échec de l\'abonnement. Veuillez réessayer.' : 'Failed to subscribe. Please try again.'
            });
            setShowNewsletterModal(true);
        } finally {
            setIsSubscribing(false);
        }
    };

    const platformDescription = isFrench
        ? 'La principale plateforme canadienne pour relier des talents qualifiés à des entreprises locales. Créée par des Canadiens, pour des Canadiens.'
        : "Canada's premier platform for connecting skilled employees with local businesses. Built for Canadians, by Canadians.";

    const footerEmployerLinks = [
        { label: isFrench ? 'Publier des offres' : 'Post Jobs', href: `/register${queryLang}` },
        { label: isFrench ? 'Trouver des employés' : 'Find Employees', href: `/register${queryLang}` },
        {
            label: isFrench ? 'Voir les forfaits' : 'Subscription Plans',
            href: `/pricing${queryLang}`,
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
            href: `/pricing${queryLang}`,
            highlight: true,
        },
        { label: isFrench ? 'Centre d\'aide' : 'Help Center', href: `/how-it-works${queryLang}` },
    ];

    const getPlanIcon = (planName: string) => {
        const name = planName.toLowerCase();
        if (name.includes('free') || name.includes('gratuit')) return <Users className="h-6 w-6" style={{color: '#10B3D6'}} />;
        if (name.includes('basic') || name.includes('de base')) return <Zap className="h-6 w-6" style={{color: '#10B3D6'}} />;
        if (name.includes('professional') || name.includes('professionnel')) return <Award className="h-6 w-6" style={{color: '#10B3D6'}} />;
        if (name.includes('on-demand') || name.includes('demande')) return <Clock className="h-6 w-6" style={{color: '#10B3D6'}} />;
        if (name.includes('per job') || name.includes('par publication')) return <Briefcase className="h-6 w-6" style={{color: '#10B3D6'}} />;
        return <Shield className="h-6 w-6" style={{color: '#10B3D6'}} />;
    };

    const renderPlanCard = (plan: any, planKey: string, type: 'employer' | 'employee') => {
        const isFree = plan.price_monthly === 0 && plan.price_yearly === 0;
        const isOnDemand = planKey === 'on_demand';
        const isPerJob = planKey === 'per_job';
        const price = isOnDemand || isPerJob 
            ? plan.price 
            : billingInterval === 'yearly' 
                ? plan.price_yearly 
                : plan.price_monthly;
        
        const monthlyPrice = isOnDemand || isPerJob ? plan.price : plan.price_monthly;
        const savings = !isFree && !isOnDemand && !isPerJob && billingInterval === 'yearly'
            ? calculateYearlySavings(monthlyPrice, plan.price_yearly)
            : null;

        return (
            <Card 
                key={planKey}
                className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    plan.is_popular 
                        ? 'ring-2 ring-[#10B3D6] shadow-[0_12px_28px_rgba(16,179,214,0.15)]' 
                        : 'hover:shadow-md'
                }`}
                style={{borderTop: '.5px solid #192341'}}
            >
                {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="text-white px-4 py-1 cursor-pointer" style={{backgroundColor: '#10B3D6'}}>
                            <Star className="h-3 w-3 mr-1" />
                            {isFrench ? 'Le plus populaire' : 'Most Popular'}
                        </Badge>
                    </div>
                )}
                
                <CardHeader className="text-center p-6">
                    <div className="mb-4">
                        {getPlanIcon(plan.name)}
                    </div>
                    <CardTitle className="text-xl font-bold mb-2" style={{color: '#192341'}}>
                        {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4">
                        {plan.description}
                    </p>
                    <div className="space-y-1">
                        <div className="text-3xl font-bold" style={{color: '#192341'}}>
                            {isOnDemand || isPerJob 
                                ? formatPrice(price, false)
                                : formatPrice(price, billingInterval === 'yearly')
                            }
                        </div>
                        {savings && savings > 0 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                                {isFrench ? `Économisez ${savings}%` : `Save ${savings}%`}
                            </Badge>
                        )}
                        {isOnDemand && (
                            <p className="text-xs text-gray-500 mt-1">
                                {isFrench ? 'Valide 7 jours' : 'Valid for 7 days'}
                            </p>
                        )}
                        {isPerJob && (
                            <p className="text-xs text-gray-500 mt-1">
                                {isFrench ? 'Par publication' : 'Per posting'}
                            </p>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                    <ul className="space-y-3 mb-6">
                        {plan.features?.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                            </li>
                        ))}
                        {plan.limitations?.map((limitation: string, index: number) => (
                            <li key={`limitation-${index}`} className="flex items-start gap-3 text-sm">
                                <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-500 line-through">{limitation}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        className={`w-full cursor-pointer hover:scale-105 transition-all duration-200 ${
                            plan.is_popular
                                ? 'text-white hover:opacity-90'
                                : 'border-2 hover:text-white'
                        }`}
                        style={{
                            height: '2.7em',
                            backgroundColor: plan.is_popular ? '#10B3D6' : 'transparent',
                            borderColor: plan.is_popular ? undefined : '#10B3D6',
                            color: plan.is_popular ? undefined : '#10B3D6'
                        }}
                        onClick={() => {
                            // TODO: Implement subscription logic
                            console.log('Subscribe to plan:', plan.name);
                        }}
                    >
                        {isFree 
                            ? (isFrench ? 'Commencer' : 'Get Started')
                            : (isFrench ? 'Sélectionner' : 'Select Plan')
                        }
                    </Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <Head title={isFrench ? 'Tarifs - SkillOnCall.ca' : 'Pricing - SkillOnCall.ca'}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], .group, .hover\\:shadow-md,
                    .hover\\:text-white, .hover\\:opacity-90,
                    .transition-colors, .transition-transform { cursor: pointer !important; }
                `}</style>
            </Head>

            <div className="min-h-screen" style={{backgroundColor: '#F6FBFD'}}>
                {/* Header - Same as Welcome Page */}
                <header style={{backgroundColor: '#192341'}} className="shadow-sm border-b border-gray-800">
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
                                    <span className="ml-1" style={{color: '#10B3D6'}}>.ca</span>
                                </Link>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.find_employees')}</Link>
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.post_jobs')}</Link>
                                <Link href={`/how-it-works${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.how_it_works')}</Link>
                                <Link href={`/pricing${queryLang}`} className="text-white font-semibold cursor-pointer transition-colors">{t('nav.pricing')}</Link>
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
                                    <div className="flex items-center space-x-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="cursor-pointer">
                                                    <Avatar className="h-8 w-8 cursor-pointer">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="text-white text-xs" style={{backgroundColor: '#10B3D6'}}>
                                                            {(auth.user.display_name || auth.user.name)?.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuItem asChild>
                                                    <Link href="/logout" method="post" className="cursor-pointer">
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        {isFrench ? 'Déconnexion' : 'Log out'}
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Link href={`/dashboard${queryLang}`}>
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">{t('auth.dashboard', 'Dashboard')}</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href={`/login${queryLang}`}>
                                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">{t('auth.sign_in', 'Sign In')}</Button>
                                        </Link>
                                        <Link href={`/register${queryLang}`}>
                                            <Button size="sm" style={{backgroundColor: '#10B3D6'}} className="hover:opacity-90 text-white">{t('auth.get_started', 'Get Started')}</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="w-full px-4 md:px-6 py-8 md:py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="text-center mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{color: '#192341'}}>
                                {pricing?.title || (isFrench ? 'Forfaits tarifaires' : 'Pricing Plans')}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                                {pricing?.subtitle || (isFrench ? 'Choisissez le forfait parfait pour vos besoins' : 'Choose the perfect plan for your needs')}
                            </p>
                        </div>

                        {/* Billing Toggle - Only for monthly/yearly plans */}
                        <div className="flex justify-center mb-8 md:mb-12">
                            <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-full">
                                <button
                                    onClick={() => setBillingInterval('monthly')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        billingInterval === 'monthly'
                                            ? 'text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    style={{
                                        backgroundColor: billingInterval === 'monthly' ? '#10B3D6' : 'transparent'
                                    }}
                                >
                                    {pricing?.billing?.monthly || (isFrench ? 'Mensuel' : 'Monthly')}
                                </button>
                                <button
                                    onClick={() => setBillingInterval('yearly')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        billingInterval === 'yearly'
                                            ? 'text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    style={{
                                        backgroundColor: billingInterval === 'yearly' ? '#10B3D6' : 'transparent'
                                    }}
                                >
                                    {pricing?.billing?.yearly || (isFrench ? 'Annuel' : 'Yearly')}
                                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                        {pricing?.billing?.save || (isFrench ? 'Économisez 20%' : 'Save 20%')}
                                    </Badge>
                                </button>
                            </div>
                        </div>

                        {/* Employer Plans Section */}
                        <div className="mb-16">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{color: '#192341'}}>
                                    {pricing?.employers?.title || (isFrench ? 'Pour les employeurs' : 'For Employers')}
                                </h2>
                                <p className="text-gray-600">
                                    {pricing?.employers?.subtitle || (isFrench ? 'Trouvez des travailleurs qualifiés rapidement et efficacement' : 'Find skilled workers quickly and efficiently')}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                                {Object.entries(employerPlans).map(([key, plan]: [string, any]) => {
                                    if (key === 'on_demand' || key === 'per_job') return null;
                                    return renderPlanCard(plan, key, 'employer');
                                })}
                            </div>

                            {/* On-Demand and Per-Job Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                                {employerPlans.on_demand && renderPlanCard(employerPlans.on_demand, 'on_demand', 'employer')}
                                {employerPlans.per_job && renderPlanCard(employerPlans.per_job, 'per_job', 'employer')}
                            </div>
                        </div>

                        {/* Employee Plans Section */}
                        <div className="mb-16">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{color: '#192341'}}>
                                    {pricing?.employees?.title || (isFrench ? 'Pour les employés' : 'For Employees')}
                                </h2>
                                <p className="text-gray-600">
                                    {pricing?.employees?.subtitle || (isFrench ? 'Débloquez plus d\'opportunités avec des fonctionnalités premium' : 'Unlock more opportunities with premium features')}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                                {Object.entries(employeePlans).map(([key, plan]: [string, any]) => {
                                    if (key === 'on_demand') return null;
                                    return renderPlanCard(plan, key, 'employee');
                                })}
                            </div>

                            {/* On-Demand Option */}
                            {employeePlans.on_demand && (
                                <div className="max-w-md mx-auto">
                                    {renderPlanCard(employeePlans.on_demand, 'on_demand', 'employee')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Same as Welcome Page */}
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

                {/* Modals */}
                <PrivacyPolicyModal 
                    isOpen={showPrivacyModal} 
                    onClose={() => setShowPrivacyModal(false)} 
                />

                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />

                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                />

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

