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
            
            // Get current Cashier subscription
            $currentPaddleSubscription = $user->subscription();

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
                'currentSubscription' => $currentPaddleSubscription ? [
                    'id' => $currentPaddleSubscription->id,
                    'status' => $currentPaddleSubscription->status,
                    'ends_at' => $currentPaddleSubscription->ends_at?->format('M j, Y'),
                    'trial_ends_at' => $currentPaddleSubscription->trial_ends_at?->format('M j, Y'),
                    'paused_at' => $currentPaddleSubscription->paused_at?->format('M j, Y'),
                    'on_trial' => $currentPaddleSubscription->onTrial(),
                    'cancelled' => $currentPaddleSubscription->cancelled(),
                    'recurring' => $currentPaddleSubscription->recurring(),
                ] : null,
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
            ->where('environment', config('paddle.sandbox') ? 'sandbox' : 'production')
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
            // Use Cashier's checkout method
            $checkout = $user->checkout($priceId)
                ->customData([
                    'plan_id' => $plan->id,
                    'plan_name' => $plan->name,
                    'billing_interval' => $request->billing_interval,
                ])
                ->returnTo(route('subscriptions.paddle.callback'))
                ->create();

            return response()->json([
                'success' => true,
                'redirect_url' => $checkout->url,
                'message' => 'Redirecting to checkout...',
            ]);
        } catch (\Exception $e) {
            Log::error('Paddle checkout creation failed', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'price_id' => $priceId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate checkout. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Handle Paddle checkout callback
     */
    public function handlePaddleCallback(Request $request)
    {
        try {
            // The webhook will handle the actual subscription creation
            // This callback just confirms the user completed checkout
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
            ->where('environment', config('paddle.sandbox') ? 'sandbox' : 'production')
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
