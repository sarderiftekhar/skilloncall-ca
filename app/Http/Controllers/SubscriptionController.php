<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\PaddleProduct;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    /**
     * Display subscription plans
     */
    public function index(): Response
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            $employerPlans = SubscriptionPlan::where('type', 'employer')
                ->where('is_active', true)
                ->orderBy('price')
                ->get();
            
            $employeePlans = SubscriptionPlan::where('type', 'employee')
                ->where('is_active', true)
                ->orderBy('price')
                ->get();
            
            // Get current subscription (prefer local subscription over Cashier)
            $currentLocalSubscription = $user->activeSubscription();
            $currentPaddleSubscription = $user->subscription();
            
            $currentSubscription = null;
            if ($currentLocalSubscription && $currentLocalSubscription->plan) {
                // Use local subscription with plan info
                $currentSubscription = [
                    'id' => $currentLocalSubscription->id,
                    'status' => $currentLocalSubscription->status,
                    'ends_at' => $currentLocalSubscription->ends_at?->format('M j, Y'),
                    'next_billing_date' => $currentLocalSubscription->next_payment_at?->format('M j, Y'),
                    'is_cancelled' => $currentLocalSubscription->status === 'cancelled',
                    'plan' => [
                        'id' => $currentLocalSubscription->plan->id,
                        'name' => $currentLocalSubscription->plan->name,
                        'slug' => $currentLocalSubscription->plan->slug,
                        'type' => $currentLocalSubscription->plan->type,
                    ],
                ];
            } elseif ($currentPaddleSubscription) {
                // Fallback to Cashier subscription - get plan from price ID
                $currentPlan = $user->getCurrentPlan();
                $currentSubscription = [
                    'id' => $currentPaddleSubscription->id,
                    'status' => $currentPaddleSubscription->status ?? 'active',
                    'ends_at' => $currentPaddleSubscription->ends_at?->format('M j, Y'),
                    'next_billing_date' => $currentPaddleSubscription->ends_at?->format('M j, Y'),
                    'is_cancelled' => $currentPaddleSubscription->cancelled(),
                    'plan' => $currentPlan ? [
                        'id' => $currentPlan->id,
                        'name' => $currentPlan->name,
                        'slug' => $currentPlan->slug,
                        'type' => $currentPlan->type,
                    ] : null,
                ];
            }

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
                'currentSubscription' => $currentSubscription,
                'userRole' => $user->role,
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription index error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

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
        $subscription = $user->subscription();

        if (!$subscription) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'You don\'t have an active subscription.');
        }

        return Inertia::render('subscriptions/show', [
            'subscription' => [
                'id' => $subscription->id,
                'paddle_id' => $subscription->paddle_id,
                'status' => $subscription->status,
                'type' => $subscription->type,
                'trial_ends_at' => $subscription->trial_ends_at?->format('M j, Y'),
                'paused_at' => $subscription->paused_at?->format('M j, Y'),
                'ends_at' => $subscription->ends_at?->format('M j, Y'),
                'on_trial' => $subscription->onTrial(),
                'cancelled' => $subscription->cancelled(),
                'recurring' => $subscription->recurring(),
                'on_grace_period' => $subscription->onGracePeriod(),
            ],
        ]);
    }

    /**
     * Subscribe to a plan - Initiate Paddle checkout using Cashier
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

        // Get or create Paddle product mapping
        $paddleProduct = PaddleProduct::where('subscription_plan_id', $plan->id)
            ->where('environment', config('cashier.sandbox') ? 'sandbox' : 'production')
            ->first();

        if (!$paddleProduct) {
            return response()->json([
                'success' => false,
                'message' => 'This plan is not configured for Paddle checkout. Please contact support.',
            ], 400);
        }

        // Get the appropriate price ID based on billing interval
        $priceId = $request->billing_interval === 'monthly' 
            ? $paddleProduct->paddle_price_id_monthly 
            : $paddleProduct->paddle_price_id_yearly;

        if (!$priceId) {
            return response()->json([
                'success' => false,
                'message' => 'Pricing not available for this billing interval. Please contact support.',
            ], 400);
        }

        try {
            // Log what we're about to send
            Log::info('Creating Paddle checkout', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'price_id' => $priceId,
                'plan_name' => $plan->name,
                'billing_interval' => $request->billing_interval,
            ]);

            // Use Cashier's subscribe method for subscriptions.
            // This returns a Checkout instance that we can pass to the frontend.
            $checkout = $user->subscribe($priceId)
                ->customData([
                    'plan_id' => $plan->id,
                    'plan_name' => $plan->name,
                    'billing_interval' => $request->billing_interval,
                ])
                // Include basic plan info in the return URL so we can
                // update our local subscriptions table after checkout.
                ->returnTo(route('subscriptions.paddle.callback', [
                    'plan_id' => $plan->id,
                    'billing_interval' => $request->billing_interval,
                ]));

            $options = $checkout->options();
            
            Log::info('Paddle checkout created successfully', [
                'checkout_options' => $options,
            ]);

            return response()->json([
                'success' => true,
                'checkout_options' => $options,
                'message' => 'Opening Paddle checkout...',
            ]);
        } catch (\Exception $e) {
            Log::error('Paddle checkout creation failed', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'price_id' => $priceId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return detailed error in development
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate checkout. Please try again.',
                'error' => $e->getMessage(), // Always show error for debugging
                'price_id' => $priceId,
                'user_email' => $user->email,
            ], 500);
        }
    }

    /**
     * Handle Paddle checkout callback
     */
    public function handlePaddleCallback(Request $request, \App\Services\SubscriptionService $subscriptionService)
    {
        try {
            /** @var \App\Models\User|null $user */
            $user = Auth::user();

            // Create / update our local subscription record so the
            // platform immediately reflects the new plan.
            if ($user && $request->filled('plan_id')) {
                $plan = SubscriptionPlan::find($request->integer('plan_id'));
                $billingInterval = $request->get('billing_interval', 'monthly');

                if ($plan) {
                    $subscriptionService->subscribe($user, $plan, $billingInterval, [
                        'payment_method' => 'paddle',
                        'payment_id' => $request->get('transaction_id'),
                        'metadata' => [
                            'paddle_checkout_id' => $request->get('checkout_id'),
                        ],
                    ]);
                }
            }

            return redirect()->route('subscriptions.show')
                ->with('success', 'Your subscription is active! Welcome aboard.');
        } catch (\Exception $e) {
            Log::error('Paddle callback error', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return redirect()->route('subscriptions.index')
                ->with('error', 'An error occurred processing your subscription. Please contact support.');
        }
    }

    /**
     * Handle cancelled Paddle checkout
     */
    public function handlePaddleCancel(Request $request)
    {
        return redirect()->route('subscriptions.index')
            ->with('info', 'Checkout was cancelled. You can try again anytime.');
    }

    /**
     * Cancel subscription using Cashier
     */
    public function cancel(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->subscription();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found.',
            ], 404);
        }

        try {
            // Cancel subscription at period end (default behavior)
            $subscription->cancel();

            return response()->json([
                'success' => true,
                'message' => 'Your subscription will be cancelled at the end of the current billing period.',
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription cancellation failed', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel subscription. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Resume a cancelled subscription
     */
    public function resume(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->subscription();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No subscription found.',
            ], 404);
        }

        if (!$subscription->cancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription is not cancelled.',
            ], 400);
        }

        try {
            // Resume the subscription
            $subscription->resume();

            return response()->json([
                'success' => true,
                'message' => 'Your subscription has been resumed successfully!',
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription resume failed', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to resume subscription. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Swap to a different price/plan
     */
    public function swap(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_interval' => 'required|in:monthly,yearly',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $subscription = $user->subscription();

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

        // Get Paddle product mapping
        $paddleProduct = PaddleProduct::where('subscription_plan_id', $newPlan->id)
            ->where('environment', config('cashier.sandbox') ? 'sandbox' : 'production')
            ->first();

        if (!$paddleProduct) {
            return response()->json([
                'success' => false,
                'message' => 'This plan is not configured for Paddle. Please contact support.',
            ], 400);
        }

        $newPriceId = $request->billing_interval === 'monthly' 
            ? $paddleProduct->paddle_price_id_monthly 
            : $paddleProduct->paddle_price_id_yearly;

        if (!$newPriceId) {
            return response()->json([
                'success' => false,
                'message' => 'Pricing not available for this billing interval.',
            ], 400);
        }

        try {
            // Swap to new price (Paddle handles proration automatically)
            $subscription->swap($newPriceId);

            return response()->json([
                'success' => true,
                'message' => 'Successfully changed to ' . $newPlan->name . ' plan!',
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription swap failed', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'new_price_id' => $newPriceId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to change subscription plan. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
