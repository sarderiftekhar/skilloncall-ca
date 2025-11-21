import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Search, Eye, CheckCircle, XCircle, Trash2, Briefcase, Filter, X, DollarSign, Calendar } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface Job {
    id: number;
    title: string;
    category: string;
    budget: number;
    status: string;
    created_at: string;
    employer?: {
        id: number;
        name: string;
    };
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

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.jobs.title', 'Job Management'),
        href: `/admin/jobs?lang=${locale}`,
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
        get(`/admin/jobs?lang=${locale}`, {
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
        router.get(`/admin/jobs?lang=${locale}`, {}, {
            preserveState: false,
        });
    };

    const handleDelete = (jobId: number) => {
        if (confirm(t('admin.common.confirm_delete', 'Are you sure you want to delete this job?'))) {
            router.delete(`/admin/jobs/${jobId}?lang=${locale}`, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.jobs.index.title', 'Jobs')}>
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
                            <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.jobs.index.title', 'Jobs')}</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.jobs.subtitle', 'Monitor and moderate job postings')}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                <Filter className="mr-2 h-5 w-5" />
                                {t('admin.common.filter', 'Filter')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.common.search', 'Search')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('admin.jobs.index.search_placeholder', 'Search jobs...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.jobs.index.filter_by_status', 'Filter by Status')}
                                    </label>
                                    <Select value={data.status || 'all'} onValueChange={(value) => setData('status', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('admin.jobs.index.all_statuses', 'All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.jobs.index.all_statuses', 'All Statuses')}</SelectItem>
                                            <SelectItem value="draft" className="cursor-pointer">{t('admin.statuses.draft', 'Draft')}</SelectItem>
                                            <SelectItem value="active" className="cursor-pointer">{t('admin.statuses.active', 'Active')}</SelectItem>
                                            <SelectItem value="completed" className="cursor-pointer">{t('admin.statuses.completed', 'Completed')}</SelectItem>
                                            <SelectItem value="cancelled" className="cursor-pointer">{t('admin.statuses.cancelled', 'Cancelled')}</SelectItem>
                                            <SelectItem value="rejected" className="cursor-pointer">{t('admin.statuses.rejected', 'Rejected')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={handleReset}
                                        style={{ height: '2.7em' }}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        {t('admin.common.reset', 'Reset')}
                                    </Button>
                                    <Button
                                        className="text-white cursor-pointer"
                                        onClick={handleFilter}
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        {t('admin.common.filter', 'Filter')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jobs List */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('admin.jobs.index.title', 'Jobs')} ({jobs.total})
                            </CardTitle>
                            <CardDescription>
                                {t('admin.common.showing', 'Showing')} {jobs.from} - {jobs.to} {t('admin.common.of', 'of')} {jobs.total} {t('admin.jobs.index.title', 'jobs')}
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
                                                            onClick={() => router.visit(`/admin/jobs/${job.id}?lang=${locale}`)}
                                                        >
                                                            {job.title}
                                                        </h3>
                                                        <Badge className={getStatusColor(job.status)} style={{ fontSize: '11px' }}>
                                                            {t(`admin.statuses.${job.status.toLowerCase()}`, job.status)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        {job.employer && (
                                                            <div className="flex items-center gap-1">
                                                                <Briefcase className="h-4 w-4" />
                                                                <span>{job.employer.name}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>{formatCurrency(job.budget)}</span>
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
                                                        onClick={() => router.visit(`/admin/jobs/${job.id}?lang=${locale}`)}
                                                        style={{ height: '2.5em' }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                                        onClick={() => handleDelete(job.id)}
                                                        style={{ height: '2.5em' }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">{t('admin.jobs.index.no_jobs', 'No jobs found')}</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {jobs.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-600">
                                        {t('admin.common.showing', 'Showing')} {jobs.from} - {jobs.to} {t('admin.common.of', 'of')} {jobs.total}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {jobs.links.map((link, index) =>
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
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

