<?php

namespace App\Services\Admin;

use App\Events\Admin\UserCreated;
use App\Events\Admin\UserUpdated;
use App\Events\Admin\UserDeleted;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class AdminUserService
{
    /**
     * Get paginated users with filters.
     */
    public function getUsers(array $filters = []): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($filters['status'] === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        return $query->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /**
     * Create a new user.
     */
    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        
        $user = User::create($data);

        event(new UserCreated($user));

        return $user;
    }

    /**
     * Get detailed user information.
     */
    public function getUserDetails(User $user): array
    {
        return [
            'user' => $user->toArray(),
            'stats' => $this->getUserStats($user),
            'recentActivity' => $this->getRecentActivity($user),
        ];
    }

    /**
     * Update user information.
     */
    public function updateUser(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        event(new UserUpdated($user));

        return $user;
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user): bool
    {
        $deleted = $user->delete();

        if ($deleted) {
            event(new UserDeleted($user));
        }

        return $deleted;
    }

    /**
     * Get user statistics.
     */
    private function getUserStats(User $user): array
    {
        $stats = [
            'totalJobs' => 0,
            'activeJobs' => 0,
            'completedJobs' => 0,
            'totalApplications' => 0,
            'totalEarnings' => 0,
        ];

        if ($user->isEmployer()) {
            $stats['totalJobs'] = $user->jobs()->count();
            $stats['activeJobs'] = $user->jobs()->where('status', 'active')->count();
            $stats['completedJobs'] = $user->jobs()->where('status', 'completed')->count();
        } elseif ($user->isWorker()) {
            $stats['totalApplications'] = $user->applications()->count();
            $stats['totalEarnings'] = $user->receivedPayments()->where('status', 'completed')->sum('amount');
        }

        return $stats;
    }

    /**
     * Get recent user activity.
     */
    private function getRecentActivity(User $user): array
    {
        // This would typically fetch from an activity log table
        // For now, return empty array as placeholder
        return [];
    }
}
