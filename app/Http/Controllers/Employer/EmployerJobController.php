<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\StoreJobRequest;
use App\Http\Requests\Employer\UpdateJobRequest;
use App\Models\Job;
use App\Services\Employer\EmployerJobService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerJobController extends Controller
{
    public function __construct(
        protected EmployerJobService $jobService
    ) {}

    /**
     * Display a listing of employer's jobs.
     */
    public function index(Request $request): Response
    {
        $jobs = $this->jobService->getEmployerJobs(auth()->user(), $request->all());

        return Inertia::render('employer/jobs/index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new job.
     */
    public function create(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        
        // Check if profile is complete, redirect to onboarding if not
        $employerProfile = \App\Models\EmployerProfile::where('user_id', $user->id)->first();
        
        if (!$employerProfile || !$employerProfile->is_profile_complete) {
            return redirect()->route('employer.onboarding.index');
        }

        $categories = $this->jobService->getJobCategories();

        return Inertia::render('employer/jobs/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created job in storage.
     */
    public function store(StoreJobRequest $request): RedirectResponse
    {
        $job = $this->jobService->createJob(auth()->user(), $request->validated());

        return redirect()->route('employer.jobs.show', $job)
            ->with('success', 'Job created successfully.');
    }

    /**
     * Display the specified job.
     */
    public function show(Job $job): Response
    {
        $this->authorize('view', $job);
        
        $jobDetails = $this->jobService->getJobDetails($job);

        return Inertia::render('employer/jobs/show', [
            'job' => $jobDetails,
        ]);
    }

    /**
     * Show the form for editing the specified job.
     */
    public function edit(Job $job): Response
    {
        $this->authorize('update', $job);
        
        $categories = $this->jobService->getJobCategories();

        return Inertia::render('employer/jobs/edit', [
            'job' => $job,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified job in storage.
     */
    public function update(UpdateJobRequest $request, Job $job): RedirectResponse
    {
        $this->authorize('update', $job);
        
        $this->jobService->updateJob($job, $request->validated());

        return redirect()->route('employer.jobs.show', $job)
            ->with('success', 'Job updated successfully.');
    }

    /**
     * Remove the specified job from storage.
     */
    public function destroy(Job $job): RedirectResponse
    {
        $this->authorize('delete', $job);
        
        $this->jobService->deleteJob($job);

        return redirect()->route('employer.jobs.index')
            ->with('success', 'Job deleted successfully.');
    }

    /**
     * Publish the specified job.
     */
    public function publish(Job $job): RedirectResponse
    {
        $this->authorize('update', $job);
        
        $this->jobService->publishJob($job);

        return redirect()->back()
            ->with('success', 'Job published successfully.');
    }

    /**
     * Unpublish the specified job.
     */
    public function unpublish(Job $job): RedirectResponse
    {
        $this->authorize('update', $job);
        
        $this->jobService->unpublishJob($job);

        return redirect()->back()
            ->with('success', 'Job unpublished successfully.');
    }
}
