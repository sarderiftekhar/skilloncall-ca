<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Employer Plans
        SubscriptionPlan::create([
            'name' => 'Starter',
            'slug' => 'employer-starter',
            'description' => 'Perfect for small businesses just getting started with hiring skilled workers.',
            'type' => 'employer',
            'price' => 0.00,
            'yearly_price' => 0.00,
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_posts_limit' => 2,
            'featured_jobs_limit' => 0,
            'team_members_limit' => 1,
            'priority_support' => false,
            'advanced_analytics' => false,
            'custom_branding' => false,
            'api_access' => false,
            'is_active' => true,
            'is_popular' => false,
            'sort_order' => 1,
            'features' => [
                'Basic job posting',
                'Access to worker profiles',
                'Basic messaging',
                'Standard support'
            ],
        ]);

        SubscriptionPlan::create([
            'name' => 'Professional',
            'slug' => 'employer-professional',
            'description' => 'Ideal for growing businesses that need to hire skilled workers regularly.',
            'type' => 'employer',
            'price' => 49.99,
            'yearly_price' => 479.99, // 20% discount
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_posts_limit' => 15,
            'featured_jobs_limit' => 3,
            'team_members_limit' => 5,
            'priority_support' => true,
            'advanced_analytics' => true,
            'custom_branding' => false,
            'api_access' => false,
            'is_active' => true,
            'is_popular' => true,
            'sort_order' => 2,
            'features' => [
                'Enhanced job posting',
                'Featured job listings',
                'Advanced worker search',
                'Priority messaging',
                'Analytics dashboard',
                'Priority support',
                'Team collaboration tools'
            ],
        ]);

        SubscriptionPlan::create([
            'name' => 'Enterprise',
            'slug' => 'employer-enterprise',
            'description' => 'For large organizations with extensive hiring needs and custom requirements.',
            'type' => 'employer',
            'price' => 149.99,
            'yearly_price' => 1439.99, // 20% discount
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_posts_limit' => null, // Unlimited
            'featured_jobs_limit' => 10,
            'team_members_limit' => null, // Unlimited
            'priority_support' => true,
            'advanced_analytics' => true,
            'custom_branding' => true,
            'api_access' => true,
            'is_active' => true,
            'is_popular' => false,
            'sort_order' => 3,
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
                'White-label solutions'
            ],
        ]);

        // Worker Plans
        SubscriptionPlan::create([
            'name' => 'Basic',
            'slug' => 'worker-basic',
            'description' => 'Get started finding work opportunities in your area.',
            'type' => 'worker',
            'price' => 0.00,
            'yearly_price' => 0.00,
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_applications_limit' => 5,
            'featured_jobs_limit' => 0,
            'team_members_limit' => null,
            'priority_support' => false,
            'advanced_analytics' => false,
            'custom_branding' => false,
            'api_access' => false,
            'is_active' => true,
            'is_popular' => false,
            'sort_order' => 1,
            'features' => [
                'Basic profile creation',
                'Apply to jobs',
                'Basic messaging',
                'Standard support'
            ],
        ]);

        SubscriptionPlan::create([
            'name' => 'Pro Worker',
            'slug' => 'worker-pro',
            'description' => 'Stand out from the competition and get more job opportunities.',
            'type' => 'worker',
            'price' => 19.99,
            'yearly_price' => 191.99, // 20% discount
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_applications_limit' => 50,
            'featured_jobs_limit' => null,
            'team_members_limit' => null,
            'priority_support' => true,
            'advanced_analytics' => true,
            'custom_branding' => false,
            'api_access' => false,
            'is_active' => true,
            'is_popular' => true,
            'sort_order' => 2,
            'features' => [
                'Enhanced profile',
                'Portfolio showcase',
                'Priority in search results',
                'Advanced job filters',
                'Application tracking',
                'Performance analytics',
                'Priority support',
                'Skills verification badges'
            ],
        ]);

        SubscriptionPlan::create([
            'name' => 'Premium Worker',
            'slug' => 'worker-premium',
            'description' => 'Maximum visibility and tools for professional skilled workers.',
            'type' => 'worker',
            'price' => 39.99,
            'yearly_price' => 383.99, // 20% discount
            'currency' => 'CAD',
            'billing_interval' => 'monthly',
            'job_applications_limit' => null, // Unlimited
            'featured_jobs_limit' => null,
            'team_members_limit' => null,
            'priority_support' => true,
            'advanced_analytics' => true,
            'custom_branding' => true,
            'api_access' => false,
            'is_active' => true,
            'is_popular' => false,
            'sort_order' => 3,
            'features' => [
                'Premium profile',
                'Featured in search results',
                'Unlimited applications',
                'Advanced portfolio tools',
                'Custom profile URL',
                'Detailed analytics',
                'Priority support',
                'Professional badges',
                'Direct employer contact',
                'Job alerts and recommendations'
            ],
        ]);
    }
}