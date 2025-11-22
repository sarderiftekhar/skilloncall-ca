<?php

namespace App\Services\Admin;

use App\Events\Admin\PaymentProcessed;
use App\Models\Payment;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminPaymentService
{
    /**
     * Get paginated payments with filters.
     */
    public function getPayments(array $filters = []): LengthAwarePaginator
    {
        $query = Payment::with(['payer:id,name', 'payee:id,name', 'job:id,title', 'subscription.plan:id,name']);

        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->whereHas('payer', function ($subQ) use ($filters) {
                    $subQ->where('name', 'like', '%' . $filters['search'] . '%');
                })->orWhereHas('payee', function ($subQ) use ($filters) {
                    $subQ->where('name', 'like', '%' . $filters['search'] . '%');
                })->orWhereHas('subscription.plan', function ($subQ) use ($filters) {
                    $subQ->where('name', 'like', '%' . $filters['search'] . '%');
                })->orWhere('transaction_id', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /**
     * Get detailed payment information.
     */
    public function getPaymentDetails(Payment $payment): array
    {
        $payment->load(['payer', 'payee', 'job', 'processor']);

        return [
            'payment' => $payment->toArray(),
            'timeline' => $this->getPaymentTimeline($payment),
        ];
    }

    /**
     * Process a payment.
     */
    public function processPayment(Payment $payment): Payment
    {
        $payment->update([
            'status' => 'completed',
            'processed_at' => now(),
            'processed_by' => auth()->id(),
        ]);

        event(new PaymentProcessed($payment));

        return $payment;
    }

    /**
     * Get payment timeline/history.
     */
    private function getPaymentTimeline(Payment $payment): array
    {
        // This would typically fetch from a payment history/audit table
        // For now, return basic timeline based on payment status
        $timeline = [
            [
                'status' => 'created',
                'timestamp' => $payment->created_at,
                'description' => 'Payment request created',
            ]
        ];

        if ($payment->processed_at) {
            $timeline[] = [
                'status' => 'processed',
                'timestamp' => $payment->processed_at,
                'description' => 'Payment processed by admin',
            ];
        }

        return $timeline;
    }

    /**
     * Get financial summary.
     */
    public function getFinancialSummary(): array
    {
        return [
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
            'pendingAmount' => Payment::where('status', 'pending')->sum('amount'),
            'commission' => Payment::where('status', 'completed')
                ->where('type', '!=', 'subscription') // Commission only on job payments
                ->sum('commission_amount'),
        ];
    }
}
