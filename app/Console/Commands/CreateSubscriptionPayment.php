<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Console\Command;

class CreateSubscriptionPayment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:create-subscription {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a payment record for a user\'s active subscription';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return Command::FAILURE;
        }

        $subscription = $user->activeSubscription();

        if (!$subscription) {
            $this->error("No active subscription found for user {$email}.");
            return Command::FAILURE;
        }

        // Check if payment already exists
        $existingPayment = Payment::where('subscription_id', $subscription->id)
            ->where('type', 'subscription')
            ->first();

        if ($existingPayment) {
            $this->warn("Payment already exists for this subscription (ID: {$existingPayment->id}).");
            return Command::SUCCESS;
        }

        $payment = Payment::create([
            'subscription_id' => $subscription->id,
            'payer_id' => $user->id,
            'payee_id' => null,
            'amount' => $subscription->amount,
            'commission_amount' => 0,
            'net_amount' => $subscription->amount,
            'currency' => $subscription->currency,
            'status' => 'completed',
            'type' => 'subscription',
            'payment_method' => 'paddle',
            'transaction_id' => 'manual_' . $subscription->id . '_' . time(),
            'processed_at' => $subscription->starts_at ?? now(),
            'notes' => 'Subscription payment for ' . $subscription->plan->name,
        ]);

        $this->info("✅ Payment created successfully!");
        $this->line("   Payment ID: {$payment->id}");
        $this->line("   Amount: {$subscription->currency} {$subscription->amount}");
        $this->line("   Plan: {$subscription->plan->name}");

        return Command::SUCCESS;
    }
}
