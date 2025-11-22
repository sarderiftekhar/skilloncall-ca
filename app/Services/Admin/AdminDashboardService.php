<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Job;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class AdminDashboardService
{
    /**
     * Get dashboard data for admin.
     */
    public function getDashboardData(): array
    {
        return [
            'stats' => $this->getStats(),
            'recentUsers' => $this->getRecentUsers(),
            'recentJobs' => $this->getRecentJobs(),
            'recentPayments' => $this->getRecentPayments(),
            'chartData' => $this->getChartData(),
        ];
    }

    /**
     * Get general statistics.
     */
    private function getStats(): array
    {
        return [
            'totalUsers' => User::count(),
            'totalAdmins' => User::where('role', 'admin')->count(),
            'totalEmployers' => User::where('role', 'employer')->count(),
            'totalEmployees' => User::whereIn('role', ['employee', 'worker'])->count(),
            'totalJobs' => Job::count(),
            'activeJobs' => Job::where('status', 'active')->count(),
            'totalPayments' => Payment::count(),
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
        ];
    }

    /**
     * Get recent users.
     */
    private function getRecentUsers(): array
    {
        return User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->toArray();
    }

    /**
     * Get recent jobs.
     */
    private function getRecentJobs(): array
    {
        return Job::with('employer:id,name')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'employer_id', 'status', 'created_at'])
            ->toArray();
    }

    /**
     * Get recent payments.
     */
    private function getRecentPayments(): array
    {
        return Payment::with(['payer:id,name', 'payee:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'amount', 'status', 'payer_id', 'payee_id', 'created_at'])
            ->toArray();
    }

    /**
     * Get chart data for dashboard.
     */
    private function getChartData(): array
    {
        $userRegistrations = User::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        $jobCreations = Job::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        return [
            'userRegistrations' => $userRegistrations,
            'jobCreations' => $jobCreations,
        ];
    }
}
