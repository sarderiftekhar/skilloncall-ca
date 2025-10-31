import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Check, Star, Zap, Shield, Users, BarChart, Briefcase, User } from 'react-feather';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: 'employer' | 'employee';
    price: number;
    yearly_price: number;
    currency: string;
    billing_interval: string;
    job_posts_limit: number | null;
    job_applications_limit: number | null;
    featured_jobs_limit: number | null;
    team_members_limit: number | null;
    priority_support: boolean;
    advanced_analytics: boolean;
    custom_branding: boolean;
    api_access: boolean;
    is_popular: boolean;
    features: string[];
}

interface CurrentSubscription {
    id: number;
    plan: Plan;
    status: string;
    amount: string;
    billing_interval: string;
    ends_at: string | null;
    cancelled_at: string | null;
    days_until_expiration: number | null;
    is_cancelled: boolean;
    next_billing_date: string | null;
}

interface Props {
    employerPlans: Plan[];
    employeePlans: Plan[];
    currentSubscription: CurrentSubscription | null;
    userRole: string;
}

export default function SubscriptionsIndex({ employerPlans, employeePlans, currentSubscription, userRole }: Props) {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

    const plans = userRole === 'admin' ? [...employerPlans, ...employeePlans] : 
                  userRole === 'employer' ? employerPlans : employeePlans;

    const handleSubscribe = async (planId: number) => {
        setIsSubscribing(planId.toString());
        
        try {
            const response = await fetch('/subscriptions/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    plan_id: planId,
                    billing_interval: billingInterval,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message + '\n\nA confirmation email has been sent to your inbox!');
                window.location.reload();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to process subscription. Please try again.');
        } finally {
            setIsSubscribing(null);
        }
    };

    const formatPrice = (plan: Plan) => {
        const price = billingInterval === 'yearly' ? plan.yearly_price : plan.price;
        if (price === 0) return 'Free';
        return `$${price.toFixed(2)}/${billingInterval === 'yearly' ? 'year' : 'month'}`;
    };

    const getSavings = (plan: Plan) => {
        if (!plan.yearly_price || plan.price === 0) return null;
        const monthlyYearly = plan.price * 12;
        const savings = monthlyYearly - plan.yearly_price;
        const percentage = Math.round((savings / monthlyYearly) * 100);
        return { amount: savings, percentage };
    };

    const getPlanIcon = (planType: string, planName: string) => {
        if (planType === 'employer') {
            if (planName.includes('Enterprise')) return <Shield className="h-8 w-8" style={{color: '#10B3D6'}} />;
            if (planName.includes('Professional')) return <Briefcase className="h-8 w-8" style={{color: '#10B3D6'}} />;
            return <Users className="h-8 w-8" style={{color: '#10B3D6'}} />;
        } else {
            if (planName.includes('Premium')) return <Star className="h-8 w-8" style={{color: '#10B3D6'}} />;
            if (planName.includes('Pro')) return <Zap className="h-8 w-8" style={{color: '#10B3D6'}} />;
            return <User className="h-8 w-8" style={{color: '#10B3D6'}} />;
        }
    };

    return (
        <AppLayout>
            <Head title="Subscription Plans" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Select the perfect plan for your needs. Upgrade or downgrade at any time.
                    </p>
                </div>

                {/* Current Subscription */}
                {currentSubscription && (
                    <div className="mb-12">
                        <Card className="border-2" style={{borderColor: '#10B3D6'}}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            Current Plan: {currentSubscription.plan.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {currentSubscription.amount} • {currentSubscription.billing_interval}
                                            {currentSubscription.next_billing_date && (
                                                <> • Next billing: {currentSubscription.next_billing_date}</>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={currentSubscription.is_cancelled ? 'destructive' : 'default'}>
                                        {currentSubscription.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                )}

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${
                                billingInterval === 'monthly'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('yearly')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${
                                billingInterval === 'yearly'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Yearly
                            <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => {
                        const savings = getSavings(plan);
                        const isCurrentPlan = currentSubscription?.plan.id === plan.id;
                        
                        return (
                            <Card 
                                key={plan.id} 
                                className={`relative ${plan.is_popular ? 'border-2 shadow-lg' : 'border'} ${
                                    isCurrentPlan ? 'ring-2 ring-green-500' : ''
                                }`}
                                style={plan.is_popular ? {borderColor: '#10B3D6'} : {}}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="text-white px-4 py-1" style={{backgroundColor: '#10B3D6'}}>
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                
                                <CardHeader className="text-center pb-4">
                                    <div className="flex justify-center mb-4">
                                        {getPlanIcon(plan.type, plan.name)}
                                    </div>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                                    
                                    <div className="mt-4">
                                        <div className="text-4xl font-bold text-gray-900">
                                            {formatPrice(plan)}
                                        </div>
                                        {billingInterval === 'yearly' && savings && (
                                            <div className="text-sm text-green-600 font-medium">
                                                Save ${savings.amount.toFixed(2)} ({savings.percentage}%)
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3">
                                        {/* Limits */}
                                        {plan.job_posts_limit && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">
                                                    {plan.job_posts_limit === null ? 'Unlimited' : plan.job_posts_limit} job posts
                                                </span>
                                            </li>
                                        )}
                                        {plan.job_applications_limit && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">
                                                    {plan.job_applications_limit === null ? 'Unlimited' : plan.job_applications_limit} applications
                                                </span>
                                            </li>
                                        )}
                                        {plan.featured_jobs_limit && plan.featured_jobs_limit > 0 && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">{plan.featured_jobs_limit} featured listings</span>
                                            </li>
                                        )}
                                        
                                        {/* Features */}
                                        {plan.priority_support && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Priority support</span>
                                            </li>
                                        )}
                                        {plan.advanced_analytics && (
                                            <li className="flex items-center gap-2">
                                                <BarChart className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Advanced analytics</span>
                                            </li>
                                        )}
                                        {plan.custom_branding && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Custom branding</span>
                                            </li>
                                        )}
                                        {plan.api_access && (
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">API access</span>
                                            </li>
                                        )}
                                        
                                        {/* Additional features from array */}
                                        {plan.features?.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    {isCurrentPlan ? (
                                        <Button disabled className="w-full">
                                            Current Plan
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleSubscribe(plan.id)}
                                            disabled={isSubscribing === plan.id.toString()}
                                            className="w-full text-white hover:opacity-90"
                                            style={{backgroundColor: '#10B3D6'}}
                                        >
                                            {isSubscribing === plan.id.toString() ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Subscribing...
                                                </>
                                            ) : (
                                                `Subscribe to ${plan.name}`
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
                    <p className="text-gray-600 mb-6">
                        Contact our support team for personalized recommendations.
                    </p>
                    <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                        Get in Touch →
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
