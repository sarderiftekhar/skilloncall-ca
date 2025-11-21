<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\Admin\AdminPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPaymentController extends Controller
{
    public function __construct(
        protected AdminPaymentService $paymentService
    ) {}

    /**
     * Display a listing of payments.
     */
    public function index(Request $request): Response
    {
        $payments = $this->paymentService->getPayments($request->all());
        $financialSummary = $this->paymentService->getFinancialSummary();

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'type']),
            'financialSummary' => $financialSummary,
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment): Response
    {
        $paymentDetails = $this->paymentService->getPaymentDetails($payment);

        return Inertia::render('admin/payments/show', [
            'payment' => $paymentDetails['payment'],
            'timeline' => $paymentDetails['timeline'],
        ]);
    }

    /**
     * Process the specified payment.
     */
    public function process(Payment $payment): RedirectResponse
    {
        $this->paymentService->processPayment($payment);

        return redirect()->back()
            ->with('success', 'Payment processed successfully.');
    }
}
