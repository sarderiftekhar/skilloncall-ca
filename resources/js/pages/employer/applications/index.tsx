import { FormEvent, useCallback, useMemo, useState } from 'react'
import { Head, router } from '@inertiajs/react'

import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/hooks/useTranslations'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import { AlertCircle, Briefcase, CheckCircle, Clock, Filter, Mail, User } from 'react-feather'

interface ApplicationJob {
    id: number
    title: string
    status: string
    budget: string | number | null
}

interface ApplicationEmployee {
    id: number
    name: string
    email: string
}

interface EmployerApplication {
    id: number
    status: string
    cover_letter?: string | null
    proposed_rate?: string | number | null
    estimated_duration?: number | null
    applied_at?: string | null
    accepted_at?: string | null
    rejected_at?: string | null
    rejection_reason?: string | null
    job?: ApplicationJob | null
    employee?: ApplicationEmployee | null
}

interface ApplicationsPaginator {
    data: EmployerApplication[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

interface EmployerApplicationsPageProps {
    applications: ApplicationsPaginator
    filters: Record<string, any>
}

const statusOptions = [
    { value: '', labelKey: 'applications.status.all', fallback: 'All statuses' },
    { value: 'pending', labelKey: 'applications.status.pending', fallback: 'Pending' },
    { value: 'accepted', labelKey: 'applications.status.accepted', fallback: 'Accepted' },
    { value: 'rejected', labelKey: 'applications.status.rejected', fallback: 'Rejected' },
    { value: 'completed', labelKey: 'applications.status.completed', fallback: 'Completed' },
]

const formatCurrency = (value?: string | number | null) => {
    if (value === null || value === undefined || value === '') {
        return null
    }

    const numeric = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(numeric)) {
        return null
    }

    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(numeric)
}

const EmployerApplicationsPage = ({ applications, filters }: EmployerApplicationsPageProps) => {
    const { t, locale } = useTranslations()

    const [searchTerm, setSearchTerm] = useState<string>(filters.search ?? '')
    const [status, setStatus] = useState<string>(filters.status ?? '')
    const [jobId, setJobId] = useState<string>(filters.job ?? '')

    const jobOptions = useMemo(() => {
        const uniqueJobs = new Map<number, { id: number; title: string }>()
        applications.data.forEach(application => {
            if (application.job?.id && application.job.title) {
                uniqueJobs.set(application.job.id, {
                    id: application.job.id,
                    title: application.job.title,
                })
            }
        })

        return Array.from(uniqueJobs.values())
    }, [applications.data])

    const handleApplyFilters = useCallback((event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault()
        }

        const query = {
            lang: locale,
            search: searchTerm || undefined,
            status: status || undefined,
            job: jobId || undefined,
        }

        router.get('/employer/applications', query, {
            preserveScroll: true,
            preserveState: true,
        })
    }, [locale, searchTerm, status, jobId])

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatus('')
        setJobId('')

        router.get('/employer/applications', { lang: locale }, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > applications.last_page) {
            return
        }

