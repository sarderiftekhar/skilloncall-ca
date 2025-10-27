<?php

namespace App\Observers;

use App\Models\Application;
use Illuminate\Support\Facades\Log;

class ApplicationObserver
{
    /**
     * Handle the Application "created" event.
     */
    public function created(Application $application): void
    {
        Log::info('New application submitted', [
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'worker_id' => $application->worker_id,
        ]);

        // Notify employer about new application
        $this->notifyEmployer($application);
        
        // Update job application count
        $this->updateJobStats($application->job);
    }

    /**
     * Handle the Application "updated" event.
     */
    public function updated(Application $application): void
    {
        // Log status changes
        if ($application->isDirty('status')) {
            Log::info('Application status changed', [
                'application_id' => $application->id,
                'job_id' => $application->job_id,
                'worker_id' => $application->worker_id,
                'old_status' => $application->getOriginal('status'),
                'new_status' => $application->status,
            ]);

            // Handle status-specific actions
            $this->handleStatusChange($application);
        }
    }

    /**
     * Handle the Application "deleted" event.
     */
    public function deleted(Application $application): void
    {
        Log::info('Application deleted', [
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'worker_id' => $application->worker_id,
        ]);

        // Update job stats
        if ($application->job) {
            $this->updateJobStats($application->job);
        }
    }

    /**
     * Notify employer about new application.
     */
    private function notifyEmployer(Application $application): void
    {
        // In a real application, send notification to employer
        // $application->job->employer->notify(new NewApplicationReceived($application));
    }

    /**
     * Handle application status changes.
     */
    private function handleStatusChange(Application $application): void
    {
        match ($application->status) {
            'accepted' => $this->handleApplicationAcceptance($application),
            'rejected' => $this->handleApplicationRejection($application),
            'withdrawn' => $this->handleApplicationWithdrawal($application),
            'completed' => $this->handleApplicationCompletion($application),
            default => null,
        };
    }

    /**
     * Handle application acceptance.
     */
    private function handleApplicationAcceptance(Application $application): void
    {
        // Notify worker about acceptance
        // $application->worker->notify(new ApplicationAccepted($application));
        
        // Auto-reject other pending applications for the same job if configured
        if ($this->shouldAutoRejectOthers($application)) {
            $application->job->applications()
                ->where('id', '!=', $application->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected']);
        }
        
        // Create initial payment record if needed
        $this->createInitialPayment($application);
    }

    /**
     * Handle application rejection.
     */
    private function handleApplicationRejection(Application $application): void
    {
        // Notify worker about rejection
        // $application->worker->notify(new ApplicationRejected($application));
    }

    /**
     * Handle application withdrawal.
     */
    private function handleApplicationWithdrawal(Application $application): void
    {
        // Notify employer about withdrawal
        // $application->job->employer->notify(new ApplicationWithdrawn($application));
    }

    /**
     * Handle application completion.
     */
    private function handleApplicationCompletion(Application $application): void
    {
        // Trigger payment processing
        $this->processJobPayment($application);
        
        // Request reviews from both parties
        $this->requestReviews($application);
        
        // Update job status if all applications are completed
        $this->checkJobCompletion($application->job);
    }

    /**
     * Update job statistics.
     */
    private function updateJobStats($job): void
    {
        if (!$job) return;

        $job->update([
            'applications_count' => $job->applications()->count(),
        ]);
    }

    /**
     * Check if other applications should be auto-rejected.
     */
    private function shouldAutoRejectOthers(Application $application): bool
    {
        // Check job settings or system configuration
        return $application->job->auto_reject_others ?? false;
    }

    /**
     * Create initial payment record.
     */
    private function createInitialPayment(Application $application): void
    {
        // Create payment record for the job
        // Payment::create([
        //     'job_id' => $application->job_id,
        //     'payer_id' => $application->job->employer_id,
        //     'payee_id' => $application->worker_id,
        //     'amount' => $application->job->budget,
        //     'status' => 'pending',
        //     'type' => 'job_payment',
        // ]);
    }

    /**
     * Process job payment.
     */
    private function processJobPayment(Application $application): void
    {
        // Find and process the payment for this job
        // $payment = Payment::where('job_id', $application->job_id)
        //     ->where('payee_id', $application->worker_id)
        //     ->where('status', 'pending')
        //     ->first();
        // 
        // if ($payment) {
        //     $payment->update(['status' => 'ready_for_processing']);
        //     ProcessPayment::dispatch($payment);
        // }
    }

    /**
     * Request reviews from both parties.
     */
    private function requestReviews(Application $application): void
    {
        // Send review requests
        // $application->worker->notify(new ReviewEmployerRequest($application));
        // $application->job->employer->notify(new ReviewWorkerRequest($application));
    }

    /**
     * Check if job should be marked as completed.
     */
    private function checkJobCompletion($job): void
    {
        if (!$job) return;

        $hasActiveApplications = $job->applications()
            ->whereIn('status', ['accepted', 'pending'])
            ->exists();

        if (!$hasActiveApplications && $job->status === 'active') {
            $job->update(['status' => 'completed']);
        }
    }
}
