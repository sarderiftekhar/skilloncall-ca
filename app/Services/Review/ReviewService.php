<?php

namespace App\Services\Review;

use App\Models\Review;
use App\Models\Application;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    /**
     * Check if a user can leave a review for another user based on a completed application.
     */
    public function canLeaveReview(User $reviewer, User $reviewee, Application $application): bool
    {
        // Application must be completed
        if (!$application->isCompleted()) {
            return false;
        }

        // Reviewer and reviewee must be different
        if ($reviewer->id === $reviewee->id) {
            return false;
        }

        // Reviewer must be part of the application (either employer or employee)
        $isEmployer = $application->job->employer_id === $reviewer->id;
        $isEmployee = $application->employee_id === $reviewer->id;

        if (!$isEmployer && !$isEmployee) {
            return false;
        }

        // Reviewee must be the other party in the application
        if ($isEmployer && $application->employee_id !== $reviewee->id) {
            return false;
        }

        if ($isEmployee && $application->job->employer_id !== $reviewee->id) {
            return false;
        }

        // Check if review already exists for this application
        $existingReview = Review::where('application_id', $application->id)
            ->where('reviewer_id', $reviewer->id)
            ->where('reviewee_id', $reviewee->id)
            ->first();

        return $existingReview === null;
    }

    /**
     * Create a new review.
     */
    public function createReview(array $data, Application $application): Review
    {
        $reviewer = auth()->user();
        $reviewee = User::findOrFail($data['reviewee_id']);

        // Validate eligibility
        if (!$this->canLeaveReview($reviewer, $reviewee, $application)) {
            throw new \Exception('You are not eligible to leave a review for this user.');
        }

        // Determine review type
        $type = $reviewer->isEmployer() 
            ? 'employer_to_employee' 
            : 'employee_to_employer';

        return DB::transaction(function () use ($data, $application, $reviewer, $reviewee, $type) {
            return Review::create([
                'job_id' => $application->job_id,
                'application_id' => $application->id,
                'reviewer_id' => $reviewer->id,
                'reviewee_id' => $reviewee->id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
                'type' => $type,
            ]);
        });
    }

    /**
     * Update an existing review.
     */
    public function updateReview(Review $review, array $data): Review
    {
        // Only the reviewer can update their review
        if ($review->reviewer_id !== auth()->id()) {
            throw new \Exception('You can only update your own reviews.');
        }

        // Check if review is still editable
        if (!$review->isEditable()) {
            throw new \Exception('This review can no longer be edited.');
        }

        return DB::transaction(function () use ($review, $data) {
            $review->update([
                'rating' => $data['rating'] ?? $review->rating,
                'comment' => $data['comment'] ?? $review->comment,
            ]);

            return $review->fresh();
        });
    }

    /**
     * Delete a review.
     */
    public function deleteReview(Review $review): bool
    {
        // Only the reviewer can delete their review
        if ($review->reviewer_id !== auth()->id()) {
            throw new \Exception('You can only delete your own reviews.');
        }

        return DB::transaction(function () use ($review) {
            return $review->delete();
        });
    }

    /**
     * Get all reviews for a user with optional filters.
     */
    public function getReviewsForUser(User $user, array $filters = []): Collection
    {
        $query = Review::where('reviewee_id', $user->id)
            ->with(['reviewer', 'job', 'application']);

        // Filter by type
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Filter by rating
        if (!empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        // Filter by date range
        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->latest()->get();
    }

    /**
     * Get average rating for a user.
     */
    public function getAverageRating(User $user): float
    {
        return $user->getAverageRating();
    }

    /**
     * Get review statistics for a user.
     */
    public function getReviewStats(User $user): array
    {
        return $user->getReviewStats();
    }

    /**
     * Check if user can review a specific application.
     */
    public function canReviewApplication(User $user, Application $application): array
    {
        $canReview = false;
        $reviewee = null;
        $existingReview = null;

        if ($application->isCompleted()) {
            if ($user->isEmployer() && $application->job->employer_id === $user->id) {
                // Employer reviewing employee
                $reviewee = $application->employee;
                $canReview = $this->canLeaveReview($user, $reviewee, $application);
            } elseif ($user->isEmployee() && $application->employee_id === $user->id) {
                // Employee reviewing employer
                $reviewee = $application->job->employer;
                $canReview = $this->canLeaveReview($user, $reviewee, $application);
            }

            // Check for existing review
            if ($reviewee) {
                $existingReview = Review::where('application_id', $application->id)
                    ->where('reviewer_id', $user->id)
                    ->where('reviewee_id', $reviewee->id)
                    ->first();
            }
        }

        return [
            'can_review' => $canReview,
            'reviewee' => $reviewee,
            'existing_review' => $existingReview,
        ];
    }
}

