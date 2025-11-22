import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, CheckCircle, XCircle, Trash2, Briefcase, Users, Eye, DollarSign, MapPin, Calendar } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { useState } from 'react';

interface Job {
    id: number;
    title: string;
    description: string;
    category: string;
    budget: number;
    status: string;
    location?: string;
    province?: string;
    city?: string;
    created_at: string;
    employer?: {
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
}

interface ShowJobPageProps {
    job: Job;
    stats: JobStats;
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string, jobTitle: string): BreadcrumbItem[] => [
    {
        title: t('admin.jobs.title', 'Job Management'),
        href: `/admin/jobs?lang=${locale}`,
    },
    {
        title: jobTitle,
        href: '#',
    },
];

export default function ShowJobPage({ job, stats }: ShowJobPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale, job.title);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { data: rejectData, setData: setRejectData, put: rejectPut, processing: rejectProcessing } = useForm({
        reason: '',
    });

    const handleApprove = () => {
        if (confirm(t('admin.jobs.show.confirm_approve', 'Are you sure you want to approve this job?'))) {
            router.put(`/admin/jobs/${job.id}/approve?lang=${locale}`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = () => {
        if (rejectData.reason.trim()) {
            router.put(`/admin/jobs/${job.id}/reject?lang=${locale}`, {
                reason: rejectData.reason,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowRejectModal(false);
                    setRejectData('reason', '');
                },
            });
        }
    };

    const handleDelete = () => {
        if (confirm(t('admin.common.confirm_delete', 'Are you sure you want to delete this job?'))) {
            router.delete(`/admin/jobs/${job.id}?lang=${locale}`, {
                onSuccess: () => {
                    router.visit(`/admin/jobs?lang=${locale}`);
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
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
            <Head title={t('admin.jobs.show.title', 'Job Details')}>
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
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => router.get(`/admin/jobs?lang=${locale}`)}
                                style={{ height: '2.7em' }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('admin.common.cancel', 'Back')}
                            </Button>
                            <div>
                                <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{job.title}</h1>
                                <p className="mt-1 text-lg leading-relaxed text-gray-600">
                                    <Badge className={getStatusColor(job.status)} style={{ fontSize: '11px' }}>
                                        {t(`admin.statuses.${job.status.toLowerCase()}`, job.status)}
                                    </Badge>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {job.status === 'draft' || job.status === 'pending' ? (
                                <>
                                    <Button
                                        className="text-white cursor-pointer border-green-600 bg-green-600 hover:bg-green-700"
                                        onClick={handleApprove}
                                        style={{ height: '2.7em' }}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {t('admin.jobs.show.approve', 'Approve Job')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                        onClick={() => setShowRejectModal(true)}
                                        style={{ height: '2.7em' }}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {t('admin.jobs.show.reject', 'Reject Job')}
                                    </Button>
                                </>
                            ) : null}
                            <Button
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={handleDelete}
                                style={{ height: '2.7em' }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('admin.jobs.show.delete', 'Delete Job')}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Job Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.jobs.show.job_information', 'Job Information')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-default text-xl font-semibold mb-2">{job.title}</h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.jobs.index.columns.category', 'Category')}</p>
                                            <p className="text-default font-medium">{job.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.jobs.index.columns.budget', 'Budget')}</p>
                                            <p className="text-default font-medium">{formatCurrency(job.budget)}</p>
                                        </div>
                                        {job.location && (
                                            <div>
                                                <p className="text-sm text-gray-600">{t('admin.jobs.show.location', 'Location')}</p>
                                                <p className="text-default font-medium">{job.location}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.jobs.index.columns.created_at', 'Created')}</p>
                                            <p className="text-default font-medium">{formatDate(job.created_at)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Employer Information */}
                            {job.employer && (
                                <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                            {t('admin.jobs.show.employer_information', 'Employer Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                                style={{ backgroundColor: '#10B3D6', width: '50px', height: '50px', fontSize: '20px' }}
                                            >
                                                {job.employer.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <div>
                                                <h3 className="text-default font-semibold">{job.employer.name}</h3>
                                                <p className="text-gray-600 text-sm">{job.employer.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Statistics */}
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.jobs.show.statistics', 'Statistics')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                <p className="text-sm text-gray-600">{t('admin.jobs.show.stats.total_applications', 'Total Applications')}</p>
                                            </div>
                                            <p className="text-default text-2xl font-bold">{stats.totalApplications}</p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <p className="text-sm text-gray-600 mb-2">{t('admin.jobs.show.stats.pending_applications', 'Pending')}</p>
                                            <p className="text-default text-2xl font-bold">{stats.pendingApplications}</p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <p className="text-sm text-gray-600 mb-2">{t('admin.jobs.show.stats.accepted_applications', 'Accepted')}</p>
                                            <p className="text-default text-2xl font-bold">{stats.acceptedApplications}</p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                <p className="text-sm text-gray-600">{t('admin.jobs.show.stats.views_count', 'Views')}</p>
                                            </div>
                                            <p className="text-default text-2xl font-bold">{stats.viewsCount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.jobs.show.actions', 'Actions')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {job.status === 'draft' || job.status === 'pending' ? (
                                        <>
                                            <Button
                                                className="w-full text-white cursor-pointer border-green-600 bg-green-600 hover:bg-green-700"
                                                onClick={handleApprove}
                                                style={{ height: '2.7em' }}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                {t('admin.jobs.show.approve', 'Approve Job')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                                onClick={() => setShowRejectModal(true)}
                                                style={{ height: '2.7em' }}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                {t('admin.jobs.show.reject', 'Reject Job')}
                                            </Button>
                                        </>
                                    ) : null}
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                        onClick={handleDelete}
                                        style={{ height: '2.7em' }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t('admin.jobs.show.delete', 'Delete Job')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold" style={{ color: '#192341' }}>
                                {t('admin.jobs.show.reject', 'Reject Job')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.jobs.show.rejection_reason', 'Rejection Reason')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="reason" className="text-default">
                                        {t('admin.jobs.show.rejection_reason', 'Rejection Reason')} *
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        value={rejectData.reason}
                                        onChange={(e) => setRejectData('reason', e.target.value)}
                                        placeholder={t('admin.jobs.show.rejection_reason_placeholder', 'Enter reason for rejection...')}
                                        className="mt-1 cursor-pointer"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        className="text-white cursor-pointer"
                                        onClick={handleReject}
                                        disabled={rejectProcessing || !rejectData.reason.trim()}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        {t('admin.jobs.show.reject', 'Reject Job')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setRejectData('reason', '');
                                        }}
                                        style={{ height: '2.7em' }}
                                    >
                                        {t('admin.common.cancel', 'Cancel')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppLayout>
    );
}

