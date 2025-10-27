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
        $query = Payment::with(['payer:id,name', 'payee:id,name', 'job:id,title']);

        if (!empty($filters['search'])) {
            $query->whereHas('payer', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('payee', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%');
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
        $payment->load(['payer', 'payee', 'job']);

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
}
