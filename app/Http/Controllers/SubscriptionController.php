<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Services\SubscriptionService;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    protected SubscriptionService $subscriptionService;
    protected EmailService $emailService;

    public function __construct(SubscriptionService $subscriptionService, EmailService $emailService)
    {
        $this->subscriptionService = $subscriptionService;
        $this->emailService = $emailService;
    }

    /**
     * Display subscription plans
     */
    public function index(): Response
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            $employerPlans = $this->subscriptionService->getEmployerPlans();
            $employeePlans = $this->subscriptionService->getEmployeePlans();
            $currentSubscription = $user->activeSubscription();

            // Transform plans to match frontend expectations
            $transformPlan = function($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'type' => $plan->type,
                    'price_monthly' => (float) $plan->price,
                    'price_yearly' => (float) ($plan->yearly_price ?? $plan->price * 12),
                    'features' => $plan->features ?? [],
                    'is_popular' => $plan->is_popular ?? false,
                ];
            };

            return Inertia::render('subscriptions/index', [
                'employerPlans' => $employerPlans->map($transformPlan)->toArray(),
                'employeePlans' => $employeePlans->map($transformPlan)->toArray(),
                'currentSubscription' => $currentSubscription ? [
                    'id' => $currentSubscription->id,
                    'plan' => $transformPlan($currentSubscription->plan),
                    'status' => $currentSubscription->status,
                    'amount' => $currentSubscription->getFormattedAmount(),
                    'billing_interval' => $currentSubscription->billing_interval,
                    'ends_at' => $currentSubscription->ends_at?->format('M j, Y'),
                    'cancelled_at' => $currentSubscription->cancelled_at?->format('M j, Y'),
                    'days_until_expiration' => $currentSubscription->daysUntilExpiration(),
                    'is_cancelled' => $currentSubscription->isCancelled(),
                    'next_billing_date' => $currentSubscription->getNextBillingDate()?->format('M j, Y'),
                ] : null,
                'userRole' => $user->role,
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription index error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return a simplified view on error
            return Inertia::render('subscriptions/index', [
                'employerPlans' => [],
                'employeePlans' => [],
                'currentSubscription' => null,
                'userRole' => Auth::user()?->role ?? 'employee',
                'error' => 'Unable to load subscription data. Please try again.',
            ]);
        }
    }

    /**
     * Show subscription details
     */
    public function show(): Response|\Illuminate\Http\RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->activeSubscription();

        if (!$subscription) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'You don\'t have an active subscription.');
        }

        // Get usage statistics
        $usage = [];
        $plan = $subscription->plan;
        
        if ($plan->job_posts_limit) {
            $usage['job_posts'] = [
                'used' => $subscription->getUsage('job_posts'),
                'limit' => $plan->job_posts_limit,
                'remaining' => $subscription->getRemainingUsage('job_posts'),
            ];
        }

        if ($plan->job_applications_limit) {
            $usage['job_applications'] = [
                'used' => $subscription->getUsage('job_applications'),
                'limit' => $plan->job_applications_limit,
                'remaining' => $subscription->getRemainingUsage('job_applications'),
            ];
        }

        if ($plan->featured_jobs_limit) {
            $usage['featured_jobs'] = [
                'used' => $subscription->getUsage('featured_jobs'),
                'limit' => $plan->featured_jobs_limit,
                'remaining' => $subscription->getRemainingUsage('featured_jobs'),
            ];
        }

        return Inertia::render('subscriptions/show', [
            'subscription' => [
                'id' => $subscription->id,
                'plan' => $subscription->plan,
                'status' => $subscription->status,
                'amount' => $subscription->getFormattedAmount(),
                'billing_interval' => $subscription->billing_interval,
                'starts_at' => $subscription->starts_at->format('M j, Y'),
                'ends_at' => $subscription->ends_at?->format('M j, Y'),
                'cancelled_at' => $subscription->cancelled_at?->format('M j, Y'),
                'days_until_expiration' => $subscription->daysUntilExpiration(),
                'is_cancelled' => $subscription->isCancelled(),
                'next_billing_date' => $subscription->getNextBillingDate()?->format('M j, Y'),
                'usage' => $usage,
            ],
        ]);
    }

    /**
     * Subscribe to a plan
     */
    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_interval' => 'required|in:monthly,yearly',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        // Validate user role matches plan type
        if (($user->isEmployer() && $plan->type !== 'employer') ||
            ($user->isEmployee() && $plan->type !== 'employee')) {
            return response()->json([
                'success' => false,
                'message' => 'This plan is not available for your account type.',
            ], 400);
        }

        try {
            $subscription = $this->subscriptionService->subscribe(
                $user,
                $plan,
                $request->billing_interval,
                [
                    'payment_method' => 'stripe', // This would come from payment processing
                    'metadata' => [
                        'source' => 'web',
                        'user_agent' => $request->userAgent(),
                    ]
                ]
            );

            // Send confirmation email
            $emailData = [
                'user_name' => $user->name,
                'user_email' => $user->email,
                'plan_name' => $plan->name,
                'amount' => $subscription->getFormattedAmount(),
                'billing_interval' => $subscription->billing_interval,
                'next_billing_date' => $subscription->getNextBillingDate()?->format('M j, Y') ?? 'N/A',
                'features' => $plan->features ?? [
                    'Access to all platform features',
                    'Customer support',
                    'Regular updates and improvements'
                ]
            ];

            $emailSent = $this->emailService->sendSubscriptionConfirmation($emailData);

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to ' . $plan->name . ' plan!' . 
                           ($emailSent ? ' A confirmation email has been sent to your inbox.' : ''),
                'subscription_id' => $subscription->id,
                'email_sent' => $emailSent,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create subscription. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Cancel subscription
     */
    public function cancel(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->activeSubscription();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found.',
            ], 404);
        }

        $immediately = $request->boolean('immediately', false);

        if ($this->subscriptionService->cancelSubscription($subscription, $immediately)) {
            $message = $immediately 
                ? 'Your subscription has been cancelled immediately.'
                : 'Your subscription will be cancelled at the end of the current billing period.';

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to cancel subscription. Please try again.',
        ], 500);
    }

    /**
     * Change subscription plan
     */
    public function changePlan(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_interval' => 'sometimes|in:monthly,yearly',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->activeSubscription();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found.',
            ], 404);
        }

        $newPlan = SubscriptionPlan::findOrFail($request->plan_id);

        // Validate user role matches plan type
        if (($user->isEmployer() && $newPlan->type !== 'employer') ||
            ($user->isEmployee() && $newPlan->type !== 'employee')) {
            return response()->json([
                'success' => false,
                'message' => 'This plan is not available for your account type.',
            ], 400);
        }

        try {
            $updatedSubscription = $this->subscriptionService->changePlan(
                $subscription,
                $newPlan,
                $request->billing_interval
            );

            return response()->json([
                'success' => true,
                'message' => 'Successfully changed to ' . $newPlan->name . ' plan!',
                'subscription' => [
                    'id' => $updatedSubscription->id,
                    'plan_name' => $newPlan->name,
                    'amount' => $updatedSubscription->getFormattedAmount(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to change subscription plan. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get usage statistics
     */
    public function usage(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->activeSubscription();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found.',
            ], 404);
        }

        $plan = $subscription->plan;
        $usage = [];

        // Job posts usage (for employers)
        if ($plan->job_posts_limit !== null) {
            $usage['job_posts'] = [
                'used' => $subscription->getUsage('job_posts'),
                'limit' => $plan->job_posts_limit,
                'remaining' => $subscription->getRemainingUsage('job_posts'),
                'percentage' => $plan->job_posts_limit > 0 
                    ? round(($subscription->getUsage('job_posts') / $plan->job_posts_limit) * 100, 1)
                    : 0,
            ];
        }

        // Job applications usage (for workers)
        if ($plan->job_applications_limit !== null) {
            $usage['job_applications'] = [
                'used' => $subscription->getUsage('job_applications'),
                'limit' => $plan->job_applications_limit,
                'remaining' => $subscription->getRemainingUsage('job_applications'),
                'percentage' => $plan->job_applications_limit > 0 
                    ? round(($subscription->getUsage('job_applications') / $plan->job_applications_limit) * 100, 1)
                    : 0,
            ];
        }

        // Featured jobs usage
        if ($plan->featured_jobs_limit !== null) {
            $usage['featured_jobs'] = [
                'used' => $subscription->getUsage('featured_jobs'),
                'limit' => $plan->featured_jobs_limit,
                'remaining' => $subscription->getRemainingUsage('featured_jobs'),
                'percentage' => $plan->featured_jobs_limit > 0 
                    ? round(($subscription->getUsage('featured_jobs') / $plan->featured_jobs_limit) * 100, 1)
                    : 0,
            ];
        }

        return response()->json([
            'success' => true,
            'usage' => $usage,
            'subscription' => [
                'plan_name' => $plan->name,
                'status' => $subscription->status,
                'days_remaining' => $subscription->daysUntilExpiration(),
            ],
        ]);
    }
}