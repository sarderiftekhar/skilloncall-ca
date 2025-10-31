<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEmployer() || $user->isEmployee();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Application $application): bool
    {
        // Admins can view all applications
        if ($user->isAdmin()) {
            return true;
        }

        // Employees can view their own applications
        if ($user->isEmployee() && $application->employee_id === $user->id) {
            return true;
        }

        // Employers can view applications for their jobs
        if ($user->isEmployer() && $application->job->employer_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEmployee();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Application $application): bool
    {
        // Admins can update any application
        if ($user->isAdmin()) {
            return true;
        }

        // Employees can update their own applications (withdraw, etc.)
        if ($user->isEmployee() && $application->employee_id === $user->id) {
            return true;
        }

        // Employers can update applications for their jobs (accept/reject)
        if ($user->isEmployer() && $application->job->employer_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Application $application): bool
    {
        // Admins can delete any application
        if ($user->isAdmin()) {
            return true;
        }

        // Employees can delete their own applications
        return $user->isEmployee() && $application->employee_id === $user->id;
    }
}
