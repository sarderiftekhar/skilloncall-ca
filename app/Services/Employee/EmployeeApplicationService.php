<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Models\Application;
use Illuminate\Support\Collection;

class EmployeeApplicationService
{
    /**
     * Get employee applications with filters.
     */
    public function getEmployeeApplications(User $employee, array $filters = []): Collection
    {
        $query = $employee->applications()
            ->with(['job:id,title,employer_id,status', 'job.employer:id,name'])
            ->latest();

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->whereHas('job', function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->get();
    }

    /**
     * Get application details.
     */
    public function getApplicationDetails(Application $application): array
    {
        return $application->load(['job', 'job.employer', 'employee'])->toArray();
    }

    /**
     * Withdraw an application.
     */
    public function withdrawApplication(Application $application): bool
    {
        return $application->update(['status' => 'withdrawn']);
    }

    /**
     * Mark application as completed.
     */
    public function completeApplication(Application $application): bool
    {
        return $application->update(['status' => 'completed', 'completed_at' => now()]);
    }
}

