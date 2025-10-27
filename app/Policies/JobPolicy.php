<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view jobs
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Job $job): bool
    {
        // Admins can view all jobs
        if ($user->isAdmin()) {
            return true;
        }

        // Employers can view their own jobs
        if ($user->isEmployer() && $job->employer_id === $user->id) {
            return true;
        }

        // Workers can view active/published jobs
        if ($user->isWorker() && $job->status === 'active') {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEmployer();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Job $job): bool
    {
        // Admins can update any job
        if ($user->isAdmin()) {
            return true;
        }

        // Employers can update their own jobs
        return $user->isEmployer() && $job->employer_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Job $job): bool
    {
        // Admins can delete any job
        if ($user->isAdmin()) {
            return true;
        }

        // Employers can delete their own jobs
        return $user->isEmployer() && $job->employer_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Job $job): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Job $job): bool
    {
        return $user->isAdmin();
    }
}
