<?php

namespace App\Services\Employer;

use App\Events\Employer\JobCreated;
use App\Events\Employer\JobUpdated;
use App\Events\Employer\JobDeleted;
use App\Events\Employer\JobPublished;
use App\Events\Employer\JobUnpublished;
use App\Models\Job;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployerJobService
{
    /**
     * Get employer's jobs with filters.
     */
    public function getEmployerJobs(User $employer, array $filters = []): LengthAwarePaginator
    {
        $query = $employer->jobs()->withCount('applications');

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /**
     * Get job categories.
     */
    public function getJobCategories(): array
    {
        return [
            'automotive' => 'Automotive',
            'cleaning_maintenance' => 'Cleaning & Maintenance',
            'construction' => 'Construction',
            'customer_service' => 'Customer Service',
            'data_entry' => 'Data Entry',
            'design' => 'Design',
            'event_services' => 'Event Services',
            'food_service' => 'Food Service',
            'handyman_services' => 'Handyman Services',
            'landscaping_outdoors' => 'Landscaping & Outdoors',
            'marketing' => 'Marketing',
            'mobile_development' => 'Mobile Development',
            'personal_care' => 'Personal Care',
            'personal_services' => 'Personal Services',
            'retail' => 'Retail',
            'seasonal_work' => 'Seasonal Work',
            'technology' => 'Technology',
            'trades_maintenance' => 'Trades & Maintenance',
            'transportation_delivery' => 'Transportation & Delivery',
            'web_development' => 'Web Development',
            'writing' => 'Writing & Content',
            'other' => 'Other',
        ];
    }

    /**
     * Create a new job.
     */
    public function createJob(User $employer, array $data): Job
    {
        $data['employer_id'] = $employer->id;
        $data['status'] = 'draft';

        $job = Job::create($data);

        event(new JobCreated($job));

        return $job;
    }

    /**
     * Get detailed job information.
     */
    public function getJobDetails(Job $job): array
    {
        $job->load(['applications.employee', 'employer']);

        return [
            'job' => $job->toArray(),
            'stats' => $this->getJobStats($job),
            'recentApplications' => $job->applications()
                ->with('employee:id,name,email')
                ->latest()
                ->take(5)
                ->get()
                ->toArray(),
        ];
    }

    /**
     * Update a job.
     */
    public function updateJob(Job $job, array $data): Job
    {
        $job->update($data);

        event(new JobUpdated($job));

        return $job;
    }

    /**
     * Delete a job.
     */
    public function deleteJob(Job $job): bool
    {
        $deleted = $job->delete();

        if ($deleted) {
            event(new JobDeleted($job));
        }

        return $deleted;
    }

    /**
     * Publish a job.
     */
    public function publishJob(Job $job): Job
    {
        $job->update([
            'status' => 'active',
            'published_at' => now(),
        ]);

        event(new JobPublished($job));

        return $job;
    }

    /**
     * Unpublish a job.
     */
    public function unpublishJob(Job $job): Job
    {
        $job->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        event(new JobUnpublished($job));

        return $job;
    }

    /**
     * Get job statistics.
     */
    private function getJobStats(Job $job): array
    {
        return [
            'totalApplications' => $job->applications()->count(),
            'pendingApplications' => $job->applications()->where('status', 'pending')->count(),
            'acceptedApplications' => $job->applications()->where('status', 'accepted')->count(),
            'rejectedApplications' => $job->applications()->where('status', 'rejected')->count(),
            'viewsCount' => $job->views_count ?? 0,
            'averageRating' => $job->reviews()->avg('rating') ?? 0,
            'totalReviews' => $job->reviews()->count(),
        ];
    }
}
