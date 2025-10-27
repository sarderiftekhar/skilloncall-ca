<?php

namespace App\Services;

use App\Models\User;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionService
{
    /**
     * Get all active plans for a specific type
     */
    public function getPlansForType(string $type): \Illuminate\Database\Eloquent\Collection
    {
        return SubscriptionPlan::where('type', $type)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();
    }

    /**
     * Get employer plans
     */
    public function getEmployerPlans(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->getPlansForType('employer');
    }

    /**
     * Get worker plans
     */
    public function getWorkerPlans(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->getPlansForType('worker');
    }

    /**
     * Subscribe user to a plan
     */
    public function subscribe(User $user, SubscriptionPlan $plan, string $billingInterval = 'monthly', array $paymentData = []): Subscription
    {
        DB::beginTransaction();

        try {
            // Cancel any existing active subscriptions
            $this->cancelActiveSubscriptions($user);

            // Calculate dates
            $startsAt = now();
            $endsAt = $this->calculateEndDate($startsAt, $billingInterval);
            $amount = $plan->getPriceForInterval($billingInterval);

            // Create subscription
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'status' => 'active',
                'amount' => $amount,
                'currency' => $plan->currency,
                'billing_interval' => $billingInterval,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'next_payment_at' => $endsAt,
                'payment_method' => $paymentData['payment_method'] ?? null,
                'payment_id' => $paymentData['payment_id'] ?? null,
                'customer_id' => $paymentData['customer_id'] ?? null,
                'subscription_id' => $paymentData['subscription_id'] ?? null,
                'usage' => [],
                'metadata' => $paymentData['metadata'] ?? [],
            ]);

            DB::commit();

            Log::info('User subscribed to plan', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'subscription_id' => $subscription->id,
                'amount' => $amount,
                'billing_interval' => $billingInterval,
            ]);

            return $subscription;
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to create subscription', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Cancel user's active subscriptions
     */
    public function cancelActiveSubscriptions(User $user): int
    {
        $count = 0;
        $activeSubscriptions = $user->subscriptions()->where('status', 'active')->get();

        foreach ($activeSubscriptions as $subscription) {
            $subscription->cancel();
            $count++;
        }

        return $count;
    }

    /**
     * Cancel specific subscription
     */
    public function cancelSubscription(Subscription $subscription, bool $immediately = false): bool
    {
        try {
            if ($immediately) {
                $subscription->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                    'ends_at' => now(),
                ]);
            } else {
                // Cancel at end of current billing period
                $subscription->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                ]);
            }

            Log::info('Subscription cancelled', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'immediately' => $immediately,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to cancel subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Renew subscription
     */
    public function renewSubscription(Subscription $subscription): bool
    {
        try {
            $newEndDate = $this->calculateEndDate(
                $subscription->ends_at ?? now(),
                $subscription->billing_interval
            );

            $subscription->update([
                'status' => 'active',
                'ends_at' => $newEndDate,
                'next_payment_at' => $newEndDate,
                'last_payment_at' => now(),
                'cancelled_at' => null,
            ]);

            Log::info('Subscription renewed', [
                'subscription_id' => $subscription->id,
                'new_end_date' => $newEndDate,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to renew subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Upgrade/Downgrade subscription
     */
    public function changePlan(Subscription $subscription, SubscriptionPlan $newPlan, string $billingInterval = null): Subscription
    {
        DB::beginTransaction();

        try {
            $billingInterval = $billingInterval ?? $subscription->billing_interval;
            $newAmount = $newPlan->getPriceForInterval($billingInterval);

            // Calculate prorated amount if upgrading mid-cycle
            $proratedAmount = $this->calculateProration($subscription, $newPlan, $billingInterval);

            // Update subscription
            $subscription->update([
                'subscription_plan_id' => $newPlan->id,
                'amount' => $newAmount,
                'billing_interval' => $billingInterval,
                'usage' => [], // Reset usage counters
                'metadata' => array_merge($subscription->metadata ?? [], [
                    'plan_change' => [
                        'changed_at' => now(),
                        'previous_plan_id' => $subscription->subscription_plan_id,
                        'prorated_amount' => $proratedAmount,
                    ]
                ]),
            ]);

            DB::commit();

            Log::info('Subscription plan changed', [
                'subscription_id' => $subscription->id,
                'old_plan_id' => $subscription->subscription_plan_id,
                'new_plan_id' => $newPlan->id,
                'prorated_amount' => $proratedAmount,
            ]);

            return $subscription->fresh();
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to change subscription plan', [
                'subscription_id' => $subscription->id,
                'new_plan_id' => $newPlan->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Check if user can use a specific feature
     */
    public function canUseFeature(User $user, string $feature): bool
    {
        $subscription = $user->activeSubscription();
        
        if (!$subscription) {
            return false;
        }

        return $subscription->plan->hasFeature($feature) && 
               $subscription->withinLimit($feature);
    }

    /**
     * Track feature usage
     */
    public function trackFeatureUsage(User $user, string $feature, int $increment = 1): bool
    {
        $subscription = $user->activeSubscription();
        
        if (!$subscription) {
            return false;
        }

        if (!$subscription->withinLimit($feature)) {
            return false; // Already at limit
        }

        $subscription->incrementUsage($feature, $increment);
        
        Log::info('Feature usage tracked', [
            'user_id' => $user->id,
            'feature' => $feature,
            'increment' => $increment,
            'new_usage' => $subscription->getUsage($feature),
        ]);

        return true;
    }

    /**
     * Get subscription statistics
     */
    public function getSubscriptionStats(): array
    {
        return [
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'cancelled_subscriptions' => Subscription::where('status', 'cancelled')->count(),
            'expired_subscriptions' => Subscription::where('status', 'expired')->count(),
            'total_revenue' => Subscription::sum('amount'),
            'monthly_revenue' => Subscription::where('created_at', '>=', now()->startOfMonth())->sum('amount'),
            'employer_subscriptions' => Subscription::whereHas('plan', function ($query) {
                $query->where('type', 'employer');
            })->where('status', 'active')->count(),
            'worker_subscriptions' => Subscription::whereHas('plan', function ($query) {
                $query->where('type', 'worker');
            })->where('status', 'active')->count(),
        ];
    }

    /**
     * Get subscriptions expiring soon
     */
    public function getExpiringSoon(int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::with(['user', 'plan'])
            ->where('status', 'active')
            ->where('ends_at', '<=', now()->addDays($days))
            ->where('ends_at', '>', now())
            ->orderBy('ends_at')
            ->get();
    }

    /**
     * Process expired subscriptions
     */
    public function processExpiredSubscriptions(): int
    {
        $expiredCount = 0;
        
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->where('ends_at', '<=', now())
            ->get();

        foreach ($expiredSubscriptions as $subscription) {
            $subscription->update(['status' => 'expired']);
            $expiredCount++;
            
            Log::info('Subscription expired', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
            ]);
        }

        return $expiredCount;
    }

    /**
     * Calculate end date based on billing interval
     */
    private function calculateEndDate(Carbon $startDate, string $billingInterval): Carbon
    {
        return match ($billingInterval) {
            'yearly' => $startDate->copy()->addYear(),
            'monthly' => $startDate->copy()->addMonth(),
            default => $startDate->copy()->addMonth(),
        };
    }

    /**
     * Calculate prorated amount for plan changes
     */
    private function calculateProration(Subscription $subscription, SubscriptionPlan $newPlan, string $billingInterval): float
    {
        if (!$subscription->ends_at) {
            return 0;
        }

        $daysRemaining = now()->diffInDays($subscription->ends_at, false);
        $totalDays = $subscription->billing_interval === 'yearly' ? 365 : 30;
        
        if ($daysRemaining <= 0) {
            return 0;
        }

        $oldDailyRate = $subscription->amount / $totalDays;
        $newDailyRate = $newPlan->getPriceForInterval($billingInterval) / $totalDays;
        
        return ($newDailyRate - $oldDailyRate) * $daysRemaining;
    }
}
