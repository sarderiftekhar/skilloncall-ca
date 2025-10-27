<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Worker\RequestPaymentRequest;
use App\Models\Payment;
use App\Services\Worker\WorkerPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerPaymentController extends Controller
{
    public function __construct(
        protected WorkerPaymentService $paymentService
    ) {}

    /**
     * Display a listing of worker's payments.
     */
    public function index(Request $request): Response
    {
        $payments = $this->paymentService->getWorkerPayments(auth()->user(), $request->all());

        return Inertia::render('worker/payments/index', [
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

        return Inertia::render('worker/payments/show', [
            'payment' => $paymentDetails,
        ]);
    }

    /**
     * Request a payment.
     */
    public function request(RequestPaymentRequest $request): RedirectResponse
    {
        $payment = $this->paymentService->requestPayment(auth()->user(), $request->validated());

        return redirect()->route('worker.payments.show', $payment)
            ->with('success', 'Payment request submitted successfully.');
    }
}
