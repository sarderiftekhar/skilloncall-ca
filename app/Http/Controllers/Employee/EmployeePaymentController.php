<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\RequestPaymentRequest;
use App\Models\Payment;
use App\Services\Employee\EmployeePaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeePaymentController extends Controller
{
    public function __construct(
        protected EmployeePaymentService $paymentService
    ) {}

    /**
     * Display a listing of employee's payments.
     */
    public function index(Request $request): Response
    {
        $payments = $this->paymentService->getEmployeePayments(auth()->user(), $request->all());

        return Inertia::render('employee/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'type']),
            'totalEarnings' => $this->paymentService->getTotalEarnings(auth()->user()),
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment): Response
    {
        $this->authorize('view', $payment);
        
        $paymentDetails = $this->paymentService->getPaymentDetails($payment);

        return Inertia::render('employee/payments/show', [
            'payment' => $paymentDetails,
        ]);
    }

    /**
     * Request a payment.
     */
    public function request(RequestPaymentRequest $request): RedirectResponse
    {
        $payment = $this->paymentService->requestPayment(auth()->user(), $request->validated());

        return redirect()->route('employee.payments.show', $payment)
            ->with('success', 'Payment request submitted successfully.');
    }
}

