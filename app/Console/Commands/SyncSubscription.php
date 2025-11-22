<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use Illuminate\Console\Command;

class SyncSubscription extends Command
{
    protected $signature = 'subscription:sync {user_id} {plan_name} {billing_interval=monthly}';
    protected $description = 'Manually sync a subscription for a user';

    public function handle()
    {
        $userId = $this->argument('user_id');
        $planName = $this->argument('plan_name');
        $billingInterval = $this->argument('billing_interval');

        $user = User::find($userId);
        if (!$user) {
            $this->error("User not found: {$userId}");
            return 1;
        }

        $plan = SubscriptionPlan::where('name', $planName)->first();
        if (!$plan) {
            $this->error("Plan not found: {$planName}");
            return 1;
        }

        // Cancel any existing active subscriptions
        Subscription::where('user_id', $userId)
            ->where('status', 'active')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Create new subscription
        $subscription = Subscription::create([
            'user_id' => $userId,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
            'amount' => $plan->getPriceForInterval($billingInterval),
            'currency' => $plan->currency,
            'billing_interval' => $billingInterval,
            'starts_at' => now(),
            'ends_at' => $billingInterval === 'monthly' ? now()->addMonth() : now()->addYear(),
            'next_payment_at' => $billingInterval === 'monthly' ? now()->addMonth() : now()->addYear(),
        ]);

        $this->info("✅ Subscription created successfully!");
        $this->info("   User: {$user->email}");
        $this->info("   Plan: {$plan->name}");
        $this->info("   Billing: {$billingInterval}");
        $this->info("   Amount: {$subscription->amount} {$subscription->currency}");
        $this->info("   Subscription ID: {$subscription->id}");

        return 0;
    }
}

