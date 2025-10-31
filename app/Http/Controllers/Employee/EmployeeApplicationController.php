<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Services\Employee\EmployeeApplicationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeApplicationController extends Controller
{
    public function __construct(
        protected EmployeeApplicationService $applicationService
    ) {}

    /**
     * Display a listing of employee's applications.
     */
    public function index(Request $request): Response
    {
        $applications = $this->applicationService->getEmployeeApplications(auth()->user(), $request->all());

        return Inertia::render('employee/applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application): Response
    {
        $this->authorize('view', $application);
        
        $applicationDetails = $this->applicationService->getApplicationDetails($application);

        return Inertia::render('employee/applications/show', [
            'application' => $applicationDetails,
        ]);
    }

    /**
     * Withdraw the specified application.
     */
    public function withdraw(Application $application): RedirectResponse
    {
        $this->authorize('update', $application);
        
        $this->applicationService->withdrawApplication($application);

        return redirect()->back()
            ->with('success', 'Application withdrawn successfully.');
    }

    /**
     * Mark the specified application as completed.
     */
    public function complete(Application $application): RedirectResponse
    {
        $this->authorize('update', $application);
        
        $this->applicationService->completeApplication($application);

        return redirect()->back()
            ->with('success', 'Job marked as completed successfully.');
    }
}

