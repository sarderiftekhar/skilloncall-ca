<?php

return [
    // Page titles and descriptions
    'title' => 'Subscription Plans',
    'description' => 'Choose the plan that best fits your needs and unlock premium features',
    'current_plan' => 'Your Current Plan',
    'choose_plan' => 'Choose Your Plan',
    
    // Plan types
    'worker_plans' => 'Worker Plans',
    'employer_plans' => 'Employer Plans',
    
    // Plan names and descriptions
    'free' => [
        'name' => 'Free',
        'description' => 'Perfect for getting started',
        'price' => 'Free',
        'features' => [
            'Basic profile creation',
            'Browse job listings',
            'Apply to 5 jobs per month',
            'Basic messaging',
            'Standard customer support'
        ]
    ],
    
    'pro' => [
        'name' => 'Pro',
        'description' => 'Ideal for active job seekers',
        'price_monthly' => '$19.99',
        'price_yearly' => '$199.99',
        'savings' => 'Save 17%',
        'features' => [
            'Everything in Free',
            'Apply to unlimited jobs',
            'Priority in search results',
            'Advanced messaging features',
            'Profile analytics',
            'Resume builder',
            'Priority customer support',
            'Featured profile badge'
        ]
    ],
    
    'premium' => [
        'name' => 'Premium', 
        'description' => 'For professionals who want it all',
        'price_monthly' => '$39.99',
        'price_yearly' => '$399.99',
        'savings' => 'Save 17%',
        'features' => [
            'Everything in Pro',
            'Direct employer contact',
            'Verified professional badge',
            'Custom portfolio gallery',
            'Skills verification',
            'Video profile introduction',
            'Exclusive job opportunities',
            '24/7 dedicated support',
            'LinkedIn integration'
        ]
    ],
    
    // Action buttons
    'get_started' => 'Get Started',
    'upgrade_now' => 'Upgrade Now',
    'current' => 'Current Plan',
    'downgrade' => 'Downgrade',
    'contact_sales' => 'Contact Sales',
    
    // Billing
    'monthly' => 'Monthly',
    'yearly' => 'Yearly',
    'per_month' => '/month',
    'per_year' => '/year',
    'billed_monthly' => 'Billed monthly',
    'billed_yearly' => 'Billed yearly',
    
    // Status messages
    'subscription_active' => 'Your subscription is active',
    'subscription_expires' => 'Your subscription expires on :date',
    'subscription_cancelled' => 'Your subscription has been cancelled',
    
    // Features
    'feature_included' => 'Included',
    'feature_not_included' => 'Not included',
    'unlimited' => 'Unlimited',
    
    // Support
    'support_basic' => 'Email support',
    'support_priority' => 'Priority support',
    'support_dedicated' => '24/7 dedicated support',
    
    // Popular badge
    'most_popular' => 'Most Popular',
    'recommended' => 'Recommended',
    
    // FAQ or additional info
    'cancel_anytime' => 'Cancel anytime',
    'no_hidden_fees' => 'No hidden fees',
    'secure_payment' => 'Secure payment processing',
];
