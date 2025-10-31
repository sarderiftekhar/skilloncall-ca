<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Models\Job;
use Illuminate\Support\Facades\DB;

class EmployeeDashboardService
{
    /**
     * Get dashboard data for employee.
     */
    public function getDashboardData(User $employee): array
    {
        return [
            'stats' => $this->getStats($employee),
            'recentApplications' => $this->getRecentApplications($employee),
            'recommendedJobs' => $this->getRecommendedJobs($employee),
            'activeJobs' => $this->getActiveJobs($employee),
            'earnings' => $this->getEarnings($employee),
        ];
    }

    /**
     * Get employee statistics.
     */
    private function getStats(User $employee): array
    {
        return [
            'totalApplications' => $employee->applications()->count(),
            'pendingApplications' => $employee->applications()->where('status', 'pending')->count(),
            'acceptedApplications' => $employee->applications()->where('status', 'accepted')->count(),
            'completedJobs' => $employee->applications()->where('status', 'completed')->count(),
            'totalEarnings' => $employee->receivedPayments()->where('status', 'completed')->sum('amount'),
            'averageRating' => $employee->receivedReviews()->avg('rating') ?? 0,
            'totalReviews' => $employee->receivedReviews()->count(),
            'profileCompletion' => $this->calculateProfileCompletion($employee),
        ];
    }

    /**
     * Get recent applications.
     */
    private function getRecentApplications(User $employee): array
    {
        return $employee->applications()
            ->with(['job:id,title,budget,status', 'job.employer:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'job_id', 'status', 'created_at'])
            ->toArray();
    }

    /**
     * Get recommended jobs based on employee's skills and preferences.
     */
    private function getRecommendedJobs(User $employee): array
    {
        // Get employee's skills
        $employeeSkills = $employee->skills()->pluck('name')->toArray();
        
        $query = Job::where('status', 'active')
            ->whereDoesntHave('applications', function ($q) use ($employee) {
                $q->where('employee_id', $employee->id);
            });

        // If employee has skills, prioritize jobs matching those skills
        if (!empty($employeeSkills)) {
            $query->where(function ($q) use ($employeeSkills) {
                foreach ($employeeSkills as $skill) {
                    $q->orWhere('required_skills', 'like', '%' . $skill . '%');
                }
            });
        }

        return $query->with('employer:id,name')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'budget', 'category', 'employer_id', 'created_at'])
            ->toArray();
    }

    /**
     * Get active jobs (accepted applications).
     */
    private function getActiveJobs(User $employee): array
    {
        return $employee->applications()
            ->where('status', 'accepted')
            ->with(['job:id,title,budget,deadline', 'job.employer:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'job_id', 'status', 'created_at'])
            ->toArray();
    }

    /**
     * Get earnings data.
     */
    private function getEarnings(User $employee): array
    {
        $thisMonth = $employee->receivedPayments()
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $lastMonth = $employee->receivedPayments()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                now()->subMonth()->startOfMonth(),
                now()->subMonth()->endOfMonth()
            ])
            ->sum('amount');

        $earningsOverTime = $employee->receivedPayments()
            ->where('status', 'completed')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as total')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        return [
            'thisMonth' => $thisMonth,
            'lastMonth' => $lastMonth,
            'growth' => $lastMonth > 0 ? (($thisMonth - $lastMonth) / $lastMonth) * 100 : 0,
            'earningsOverTime' => $earningsOverTime,
        ];
    }

    /**
     * Calculate profile completion percentage.
     */
    private function calculateProfileCompletion(User $employee): int
    {
        // Prefer the dedicated EmployeeProfile completion calculation
        $profile = $employee->employeeProfile;
        if ($profile) {
            return (int) $profile->calculateProfileCompletion();
        }

        // Fallback to a simple heuristic if no profile yet
        $fields = [
            !empty($employee->name),
            !empty($employee->email),
        ];
        $completed = count(array_filter($fields));
        return (int) round(($completed / count($fields)) * 100);
    }
}

