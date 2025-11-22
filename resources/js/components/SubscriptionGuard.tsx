/**
 * SubscriptionGuard Component
 * 
 * Conditionally render content based on user's subscription status
 * 
 * Usage:
 * <SubscriptionGuard plan="professional">
 *   <PremiumFeature />
 * </SubscriptionGuard>
 */

import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { SubscriptionStatus } from '@/types/subscription';

interface SubscriptionGuardProps extends PropsWithChildren {
    /** Required subscription plan */
    plan: 'professional' | 'enterprise' | 'pro_employee' | 'premium_employee' | 'any_paid';
    
    /** Custom fallback content when user doesn't have required plan */
    fallback?: React.ReactNode;
    
    /** Show default upgrade prompt (default: true) */
    showUpgradePrompt?: boolean;
    
    /** Custom upgrade message */
    upgradeMessage?: string;
}

export default function SubscriptionGuard({
    plan,
    fallback,
    showUpgradePrompt = true,
    upgradeMessage,
    children,
}: SubscriptionGuardProps) {
    const { subscriptionStatus } = usePage<{ subscriptionStatus: SubscriptionStatus }>().props;
    
    // Map plan to subscription status check
    const hasAccess = {
        professional: subscriptionStatus.has_professional,
        enterprise: subscriptionStatus.has_enterprise,
        pro_employee: subscriptionStatus.has_pro_employee,
        premium_employee: subscriptionStatus.has_premium_employee,
        any_paid: subscriptionStatus.has_paid_plan,
    }[plan];
    
    // If user has access, render children
    if (hasAccess) {
        return <>{children}</>;
    }
    
    // If custom fallback provided, use it
    if (fallback) {
        return <>{fallback}</>;
    }
    
    // If upgrade prompt disabled, render nothing
    if (!showUpgradePrompt) {
        return null;
    }
    
    // Default upgrade prompt
    const planNames = {
        professional: 'Professional',
        enterprise: 'Enterprise',
        pro_employee: 'Pro Employee',
        premium_employee: 'Premium Employee',
        any_paid: 'a paid',
    };
    
    const defaultMessage = upgradeMessage || `This feature requires ${planNames[plan]} subscription.`;
    
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <div className="mb-4 text-yellow-600">
                <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Premium Feature
            </h3>
            <p className="mb-4 text-sm text-gray-600">
                {defaultMessage}
            </p>
            <a
                href="/subscriptions"
                className="inline-flex items-center rounded-md bg-[#20b2aa] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a8f89] cursor-pointer"
            >
                View Plans & Upgrade
                <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                </svg>
            </a>
        </div>
    );
}

/**
 * SubscriptionBadge Component
 * 
 * Display user's current subscription plan as a badge
 */
export function SubscriptionBadge() {
    const { subscription, subscriptionStatus } = usePage<{
        subscription: { plan_name: string; is_free_tier: boolean } | null;
        subscriptionStatus: SubscriptionStatus;
    }>().props;
    
    if (!subscription) {
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Free Plan
            </span>
        );
    }
    
    const badgeColors = {
        professional: 'bg-blue-100 text-blue-800',
        enterprise: 'bg-purple-100 text-purple-800',
        pro_employee: 'bg-green-100 text-green-800',
        premium_employee: 'bg-indigo-100 text-indigo-800',
    };
    
    let badgeColor = 'bg-gray-100 text-gray-600';
    if (subscriptionStatus.has_enterprise) badgeColor = badgeColors.enterprise;
    else if (subscriptionStatus.has_professional) badgeColor = badgeColors.professional;
    else if (subscriptionStatus.has_premium_employee) badgeColor = badgeColors.premium_employee;
    else if (subscriptionStatus.has_pro_employee) badgeColor = badgeColors.pro_employee;
    
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}>
            {subscription.plan_name}
        </span>
    );
}

/**
 * FeatureFlag Component
 * 
 * Simple boolean conditional rendering based on subscription
 */
interface FeatureFlagProps extends PropsWithChildren {
    requires: 'professional' | 'enterprise' | 'pro_employee' | 'premium_employee' | 'any_paid';
    invert?: boolean;
}

export function FeatureFlag({ requires, invert = false, children }: FeatureFlagProps) {
    const { subscriptionStatus } = usePage<{ subscriptionStatus: SubscriptionStatus }>().props;
    
    const hasAccess = {
        professional: subscriptionStatus.has_professional,
        enterprise: subscriptionStatus.has_enterprise,
        pro_employee: subscriptionStatus.has_pro_employee,
        premium_employee: subscriptionStatus.has_premium_employee,
        any_paid: subscriptionStatus.has_paid_plan,
    }[requires];
    
    const shouldRender = invert ? !hasAccess : hasAccess;
    
    return shouldRender ? <>{children}</> : null;
}

