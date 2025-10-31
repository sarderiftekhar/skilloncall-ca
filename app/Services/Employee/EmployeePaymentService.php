<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Collection;

class EmployeePaymentService
{
    /**
     * Get employee payments with filters.
     */
    public function getEmployeePayments(User $employee, array $filters = []): Collection
    {
        $query = $employee->receivedPayments()
            ->with(['payer:id,name'])
            ->latest();

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply type filter
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhereHas('payer', function ($q2) use ($filters) {
                      $q2->where('name', 'like', '%' . $filters['search'] . '%');
                  });
            });
        }

        return $query->get();
    }

    /**
     * Get total earnings for employee.
     */
    public function getTotalEarnings(User $employee): float
    {
        return $employee->receivedPayments()
            ->where('status', 'completed')
            ->sum('amount');
    }

    /**
     * Get payment details.
     */
    public function getPaymentDetails(Payment $payment): array
    {
        return $payment->load(['payer', 'payee', 'job'])->toArray();
    }

    /**
     * Request a payment.
     */
    public function requestPayment(User $employee, array $data): Payment
    {
        return Payment::create([
            'payee_id' => $employee->id,
            'payer_id' => $data['payer_id'],
            'amount' => $data['amount'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'type' => 'job_payment',
        ]);
    }
}

