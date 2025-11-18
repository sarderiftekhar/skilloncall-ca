import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { 
    Briefcase, 
    DollarSign, 
    Users, 
    TrendingUp, 
    Clock, 
    CheckCircle,
    AlertCircle,
    FileText,
    UserCheck,
    PlusCircle
} from 'react-feather';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('employer.title', 'Employer Dashboard'),
        href: `/employer/dashboard?lang=${locale}`,
    },
];

interface EmployerStats {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    totalApplications: number;
    pendingApplications: number;
    totalSpent: number;
    activeWorkers: number;
}

interface Job {
    id: number;
    title: string;
    status: string;
    budget: number;
    created_at: string;
    applications_count: number;
}

interface Application {
    id: number;
    status: string;
    created_at: string;
    job_title: string;
    worker_name: string;
}

interface Worker {
    id: number;
    name: string;
    email: string;
    current_job: string;
    hired_at: string;
}

interface ChartDataPoint {
    date: string;
    count: number;
}

interface ChartData {
    jobsOverTime: ChartDataPoint[];
    applicationsOverTime: ChartDataPoint[];
}

interface EmployerDashboardProps {
    stats: EmployerStats;
    recentJobs: Job[];
    recentApplications: Application[];
    activeWorkers: Worker[];
    chartData: ChartData;
}

