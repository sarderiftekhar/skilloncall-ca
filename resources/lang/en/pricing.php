<?php

return [
    'title' => 'Pricing Plans',
    'subtitle' => 'Choose the perfect plan for your needs',
    'description' => 'Flexible pricing options for employers and employees. Start free, upgrade anytime.',
    
    'employers' => [
        'title' => 'For Employers',
        'subtitle' => 'Find skilled workers quickly and efficiently',
    ],
    
    'employees' => [
        'title' => 'For Employees',
        'subtitle' => 'Unlock more opportunities with premium features',
    ],
    
    'plans' => [
        'employer' => [
            'free' => [
                'name' => 'Free',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'description' => 'Perfect for getting started',
                'features' => [
                    'Free registration',
                    'Unlimited candidate search (basic filters)',
                    '1 free job posting per month',
                    'View available employees by type',
                    'View basic employee profiles (masked contact)',
                    'View applicants only (for posted jobs)',
                    'Free newsletter subscription',
                ],
                'limitations' => [
                    'No messaging/contact with candidates',
                    'Cannot view full candidate contact details',
                    'Limited to basic search filters',
                    'No advanced analytics',
                ],
            ],
            'basic' => [
                'name' => 'Basic',
                'price_monthly' => 10,
                'price_yearly' => 96, // 20% discount: $10 * 12 * 0.8 = $96
                'description' => 'Ideal for regular hiring needs',
                'is_popular' => true,
                'features' => [
                    'Everything in Free',
                    'Unlimited job postings',
                    'View full candidate profiles (contact visible)',
                    'Messaging/contact with candidates',
                    'Advanced search filters',
                    'View all candidates (not just applicants)',
                    'Application management tools',
                    'Basic analytics dashboard',
                ],
            ],
            'professional' => [
                'name' => 'Professional',
                'price_monthly' => 25,
                'price_yearly' => 240, // 20% discount: $25 * 12 * 0.8 = $240
                'description' => 'For businesses with high hiring volume',
                'features' => [
                    'Everything in Basic',
                    'Featured job postings (priority placement)',
                    'Advanced analytics & insights',
                    'Priority customer support',
                    'Bulk candidate export',
                    'Custom job posting templates',
                    'Advanced candidate matching algorithms',
                ],
            ],
            'on_demand' => [
                'name' => '7-Day On-Demand',
                'price' => 15,
                'description' => 'Perfect for urgent hiring needs',
                'features' => [
                    'All Basic Plan features',
                    'Valid for 7 days only',
                    'Perfect for urgent hiring needs',
                ],
            ],
            'per_job' => [
                'name' => 'Per Job Posting',
                'price' => 10,
                'description' => 'No monthly commitment',
                'features' => [
                    'Post 1 job',
                    'View applicants only (contact visible)',
                    'Contact applicants via messaging',
                    'No monthly commitment',
                ],
                'limitations' => [
                    'Cannot view other candidates (non-applicants)',
                    'Other candidate details hidden (like free tier)',
                ],
            ],
        ],
        'employee' => [
            'free' => [
                'name' => 'Free',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'description' => 'Perfect for getting started',
                'features' => [
                    'Free registration',
                    'Browse job listings',
                    'View job details',
                    'Basic profile creation',
                    '5 job applications per month',
                    'Save jobs',
                ],
                'limitations' => [
                    'No messaging/contact with employers',
                    'Cannot initiate contact',
                    'Limited profile visibility',
                    'No portfolio uploads',
                    'Basic search only',
                ],
            ],
            'basic' => [
                'name' => 'Basic',
                'price_monthly' => 7.99,
                'price_yearly' => 76.70, // 20% discount: $7.99 * 12 * 0.8 = $76.70
                'description' => 'Ideal for active job seekers',
                'is_popular' => true,
                'features' => [
                    'Everything in Free',
                    'Unlimited job applications',
                    'Messaging/contact with employers',
                    'Portfolio uploads',
                    'Enhanced profile visibility',
                    'Advanced job search filters',
                    'Application tracking dashboard',
                ],
            ],
            'professional' => [
                'name' => 'Professional',
                'price_monthly' => 15,
                'price_yearly' => 144, // 20% discount: $15 * 12 * 0.8 = $144
                'description' => 'For professionals who want it all',
                'features' => [
                    'Everything in Basic',
                    'Priority in search results',
                    'Featured profile badge',
                    'Profile analytics',
                    'Advanced portfolio features',
                    'Direct employer contact (initiate conversations)',
                    'Verified professional badge',
                    'Priority customer support',
                ],
            ],
            'on_demand' => [
                'name' => '7-Day On-Demand',
                'price' => 5,
                'description' => 'Perfect for active job searching periods',
                'features' => [
                    'All Basic Plan features',
                    'Valid for 7 days only',
                    'Perfect for active job searching periods',
                ],
            ],
        ],
    ],
    
    'billing' => [
        'monthly' => 'Monthly',
        'yearly' => 'Yearly',
        'save' => 'Save 20%',
        'per_month' => '/month',
        'per_year' => '/year',
        'one_time' => 'One-time',
    ],
    
    'cta' => [
        'get_started' => 'Get Started',
        'upgrade_now' => 'Upgrade Now',
        'select_plan' => 'Select Plan',
        'current_plan' => 'Current Plan',
    ],
    
    'faq' => [
        'title' => 'Frequently Asked Questions',
        'items' => [
            [
                'question' => 'Can I change my plan later?',
                'answer' => 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.',
            ],
            [
                'question' => 'What happens if I cancel?',
                'answer' => 'You can cancel anytime. Your subscription will remain active until the end of the billing period.',
            ],
            [
                'question' => 'Do you offer refunds?',
                'answer' => 'We offer a 7-day money-back guarantee for all paid plans.',
            ],
            [
                'question' => 'Can I use multiple plans?',
                'answer' => 'No, you can only have one active subscription plan at a time.',
            ],
        ],
    ],
    
    'features' => [
        'unlimited' => 'Unlimited',
        'limited' => 'Limited',
        'included' => 'Included',
        'not_included' => 'Not included',
    ],
];

