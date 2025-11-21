<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Services\Admin\AdminJobService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminJobController extends Controller
{
    public function __construct(
        protected AdminJobService $jobService
    ) {}

    /**
     * Display a listing of jobs.
     */
    public function index(Request $request): Response
    {
        $jobs = $this->jobService->getJobs($request->all());

        return Inertia::render('admin/jobs/index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    /**
     * Display the specified job.
     */
    public function show(Job $job): Response
    {
        $jobDetails = $this->jobService->getJobDetails($job);

        return Inertia::render('admin/jobs/show', [
            'job' => $jobDetails['job'],
            'stats' => $jobDetails['stats'],
        ]);
    }

    /**
     * Approve the specified job.
     */
    public function approve(Job $job): RedirectResponse
    {
        $this->jobService->approveJob($job);

        return redirect()->back()
            ->with('success', 'Job approved successfully.');
    }

    /**
     * Reject the specified job.
     */
    public function reject(Request $request, Job $job): RedirectResponse
    {
        $this->jobService->rejectJob($job, $request->input('reason'));

        return redirect()->back()
            ->with('success', 'Job rejected successfully.');
    }

    /**
     * Remove the specified job from storage.
     */
    public function destroy(Job $job): RedirectResponse
    {
        $this->jobService->deleteJob($job);

        return redirect()->route('admin.jobs.index')
            ->with('success', 'Job deleted successfully.');
    }
}