export default function EmployerDashboard({ 
    stats, 
    recentJobs, 
    recentApplications, 
    activeWorkers,
    chartData 
}: EmployerDashboardProps) {
    const { t, locale } = useTranslations();
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric'
        });
    };

    const breadcrumbs = getBreadcrumbs(t, locale);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employer.title', 'Employer Dashboard')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], select, input[type="button"],
                    input[type="submit"], input[type="reset"] { 
                        cursor: pointer !important; 
                    }
                    
                    /* Ensure cards with onClick show pointer cursor */
                    [onclick], [onClick] { cursor: pointer !important; }
                    [onclick] *, [onClick] * { cursor: inherit !important; }
                    
                    .employer-title {
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
                <div className={`flex items-center justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight employer-title">{t('employer.title', 'Employer Dashboard')}</h1>
                        <p className="text-lg leading-relaxed text-gray-600 mt-1">{t('employer.subtitle', 'Manage your job postings and applications')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('employer.verified_employer', 'Verified Employer')}
                        </Badge>
                        <Button 
                            className="text-white hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer" 
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                            onClick={() => window.location.href = '/employer/jobs/create'}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t('employer.post_new_job', 'Post New Job')}
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: t('employer.stats.total_jobs', 'Total Jobs'),
                            value: stats.totalJobs,
                            icon: Briefcase,
                            description: t('employer.stats.all_job_postings', 'All job postings')
                        },
                        {
                            title: t('employer.stats.active_jobs', 'Active Jobs'),
                            value: stats.activeJobs,
                            icon: CheckCircle,
                            description: t('employer.stats.currently_active', 'Currently active')
                        },
                        {
                            title: t('employer.stats.applications', 'Applications'),
                            value: stats.totalApplications,
                            icon: FileText,
                            description: t('employer.stats.total_received', 'Total received')
                        },
                        {
                            title: t('employer.stats.total_employees', 'Total Employees'),
                            value: stats.activeWorkers,
                            icon: Users,
                            description: t('employer.stats.total_employees_desc', 'Total employees')
                        }
                    ].map((stat, index) => (
                        <Card 
                            key={index} 
                            className={`hover:shadow-lg hover:scale-105 transition-all duration-500 bg-white rounded-xl shadow-sm transform card-with-border ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transitionDelay: `${index * 150}ms`
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold" style={{color: '#10B3D6'}}>
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-6 w-6" style={{color: '#10B3D6'}} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-default">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pending Applications Alert */}
                {stats.pendingApplications > 0 && (
                    <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: '600ms'}}>
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <AlertCircle className="h-8 w-8 text-orange-600" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-orange-900">
                                            {t('employer.pending_applications', `You have ${stats.pendingApplications} pending application${stats.pendingApplications !== 1 ? 's' : ''}`).replace(':count', String(stats.pendingApplications))}
                                        </h3>
                                        <p className="text-orange-700 mt-1">
                                            {t('employer.pending_applications_message', 'Review and respond to applications to find the best workers for your jobs.')}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="border-orange-300 text-orange-700 hover:bg-orange-100 cursor-pointer hover:scale-105 transition-all duration-200"
                                        onClick={() => window.location.href = '/employer/applications'}
                                        style={{height: '2.7em'}}
                                    >
                                        {t('employer.review_applications', 'Review Applications')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Jobs */}
                    <div className={`lg:col-span-2 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{transitionDelay: '700ms'}}>
                        <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 card-with-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                    {t('employer.recent_job_postings', 'Recent Job Postings')}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    {t('employer.recent_job_postings_subtitle', 'Your latest job postings')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentJobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentJobs.map((job, index) => (
                                            <div 
                                                key={job.id} 
                                                className={`flex items-start justify-between p-3 rounded-lg hover:scale-102 transition-all duration-300 cursor-pointer ${
                                                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                                }`} 
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${800 + (index * 100)}ms`
                                                }}
                                                onClick={() => window.location.href = `/employer/jobs/${job.id}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-default">{job.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className={getStatusColor(job.status)} style={{fontSize: '10px'}}>
                                                            {t(`employer.status.${job.status.toLowerCase()}`, job.status)}
                                                        </Badge>
                                                        <span className="text-xs text-gray-600">
                                                            {formatCurrency(job.budget)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-gray-600">
                                                            {job.applications_count} {job.applications_count !== 1 ? t('employer.applications_plural', 'applications') : t('employer.application', 'application')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {t('employer.posted', 'Posted')} {formatDate(job.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Button 
                                                variant="outline" 
                                                className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                onClick={() => window.location.href = '/employer/jobs'}
                                                style={{height: '2.7em'}}
                                            >
                                                {t('employer.view_all_jobs', 'View All Jobs')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">{t('employer.no_jobs_posted', 'No jobs posted yet')}</p>
                                        <Button 
                                            className="mt-4 cursor-pointer text-white hover:scale-105 transition-all duration-200"
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                            onClick={() => window.location.href = '/employer/jobs/create'}
                                        >
                                            {t('employer.post_first_job', 'Post Your First Job')}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Applications */}
                    <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{transitionDelay: '800ms'}}>
                        <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 card-with-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <FileText className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                    {t('employer.recent_applications_title', 'Recent Applications')}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    {t('employer.recent_applications_subtitle', 'Latest applications received')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentApplications.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentApplications.map((application, index) => (
                                            <div 
                                                key={application.id} 
                                                className={`p-3 rounded-lg hover:scale-102 transition-all duration-300 cursor-pointer ${
                                                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                                }`} 
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${900 + (index * 100)}ms`
                                                }}
                                                onClick={() => window.location.href = `/employer/applications/${application.id}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-default">{application.worker_name}</h4>
                                                        <p className="text-xs text-gray-600 mt-1">{application.job_title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {t('employer.applied', 'Applied')} {formatDate(application.created_at)}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(application.status)} style={{fontSize: '10px'}}>
                                                        {t(`employer.status.${application.status.toLowerCase()}`, application.status)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Button 
                                                variant="outline" 
                                                className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                onClick={() => window.location.href = '/employer/applications'}
                                                style={{height: '2.7em'}}
                                            >
                                                {t('employer.view_all_applications', 'View All Applications')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">{t('employer.no_applications_yet', 'No applications yet')}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {t('employer.no_applications_message', 'Post jobs to receive applications from workers')}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Total Employees */}
                {activeWorkers.length > 0 && (
                    <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '900ms'}}>
                        <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 card-with-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Users className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                    {t('employer.total_employees_title', 'Total Employees')}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    {t('employer.total_employees_subtitle', 'Employees currently engaged on your jobs')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeWorkers.slice(0, 6).map((worker, index) => (
                                        <div 
                                            key={worker.id} 
                                            className={`p-3 rounded-lg hover:scale-102 transition-all duration-300 cursor-pointer ${
                                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                            }`} 
                                            style={{
                                                backgroundColor: '#FCF2F0',
                                                transitionDelay: `${1000 + (index * 100)}ms`
                                            }}
                                            onClick={() => window.location.href = `/employer/workers/${worker.id}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#10B3D6', width: '40px', height: '40px'}}>
                                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-default">{worker.name}</h4>
                                                    <p className="text-xs text-gray-600 truncate">{worker.current_job}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {t('employer.hired', 'Hired')} {formatDate(worker.hired_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {activeWorkers.length > 6 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <Button 
                                            variant="outline" 
                                            className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                            onClick={() => window.location.href = '/employer/workers'}
                                            style={{height: '2.7em'}}
                                        >
                                            {t('employer.view_all_workers', 'View All Workers')}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer bg-white rounded-xl shadow-sm card-with-border"
                        onClick={() => window.location.href = '/employer/jobs/create'}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg" style={{backgroundColor: '#FCF2F0'}}>
                                    <PlusCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-default">{t('employer.quick_actions.post_new_job', 'Post New Job')}</p>
                                    <p className="text-xs text-gray-500">{t('employer.quick_actions.post_new_job_desc', 'Create a job listing')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer bg-white rounded-xl shadow-sm card-with-border"
                        onClick={() => window.location.href = '/employer/applications'}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg" style={{backgroundColor: '#FCF2F0'}}>
                                    <FileText className="h-5 w-5" style={{color: '#10B3D6'}} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-default">{t('employer.quick_actions.view_applications', 'View Applications')}</p>
                                    <p className="text-xs text-gray-500">{t('employer.quick_actions.view_applications_desc', 'Review submissions')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer bg-white rounded-xl shadow-sm card-with-border"
                        onClick={() => window.location.href = '/employer/workers'}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg" style={{backgroundColor: '#FCF2F0'}}>
                                    <Users className="h-5 w-5" style={{color: '#10B3D6'}} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-default">{t('employer.quick_actions.find_workers', 'Find Workers')}</p>
                                    <p className="text-xs text-gray-500">{t('employer.quick_actions.find_workers_desc', 'Browse worker profiles')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer bg-white rounded-xl shadow-sm card-with-border"
                        onClick={() => window.location.href = '/employer/payments'}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg" style={{backgroundColor: '#FCF2F0'}}>
                                    <DollarSign className="h-5 w-5" style={{color: '#10B3D6'}} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-default">{t('employer.quick_actions.payments', 'Payments')}</p>
                                    <p className="text-xs text-gray-500">{t('employer.quick_actions.payments_desc', 'Manage transactions')}</p>
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



