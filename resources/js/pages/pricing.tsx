import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Check, 
    Star, 
    Users, 
    Briefcase,
    Shield,
    CreditCard,
    Zap,
    Award
} from 'react-feather';
import { useState } from 'react';

export default function Pricing() {
    const { auth, translations } = usePage<SharedData>().props as any;
    const { t } = useTranslations();
    const queryLang = `?lang=en`;

    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const [activeTab, setActiveTab] = useState<'employees' | 'employers'>('employees');

    const formatPrice = (price: number) => {
        if (price === 0) return t('free', 'Free');
        const interval = billingInterval === 'monthly' 
            ? t('per_month', '/month') 
            : t('per_year', '/year');
        return `$${price.toFixed(2)}${interval}`;
    };

    const getSavings = (plan: any) => {
        if (plan.price_monthly === 0) return null;
        const monthlyTotal = plan.price_monthly * 12;
        const yearlyPrice = plan.price_yearly;
        const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal * 100).toFixed(0);
        return billingInterval === 'yearly' ? `${t('save', 'Save')} ${savings}%` : null;
    };

    const getPlanIcon = (planName: string) => {
        const name = planName.toLowerCase();
        if (name === 'free' || name === 'starter') {
            return <Users className="h-6 w-6" style={{color: '#10B3D6'}} />;
        }
        if (name === 'pro' || name === 'professional') {
            return <Zap className="h-6 w-6" style={{color: '#10B3D6'}} />;
        }
        if (name === 'premium' || name === 'enterprise') {
            return <Award className="h-6 w-6" style={{color: '#10B3D6'}} />;
        }
        return <Shield className="h-6 w-6" style={{color: '#10B3D6'}} />;
    };

    // Get plan data from translations object with fallback to hardcoded plans
    const getEmployeePlans = () => {
        if (translations?.employee_plans) {
            return [
                translations.employee_plans.free,
                translations.employee_plans.pro,
                translations.employee_plans.premium,
            ].filter(Boolean);
        }
        // Fallback hardcoded plans
        return [
            {
                name: 'Free',
                description: 'Perfect for getting started',
                price_monthly: 0,
                price_yearly: 0,
                features: [
                    'Basic profile creation',
                    'Browse job listings',
                    'Apply to 5 jobs per month',
                    'Basic messaging',
                    'Standard customer support',
                ],
            },
            {
                name: 'Pro',
                description: 'Ideal for active job seekers',
                price_monthly: 19.99,
                price_yearly: 199.99,
                is_popular: true,
                features: [
                    'Everything in Free',
                    'Apply to unlimited jobs',
                    'Priority in search results',
                    'Advanced messaging features',
                    'Profile analytics',
                    'Resume builder',
                    'Priority customer support',
                    'Featured profile badge',
                ],
            },
            {
                name: 'Premium',
                description: 'For professionals who want it all',
                price_monthly: 39.99,
                price_yearly: 399.99,
                features: [
                    'Everything in Pro',
                    'Direct employer contact',
                    'Verified professional badge',
                    'Custom portfolio gallery',
                    'Skills verification',
                    'Video profile introduction',
                    'Exclusive job opportunities',
                    '24/7 dedicated support',
                    'LinkedIn integration',
                ],
            },
        ];
    };

    const getEmployerPlans = () => {
        if (translations?.employer_plans) {
            return [
                translations.employer_plans.starter,
                translations.employer_plans.professional,
                translations.employer_plans.enterprise,
            ].filter(Boolean);
        }
        // Fallback hardcoded plans
        return [
            {
                name: 'Starter',
                description: 'Perfect for small businesses',
                price_monthly: 0,
                price_yearly: 0,
                features: [
                    'Basic job posting',
                    'Access to worker profiles',
                    'Basic messaging',
                    'Standard support',
                ],
            },
            {
                name: 'Professional',
                description: 'Ideal for growing businesses',
                price_monthly: 19.99,
                price_yearly: 191.99,
                is_popular: true,
                features: [
                    'Enhanced job posting',
                    'Featured job listings',
                    'Advanced worker search',
                    'Priority messaging',
                    'Analytics dashboard',
                    'Priority support',
                    'Team collaboration tools',
                ],
            },
            {
                name: 'Enterprise',
                description: 'For large organizations',
                price_monthly: 49.99,
                price_yearly: 479.99,
                features: [
                    'Unlimited job postings',
                    'Featured job listings',
                    'Advanced worker search',
                    'Priority messaging',
                    'Advanced analytics',
                    'Custom branding',
                    'API access',
                    'Dedicated account manager',
                    'Custom integrations',
                    'White-label solutions',
                ],
            },
        ];
    };

    const employeePlans = getEmployeePlans();
    const employerPlans = getEmployerPlans();
    const plansToShow = activeTab === 'employees' ? employeePlans : employerPlans;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
            <Head title={t('title', 'Pricing Plans')} />

            {/* Header */}
            <header className="w-full shadow-sm" style={{ backgroundColor: '#192341' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href={`/${queryLang}`} className="flex-shrink-0 flex items-center cursor-pointer">
                            <img 
                                src="/logo-white.png" 
                                alt="SkillOnCall Logo" 
                                className="w-8 h-8 mr-3"
                            />
                            <span className="text-xl font-bold text-white">SkillOnCall</span>
                            <span className="ml-1" style={{color: '#10B3D6'}}>.ca</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link 
                                    href={`/dashboard${queryLang}`}
                                    className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                                >
                                    {t('welcome.auth.dashboard', 'Dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={`/login${queryLang}`}
                                        className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                                    >
                                        {t('welcome.auth.sign_in', 'Sign In')}
                                    </Link>
                                    <Link href={`/register${queryLang}`}>
                                        <Button 
                                            className="text-white hover:opacity-90 cursor-pointer" 
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            {t('welcome.auth.get_started', 'Get Started')}
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{color: '#192341'}}>
                                {t('title', 'Pricing Plans')}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                                {t('subtitle', 'Choose the perfect plan for your needs')}
                            </p>
                            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
                                {t('description', 'Transparent pricing for employees and employers. Start free and upgrade as you grow.')}
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex justify-center mb-8 md:mb-12">
                            <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
                                <button
                                    onClick={() => setActiveTab('employees')}
                                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        activeTab === 'employees'
                                            ? 'text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    style={{
                                        backgroundColor: activeTab === 'employees' ? '#10B3D6' : 'transparent'
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{t('for_employees', 'For Employees')}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('employers')}
                                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        activeTab === 'employers'
                                            ? 'text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    style={{
                                        backgroundColor: activeTab === 'employers' ? '#10B3D6' : 'transparent'
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{t('for_employers', 'For Employers')}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex justify-center mb-8 md:mb-12">
                            <div className="flex items-center gap-4 p-1 bg-white rounded-full shadow-sm border border-gray-200">
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
                                    {t('monthly', 'Monthly')}
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
                                    {t('yearly', 'Yearly')}
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {plansToShow && plansToShow.length > 0 ? plansToShow.map((plan: any, index: number) => {
                                const price = billingInterval === 'monthly' ? plan.price_monthly : plan.price_yearly;
                                const savings = getSavings(plan);
                                
                                return (
                                    <Card 
                                        key={index}
                                        className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                            plan.is_popular 
                                                ? 'ring-2 ring-[#10B3D6] shadow-[0_12px_28px_rgba(16,179,214,0.15)]' 
                                                : 'hover:shadow-md'
                                        } bg-white`}
                                        style={{borderTop: '.5px solid #192341'}}
                                    >
                                        {plan.is_popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <Badge className="text-white px-4 py-1 cursor-pointer" style={{backgroundColor: '#10B3D6'}}>
                                                    <Star className="h-3 w-3 mr-1" />
                                                    {t('most_popular', 'Most Popular')}
                                                </Badge>
                                            </div>
                                        )}

                                        <CardHeader className="text-center p-6">
                                            <div className="mb-4 flex justify-center">
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
                                                    {formatPrice(price)}
                                                </div>
                                                {savings && (
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        {savings}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-6 pt-0">
                                            <ul className="space-y-3 mb-6">
                                                {plan.features?.map((feature: string, featureIndex: number) => (
                                                    <li key={featureIndex} className="flex items-start gap-3 text-sm">
                                                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700" style={{color: '#192341'}}>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link 
                                                href={auth?.user ? `/subscriptions${queryLang}` : `/register${queryLang}`}
                                                className="block"
                                            >
                                                <Button
                                                    className={`w-full cursor-pointer hover:scale-105 transition-all duration-200 ${
                                                        plan.is_popular
                                                            ? 'text-white hover:opacity-90'
                                                            : 'border-2'
                                                    }`}
                                                    style={{
                                                        height: '2.7em',
                                                        backgroundColor: plan.is_popular ? '#10B3D6' : 'transparent',
                                                        borderColor: plan.is_popular ? undefined : '#10B3D6',
                                                        color: plan.is_popular ? undefined : '#10B3D6'
                                                    }}
                                                >
                                                    {plan.price_monthly === 0 
                                                        ? t('get_started', 'Get Started')
                                                        : auth?.user 
                                                            ? t('sign_up', 'Sign Up')
                                                            : t('get_started', 'Get Started')
                                                    }
                                                </Button>
                                            </Link>
                                    </CardContent>
                                </Card>
                                );
                            }) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-600">Loading plans...</p>
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div className="mt-12 text-center">
                            <div className="space-y-4">
                                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{t('features.cancel_anytime', 'Cancel anytime')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span>{t('features.secure_payment', 'Secure payment processing')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-green-500" />
                                        <span>{t('features.no_hidden_fees', 'No hidden fees')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full mt-16 py-8 text-white" style={{ backgroundColor: '#10B3D6' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">
                        © 2025 SkillOnCall.ca - Canada's Premier Skilled Worker Platform
                    </p>
                </div>
            </footer>
        </div>
    );
}

