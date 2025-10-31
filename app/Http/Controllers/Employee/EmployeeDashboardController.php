<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Services\Employee\EmployeeDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeDashboardController extends Controller
{
    public function __construct(
        protected EmployeeDashboardService $dashboardService
    ) {}

    /**
     * Display the employee dashboard.
     */
    public function index(Request $request): Response
    {
        $dashboardData = $this->dashboardService->getDashboardData(auth()->user());

        return Inertia::render('employee/dashboard', [
            'stats' => $dashboardData['stats'],
            'recentApplications' => $dashboardData['recentApplications'],
            'recommendedJobs' => $dashboardData['recommendedJobs'],
            'activeJobs' => $dashboardData['activeJobs'],
            'earnings' => $dashboardData['earnings'],
        ]);
    }
}

