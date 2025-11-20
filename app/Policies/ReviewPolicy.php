<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;
use App\Models\Application;
use Illuminate\Auth\Access\Response;

class ReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Anyone can view reviews (they're public)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Review $review): bool
    {
        // Reviews are public - anyone can view them
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?Application $application = null): bool
    {
        // User must be employer or employee
        if (!$user->isEmployer() && !$user->isEmployee()) {
            return false;
        }

        // If application is provided, check if user is part of it
        if ($application) {
            $isPartOfApplication = 
                ($user->isEmployer() && $application->job->employer_id === $user->id) ||
                ($user->isEmployee() && $application->employee_id === $user->id);

            if (!$isPartOfApplication) {
                return false;
            }

            // Application must be completed
            return $application->isCompleted();
        }

        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Review $review): bool
    {
        // Only the reviewer can update their own review
        if ($review->reviewer_id !== $user->id) {
            return false;
        }

        // Check if review is still editable (within 7 days)
        return $review->isEditable();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Review $review): bool
    {
        // Only the reviewer can delete their own review
        return $review->reviewer_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Review $review): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Review $review): bool
    {
        // Only admins can permanently delete reviews
        return $user->isAdmin();
    }
}
