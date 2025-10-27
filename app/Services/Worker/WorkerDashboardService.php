<?php

namespace App\Services\Worker;

use App\Models\User;
use App\Models\Job;
use Illuminate\Support\Facades\DB;

class WorkerDashboardService
{
    /**
     * Get dashboard data for worker.
     */
    public function getDashboardData(User $worker): array
    {
        return [
            'stats' => $this->getStats($worker),
            'recentApplications' => $this->getRecentApplications($worker),
            'recommendedJobs' => $this->getRecommendedJobs($worker),
            'activeJobs' => $this->getActiveJobs($worker),
            'earnings' => $this->getEarnings($worker),
        ];
    }

    /**
     * Get worker statistics.
     */
    private function getStats(User $worker): array
    {
        return [
            'totalApplications' => $worker->applications()->count(),
            'pendingApplications' => $worker->applications()->where('status', 'pending')->count(),
            'acceptedApplications' => $worker->applications()->where('status', 'accepted')->count(),
            'completedJobs' => $worker->applications()->where('status', 'completed')->count(),
            'totalEarnings' => $worker->receivedPayments()->where('status', 'completed')->sum('amount'),
            'averageRating' => $worker->receivedReviews()->avg('rating') ?? 0,
            'totalReviews' => $worker->receivedReviews()->count(),
            'profileCompletion' => $this->calculateProfileCompletion($worker),
        ];
    }

    /**
     * Get recent applications.
     */
    private function getRecentApplications(User $worker): array
    {
        return $worker->applications()
            ->with(['job:id,title,budget,status', 'job.employer:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'job_id', 'status', 'created_at'])
            ->toArray();
    }

    /**
     * Get recommended jobs based on worker's skills and preferences.
     */
    private function getRecommendedJobs(User $worker): array
    {
        // Get worker's skills
        $workerSkills = $worker->skills()->pluck('name')->toArray();
        
        $query = Job::where('status', 'active')
            ->whereDoesntHave('applications', function ($q) use ($worker) {
                $q->where('worker_id', $worker->id);
            });

        // If worker has skills, prioritize jobs matching those skills
        if (!empty($workerSkills)) {
            $query->where(function ($q) use ($workerSkills) {
                foreach ($workerSkills as $skill) {
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
    private function getActiveJobs(User $worker): array
    {
        return $worker->applications()
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
    private function getEarnings(User $worker): array
    {
        $thisMonth = $worker->receivedPayments()
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $lastMonth = $worker->receivedPayments()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                now()->subMonth()->startOfMonth(),
                now()->subMonth()->endOfMonth()
            ])
            ->sum('amount');

        $earningsOverTime = $worker->receivedPayments()
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
    private function calculateProfileCompletion(User $worker): int
    {
        // Prefer the dedicated WorkerProfile completion calculation
        $profile = $worker->workerProfile;
        if ($profile) {
            return (int) $profile->calculateProfileCompletion();
        }

        // Fallback to a simple heuristic if no profile yet
        $fields = [
            !empty($worker->name),
            !empty($worker->email),
        ];
        $completed = count(array_filter($fields));
        return (int) round(($completed / count($fields)) * 100);
    }
}
