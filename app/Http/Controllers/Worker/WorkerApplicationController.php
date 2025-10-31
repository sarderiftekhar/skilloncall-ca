<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Application;
// use App\Services\Worker\WorkerApplicationService; // Temporarily commented out
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerApplicationController extends Controller
{
    // public function __construct(
    //     protected WorkerApplicationService $applicationService
    // ) {} // Temporarily commented out

    /**
     * Display a listing of worker's applications.
     * Temporarily showing coming soon page.
     */
    public function index(Request $request): Response
    {
        // Temporarily return coming soon page
        return Inertia::render('worker/applications/coming-soon');
    }

    /**
     * Display the specified application.
     * Temporarily showing coming soon page.
     */
    public function show(Application $application): Response
    {
        // Temporarily return coming soon page
        return Inertia::render('worker/applications/coming-soon');
    }

    /**
     * Withdraw the specified application.
     * Temporarily disabled.
     */
    public function withdraw(Application $application): RedirectResponse
    {
        return redirect()->back()
            ->with('info', 'This feature is coming soon.');
    }

    /**
     * Mark the specified application as completed.
     * Temporarily disabled.
     */
    public function complete(Application $application): RedirectResponse
    {
        return redirect()->back()
            ->with('info', 'This feature is coming soon.');
    }
}
