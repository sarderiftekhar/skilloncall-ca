<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerJobController extends Controller
{
    /**
     * Display a listing of available jobs.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('worker/find-jobs');
    }

    /**
     * Display the specified job.
     */
    public function show(Job $job): Response
    {
        return Inertia::render('worker/jobs/show', [
            'job' => $job,
        ]);
    }

    /**
     * Apply for the specified job.
     */
    public function apply(Request $request, Job $job): RedirectResponse
    {
        // Handle job application
        return redirect()->back()
            ->with('success', 'Application submitted successfully.');
    }

    /**
     * Search for jobs.
     */
    public function search(Request $request): Response
    {
        return Inertia::render('worker/find-jobs');
    }
}
