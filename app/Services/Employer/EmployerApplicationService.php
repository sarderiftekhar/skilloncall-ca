<?php

namespace App\Services\Employer;

use App\Models\User;
use App\Models\Application;
use Illuminate\Support\Collection;

class EmployerApplicationService
{
    /**
     * Get employer applications with filters.
     */
    public function getEmployerApplications(User $employer, array $filters = []): Collection
    {
        $query = Application::whereHas('job', function ($q) use ($employer) {
                $q->where('employer_id', $employer->id);
            })
            ->with([
                'job:id,title,employer_id,status,budget,category',
                'job.employer:id,name',
                'employee:id,name,email'
            ])
            ->latest();

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply job filter
        if (!empty($filters['job'])) {
            $query->where('job_id', $filters['job']);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('job', function ($jobQuery) use ($filters) {
                    $jobQuery->where('title', 'like', '%' . $filters['search'] . '%');
                })
                ->orWhereHas('employee', function ($employeeQuery) use ($filters) {
                    $employeeQuery->where('name', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('email', 'like', '%' . $filters['search'] . '%');
                });
            });
        }

        return $query->get();
    }

    /**
     * Get application details.
     */
    public function getApplicationDetails(Application $application): array
    {
        return $application->load([
            'job',
            'job.employer',
            'employee',
            'employee.employeeProfile'
        ])->toArray();
    }

    /**
     * Accept an application.
     */
    public function acceptApplication(Application $application): bool
    {
        // Reject other pending applications for the same job
        Application::where('job_id', $application->job_id)
            ->where('id', '!=', $application->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'rejected',
                'rejected_at' => now(),
            ]);

        return $application->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
    }

    /**
     * Reject an application.
     */
    public function rejectApplication(Application $application, ?string $reason = null): bool
    {
        return $application->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }
}

