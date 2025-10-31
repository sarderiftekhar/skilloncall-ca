import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Check, 
    Star, 
    Shield, 
    Award,
    CreditCard,
    Users,
    Zap,
    X
} from 'react-feather';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

// Define types for the subscription data
interface SubscriptionPlan {
    id: number;
    name: string;
    type: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
    is_popular?: boolean;
}

interface CurrentSubscription {
    id: number;
    plan: SubscriptionPlan;
    status: string;
    amount: string;
    billing_interval: string;
    ends_at: string | null;
    cancelled_at: string | null;
    days_until_expiration: number | null;
    is_cancelled: boolean;
    next_billing_date: string | null;
}

interface SubscriptionsPageProps {
    employerPlans: SubscriptionPlan[];
    workerPlans: SubscriptionPlan[];
    currentSubscription: CurrentSubscription | null;
    userRole: string;
    error?: string;
}

// Hardcoded plan data for now (as requested)
const HARDCODED_WORKER_PLANS = [
    {
        id: 1,
        name: 'Free',
        type: 'worker',
        price_monthly: 0,
        price_yearly: 0,
        features: [
            'Basic profile creation',
            'Browse job listings', 
            'Apply to 5 jobs per month',
            'Basic messaging',
            'Standard customer support'
        ],
        is_popular: false
    },
    {
        id: 2,
        name: 'Pro',
        type: 'worker',
        price_monthly: 19.99,
        price_yearly: 199.99,
        features: [
            'Everything in Free',
            'Apply to unlimited jobs',
            'Priority in search results',
            'Advanced messaging features',
            'Profile analytics',
            'Resume builder',
            'Priority customer support',
            'Featured profile badge'
        ],
        is_popular: true
    },
    {
        id: 3,
        name: 'Premium',
        type: 'worker',
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
            'LinkedIn integration'
        ],
        is_popular: false
    }
];

