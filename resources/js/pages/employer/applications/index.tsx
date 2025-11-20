import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { 
    FileText, 
    Search, 
    Eye, 
    Check,
    X,
    Calendar,
    DollarSign,
    User,
    Filter,
    Briefcase,
    Mail
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { show as showApplication } from '@/routes/employer/applications';

interface Application {
    id: number;
    cover_letter: string | null;
    proposed_rate: number | null;
    estimated_duration: number | null;
    status: string;
    applied_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
    created_at: string;
    job: {
        id: number;
        title: string;
        status: string;
        budget: number;
        category: string;
    };
    employee: {
        id: number;
        name: string;
        email: string;
    };
}

interface IndexApplicationsPageProps {
    applications: Application[];
    filters: {
        search?: string;
        status?: string;
        job?: string;
    };
}

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('employer.applications.manage', 'Manage Applications'),
        href: `/employer/applications?lang=${locale}`,
    },
];

export default function IndexApplicationsPage({ applications, filters }: IndexApplicationsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);
    const queryLang = `?lang=${locale}`;

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        job: filters.job || '',
    });

    const handleFilter = () => {
        get(`/employer/applications${queryLang}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            job: '',
        });
        router.get(`/employer/applications${queryLang}`, {}, {
            preserveState: false,
        });
    };

    const handleAccept = (applicationId: number) => {
        if (confirm(t('employer.applications.accept_confirm', 'Are you sure you want to accept this application?'))) {
            router.put(`/employer/applications/${applicationId}/accept${queryLang}`, {}, {
                preserveScroll: false,
            });
        }
    };

    const handleReject = (applicationId: number) => {
        if (confirm(t('employer.applications.reject_confirm', 'Are you sure you want to reject this application?'))) {
            router.put(`/employer/applications/${applicationId}/reject${queryLang}`, {}, {
                preserveScroll: false,
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'withdrawn':
                return 'bg-gray-100 text-gray-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredApplications = applications.filter(app => {
        if (data.status && app.status !== data.status) return false;
        if (data.job && app.job.id.toString() !== data.job) return false;
        if (data.search) {
            const searchLower = data.search.toLowerCase();
            return (
                app.job.title.toLowerCase().includes(searchLower) ||
                app.employee.name.toLowerCase().includes(searchLower) ||
                app.employee.email.toLowerCase().includes(searchLower) ||
                (app.cover_letter && app.cover_letter.toLowerCase().includes(searchLower))
            );
        }
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employer.applications.manage', 'Manage Applications')}>
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
            
            <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex h-full flex-1 flex-col gap-6 sm:gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight page-title">
                                {t('employer.applications.manage', 'Manage Applications')}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('employer.applications.subtitle', 'Review and manage job applications from skilled employees')}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center page-title">
                                <Filter className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                {t('employer.applications.filters', 'Filters')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('employer.applications.search', 'Search')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('employer.applications.search_placeholder', 'Search by job, employee name, or email...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('employer.applications.status', 'Status')}
                                    </label>
                                    <Select value={data.status || 'all'} onValueChange={(value) => setData('status', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('employer.applications.all_statuses', 'All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('employer.applications.all_statuses', 'All Statuses')}</SelectItem>
                                            <SelectItem value="pending" className="cursor-pointer">{t('employer.applications.status.pending', 'Pending')}</SelectItem>
                                            <SelectItem value="accepted" className="cursor-pointer">{t('employer.applications.status.accepted', 'Accepted')}</SelectItem>
                                            <SelectItem value="rejected" className="cursor-pointer">{t('employer.applications.status.rejected', 'Rejected')}</SelectItem>
                                            <SelectItem value="withdrawn" className="cursor-pointer">{t('employer.applications.status.withdrawn', 'Withdrawn')}</SelectItem>
                                            <SelectItem value="completed" className="cursor-pointer">{t('employer.applications.status.completed', 'Completed')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('employer.applications.job', 'Job')}
                                    </label>
                                    <Select value={data.job || 'all'} onValueChange={(value) => setData('job', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('employer.applications.all_jobs', 'All Jobs')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('employer.applications.all_jobs', 'All Jobs')}</SelectItem>
                                            {Array.from(new Set(applications.map(app => app.job.id))).map(jobId => {
                                                const job = applications.find(app => app.job.id === jobId)?.job;
                                                return job ? (
                                                    <SelectItem key={jobId} value={jobId.toString()} className="cursor-pointer">{job.title}</SelectItem>
                                                ) : null;
                                            })}
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
                                        {t('employer.applications.reset', 'Reset')}
                                    </Button>
                                    <Button 
                                        className="text-white cursor-pointer"
                                        onClick={handleFilter}
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        {t('employer.applications.apply_filters', 'Apply')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applications List */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('employer.applications.applications', 'Applications')} ({filteredApplications.length})
                            </CardTitle>
                            <CardDescription>
                                {t('employer.applications.showing', 'Showing')} {filteredApplications.length} {t('employer.applications.applications', 'applications')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredApplications.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredApplications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                                            style={{ backgroundColor: '#FCF2F0' }}
                                        >
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0 w-full sm:w-auto">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-default">
                                                            {application.job.title}
                                                        </h3>
                                                        <Badge className={getStatusColor(application.status)} style={{fontSize: '11px'}}>
                                                            {t(`employer.applications.status.${application.status.toLowerCase()}`, application.status)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span className="font-medium">{application.employee.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-4 w-4" />
                                                            <span>{application.employee.email}</span>
                                                        </div>
                                                        {application.proposed_rate && (
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="h-4 w-4" />
                                                                <span>{formatCurrency(application.proposed_rate)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(application.applied_at || application.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    {application.cover_letter && (
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{application.cover_letter}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => router.visit(showApplication({ application: application.id }).url({ lang: locale }))}
                                                        style={{height: '2.5em'}}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        {t('employer.applications.view', 'View')}
                                                    </Button>
                                                    {application.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-green-300 text-green-700 hover:bg-green-50 cursor-pointer"
                                                                onClick={() => handleAccept(application.id)}
                                                                style={{height: '2.5em'}}
                                                            >
                                                                <Check className="h-4 w-4 mr-2" />
                                                                {t('employer.applications.accept', 'Accept')}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                                                onClick={() => handleReject(application.id)}
                                                                style={{height: '2.5em'}}
                                                            >
                                                                <X className="h-4 w-4 mr-2" />
                                                                {t('employer.applications.reject', 'Reject')}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {t('employer.applications.no_applications_found', 'No applications found')}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t('employer.applications.no_applications_description', 'No applications match your current filters')}
                                    </p>
                                    <Button 
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={handleReset}
                                        style={{height: '2.7em'}}
                                    >
                                        {t('employer.applications.clear_filters', 'Clear Filters')}
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

