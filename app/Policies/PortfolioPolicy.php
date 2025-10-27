<?php

namespace App\Policies;

use App\Models\Portfolio;
use App\Models\User;

class PortfolioPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All users can view portfolios
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Portfolio $portfolio): bool
    {
        return true; // All users can view individual portfolios
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isWorker();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Portfolio $portfolio): bool
    {
        // Workers can update their own portfolio items
        return $user->isWorker() && $portfolio->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Portfolio $portfolio): bool
    {
        // Admins can delete any portfolio item
        if ($user->isAdmin()) {
            return true;
        }

        // Workers can delete their own portfolio items
        return $user->isWorker() && $portfolio->user_id === $user->id;
    }
}