export default function SubscriptionsIndex({ 
    employerPlans = [], 
    workerPlans = [], 
    currentSubscription, 
    userRole = 'worker',
    error
}: SubscriptionsPageProps) {
    const { t } = useTranslations();
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    
    // Use hardcoded plans for workers, fallback to server data
    const plansToShow = userRole === 'worker' ? HARDCODED_WORKER_PLANS : workerPlans;

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setShowContent(true), 50);
        }, 800);

        return () => clearTimeout(loadingTimer);
    }, []);

    const formatPrice = (plan: any) => {
        if (plan.name === 'Free') {
            return 'Free';
        }
        
        const price = billingInterval === 'monthly' ? plan.price_monthly : plan.price_yearly;
        const interval = billingInterval === 'monthly' ? '/month' : '/year';
        
        return `$${price.toFixed(2)}${interval}`;
    };

    const getSavings = (plan: any) => {
        if (plan.name === 'Free') return null;
        
        const monthlyTotal = plan.price_monthly * 12;
        const yearlyPrice = plan.price_yearly;
        const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal * 100).toFixed(0);
        
        return billingInterval === 'yearly' ? `Save ${savings}%` : null;
    };

    const getPlanIcon = (planName: string) => {
        switch (planName.toLowerCase()) {
            case 'free':
                return <Users className="h-6 w-6" style={{color: '#10B3D6'}} />;
            case 'pro':
                return <Zap className="h-6 w-6" style={{color: '#10B3D6'}} />;
            case 'premium':
                return <Award className="h-6 w-6" style={{color: '#10B3D6'}} />;
            default:
                return <Shield className="h-6 w-6" style={{color: '#10B3D6'}} />;
        }
    };

    const handleSubscribe = (plan: any) => {
        // This will be implemented with actual subscription logic
        console.log('Subscribe to plan:', plan.name, 'with interval:', billingInterval);
        // For now, just show a placeholder
        alert(`Subscribing to ${plan.name} plan (${billingInterval}) - This feature will be implemented soon!`);
    };

    const isCurrentPlan = (plan: any) => {
        return currentSubscription?.plan?.name?.toLowerCase() === plan.name.toLowerCase();
    };

    return (
        <AppLayout>
            <Head title="Subscription Plans" />

            <div className="w-full px-4 md:px-6 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Error Message */}
                    {error && !isLoading && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <X className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className={`text-center mb-8 md:mb-12 transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="h-8 md:h-10 bg-gray-300 rounded w-64 md:w-80 mx-auto animate-pulse"></div>
                                <div className="h-4 md:h-5 bg-gray-200 rounded w-80 md:w-96 mx-auto animate-pulse"></div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{color: '#192341'}}>
                                    Subscription Plans
                                </h1>
                                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                                    Choose the plan that best fits your needs and unlock premium features to enhance your job search experience
                                </p>
                            </>
                        )}
                    </div>

                    {/* Current Subscription Status */}
                    {currentSubscription && (
                        <div className={`mb-8 transition-all duration-400 ease-out ${
                            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {isLoading ? (
                                <Card className="bg-blue-50 border-blue-200 animate-pulse">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 bg-blue-300 rounded-full animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-5 bg-blue-300 rounded w-48 animate-pulse"></div>
                                                <div className="h-4 bg-blue-200 rounded w-64 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center gap-4">
                                            <Shield className="h-8 w-8 text-blue-600" />
                                            <div>
                                                <h3 className="font-semibold text-blue-900">
                                                    Your Current Plan: {currentSubscription.plan.name}
                                                </h3>
                                                <p className="text-blue-700 text-sm">
                                                    {currentSubscription.is_cancelled 
                                                        ? `Expires on ${currentSubscription.ends_at}` 
                                                        : `Next billing: ${currentSubscription.next_billing_date}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Billing Toggle */}
                    <div className={`flex justify-center mb-8 md:mb-12 transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <div className="h-10 bg-gray-200 rounded-full w-48 animate-pulse"></div>
                        ) : (
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
                                    Monthly
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
                                    Yearly
                                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                        Save 17%
                                    </Badge>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Plans Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="relative animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                        <CardHeader className="text-center p-6">
                                            <div className="h-6 w-6 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
                                            <div className="h-6 bg-gray-300 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
                                            <div className="h-8 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <div className="space-y-3 mb-6">
                                                {[1, 2, 3, 4].map((j) => (
                                                    <div key={j} className="flex items-center gap-3">
                                                        <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        ) : (
                            plansToShow.map((plan, index) => (
                                <Card 
                                    key={plan.id} 
                                    className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                        plan.is_popular 
                                            ? 'ring-2 ring-[#10B3D6] shadow-[0_12px_28px_rgba(16,179,214,0.15)]' 
                                            : 'hover:shadow-md'
                                    } ${
                                        isCurrentPlan(plan) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                    }`}
                                    style={{borderTop: '.5px solid #192341'}}
                                >
                                    {plan.is_popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="text-white px-4 py-1" style={{backgroundColor: '#10B3D6'}}>
                                                <Star className="h-3 w-3 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    
                                    {isCurrentPlan(plan) && (
                                        <div className="absolute -top-3 right-4">
                                            <Badge className="bg-green-100 text-green-800 px-3 py-1">
                                                Current Plan
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
                                            {plan.name === 'Free' && 'Perfect for getting started'}
                                            {plan.name === 'Pro' && 'Ideal for active job seekers'}
                                            {plan.name === 'Premium' && 'For professionals who want it all'}
                                        </p>
                                        <div className="space-y-1">
                                            <div className="text-3xl font-bold" style={{color: '#192341'}}>
                                                {formatPrice(plan)}
                                            </div>
                                            {getSavings(plan) && (
                                                <Badge className="bg-green-100 text-green-800 text-xs">
                                                    {getSavings(plan)}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 pt-0">
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3 text-sm">
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className={`w-full cursor-pointer hover:scale-105 transition-all duration-200 ${
                                                isCurrentPlan(plan) 
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                    : plan.is_popular
                                                        ? 'text-white hover:opacity-90'
                                                        : 'border-2 hover:text-white'
                                            }`}
                                            style={{
                                                height: '2.7em',
                                                backgroundColor: isCurrentPlan(plan) 
                                                    ? undefined 
                                                    : plan.is_popular 
                                                        ? '#10B3D6' 
                                                        : 'transparent',
                                                borderColor: plan.is_popular ? undefined : '#10B3D6',
                                                color: isCurrentPlan(plan) 
                                                    ? undefined 
                                                    : plan.is_popular 
                                                        ? undefined 
                                                        : '#10B3D6'
                                            }}
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={isCurrentPlan(plan)}
                                        >
                                            {isCurrentPlan(plan) 
                                                ? 'Current Plan' 
                                                : plan.name === 'Free' 
                                                    ? 'Get Started' 
                                                    : 'Upgrade Now'
                                            }
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Additional Information */}
                    <div className={`mt-12 text-center transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {!isLoading && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>Cancel anytime</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span>Secure payment processing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-green-500" />
                                        <span>No hidden fees</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Questions about our plans? <a href="/contact" className="hover:underline cursor-pointer" style={{color: '#10B3D6'}}>Contact our support team</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}