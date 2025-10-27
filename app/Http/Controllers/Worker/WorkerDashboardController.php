<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Services\Worker\WorkerDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerDashboardController extends Controller
{
    public function __construct(
        protected WorkerDashboardService $dashboardService
    ) {}

    /**
     * Display the worker dashboard.
     */
    public function index(Request $request): Response
    {
        $dashboardData = $this->dashboardService->getDashboardData(auth()->user());

        return Inertia::render('worker/dashboard', [
            'stats' => $dashboardData['stats'],
            'recentApplications' => $dashboardData['recentApplications'],
            'recommendedJobs' => $dashboardData['recommendedJobs'],
            'activeJobs' => $dashboardData['activeJobs'],
            'earnings' => $dashboardData['earnings'],
        ]);
    }
}
