<?php

return [
    'title' => 'Pricing Plans',
    'subtitle' => 'Choose the perfect plan for your needs',
    'description' => 'Transparent pricing for employees and employers. Start free and upgrade as you grow.',
    
    'for_employees' => 'For Employees',
    'for_employers' => 'For Employers',
    
    'employee_subtitle' => 'Find your next opportunity',
    'employer_subtitle' => 'Find the right talent',
    
    'monthly' => 'Monthly',
    'yearly' => 'Yearly',
    'save' => 'Save',
    'per_month' => '/month',
    'per_year' => '/year',
    'free' => 'Free',
    
    'most_popular' => 'Most Popular',
    'get_started' => 'Get Started',
    'sign_up' => 'Sign Up',
    'contact_sales' => 'Contact Sales',
    
    'features' => [
        'cancel_anytime' => 'Cancel anytime',
        'no_hidden_fees' => 'No hidden fees',
        'secure_payment' => 'Secure payment processing',
        'money_back' => '30-day money-back guarantee',
    ],
    
    'employee_plans' => [
        'free' => [
            'name' => 'Free',
            'description' => 'Perfect for getting started',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'features' => [
                'Basic profile creation',
                'Browse job listings',
                'Apply to 5 jobs per month',
                'Basic messaging',
                'Standard customer support',
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'description' => 'Ideal for active job seekers',
            'price_monthly' => 19.99,
            'price_yearly' => 199.99,
            'is_popular' => true,
            'features' => [
                'Everything in Free',
                'Apply to unlimited jobs',
                'Priority in search results',
                'Advanced messaging features',
                'Profile analytics',
                'Resume builder',
                'Priority customer support',
                'Featured profile badge',
            ],
        ],
        'premium' => [
            'name' => 'Premium',
            'description' => 'For professionals who want it all',
            'price_monthly' => 39.99,
            'price_yearly' => 399.99,
            'features' => [
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
        ],
    ],
    
    'employer_plans' => [
        'starter' => [
            'name' => 'Starter',
            'description' => 'Perfect for small businesses',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'features' => [
                'Basic job posting',
                'Access to worker profiles',
                'Basic messaging',
                'Standard support',
            ],
        ],
        'professional' => [
            'name' => 'Professional',
            'description' => 'Ideal for growing businesses',
            'price_monthly' => 19.99,
            'price_yearly' => 191.99,
            'is_popular' => true,
            'features' => [
                'Enhanced job posting',
                'Featured job listings',
                'Advanced worker search',
                'Priority messaging',
                'Analytics dashboard',
                'Priority support',
                'Team collaboration tools',
            ],
        ],
        'enterprise' => [
            'name' => 'Enterprise',
            'description' => 'For large organizations',
            'price_monthly' => 49.99,
            'price_yearly' => 479.99,
            'features' => [
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
        ],
    ],
];

