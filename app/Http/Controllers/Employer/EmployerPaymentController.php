<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\StorePaymentRequest;
use App\Models\Payment;
use App\Services\Employer\EmployerPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerPaymentController extends Controller
{
    public function __construct(
        protected EmployerPaymentService $paymentService
    ) {}

    /**
     * Display a listing of payments.
     */
    public function index(Request $request): Response
    {
        $payments = $this->paymentService->getEmployerPayments(auth()->user(), $request->all());

        return Inertia::render('employer/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment): Response
    {
        $this->authorize('view', $payment);
        
        $paymentDetails = $this->paymentService->getPaymentDetails($payment);

        return Inertia::render('employer/payments/show', [
            'payment' => $paymentDetails,
        ]);
    }

    /**
     * Store a newly created payment in storage.
     */
    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $payment = $this->paymentService->createPayment(auth()->user(), $request->validated());

        return redirect()->route('employer.payments.show', $payment)
            ->with('success', 'Payment created successfully.');
    }
}
