<?php

namespace App\Services\Admin;

use App\Events\Admin\JobApproved;
use App\Events\Admin\JobRejected;
use App\Events\Admin\JobDeleted;
use App\Models\Job;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminJobService
{
    /**
     * Get paginated jobs with filters.
     */
    public function getJobs(array $filters = []): LengthAwarePaginator
    {
        $query = Job::with(['employer:id,name']);

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
     * Get detailed job information.
     */
    public function getJobDetails(Job $job): array
    {
        $job->load(['employer', 'applications.employee']);

        return [
            'job' => $job->toArray(),
            'stats' => $this->getJobStats($job),
        ];
    }

    /**
     * Approve a job.
     */
    public function approveJob(Job $job): Job
    {
        $job->update([
            'status' => 'active',
            'published_at' => now(),
        ]);

        event(new JobApproved($job));

        return $job;
    }

    /**
     * Reject a job.
     */
    public function rejectJob(Job $job, ?string $reason = null): Job
    {
        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        event(new JobRejected($job, $reason));

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
        ];
    }
}
