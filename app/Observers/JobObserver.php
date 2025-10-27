<?php

namespace App\Observers;

use App\Models\Job;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class JobObserver
{
    /**
     * Handle the Job "creating" event.
     */
    public function creating(Job $job): void
    {
        // Set default values
        $job->status = $job->status ?? 'draft';
        $job->views_count = 0;
    }

    /**
     * Handle the Job "created" event.
     */
    public function created(Job $job): void
    {
        Log::info('New job created', [
            'job_id' => $job->id,
            'employer_id' => $job->employer_id,
            'title' => $job->title,
            'status' => $job->status,
        ]);

        // Clear relevant caches
        $this->clearJobCaches();
        
        // Notify admin if job approval is required
        if ($this->requiresApproval($job)) {
            $this->notifyAdminForApproval($job);
        }
    }

    /**
     * Handle the Job "updated" event.
     */
    public function updated(Job $job): void
    {
        // Log status changes
        if ($job->isDirty('status')) {
            Log::info('Job status changed', [
                'job_id' => $job->id,
                'old_status' => $job->getOriginal('status'),
                'new_status' => $job->status,
                'employer_id' => $job->employer_id,
            ]);

            // Handle status-specific actions
            $this->handleStatusChange($job);
        }

        // Clear caches when job is updated
        $this->clearJobCaches();
    }

    /**
     * Handle the Job "deleted" event.
     */
    public function deleted(Job $job): void
    {
        Log::info('Job deleted', [
            'job_id' => $job->id,
            'employer_id' => $job->employer_id,
            'title' => $job->title,
        ]);

        // Handle pending applications
        $this->handleJobDeletion($job);
        
        // Clear caches
        $this->clearJobCaches();
    }

    /**
     * Handle the Job "restored" event.
     */
    public function restored(Job $job): void
    {
        Log::info('Job restored', [
            'job_id' => $job->id,
            'employer_id' => $job->employer_id,
        ]);

        $this->clearJobCaches();
    }

    /**
     * Handle the Job "force deleted" event.
     */
    public function forceDeleted(Job $job): void
    {
        Log::info('Job force deleted', [
            'job_id' => $job->id,
            'employer_id' => $job->employer_id,
        ]);

        $this->clearJobCaches();
    }

    /**
     * Check if job requires admin approval.
     */
    private function requiresApproval(Job $job): bool
    {
        // Check system settings for job approval requirement
        return config('app.job_approval_required', true);
    }

    /**
     * Notify admin for job approval.
     */
    private function notifyAdminForApproval(Job $job): void
    {
        // In a real application, send notification to admins
        // Notification::send(User::where('role', 'admin')->get(), new JobRequiresApproval($job));
    }

    /**
     * Handle job status changes.
     */
    private function handleStatusChange(Job $job): void
    {
        match ($job->status) {
            'active' => $this->handleJobActivation($job),
            'completed' => $this->handleJobCompletion($job),
            'cancelled' => $this->handleJobCancellation($job),
            'rejected' => $this->handleJobRejection($job),
            default => null,
        };
    }

    /**
     * Handle job activation.
     */
    private function handleJobActivation(Job $job): void
    {
        // Notify workers about new job opportunity
        // Notification::send(User::where('role', 'worker')->get(), new NewJobAvailable($job));
        
        // Update search indexes
        // $job->searchable();
    }

    /**
     * Handle job completion.
     */
    private function handleJobCompletion(Job $job): void
    {
        // Process final payments, send completion notifications
        // $this->processFinalPayments($job);
        // $this->sendCompletionNotifications($job);
    }

    /**
     * Handle job cancellation.
     */
    private function handleJobCancellation(Job $job): void
    {
        // Cancel pending applications, refund payments if needed
        $job->applications()
            ->where('status', 'pending')
            ->update(['status' => 'cancelled']);
    }

    /**
     * Handle job rejection by admin.
     */
    private function handleJobRejection(Job $job): void
    {
        // Notify employer about rejection
        // $job->employer->notify(new JobRejected($job));
    }

    /**
     * Handle job deletion.
     */
    private function handleJobDeletion(Job $job): void
    {
        // Update applications status
        $job->applications()
            ->whereIn('status', ['pending', 'accepted'])
            ->update(['status' => 'cancelled']);

        // Notify applicants
        // $job->applications->each(function ($application) {
        //     $application->worker->notify(new JobDeleted($application->job));
        // });
    }

    /**
     * Clear job-related caches.
     */
    private function clearJobCaches(): void
    {
        // Only use tags if cache store supports them
        if (Cache::getStore() instanceof \Illuminate\Contracts\Cache\TaggedCache) {
            Cache::tags(['jobs'])->flush();
        } else {
            // Fallback for cache stores that don't support tagging
            Cache::forget('featured_jobs');
            Cache::forget('recent_jobs');
            Cache::forget('job_categories_count');
            // Clear other job-related cache keys as needed
            Cache::forget('jobs_list');
            Cache::forget('active_jobs_count');
        }
    }
}
