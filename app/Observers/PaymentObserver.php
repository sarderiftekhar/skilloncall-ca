<?php

namespace App\Observers;

use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentObserver
{
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        Log::info('New payment created', [
            'payment_id' => $payment->id,
            'payer_id' => $payment->payer_id,
            'payee_id' => $payment->payee_id,
            'amount' => $payment->amount,
            'type' => $payment->type,
        ]);

        // Notify relevant parties
        $this->notifyPaymentCreated($payment);
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        // Log status changes
        if ($payment->isDirty('status')) {
            Log::info('Payment status changed', [
                'payment_id' => $payment->id,
                'old_status' => $payment->getOriginal('status'),
                'new_status' => $payment->status,
                'amount' => $payment->amount,
            ]);

            // Handle status-specific actions
            $this->handleStatusChange($payment);
        }
    }

    /**
     * Handle the Payment "deleted" event.
     */
    public function deleted(Payment $payment): void
    {
        Log::info('Payment deleted', [
            'payment_id' => $payment->id,
            'payer_id' => $payment->payer_id,
            'payee_id' => $payment->payee_id,
            'amount' => $payment->amount,
        ]);

        // Notify parties about payment cancellation
        $this->notifyPaymentCancelled($payment);
    }

    /**
     * Notify parties about payment creation.
     */
    private function notifyPaymentCreated(Payment $payment): void
    {
        // Notify payer and payee
        // $payment->payer->notify(new PaymentCreated($payment));
        // $payment->payee->notify(new PaymentReceived($payment));
    }

    /**
     * Handle payment status changes.
     */
    private function handleStatusChange(Payment $payment): void
    {
        match ($payment->status) {
            'processing' => $this->handlePaymentProcessing($payment),
            'completed' => $this->handlePaymentCompletion($payment),
            'failed' => $this->handlePaymentFailure($payment),
            'refunded' => $this->handlePaymentRefund($payment),
            'cancelled' => $this->handlePaymentCancellation($payment),
            default => null,
        };
    }

    /**
     * Handle payment processing.
     */
    private function handlePaymentProcessing(Payment $payment): void
    {
        // Notify parties that payment is being processed
        // $payment->payer->notify(new PaymentProcessing($payment));
        // $payment->payee->notify(new PaymentProcessing($payment));
        
        // Log for audit trail
        Log::info('Payment processing started', [
            'payment_id' => $payment->id,
            'processor' => auth()->id(),
        ]);
    }

    /**
     * Handle payment completion.
     */
    private function handlePaymentCompletion(Payment $payment): void
    {
        // Notify parties about successful payment
        // $payment->payer->notify(new PaymentCompleted($payment));
        // $payment->payee->notify(new PaymentCompleted($payment));
        
        // Update related job/application status if applicable
        $this->updateRelatedRecords($payment);
        
        // Update user balances or earnings
        $this->updateUserFinancials($payment);
        
        Log::info('Payment completed successfully', [
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
        ]);
    }

    /**
     * Handle payment failure.
     */
    private function handlePaymentFailure(Payment $payment): void
    {
        // Notify parties about payment failure
        // $payment->payer->notify(new PaymentFailed($payment));
        // $payment->payee->notify(new PaymentFailed($payment));
        
        // Revert any status changes made in anticipation of payment
        $this->revertRelatedRecords($payment);
        
        Log::warning('Payment failed', [
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'failure_reason' => $payment->failure_reason,
        ]);
    }

    /**
     * Handle payment refund.
     */
    private function handlePaymentRefund(Payment $payment): void
    {
        // Notify parties about refund
        // $payment->payer->notify(new PaymentRefunded($payment));
        // $payment->payee->notify(new PaymentRefunded($payment));
        
        // Update user balances
        $this->processRefund($payment);
        
        Log::info('Payment refunded', [
            'payment_id' => $payment->id,
            'refund_amount' => $payment->refund_amount,
        ]);
    }

    /**
     * Handle payment cancellation.
     */
    private function handlePaymentCancellation(Payment $payment): void
    {
        // Notify parties about cancellation
        $this->notifyPaymentCancelled($payment);
        
        Log::info('Payment cancelled', [
            'payment_id' => $payment->id,
            'cancelled_by' => auth()->id(),
        ]);
    }

    /**
     * Notify parties about payment cancellation.
     */
    private function notifyPaymentCancelled(Payment $payment): void
    {
        // $payment->payer->notify(new PaymentCancelled($payment));
        // $payment->payee->notify(new PaymentCancelled($payment));
    }

    /**
     * Update related job/application records.
     */
    private function updateRelatedRecords(Payment $payment): void
    {
        if ($payment->job_id) {
            // Update job status if this was the final payment
            $job = $payment->job;
            if ($job && $this->isJobFullyPaid($job)) {
                $job->update(['payment_status' => 'completed']);
            }
        }
    }

    /**
     * Revert related records on payment failure.
     */
    private function revertRelatedRecords(Payment $payment): void
    {
        if ($payment->job_id) {
            $job = $payment->job;
            if ($job) {
                $job->update(['payment_status' => 'pending']);
            }
        }
    }

    /**
     * Update user financial records.
     */
    private function updateUserFinancials(Payment $payment): void
    {
        // Update payee earnings
        // $payment->payee->increment('total_earnings', $payment->amount);
        
        // Update payer spending
        // $payment->payer->increment('total_spent', $payment->amount);
    }

    /**
     * Process refund to user balance.
     */
    private function processRefund(Payment $payment): void
    {
        // Credit refund to payer
        // $payment->payer->increment('account_balance', $payment->refund_amount);
        
        // Deduct from payee if already credited
        // $payment->payee->decrement('total_earnings', $payment->refund_amount);
    }

    /**
     * Check if job is fully paid.
     */
    private function isJobFullyPaid($job): bool
    {
        $totalPaid = $job->payments()
            ->where('status', 'completed')
            ->sum('amount');
            
        return $totalPaid >= $job->budget;
    }
}