        router.get('/employer/applications', {
            lang: locale,
            page,
            search: searchTerm || undefined,
            status: status || undefined,
            job: jobId || undefined,
        }, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const paginationWindow = useMemo(() => {
        const totalPages = applications.last_page
        const current = applications.current_page
        const windowSize = 5

        if (totalPages <= windowSize) {
            return Array.from({ length: totalPages }, (_, index) => index + 1)
        }

        const half = Math.floor(windowSize / 2)
        let start = Math.max(current - half, 1)
        let end = start + windowSize - 1

        if (end > totalPages) {
            end = totalPages
            start = end - windowSize + 1
        }

        return Array.from({ length: end - start + 1 }, (_, index) => start + index)
    }, [applications.current_page, applications.last_page])

    const renderStatusBadge = (value: string) => {
        const normalized = value?.toLowerCase?.() ?? ''

        const variants: Record<string, { bg: string; text: string; border: string }> = {
            pending: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
            accepted: { bg: '#DCFCE7', text: '#166534', border: '#4ADE80' },
            rejected: { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' },
            completed: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
        }

        const styles = variants[normalized] ?? { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' }

        return (
            <Badge
                variant="outline"
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                    backgroundColor: styles.bg,
                    color: styles.text,
                    borderColor: styles.border,
                }}
            >
                {t(`applications.status.${normalized}`, value)}
            </Badge>
        )
    }

    const formatDate = useCallback((value?: string | null) => {
        if (!value) {
            return null
        }

        try {
            return new Intl.DateTimeFormat(locale || 'en-CA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date(value))
        } catch {
            return value
        }
    }, [locale])

    const paginationSummary = useMemo(() => {
        const template = t('applications.pagination.summary', 'Showing :from – :to of :total results')

        return template
            .replace(':from', String(applications.from ?? 0))
            .replace(':to', String(applications.to ?? applications.from ?? 0))
            .replace(':total', String(applications.total ?? 0))
    }, [applications.from, applications.to, applications.total, t])

    return (
        <AppLayout>
            <Head title={t('applications.title', 'Applications')}>
                <style>{`
                    .page-title {
                        color: #192341;
                    }

                    .section-title {
                        color: #10B3D6;
                    }
                `}</style>
            </Head>

            <div className="w-full px-4 py-6 md:px-6 md:py-8">
                <div className="mx-auto w-full max-w-6xl space-y-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="page-title text-2xl font-bold leading-tight md:text-3xl">
                            {t('applications.title', 'Applications')}
                        </h1>
                        <p className="text-base text-gray-600">
                            {t('applications.subtitle', 'Track, review, and respond to employee applications in one hub.')}
                        </p>
                    </div>

                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="section-title text-lg font-semibold">
                                {t('applications.filters.title', 'Filters')}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                {t('applications.filters.subtitle', 'Fine-tune the list with quick search and status filters.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                                <div className="lg:col-span-2">
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        {t('applications.filters.search', 'Search')}
                                    </label>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={event => setSearchTerm(event.target.value)}
                                            placeholder={t('applications.filters.search_placeholder', 'Job title or applicant')}
                                            className="h-11 rounded-lg border border-slate-200 pl-9 pr-3 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        {t('applications.filters.status', 'Status')}
                                    </label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="h-11 rounded-lg border border-slate-200">
                                            <SelectValue placeholder={t('applications.filters.status', 'Status')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {t(option.labelKey, option.fallback)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        {t('applications.filters.job', 'Job')}
                                    </label>
                                    <Select value={jobId} onValueChange={setJobId}>
                                        <SelectTrigger className="h-11 rounded-lg border border-slate-200">
                                            <SelectValue placeholder={t('applications.filters.job_placeholder', 'All jobs')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">
                                                {t('applications.filters.job_placeholder', 'All jobs')}
                                            </SelectItem>
                                            {jobOptions.map(job => (
                                                <SelectItem key={job.id} value={String(job.id)}>
                                                    {job.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:col-span-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleResetFilters}
                                        className="h-11 rounded-lg border border-transparent hover:bg-slate-50 cursor-pointer"
                                    >
                                        {t('applications.filters.clear', 'Clear filters')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-11 rounded-lg bg-[#10B3D6] text-white shadow-sm transition hover:opacity-90 cursor-pointer"
                                    >
                                        {t('applications.filters.apply', 'Apply filters')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {applications.data.length > 0 ? (
                            <div className="space-y-4">
                                {applications.data.map(application => {
                                    const appliedDate = formatDate(application.applied_at)
                                    const proposedRate = formatCurrency(application.proposed_rate)
                                    const budget = formatCurrency(application.job?.budget ?? null)

                                    return (
                                        <Card
                                            key={application.id}
                                            className="border border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <CardHeader className="space-y-3">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-[#192341]">
                                                            {application.job?.title ?? t('applications.card.untitled_job', 'Untitled job')}
                                                        </h2>
                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                            {application.employee?.name && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <User className="h-4 w-4 text-[#10B3D6]" />
                                                                    {application.employee.name}
                                                                </span>
                                                            )}
                                                            {appliedDate && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Clock className="h-4 w-4 text-[#10B3D6]" />
                                                                    {t('applications.card.applied_on', 'Applied on')} {appliedDate}
                                                                </span>
                                                            )}
                                                            {budget && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Briefcase className="h-4 w-4 text-[#10B3D6]" />
                                                                    {budget}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {renderStatusBadge(application.status)}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {application.cover_letter && (
                                                    <div className="rounded-lg bg-slate-50 p-4 text-sm text-gray-600 leading-relaxed">
                                                        {application.cover_letter}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
                                                    {proposedRate && (
                                                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#10B3D6]">
                                                                {t('applications.card.proposed_rate', 'Proposed rate')}
                                                            </p>
                                                            <p className="mt-1 font-medium text-[#192341]">{proposedRate}</p>
                                                        </div>
                                                    )}
                                                    {application.estimated_duration && (
                                                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#10B3D6]">
                                                                {t('applications.card.estimated_duration', 'Estimated duration')}
                                                            </p>
                                                            <p className="mt-1 font-medium text-[#192341]">
                                                                {application.estimated_duration} {t('applications.card.days', 'days')}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {application.rejection_reason && (
                                                        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                                                                {t('applications.card.rejection_reason', 'Rejection reason')}
                                                            </p>
                                                            <p className="mt-1 text-red-700">{application.rejection_reason}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="text-sm text-gray-600">
                                                        {application.employee?.email ? (
                                                            <span className="inline-flex items-center gap-2">
                                                                <Mail className="h-4 w-4 text-[#10B3D6]" />
                                                                {application.employee.email}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-2 text-gray-400">
                                                                <AlertCircle className="h-4 w-4" />
                                                                {t('applications.card.no_contact', 'Contact info unavailable')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {application.job?.id && (
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                className="h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                                                            >
                                                                <Link href={`/employer/jobs/${application.job.id}?lang=${locale}`}>
                                                                    {t('applications.card.view_job', 'View job')}
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {application.employee?.id && (
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                className="h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                                                            >
                                                                <Link href={`/employer/employees/${application.employee.id}?lang=${locale}`}>
                                                                    {t('applications.card.view_profile', 'View profile')}
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <Card className="border border-slate-200">
                                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                                    <AlertCircle className="h-12 w-12 text-gray-300" />
                                    <h3 className="text-lg font-semibold text-[#192341]">
                                        {t('applications.empty.title', 'No applications found')}
                                    </h3>
                                    <p className="max-w-md text-sm text-gray-500">
                                        {t('applications.empty.description', 'Adjust your filters or encourage more applicants by sharing your job listing.')}
                                    </p>
                                    <Button
                                        onClick={handleResetFilters}
                                        className="h-10 rounded-lg bg-[#10B3D6] px-6 text-white hover:opacity-90 cursor-pointer"
                                    >
                                        {t('applications.filters.clear', 'Clear filters')}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {applications.last_page > 1 && (
                        <Card className="border border-slate-200">
                            <CardContent className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                                <div className="text-sm text-gray-600">
                                    {paginationSummary}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={applications.current_page === 1}
                                        onClick={() => handlePageChange(applications.current_page - 1)}
                                        className="h-9 rounded-lg cursor-pointer"
                                    >
                                        ‹
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {paginationWindow.map(page => (
                                            <Button
                                                key={page}
                                                variant={applications.current_page === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="h-9 w-9 rounded-lg p-0 cursor-pointer"
                                                style={applications.current_page === page ? { backgroundColor: '#10B3D6', color: '#FFFFFF' } : {}}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={applications.current_page === applications.last_page}
                                        onClick={() => handlePageChange(applications.current_page + 1)}
                                        className="h-9 rounded-lg cursor-pointer"
                                    >
                                        ›
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}

export default EmployerApplicationsPage

