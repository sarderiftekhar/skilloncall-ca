<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __construct(
        protected AdminDashboardService $dashboardService
    ) {}

    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $dashboardData = $this->dashboardService->getDashboardData();

        return Inertia::render('admin/dashboard', [
            'stats' => $dashboardData['stats'],
            'recentUsers' => $dashboardData['recentUsers'],
            'recentJobs' => $dashboardData['recentJobs'],
            'recentPayments' => $dashboardData['recentPayments'],
            'chartData' => $dashboardData['chartData'],
        ]);
    }
}
