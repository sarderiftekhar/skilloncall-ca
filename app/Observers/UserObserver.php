<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        Log::info('New user created', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        // Send welcome email based on role
        $this->sendWelcomeEmail($user);
        
        // Create role-specific profile data
        $this->createRoleProfile($user);
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        // Log role changes
        if ($user->isDirty('role')) {
            Log::info('User role changed', [
                'user_id' => $user->id,
                'old_role' => $user->getOriginal('role'),
                'new_role' => $user->role,
            ]);
        }

        // Log email verification
        if ($user->isDirty('email_verified_at') && $user->email_verified_at) {
            Log::info('User email verified', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        Log::info('User deleted', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        // Clean up related data based on role
        $this->cleanupUserData($user);
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        Log::info('User restored', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        Log::info('User force deleted', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * Send welcome email based on user role.
     */
    private function sendWelcomeEmail(User $user): void
    {
        // In a real application, you would send different welcome emails
        // based on the user's role using Mail facades or queued jobs
        
        // Example:
        // match ($user->role) {
        //     'admin' => Mail::to($user)->queue(new AdminWelcomeEmail($user)),
        //     'employer' => Mail::to($user)->queue(new EmployerWelcomeEmail($user)),
        //     'worker' => Mail::to($user)->queue(new WorkerWelcomeEmail($user)),
        // };
    }

    /**
     * Create role-specific profile data.
     */
    private function createRoleProfile(User $user): void
    {
        match ($user->role) {
            'employer' => $this->createEmployerProfile($user),
            'worker' => $this->createWorkerProfile($user),
            default => null,
        };
    }

    /**
     * Create employer-specific profile data.
     */
    private function createEmployerProfile(User $user): void
    {
        // Create employer profile record
        // $user->employerProfile()->create([
        //     'company_name' => null,
        //     'company_size' => null,
        //     'industry' => null,
        //     'website' => null,
        // ]);
    }

    /**
     * Create worker-specific profile data.
     */
    private function createWorkerProfile(User $user): void
    {
        // Create worker profile record
        // $user->workerProfile()->create([
        //     'hourly_rate' => null,
        //     'availability' => 'full_time',
        //     'experience_level' => 'beginner',
        //     'bio' => null,
        // ]);
    }

    /**
     * Clean up user-related data.
     */
    private function cleanupUserData(User $user): void
    {
        match ($user->role) {
            'employer' => $this->cleanupEmployerData($user),
            'worker' => $this->cleanupWorkerData($user),
            'admin' => $this->cleanupAdminData($user),
            default => null,
        };
    }

    /**
     * Clean up employer-specific data.
     */
    private function cleanupEmployerData(User $user): void
    {
        // Cancel active jobs, process pending payments, etc.
        // $user->jobs()->update(['status' => 'cancelled']);
        // $user->sentPayments()->where('status', 'pending')->update(['status' => 'cancelled']);
    }

    /**
     * Clean up worker-specific data.
     */
    private function cleanupWorkerData(User $user): void
    {
        // Withdraw pending applications, process final payments, etc.
        // $user->applications()->where('status', 'pending')->update(['status' => 'withdrawn']);
    }

    /**
     * Clean up admin-specific data.
     */
    private function cleanupAdminData(User $user): void
    {
        // Log admin deletion for audit purposes
        Log::warning('Admin user deleted', [
            'admin_id' => $user->id,
            'admin_email' => $user->email,
            'deleted_by' => auth()->id(),
        ]);
    }
}
