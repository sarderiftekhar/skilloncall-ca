<?php

namespace App\Services\Employer;

use App\Models\Application;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class EmployerApplicationService
{
    /**
     * Get applications for the authenticated employer with optional filters.
     */
    public function getEmployerApplications(User $employer, array $filters = []): LengthAwarePaginator
    {
        $query = Application::query()
            ->with([
                'job:id,title,status,employer_id',
                'employee:id,name,email',
            ])
            ->whereHas('job', static function ($jobQuery) use ($employer) {
                $jobQuery->where('employer_id', $employer->id);
            });

        $search = trim((string) Arr::get($filters, 'search', ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->whereHas('job', static function ($jobQuery) use ($search) {
                        $jobQuery->where('title', 'like', "%{$search}%");
                    })
                    ->orWhereHas('employee', static function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $status = Arr::get($filters, 'status');
        if ($status) {
            $query->where('status', $status);
        }

        $jobId = Arr::get($filters, 'job');
        if ($jobId) {
            $query->where('job_id', $jobId);
        }

        $query->orderByDesc('applied_at')->orderByDesc('created_at');

        $paginated = $query->paginate(15)->withQueryString();

        $paginated->getCollection()->transform(function (Application $application) {
            return $this->transformApplication($application);
        });

        return $paginated;
    }

    /**
     * Get detailed application information along with related job and employee data.
     */
    public function getApplicationDetails(Application $application): array
    {
        $application->loadMissing([
            'job' => static function ($jobQuery) {
                $jobQuery->select(['id', 'title', 'status', 'budget', 'employer_id'])->withTrashed();
            },
            'employee:id,name,email,role',
            'job.employer:id,name,email',
        ]);

        return $this->transformApplication($application, true);
    }

    /**
     * Accept an application.
     */
    public function acceptApplication(Application $application): void
    {
        DB::transaction(static function () use ($application) {
            $application->update([
                'status' => 'accepted',
                'accepted_at' => now(),
                'rejected_at' => null,
                'rejection_reason' => null,
            ]);
        });
    }

    /**
     * Reject an application with an optional reason.
     */
    public function rejectApplication(Application $application, ?string $reason = null): void
    {
        DB::transaction(static function () use ($application, $reason) {
            $application->update([
                'status' => 'rejected',
                'rejected_at' => now(),
                'rejection_reason' => $reason,
            ]);
        });
    }

    protected function transformApplication(Application $application, bool $includeRelations = false): array
    {
        $job = $application->job;
        $employee = $application->employee;

        return [
            'id' => $application->id,
            'status' => $application->status,
            'cover_letter' => $application->cover_letter,
            'proposed_rate' => $application->proposed_rate,
            'estimated_duration' => $application->estimated_duration,
            'applied_at' => optional($application->applied_at ?? $application->created_at)->toIso8601String(),
            'accepted_at' => optional($application->accepted_at)->toIso8601String(),
            'rejected_at' => optional($application->rejected_at)->toIso8601String(),
            'rejection_reason' => $application->rejection_reason,
            'job' => $job ? [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $job->status,
                'budget' => $job->budget,
            ] : null,
            'employee' => $employee ? [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
            ] : null,
            'meta' => $includeRelations && $job && $job->employer ? [
                'employer' => [
                    'id' => $job->employer->id,
                    'name' => $job->employer->name,
                    'email' => $job->employer->email,
                ],
            ] : null,
        ];
    }
}


