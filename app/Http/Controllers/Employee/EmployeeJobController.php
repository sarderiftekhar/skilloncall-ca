<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\SavedJob;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeJobController extends Controller
{
    /**
     * Display a listing of available jobs.
     */
    public function index(Request $request): Response
    {
        // Get all active jobs for profession extraction (before filtering)
        $allActiveJobs = Job::query()
            ->active()
            ->published()
            ->get(['title']); // Only need titles for profession extraction

        // Extract professions from all jobs inline
        $professionsCollection = collect();
        $excludeWords = [
            'the', 'for', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'from', 'with', 'by',
            'needed', 'shift', 'service', 'work', 'job', 'position', 'team', 'member', 'day', 
            'night', 'evening', 'evenings', 'morning', 'weekend', 'weekends', 'part', 'time', 
            'full', 'flexible', 'hours', 'daily', 'weekly', 'monthly', 'contract', 'temporary',
            'permanent', 'immediate', 'urgent', 'experienced', 'entry', 'level', 'senior',
            'junior', 'assistant', 'helper', 'specialist', 'coordinator', 'supervisor',
            'manager', 'director', 'lead', 'head'
        ];
        
        foreach ($allActiveJobs as $job) {
            $titleParts = preg_split('/[\s\-\/]+/', strtolower($job->title));
            foreach ($titleParts as $part) {
                $part = trim($part);
                if (strlen($part) > 2 && !in_array($part, $excludeWords)) {
                    $professionsCollection->push(ucfirst($part));
                }
            }
        }
        $allProfessions = $professionsCollection->unique()->sort()->values()->toArray();

        $query = Job::query()
            ->with(['employer:id,name', 'employer.employerProfile:user_id,business_name'])
            ->active()
            ->published()
            ->latest('published_at');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('location', 'like', '%' . $search . '%');
            });
        }

        // Apply profession/category filter
        if ($request->filled('professions')) {
            $professions = is_array($request->professions) ? $request->professions : [$request->professions];
            $query->where(function ($q) use ($professions) {
                foreach ($professions as $profession) {
                    $q->orWhere('title', 'like', '%' . $profession . '%');
                }
            });
        }

        // Apply experience level filter
        if ($request->filled('experience')) {
            $experience = is_array($request->experience) ? $request->experience : [$request->experience];
            $query->whereIn('experience_level', $experience);
        }

        // Apply job type filter (shifts)
        if ($request->filled('shifts')) {
            $shifts = is_array($request->shifts) ? $request->shifts : [$request->shifts];
            $query->whereIn('job_type', $shifts);
        }

        // Apply budget/rate filter
        if ($request->filled('min_rate')) {
            $query->where('budget', '>=', $request->min_rate);
        }
        if ($request->filled('max_rate')) {
            $query->where('budget', '<=', $request->max_rate);
        }

        $jobs = $query->paginate(12)->withQueryString();

        // Transform jobs to use business_name from employer profile, fallback to user name
        $jobs->getCollection()->transform(function ($job) {
            if ($job->employer) {
                $job->employer->name = $job->employer->employerProfile?->business_name ?? $job->employer->name;
            }
            return $job;
        });

        // Get saved job IDs for the current user
        $savedJobIds = SavedJob::where('user_id', Auth::id())->pluck('job_id')->toArray();

        return Inertia::render('employee/find-jobs', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'professions', 'shifts', 'experience', 'min_rate', 'max_rate']),
            'savedJobIds' => $savedJobIds,
            'allProfessions' => $allProfessions,
        ]);
    }

    /**
     * Display the specified job.
     */
    public function show(Job $job): Response
    {
        return Inertia::render('employee/jobs/show', [
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
        return Inertia::render('employee/find-jobs');
    }

    /**
     * Display saved jobs for the employee.
     */
    public function savedJobs(): Response
    {
        $savedJobs = SavedJob::with(['job.employer:id,name', 'job.employer.employerProfile:user_id,business_name'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        // Transform the data to match the expected structure
        $jobsData = [
            'data' => $savedJobs->map(function ($savedJob) {
                $job = $savedJob->job;
                if ($job->employer) {
                    $job->employer->name = $job->employer->employerProfile?->business_name ?? $job->employer->name;
                }
                return $job;
            }),
            'current_page' => $savedJobs->currentPage(),
            'last_page' => $savedJobs->lastPage(),
            'per_page' => $savedJobs->perPage(),
            'total' => $savedJobs->total(),
            'from' => $savedJobs->firstItem(),
            'to' => $savedJobs->lastItem(),
        ];

        return Inertia::render('employee/saved-jobs', [
            'jobs' => $jobsData,
        ]);
    }

    /**
     * Save a job for the employee.
     */
    public function saveJob(Job $job): RedirectResponse
    {
        $userId = Auth::id();

        // Check if job is already saved
        $exists = SavedJob::where('user_id', $userId)
            ->where('job_id', $job->id)
            ->exists();

        if (!$exists) {
            SavedJob::create([
                'user_id' => $userId,
                'job_id' => $job->id,
            ]);
        }

        return redirect()->back()->with('success', 'Job saved successfully!');
    }

    /**
     * Unsave a job for the employee.
     */
    public function unsaveJob(Job $job): RedirectResponse
    {
        SavedJob::where('user_id', Auth::id())
            ->where('job_id', $job->id)
            ->delete();

        return redirect()->back()->with('success', 'Job removed from saved jobs!');
    }
}

