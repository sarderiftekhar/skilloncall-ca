<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Job;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class AdminReportService
{
    /**
     * Get reports dashboard data.
     */
    public function getReportsDashboard(): array
    {
        return [
            'summary' => $this->getSummaryStats(),
            'trends' => $this->getTrends(),
            'topCategories' => $this->getTopJobCategories(),
            'revenueByMonth' => $this->getRevenueByMonth(),
        ];
    }

    /**
     * Get user reports.
     */
    public function getUserReports(array $filters = []): array
    {
        $period = $filters['period'] ?? '30days';
        $role = $filters['role'] ?? null;

        $query = User::query();

        if ($role) {
            $query->where('role', $role);
        }

        $query->where('created_at', '>=', $this->getPeriodDate($period));

        $users = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count'),
            'role'
        )
            ->groupBy('date', 'role')
            ->orderBy('date')
            ->get();

        return [
            'data' => $users->toArray(),
            'total' => $users->sum('count'),
        ];
    }

    /**
     * Get job reports.
     */
    public function getJobReports(array $filters = []): array
    {
        $period = $filters['period'] ?? '30days';
        $category = $filters['category'] ?? null;

        $query = Job::query();

        if ($category) {
            $query->where('category', $category);
        }

        $query->where('created_at', '>=', $this->getPeriodDate($period));

        $jobs = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count'),
            'status'
        )
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        return [
            'data' => $jobs->toArray(),
            'total' => $jobs->sum('count'),
        ];
    }

    /**
     * Get payment reports.
     */
    public function getPaymentReports(array $filters = []): array
    {
        $period = $filters['period'] ?? '30days';
        $type = $filters['type'] ?? null;

        $query = Payment::query();

        if ($type) {
            $query->where('type', $type);
        }

        $query->where('created_at', '>=', $this->getPeriodDate($period));

        $payments = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(amount) as total_amount'),
            'status'
        )
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        return [
            'data' => $payments->toArray(),
            'totalAmount' => $payments->sum('total_amount'),
            'totalCount' => $payments->sum('count'),
        ];
    }

    /**
     * Export report data.
     */
    public function exportReport(string $type, array $filters = []): array
    {
        $data = match ($type) {
            'users' => $this->getUserReports($filters),
            'jobs' => $this->getJobReports($filters),
            'payments' => $this->getPaymentReports($filters),
            default => throw new \InvalidArgumentException("Invalid report type: {$type}")
        };

        // Convert to CSV format
        $csv = $this->arrayToCsv($data['data']);

        return [
            'content' => $csv,
            'contentType' => 'text/csv',
            'filename' => "{$type}_report_" . now()->format('Y-m-d') . '.csv',
        ];
    }

    /**
     * Get summary statistics.
     */
    private function getSummaryStats(): array
    {
        return [
            'totalUsers' => User::count(),
            'totalJobs' => Job::count(),
            'totalPayments' => Payment::count(),
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
            'newUsersThisMonth' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            'newJobsThisMonth' => Job::where('created_at', '>=', now()->startOfMonth())->count(),
        ];
    }

    /**
     * Get trend data.
     */
    private function getTrends(): array
    {
        $lastMonth = now()->subMonth();
        $thisMonth = now();

        $lastMonthUsers = User::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])->count();
        $thisMonthUsers = User::whereBetween('created_at', [$thisMonth->startOfMonth(), $thisMonth->endOfMonth()])->count();
        $userTrend = $lastMonthUsers > 0 ? (($thisMonthUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;

        $lastMonthJobs = Job::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])->count();
        $thisMonthJobs = Job::whereBetween('created_at', [$thisMonth->startOfMonth(), $thisMonth->endOfMonth()])->count();
        $jobTrend = $lastMonthJobs > 0 ? (($thisMonthJobs - $lastMonthJobs) / $lastMonthJobs) * 100 : 0;

        $lastMonthRevenue = Payment::where('status', 'completed')
            ->whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->sum('amount');
        $thisMonthRevenue = Payment::where('status', 'completed')
            ->whereBetween('created_at', [$thisMonth->startOfMonth(), $thisMonth->endOfMonth()])
            ->sum('amount');
        $revenueTrend = $lastMonthRevenue > 0 ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;

        return [
            'userGrowth' => round($userTrend, 2),
            'jobGrowth' => round($jobTrend, 2),
            'revenueGrowth' => round($revenueTrend, 2),
        ];
    }

    /**
     * Get top job categories.
     */
    private function getTopJobCategories(): array
    {
        return Job::select('category', DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get revenue by month.
     */
    private function getRevenueByMonth(): array
    {
        return Payment::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    /**
     * Get date for period filter.
     */
    private function getPeriodDate(string $period): \Carbon\Carbon
    {
        return match ($period) {
            '7days' => now()->subDays(7),
            '30days' => now()->subDays(30),
            '90days' => now()->subDays(90),
            '1year' => now()->subYear(),
            default => now()->subDays(30)
        };
    }

    /**
     * Convert array to CSV format.
     */
    private function arrayToCsv(array $data): string
    {
        if (empty($data)) {
            return '';
        }

        $output = fopen('php://temp', 'r+');
        
        // Add header
        fputcsv($output, array_keys($data[0]));
        
        // Add data rows
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
