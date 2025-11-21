import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Users, Briefcase, DollarSign, TrendingUp, ArrowRight, Activity } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface ReportSummary {
    totalUsers: number;
    totalJobs: number;
    totalPayments: number;
    totalRevenue: number;
    newUsersThisMonth: number;
    newJobsThisMonth: number;
}

interface Trends {
    userGrowth: number;
    jobGrowth: number;
    revenueGrowth: number;
}

interface TopCategory {
    category: string;
    count: number;
}

interface RevenueByMonth {
    year: number;
    month: number;
    total: number;
}

interface ReportsDashboardProps {
    reportData: {
        summary: ReportSummary;
        trends: Trends;
        topCategories: TopCategory[];
        revenueByMonth: RevenueByMonth[];
    };
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.reports.title', 'Reports & Analytics'),
        href: `/admin/reports?lang=${locale}`,
    },
];

export default function ReportsDashboard({ reportData }: ReportsDashboardProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.reports.index.title', 'Reports Dashboard')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    .page-title { color: #192341 !important; }
                    .text-default { color: #192341 !important; }
                    .card-with-border { border-top: .5px solid #192341 !important; }
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.reports.index.title', 'Reports Dashboard')}</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.reports.subtitle', 'View platform analytics and generate reports')}</p>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: '#10B3D6' }}>
                            {t('admin.reports.index.summary', 'Summary Statistics')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <Users className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.total_users', 'Total Users')}</p>
                                            <p className="text-default text-2xl font-bold">{reportData.summary.totalUsers.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {t('admin.reports.index.new_this_month', '+:count this month', { count: reportData.summary.newUsersThisMonth })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <Briefcase className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.total_jobs', 'Total Jobs')}</p>
                                            <p className="text-default text-2xl font-bold">{reportData.summary.totalJobs.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {t('admin.reports.index.new_this_month', '+:count this month', { count: reportData.summary.newJobsThisMonth })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <DollarSign className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.total_revenue', 'Total Revenue')}</p>
                                            <p className="text-default text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Trends */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: '#10B3D6' }}>
                            {t('admin.reports.index.trends', 'Trends')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.user_growth', 'User Growth')}</p>
                                            <p className={`text-2xl font-bold ${reportData.trends.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {reportData.trends.userGrowth >= 0 ? '+' : ''}{reportData.trends.userGrowth.toFixed(1)}%
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.job_growth', 'Job Growth')}</p>
                                            <p className={`text-2xl font-bold ${reportData.trends.jobGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {reportData.trends.jobGrowth >= 0 ? '+' : ''}{reportData.trends.jobGrowth.toFixed(1)}%
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.reports.index.revenue_growth', 'Revenue Growth')}</p>
                                            <p className={`text-2xl font-bold ${reportData.trends.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {reportData.trends.revenueGrowth >= 0 ? '+' : ''}{reportData.trends.revenueGrowth.toFixed(1)}%
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: '#10B3D6' }}>
                            {t('admin.reports.index.quick_links', 'Quick Links')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card 
                                className="card-with-border rounded-xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.get(`/admin/reports/users?lang=${locale}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-default font-semibold mb-1">{t('admin.reports.index.user_reports', 'User Reports')}</h3>
                                            <p className="text-sm text-gray-600">{t('admin.reports.users.subtitle', 'User registration and activity reports')}</p>
                                        </div>
                                        <ArrowRight className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card 
                                className="card-with-border rounded-xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.get(`/admin/reports/jobs?lang=${locale}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-default font-semibold mb-1">{t('admin.reports.index.job_reports', 'Job Reports')}</h3>
                                            <p className="text-sm text-gray-600">{t('admin.reports.jobs.subtitle', 'Job posting and activity reports')}</p>
                                        </div>
                                        <ArrowRight className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card 
                                className="card-with-border rounded-xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.get(`/admin/reports/payments?lang=${locale}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-default font-semibold mb-1">{t('admin.reports.index.payment_reports', 'Payment Reports')}</h3>
                                            <p className="text-sm text-gray-600">{t('admin.reports.payments.subtitle', 'Payment and revenue reports')}</p>
                                        </div>
                                        <ArrowRight className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Top Categories */}
                    {reportData.topCategories && reportData.topCategories.length > 0 && (
                        <Card className="card-with-border rounded-xl bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                    {t('admin.reports.index.top_categories', 'Top Job Categories')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {reportData.topCategories.slice(0, 10).map((category, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <span className="text-default font-medium">{category.category}</span>
                                            <span className="text-gray-600">{category.count} {t('admin.reports.index.jobs', 'jobs')}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

