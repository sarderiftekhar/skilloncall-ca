<?php

namespace App\Listeners;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;
use Laravel\Paddle\Events\TransactionCompleted;

class RecordSubscriptionPayment
{
    /**
     * Handle the event.
     */
    public function handle(TransactionCompleted $event): void
    {
        try {
            $transaction = $event->transaction;
            $user = $transaction->billable;

            if (!$user) {
                Log::warning('TransactionCompleted: No billable user found', [
                    'transaction_id' => $transaction->paddle_id,
                ]);
                return;
            }

            // Find the subscription for this transaction
            $subscription = Subscription::where('user_id', $user->id)
                ->where(function($query) use ($transaction) {
                    $query->where('paddle_subscription_id', $transaction->paddle_subscription_id)
                          ->orWhere('payment_id', $transaction->paddle_id);
                })
                ->latest()
                ->first();

            // Check if payment already exists
            $existingPayment = Payment::where('transaction_id', $transaction->paddle_id)
                ->where('type', 'subscription')
                ->first();

            if ($existingPayment) {
                Log::info('Subscription payment already recorded', [
                    'payment_id' => $existingPayment->id,
                    'transaction_id' => $transaction->paddle_id,
                ]);
                return;
            }

            // Convert transaction amount from string to decimal
            $amount = (float) str_replace(',', '', $transaction->total);
            $tax = (float) str_replace(',', '', $transaction->tax ?? '0');
            $netAmount = $amount - $tax;

            // Create payment record
            $payment = Payment::create([
                'subscription_id' => $subscription?->id,
                'payer_id' => $user->id,
                'payee_id' => null, // Platform receives subscription payments
                'amount' => $amount,
                'commission_amount' => 0, // No commission on subscription payments
                'net_amount' => $netAmount,
                'currency' => $transaction->currency ?? 'CAD',
                'status' => $transaction->status === 'completed' ? 'completed' : 'processing',
                'type' => 'subscription',
                'payment_method' => 'paddle',
                'transaction_id' => $transaction->paddle_id,
                'processed_at' => $transaction->billed_at ?? now(),
                'notes' => 'Subscription payment for ' . ($subscription && $subscription->plan ? $subscription->plan->name : 'Unknown Plan'),
            ]);

            Log::info('Subscription payment recorded', [
                'payment_id' => $payment->id,
                'user_id' => $user->id,
                'subscription_id' => $subscription?->id,
                'transaction_id' => $transaction->paddle_id,
                'amount' => $amount,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to record subscription payment', [
                'transaction_id' => $event->transaction->paddle_id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
