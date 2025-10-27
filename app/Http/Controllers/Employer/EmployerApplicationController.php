<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Services\Employer\EmployerApplicationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerApplicationController extends Controller
{
    public function __construct(
        protected EmployerApplicationService $applicationService
    ) {}

    /**
     * Display a listing of applications.
     */
    public function index(Request $request): Response
    {
        $applications = $this->applicationService->getEmployerApplications(auth()->user(), $request->all());

        return Inertia::render('employer/applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'job']),
        ]);
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application): Response
    {
        $this->authorize('view', $application);
        
        $applicationDetails = $this->applicationService->getApplicationDetails($application);

        return Inertia::render('employer/applications/show', [
            'application' => $applicationDetails,
        ]);
    }

    /**
     * Accept the specified application.
     */
    public function accept(Application $application): RedirectResponse
    {
        $this->authorize('update', $application);
        
        $this->applicationService->acceptApplication($application);

        return redirect()->back()
            ->with('success', 'Application accepted successfully.');
    }

    /**
     * Reject the specified application.
     */
    public function reject(Request $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);
        
        $this->applicationService->rejectApplication($application, $request->input('reason'));

        return redirect()->back()
            ->with('success', 'Application rejected successfully.');
    }
}
