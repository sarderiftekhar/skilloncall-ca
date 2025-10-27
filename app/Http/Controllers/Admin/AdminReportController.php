<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminReportService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminReportController extends Controller
{
    public function __construct(
        protected AdminReportService $reportService
    ) {}

    /**
     * Display the reports dashboard.
     */
    public function index(): InertiaResponse
    {
        $reportData = $this->reportService->getReportsDashboard();

        return Inertia::render('admin/reports/index', [
            'reportData' => $reportData,
        ]);
    }

    /**
     * Display user reports.
     */
    public function users(Request $request): InertiaResponse
    {
        $userReports = $this->reportService->getUserReports($request->all());

        return Inertia::render('admin/reports/users', [
            'reports' => $userReports,
            'filters' => $request->only(['period', 'role']),
        ]);
    }

    /**
     * Display job reports.
     */
    public function jobs(Request $request): InertiaResponse
    {
        $jobReports = $this->reportService->getJobReports($request->all());

        return Inertia::render('admin/reports/jobs', [
            'reports' => $jobReports,
            'filters' => $request->only(['period', 'category']),
        ]);
    }

    /**
     * Display payment reports.
     */
    public function payments(Request $request): InertiaResponse
    {
        $paymentReports = $this->reportService->getPaymentReports($request->all());

        return Inertia::render('admin/reports/payments', [
            'reports' => $paymentReports,
            'filters' => $request->only(['period', 'type']),
        ]);
    }

    /**
     * Export reports.
     */
    public function export(Request $request, string $type): Response
    {
        $export = $this->reportService->exportReport($type, $request->all());

        return response($export['content'])
            ->header('Content-Type', $export['contentType'])
            ->header('Content-Disposition', 'attachment; filename="' . $export['filename'] . '"');
    }
}
