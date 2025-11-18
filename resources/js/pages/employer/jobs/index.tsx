import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { 
    Briefcase, 
    Search, 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    Calendar,
    DollarSign,
    Users,
    Filter,
    X,
    MapPin
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface Job {
    id: number;
    title: string;
    description: string;
    category: string;
    budget: number;
    status?: string;
    province: string;
    city: string;
    created_at: string;
    updated_at: string;
    applications_count: number;
}

interface PaginatedJobs {
    data: Job[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface IndexJobsPageProps {
    jobs: PaginatedJobs;
    filters: {
        search?: string;
        status?: string;
        category?: string;
    };
}

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('nav.manage_jobs', 'Manage Jobs'),
        href: `/employer/jobs?lang=${locale}`,
    },
];

export default function IndexJobsPage({ jobs, filters }: IndexJobsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        category: filters.category || '',
    });

    const handleFilter = () => {
        get(`/employer/jobs?lang=${locale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            category: '',
        });
        router.get(`/employer/jobs?lang=${locale}`, {}, {
            preserveState: false,
        });
    };

    const getStatusColor = (status: string | undefined) => {
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDelete = (jobId: number) => {
        if (confirm(t('jobs.delete_confirm', 'Are you sure you want to delete this job?'))) {
            router.delete(`/employer/jobs/${jobId}?lang=${locale}`, {
                preserveScroll: false,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.manage_jobs', 'Manage Jobs')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], select, input[type="button"],
                    input[type="submit"], input[type="reset"] { 
                        cursor: pointer !important; 
                    }
                    
                    .page-title {
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
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight page-title">
                                {t('nav.manage_jobs', 'Manage Jobs')}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('jobs.manage_subtitle', 'View and manage all your job postings')}
                            </p>
                        </div>
                        <Button 
                            className="text-white cursor-pointer"
                            onClick={() => router.visit(`/employer/jobs/create?lang=${locale}`)}
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('jobs.post_new_job', 'Post New Job')}
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center page-title">
                                <Filter className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                {t('jobs.filters', 'Filters')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('jobs.search', 'Search')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('jobs.search_placeholder', 'Search jobs...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('jobs.status', 'Status')}
                                    </label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('jobs.all_statuses', 'All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="" className="cursor-pointer">{t('jobs.all_statuses', 'All Statuses')}</SelectItem>
                                            <SelectItem value="draft" className="cursor-pointer">{t('employer.status.draft', 'Draft')}</SelectItem>
                                            <SelectItem value="active" className="cursor-pointer">{t('employer.status.active', 'Active')}</SelectItem>
                                            <SelectItem value="completed" className="cursor-pointer">{t('employer.status.completed', 'Completed')}</SelectItem>
                                            <SelectItem value="cancelled" className="cursor-pointer">{t('employer.status.cancelled', 'Cancelled')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('jobs.category', 'Category')}
                                    </label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('jobs.all_categories', 'All Categories')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="" className="cursor-pointer">{t('jobs.all_categories', 'All Categories')}</SelectItem>
                                            <SelectItem value="personal_services" className="cursor-pointer">Personal Services</SelectItem>
                                            <SelectItem value="food_service" className="cursor-pointer">Food Service</SelectItem>
                                            <SelectItem value="cleaning_maintenance" className="cursor-pointer">Cleaning & Maintenance</SelectItem>
                                            <SelectItem value="construction" className="cursor-pointer">Construction</SelectItem>
                                            <SelectItem value="technology" className="cursor-pointer">Technology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button 
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={handleReset}
                                        style={{height: '2.7em'}}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        {t('jobs.reset', 'Reset')}
                                    </Button>
                                    <Button 
                                        className="text-white cursor-pointer"
                                        onClick={handleFilter}
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        {t('jobs.apply_filters', 'Apply')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jobs List */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('jobs.your_jobs', 'Your Jobs')} ({jobs.total})
                            </CardTitle>
                            <CardDescription>
                                {t('jobs.showing', 'Showing')} {jobs.from} - {jobs.to} {t('jobs.of', 'of')} {jobs.total} {t('jobs.jobs', 'jobs')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {jobs.data.length > 0 ? (
                                <div className="space-y-4">
                                    {jobs.data.map((job) => (
                                        <div
                                            key={job.id}
                                            className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                                            style={{ backgroundColor: '#FCF2F0' }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-default cursor-pointer hover:text-[#10B3D6] transition-colors"
                                                            onClick={() => router.visit(`/employer/jobs/${job.id}?lang=${locale}`)}
                                                        >
                                                            {job.title}
                                                        </h3>
                                                        <Badge className={getStatusColor(job.status)} style={{fontSize: '11px'}}>
                                                            {job.status ? t(`employer.status.${job.status.toLowerCase()}`, job.status) : t('employer.status.draft', 'Draft')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{job.city}, {job.province}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>{formatCurrency(job.budget)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{job.applications_count} {t('jobs.applications', 'applications')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(job.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => router.visit(`/employer/jobs/${job.id}?lang=${locale}`)}
                                                        style={{height: '2.5em'}}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => router.visit(`/employer/jobs/${job.id}/edit?lang=${locale}`)}
                                                        style={{height: '2.5em'}}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                                        onClick={() => handleDelete(job.id)}
                                                        style={{height: '2.5em'}}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Pagination */}
                                    {jobs.last_page > 1 && (
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                                {t('jobs.showing', 'Showing')} {jobs.from} - {jobs.to} {t('jobs.of', 'of')} {jobs.total}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {jobs.links.map((link, index) => (
                                                    link.url ? (
                                                        <Link
                                                            key={index}
                                                            href={`${link.url}${link.url.includes('?') ? '&' : '?'}lang=${locale}`}
                                                            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                                                                link.active
                                                                    ? 'bg-[#10B3D6] text-white'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                            }`}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        </Link>
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {t('jobs.no_jobs_found', 'No jobs found')}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t('jobs.no_jobs_description', 'Get started by posting your first job')}
                                    </p>
                                    <Button 
                                        className="text-white cursor-pointer"
                                        onClick={() => router.visit(`/employer/jobs/create?lang=${locale}`)}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('jobs.post_new_job', 'Post New Job')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

