/**
 * Subscription Types
 * 
 * Types for subscription-related data passed from Laravel to React/Inertia
 */

export interface Subscription {
    plan_name: string;
    plan_slug: string;
    plan_type: 'employer' | 'employee';
    price: number;
    status?: string;
    is_cancelled?: boolean;
    is_free_tier: boolean;
}

export interface SubscriptionStatus {
    has_professional: boolean;
    has_enterprise: boolean;
    has_pro_employee: boolean;
    has_premium_employee: boolean;
    has_paid_plan: boolean;
}

export interface PageProps {
    auth: {
        user: any; // You can define a proper User type
    };
    subscription: Subscription | null;
    subscriptionStatus: SubscriptionStatus;
    isFreeTier: boolean;
    locale: string;
    translations: Record<string, any>;
    csrfToken: string;
    [key: string]: any;
}

/**
 * Helper to check if user has a specific plan
 */
export function hasSubscriptionPlan(
    subscriptionStatus: SubscriptionStatus,
    plan: 'professional' | 'enterprise' | 'pro_employee' | 'premium_employee' | 'any_paid'
): boolean {
    const planMap = {
        professional: subscriptionStatus.has_professional,
        enterprise: subscriptionStatus.has_enterprise,
        pro_employee: subscriptionStatus.has_pro_employee,
        premium_employee: subscriptionStatus.has_premium_employee,
        any_paid: subscriptionStatus.has_paid_plan,
    };
    
    return planMap[plan] || false;
}

/**
 * Helper to get plan display name
 */
export function getPlanDisplayName(subscription: Subscription | null): string {
    return subscription?.plan_name || 'Free';
}

/**
 * Helper to check if user can access employer features
 */
export function canAccessEmployerFeature(
    subscriptionStatus: SubscriptionStatus,
    requiredPlan: 'professional' | 'enterprise' | 'any'
): boolean {
    if (requiredPlan === 'any') {
        return subscriptionStatus.has_professional || subscriptionStatus.has_enterprise;
    }
    if (requiredPlan === 'professional') {
        return subscriptionStatus.has_professional || subscriptionStatus.has_enterprise;
    }
    return subscriptionStatus.has_enterprise;
}

/**
 * Helper to check if user can access employee features
 */
export function canAccessEmployeeFeature(
    subscriptionStatus: SubscriptionStatus,
    requiredPlan: 'pro' | 'premium' | 'any'
): boolean {
    if (requiredPlan === 'any') {
        return subscriptionStatus.has_pro_employee || subscriptionStatus.has_premium_employee;
    }
    if (requiredPlan === 'pro') {
        return subscriptionStatus.has_pro_employee || subscriptionStatus.has_premium_employee;
    }
    return subscriptionStatus.has_premium_employee;
}

