import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { 
    Briefcase, 
    DollarSign, 
    MapPin, 
    Calendar, 
    Clock, 
    Users, 
    FileText,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface Job {
    id: number;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline?: string;
    required_skills?: string[];
    province: string;
    city: string;
    job_type: string;
    experience_level: string;
    status?: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

interface Application {
    id: number;
    status?: string;
    created_at: string;
    employee?: {
        id: number;
        name: string;
        email: string;
    };
}

interface JobStats {
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    viewsCount: number;
    averageRating: number;
    totalReviews: number;
}

interface ShowJobPageProps {
    job: Job;
    stats?: JobStats;
    recentApplications?: Application[];
}

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string, jobTitle: string): BreadcrumbItem[] => [
    {
        title: t('nav.manage_jobs', 'Manage Jobs'),
        href: `/employer/jobs?lang=${locale}`,
    },
    {
        title: jobTitle,
        href: '#',
    },
];

export default function ShowJobPage({ job, stats, recentApplications }: ShowJobPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale, job.title);

    // Provide default values for optional props
    const jobStats: JobStats = stats || {
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        viewsCount: 0,
        averageRating: 0,
        totalReviews: 0,
    };
    
    const applications: Application[] = recentApplications || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string | undefined | null) => {
        if (!status) {
            return 'bg-gray-100 text-gray-800';
        }
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handlePublish = () => {
        router.put(`/employer/jobs/${job.id}/publish?lang=${locale}`, {}, {
            preserveScroll: true,
        });
    };

    const handleUnpublish = () => {
        router.put(`/employer/jobs/${job.id}/unpublish?lang=${locale}`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm(t('jobs.delete_confirm', 'Are you sure you want to delete this job?'))) {
            router.delete(`/employer/jobs/${job.id}?lang=${locale}`, {
                preserveScroll: false,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={job.title}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], select, input[type="button"],
                    input[type="submit"], input[type="reset"] { 
                        cursor: pointer !important; 
                    }
                    
                    .job-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                `}</style>
            </Head>
            
            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight job-title">{job.title}</h1>
                                <Badge className={getStatusColor(job.status)} style={{fontSize: '12px'}}>
                                    {job.status ? t(`employer.status.${job.status.toLowerCase()}`, job.status) : t('employer.status.draft', 'Draft')}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                                {t('jobs.posted_on', 'Posted on')} {formatDate(job.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => router.visit(`/employer/jobs/${job.id}/edit?lang=${locale}`)}
                                style={{height: '2.7em'}}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {t('common.edit', 'Edit') || 'Edit'}
                            </Button>
                            {(!job.status || job.status === 'draft') ? (
                                <Button 
                                    className="text-white cursor-pointer"
                                    onClick={handlePublish}
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t('jobs.publish', 'Publish')}
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={handleUnpublish}
                                    style={{height: '2.7em'}}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {t('jobs.unpublish', 'Unpublish')}
                                </Button>
                            )}
                            <Button 
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={handleDelete}
                                style={{height: '2.7em'}}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common.delete', 'Delete') || 'Delete'}
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: t('jobs.total_applications', 'Total Applications'),
                                value: jobStats.totalApplications,
                                icon: FileText,
                                color: '#10B3D6',
                            },
                            {
                                title: t('jobs.pending_applications', 'Pending'),
                                value: jobStats.pendingApplications,
                                icon: Clock,
                                color: '#F59E0B',
                            },
                            {
                                title: t('jobs.accepted_applications', 'Accepted'),
                                value: jobStats.acceptedApplications,
                                icon: CheckCircle,
                                color: '#10B981',
                            },
                            {
                                title: t('jobs.views', 'Views'),
                                value: jobStats.viewsCount,
                                icon: Eye,
                                color: '#8B5CF6',
                            },
                        ].map((stat, index) => (
                            <Card 
                                key={index} 
                                className="hover:shadow-lg transition-all duration-300 bg-white rounded-xl shadow-sm"
                                style={{ borderTop: '0.5px solid #192341' }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold" style={{color: stat.color}}>
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-6 w-6" style={{color: stat.color}} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-default">{stat.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Job Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold flex items-center job-title">
                                        <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                        {t('jobs.job_details', 'Job Details')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('jobs.description', 'Description')}</h3>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('jobs.category', 'Category')}</h3>
                                            <p className="text-sm text-gray-600">{job.category}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('jobs.job_type', 'Job Type')}</h3>
                                            <p className="text-sm text-gray-600">{job.job_type}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('jobs.experience_level', 'Experience Level')}</h3>
                                            <p className="text-sm text-gray-600">{job.experience_level}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('jobs.hourly_rate', 'Hourly Rate')}</h3>
                                            <p className="text-sm text-gray-600 font-semibold">{formatCurrency(job.budget)}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {t('jobs.location', 'Location')}
                                            </h3>
                                            <p className="text-sm text-gray-600">{job.city}, {job.province}</p>
                                        </div>
                                        {job.deadline && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {t('jobs.deadline', 'Deadline')}
                                                </h3>
                                                <p className="text-sm text-gray-600">{formatDate(job.deadline)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {job.required_skills && job.required_skills.length > 0 && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('jobs.required_skills', 'Required Skills')}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {job.required_skills.map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-sm">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Applications */}
                        <div>
                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold flex items-center job-title">
                                        <Users className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                        {t('jobs.recent_applications', 'Recent Applications')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('jobs.latest_applications', 'Latest applications received')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {applications.length > 0 ? (
                                        <div className="space-y-3">
                                            {applications.map((application) => (
                                                <div 
                                                    key={application.id}
                                                    className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                                    style={{ backgroundColor: '#FCF2F0' }}
                                                    onClick={() => router.visit(`/employer/applications/${application.id}?lang=${locale}`)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-default">
                                                                {application.employee?.name || t('jobs.anonymous', 'Anonymous')}
                                                            </h4>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {formatDate(application.created_at)}
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusColor(application.status)} style={{fontSize: '10px'}}>
                                                            {application.status ? t(`employer.status.${application.status.toLowerCase()}`, application.status) : 'Pending'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                    onClick={() => router.visit(`/employer/applications?job=${job.id}&lang=${locale}`)}
                                                    style={{height: '2.7em'}}
                                                >
                                                    {t('jobs.view_all_applications', 'View All Applications')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">{t('jobs.no_applications_yet', 'No applications yet')}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {t('jobs.share_job_to_receive', 'Share this job to receive applications')}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

