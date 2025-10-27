<?php

namespace App\Services\Employer;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class EmployerDashboardService
{
    /**
     * Get dashboard data for employer.
     */
    public function getDashboardData(User $employer): array
    {
        return [
            'stats' => $this->getStats($employer),
            'recentJobs' => $this->getRecentJobs($employer),
            'recentApplications' => $this->getRecentApplications($employer),
            'activeWorkers' => $this->getActiveWorkers($employer),
            'chartData' => $this->getChartData($employer),
        ];
    }

    /**
     * Get employer statistics.
     */
    private function getStats(User $employer): array
    {
        return [
            'totalJobs' => $employer->jobs()->count(),
            'activeJobs' => $employer->jobs()->where('status', 'active')->count(),
            'completedJobs' => $employer->jobs()->where('status', 'completed')->count(),
            'totalApplications' => $employer->jobs()->withCount('applications')->get()->sum('applications_count'),
            'pendingApplications' => DB::table('applications')
                ->join('job_postings', 'applications.job_id', '=', 'job_postings.id')
                ->where('job_postings.employer_id', $employer->id)
                ->where('applications.status', 'pending')
                ->count(),
            'totalSpent' => $employer->sentPayments()->where('status', 'completed')->sum('amount'),
            'activeWorkers' => $this->getActiveWorkersCount($employer),
        ];
    }

    /**
     * Get recent jobs.
     */
    private function getRecentJobs(User $employer): array
    {
        return $employer->jobs()
            ->withCount('applications')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'status', 'budget', 'created_at'])
            ->toArray();
    }

    /**
     * Get recent applications.
     */
    private function getRecentApplications(User $employer): array
    {
        return DB::table('applications')
            ->join('job_postings', 'applications.job_id', '=', 'job_postings.id')
            ->join('users', 'applications.worker_id', '=', 'users.id')
            ->where('job_postings.employer_id', $employer->id)
            ->select([
                'applications.id',
                'applications.status',
                'applications.created_at',
                'job_postings.title as job_title',
                'users.name as worker_name'
            ])
            ->orderByDesc('applications.created_at')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Get active workers.
     */
    private function getActiveWorkers(User $employer): array
    {
        return DB::table('applications')
            ->join('job_postings', 'applications.job_id', '=', 'job_postings.id')
            ->join('users', 'applications.worker_id', '=', 'users.id')
            ->where('job_postings.employer_id', $employer->id)
            ->where('applications.status', 'accepted')
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'job_postings.title as current_job',
                'applications.created_at as hired_at'
            ])
            ->orderByDesc('applications.created_at')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get chart data for dashboard.
     */
    private function getChartData(User $employer): array
    {
        $jobsOverTime = $employer->jobs()
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        $applicationsOverTime = DB::table('applications')
            ->join('job_postings', 'applications.job_id', '=', 'job_postings.id')
            ->where('job_postings.employer_id', $employer->id)
            ->select(
                DB::raw('DATE(applications.created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('applications.created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        return [
            'jobsOverTime' => $jobsOverTime,
            'applicationsOverTime' => $applicationsOverTime,
        ];
    }

    /**
     * Get count of active workers.
     */
    private function getActiveWorkersCount(User $employer): int
    {
        return DB::table('applications')
            ->join('job_postings', 'applications.job_id', '=', 'job_postings.id')
            ->where('job_postings.employer_id', $employer->id)
            ->where('applications.status', 'accepted')
            ->distinct('applications.worker_id')
            ->count('applications.worker_id');
    }
}
