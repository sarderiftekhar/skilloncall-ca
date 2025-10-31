<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Services\Employer\EmployerDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerDashboardController extends Controller
{
    public function __construct(
        protected EmployerDashboardService $dashboardService
    ) {}

    /**
     * Display the employer dashboard.
     */
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        
        // Check if profile is complete, redirect to onboarding if not
        $employerProfile = \App\Models\EmployerProfile::where('user_id', $user->id)->first();
        
        if (!$employerProfile || !$employerProfile->is_profile_complete) {
            return redirect()->route('employer.onboarding.index');
        }

        $dashboardData = $this->dashboardService->getDashboardData($user);

        return Inertia::render('employer/dashboard', [
            'stats' => $dashboardData['stats'],
            'recentJobs' => $dashboardData['recentJobs'],
            'recentApplications' => $dashboardData['recentApplications'],
            'activeWorkers' => $dashboardData['activeWorkers'],
            'chartData' => $dashboardData['chartData'],
        ]);
    }
}
