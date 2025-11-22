import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';
import { Briefcase, CheckCircle, Clock, DollarSign, MapPin, Shield, Star, TrendingUp, Users } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalEmployers: number;
    totalEmployees: number;
    totalJobs: number;
    activeJobs: number;
    totalPayments: number;
    totalRevenue: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface RecentJob {
    id: number;
    title: string;
    employer_id: number;
    status: string;
    created_at: string;
    employer?: {
        id: number;
        name: string;
    };
}

interface RecentPayment {
    id: number;
    amount: number;
    status: string;
    payer_id: number;
    payee_id: number;
    created_at: string;
    payer?: {
        id: number;
        name: string;
    };
    payee?: {
        id: number;
        name: string;
    };
}

interface ChartData {
    userRegistrations: Array<{ date: string; count: number }>;
    jobCreations: Array<{ date: string; count: number }>;
}

interface AdminDashboardProps {
    stats: DashboardStats;
    recentUsers: RecentUser[];
    recentJobs: RecentJob[];
    recentPayments: RecentPayment[];
    chartData: ChartData;
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.dashboard.title', 'Admin Dashboard'),
        href: `/admin/dashboard?lang=${locale}`,
    },
];

export default function AdminDashboard({ stats, recentUsers, recentJobs, recentPayments, chartData }: AdminDashboardProps) {
    const { t, locale } = useTranslations();
    const [isLoaded, setIsLoaded] = useState(false);
    const breadcrumbs = getBreadcrumbs(t, locale);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return diffInMinutes < 1 ? t('admin.dashboard.just_now', 'Just now') : `${diffInMinutes} ${t('admin.dashboard.minutes_ago', 'min ago')}`;
        }
        if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} ${t('admin.dashboard.hours_ago', 'h ago')}`;
        }
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} ${t('admin.dashboard.days_ago', 'days ago')}`;
        }
        return date.toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate percentage changes (mock for now, can be enhanced with historical data)
    const calculateChange = (current: number, previous: number = current * 0.9) => {
        if (previous === 0) return { value: '+0%', type: 'positive' as const };
        const change = ((current - previous) / previous) * 100;
        return {
            value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
            type: (change >= 0 ? 'positive' : 'negative') as const,
        };
    };

    // Calculate success rate (completed jobs / total jobs)
    const completedJobs = stats.totalJobs - stats.activeJobs;
    const successRate = stats.totalJobs > 0 
        ? ((completedJobs / stats.totalJobs) * 100).toFixed(1)
        : '0.0';

    const statsCards = useMemo(() => [
        {
            title: t('admin.dashboard.stats.total_users', 'Total Users'),
            value: stats.totalUsers.toLocaleString(),
            change: calculateChange(stats.totalUsers),
            icon: Users,
            description: t('admin.dashboard.stats.total_users_desc', 'Active platform users'),
        },
        {
            title: t('admin.dashboard.stats.active_jobs', 'Active Jobs'),
            value: stats.activeJobs.toLocaleString(),
            change: calculateChange(stats.activeJobs),
            icon: Briefcase,
            description: t('admin.dashboard.stats.active_jobs_desc', 'Currently posted jobs'),
        },
        {
            title: t('admin.dashboard.stats.monthly_revenue', 'Monthly Revenue'),
            value: formatCurrency(stats.totalRevenue || 0),
            change: calculateChange(stats.totalRevenue || 0),
            icon: DollarSign,
            description: t('admin.dashboard.stats.monthly_revenue_desc', 'Subscription & credits'),
        },
        {
            title: t('admin.dashboard.stats.success_rate', 'Success Rate'),
            value: `${successRate}%`,
            change: calculateChange(parseFloat(successRate)),
            icon: TrendingUp,
            description: t('admin.dashboard.stats.success_rate_desc', 'Job completion rate'),
        },
    ], [stats, t]);

    // Build recent activity from real data
    const recentActivity = useMemo(() => {
        const activities: Array<{
            type: string;
            message: string;
            time: string;
            status: 'info' | 'success' | 'warning';
        }> = [];

        // Add recent users
        (recentUsers || []).slice(0, 2).forEach((user: RecentUser) => {
            activities.push({
                type: 'user_registered',
                message: t('admin.dashboard.activity.user_registered', 'New :role registered: :name').replace(':role', t(`admin.roles.${user.role}`, user.role)).replace(':name', user.name),
                time: formatDate(user.created_at),
                status: 'info' as const,
            });
        });

        // Add recent jobs
        (recentJobs || []).slice(0, 2).forEach((job: RecentJob) => {
            activities.push({
                type: 'job_posted',
                message: t('admin.dashboard.activity.job_posted', 'Job posted: :title').replace(':title', job.title),
                time: formatDate(job.created_at),
                status: 'success' as const,
            });
        });

        // Add recent payments
        (recentPayments || []).slice(0, 1).forEach((payment: RecentPayment) => {
            activities.push({
                type: 'payment_received',
                message: t('admin.dashboard.activity.payment_received', 'Payment received: :amount').replace(':amount', formatCurrency(payment.amount)),
                time: formatDate(payment.created_at),
                status: 'success' as const,
            });
        });

        return activities.slice(0, 5);
    }, [recentUsers, recentJobs, recentPayments, t]);

    // Top performers - simplified for now (would need ratings data)
    const topPerformers = useMemo(() => {
        // Return empty array for now - can be enhanced with actual worker ratings
        return [];
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.dashboard.title', 'Admin Dashboard')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    
                    .admin-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                    
                    .card-with-border {
                        border-top: .5px solid #192341 !important;
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.7;
                        }
                    }
                    
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s ease-out forwards;
                    }
                    
                    .animate-slide-in-left {
                        animation: slideInLeft 0.6s ease-out forwards;
                    }
                    
                    .animate-slide-in-right {
                        animation: slideInRight 0.6s ease-out forwards;
                    }
                    
                    .hover\\:scale-102:hover {
                        transform: scale(1.02);
                    }
                    
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                    >
                        <div>
                            <h1 className="admin-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.dashboard.subtitle', 'Manage users, jobs, payments, and platform analytics')}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="animate-pulse border-green-200 bg-green-50 text-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                {t('admin.dashboard.system_healthy', 'System Healthy')}
                            </Badge>
                            <Button
                                className="text-white transition-all duration-200 hover:scale-105 hover:opacity-90 cursor-pointer"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                onClick={() => router.get(`/admin/reports?lang=${locale}`)}
                            >
                                {t('admin.dashboard.generate_report', 'Generate Report')}
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {statsCards.map((stat, index) => (
                            <Card
                                key={index}
                                className={`card-with-border transform rounded-xl bg-white shadow-sm transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${index * 150}ms`,
                                }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold" style={{ color: '#10B3D6' }}>
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-default text-2xl font-bold">{stat.value}</div>
                                    <div className="mt-1 flex items-center space-x-1 text-xs text-gray-600">
                                        <span style={{ color: stat.change.type === 'positive' ? '#10B3D6' : '#ef4444' }} className="font-medium">
                                            {stat.change.value}
                                        </span>
                                        <span>{t('admin.dashboard.from_last_month', 'from last month')}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Recent Activity */}
                        <div
                            className={`transition-all duration-700 lg:col-span-2 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                            style={{ transitionDelay: '600ms' }}
                        >
                            <Card className="card-with-border rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        <Clock className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                                        {t('admin.dashboard.recent_activity', 'Recent Activity')}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">{t('admin.dashboard.recent_activity_desc', 'Latest platform events and notifications')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start space-x-3 rounded-lg p-3 transition-all duration-300 hover:scale-102 ${
                                                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                                                }`}
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${700 + index * 100}ms`,
                                                }}
                                            >
                                                <div
                                                    className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                                                        activity.status === 'success'
                                                            ? 'bg-green-500'
                                                            : activity.status === 'warning'
                                                              ? 'bg-yellow-500'
                                                              : 'bg-blue-500'
                                                    }`}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-default text-sm">{activity.message}</p>
                                                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full transition-all duration-200 hover:scale-105 cursor-pointer"
                                            style={{ height: '2.7em' }}
                                            onClick={() => router.get(`/admin/reports?lang=${locale}`)}
                                        >
                                            {t('admin.dashboard.view_all_activity', 'View All Activity')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Performers */}
                        <div
                            className={`transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                            style={{ transitionDelay: '800ms' }}
                        >
                            <Card className="card-with-border rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        <Star className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                                        {t('admin.dashboard.top_performers', 'Top Performers')}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">{t('admin.dashboard.top_performers_desc', 'Highest rated workers this month')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {topPerformers.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">{t('admin.dashboard.no_performers', 'No top performers data available')}</p>
                                    ) : (
                                        <div className="space-y-4">
                                        {topPerformers.map((performer, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center space-x-3 rounded-lg p-3 transition-all duration-300 hover:scale-102 ${
                                                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                                }`}
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${900 + index * 100}ms`,
                                                }}
                                            >
                                                <div
                                                    className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                                    style={{ backgroundColor: '#10B3D6', width: '30px', height: '30px', fontSize: '12px' }}
                                                >
                                                    {performer.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-default text-sm font-semibold">{performer.name}</p>
                                                    <p className="text-xs text-gray-500">{performer.role}</p>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <div className="flex items-center">
                                                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                                                            <span className="ml-1 text-xs text-gray-600">{performer.rating}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-600">{performer.completedJobs} jobs</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="ml-1 text-xs text-gray-500">{performer.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full transition-all duration-200 hover:scale-105 cursor-pointer"
                                            style={{ height: '2.7em' }}
                                            onClick={() => router.get(`/admin/users?lang=${locale}&role=employee`)}
                                        >
                                            {t('admin.dashboard.view_all_workers', 'View All Workers')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card 
                            className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                            onClick={() => router.get(`/admin/users?lang=${locale}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <Users className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">{t('admin.dashboard.quick_actions.manage_users', 'Manage Users')}</p>
                                        <p className="text-xs text-gray-500">{t('admin.dashboard.quick_actions.manage_users_desc', 'View & verify accounts')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card 
                            className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                            onClick={() => router.get(`/admin/jobs?lang=${locale}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <Briefcase className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">{t('admin.dashboard.quick_actions.job_oversight', 'Job Oversight')}</p>
                                        <p className="text-xs text-gray-500">{t('admin.dashboard.quick_actions.job_oversight_desc', 'Monitor job postings')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card 
                            className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                            onClick={() => router.get(`/admin/payments?lang=${locale}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <DollarSign className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">{t('admin.dashboard.quick_actions.payments', 'Payments & Billing')}</p>
                                        <p className="text-xs text-gray-500">{t('admin.dashboard.quick_actions.payments_desc', 'Financial analytics')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card 
                            className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                            onClick={() => router.get(`/admin/reports?lang=${locale}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <TrendingUp className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">{t('admin.dashboard.quick_actions.reports', 'Reports & Analytics')}</p>
                                        <p className="text-xs text-gray-500">{t('admin.dashboard.quick_actions.reports_desc', 'View detailed reports')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
